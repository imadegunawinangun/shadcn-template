"use client"

import { useEffect, useRef } from "react"
import { WebMCPTool } from "../types"

export function useWebMCP({
  tools
}: {
  tools: WebMCPTool[]
}) {
  const registeredTools = useRef<string[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Ensure global registry exists
    if (!window.__WEBMCP_TOOLS__) window.__WEBMCP_TOOLS__ = {}

    const modelContext = (navigator as any).modelContext

    // Clean up old registrations
    registeredTools.current.forEach(name => {
      if (typeof modelContext?.unregisterTool === 'function') {
        try {
          modelContext.unregisterTool(name)
        } catch (e) {
          console.warn(`Failed to unregister tool ${name}:`, e)
        }
      }
      if (window.__WEBMCP_TOOLS__) delete window.__WEBMCP_TOOLS__[name]
    })
    registeredTools.current = []

    // Register new ones
    tools.forEach(tool => {
      if (typeof modelContext?.registerTool === 'function') {
        try {
          modelContext.registerTool(tool)
        } catch (e) {
          console.warn(`Failed to register tool ${tool.name}:`, e)
        }
      }
      if (window.__WEBMCP_TOOLS__) window.__WEBMCP_TOOLS__[tool.name] = tool
      registeredTools.current.push(tool.name)
    })

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentTools = registeredTools.current
      currentTools.forEach(name => {
        if (typeof modelContext?.unregisterTool === 'function') {
          try {
            modelContext.unregisterTool(name)
          } catch (e) {
            console.warn(`Failed to unregister tool ${name}:`, e)
          }
        }
        if (window.__WEBMCP_TOOLS__) delete window.__WEBMCP_TOOLS__[name]
      })
    }
  }, [tools])
}
