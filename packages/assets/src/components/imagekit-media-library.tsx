'use client'

import React, { useEffect, useRef } from 'react'
import { Card } from '@workspace/ui/components/card'

interface ImageKitMediaLibraryProps {
  publicKey: string
  urlEndpoint: string
  onSelect?: (url: string) => void
}

export function ImageKitMediaLibrary({ publicKey, urlEndpoint, onSelect }: ImageKitMediaLibraryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetInstance = useRef<any>(null)
  const isInitializing = useRef(false)
  const onSelectRef = useRef(onSelect)

  // Keep ref in sync
  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    async function initWidget() {
      // Prevent multiple simultaneous initializations
      if (isInitializing.current || widgetInstance.current) return
      isInitializing.current = true

      try {
        const { ImagekitMediaLibraryWidget } = await import('imagekit-media-library-widget')
        
        if (containerRef.current) {
          // Final safety check: clear container one last time
          containerRef.current.innerHTML = ''
          
          // Define callback function
          const handleCallback = (payload: any) => {
            // Check both action and eventType for compatibility
            const action = payload.action || payload.eventType
            const data = payload.data || (Array.isArray(payload) ? payload : null)

            if (action === 'INSERT' || action === 'success' || (data && data.length > 0)) {
              if (data && data.length > 0) {
                const url = data[0].url || data[0].thumbnailUrl
                if (url) {
                  onSelectRef.current?.(url)
                }
              }
            }
          }

          // Initialize widget with config and callback as second argument
          const config = {
            container: containerRef.current,
            view: 'inline' as const,
            renderOpenButton: false,
            width: '100%',
            height: '600px',
            mlSettings: {
              publicKey: publicKey,
              urlEndpoint: urlEndpoint,
              authenticationEndpoint: '/api/imagekit/auth',
              toolbar: {
                showInsertButton: true
              }
            }
          }

          // Try both constructor patterns
          try {
            // Pattern 1: Callback as second argument (newer versions)
            widgetInstance.current = new ImagekitMediaLibraryWidget(config, handleCallback)
          } catch (e) {
            console.warn("Failed to init with 2 arguments, trying 1 argument with callback in config")
            // Pattern 2: Callback inside config (older versions)
            widgetInstance.current = new (ImagekitMediaLibraryWidget as any)({
              ...config,
              callback: handleCallback
            })
          }
        }
      } catch (error) {
        console.error("Failed to initialize ImageKit Media Library:", error)
      } finally {
        isInitializing.current = false
      }
    }

    initWidget()

    return () => {
      if (widgetInstance.current) {
        try {
          if (typeof widgetInstance.current.destroy === 'function') {
            widgetInstance.current.destroy()
          }
        } catch (e) {
          console.error("Error destroying widget:", e)
        }
        widgetInstance.current = null
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [publicKey, urlEndpoint])

  return (
    <div className="w-full">
      <div 
        ref={containerRef} 
        style={{ height: '600px', width: '100%' }}
        className="rounded-xl border border-white/10 bg-black/20 overflow-hidden"
        id="ik-media-library-container"
      />
    </div>
  )
}
