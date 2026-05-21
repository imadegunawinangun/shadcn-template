"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname() // Returns full path e.g. /en/dashboard or /id/dashboard
  const locale = useLocale()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const switchLocale = (newLocale: string) => {
    if (!pathname) return
    const segments = pathname.split('/')
    // Replace the first segment (which is the locale)
    // segments[0] is empty string because path starts with /
    if (segments.length > 1) {
      segments[1] = newLocale
      router.push(segments.join('/'))
      router.refresh()
    }
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 px-0">
        <span className="font-semibold text-sm">{locale.toUpperCase()}</span>
        <span className="sr-only">Toggle language</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 px-0">
          <span className="font-semibold text-sm">{locale.toUpperCase()}</span>
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[80px]">
        <DropdownMenuItem onClick={() => switchLocale('id')}>
          ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale('en')}>
          EN
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
