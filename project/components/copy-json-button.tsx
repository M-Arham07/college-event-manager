"use client"

import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { DelegateClient } from "@/lib/types"

interface CopyJsonButtonProps {
  delegates: DelegateClient[]
}

export function CopyJsonButton({ delegates }: CopyJsonButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const json = JSON.stringify(delegates, null, 2)
    await navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="h-9 bg-transparent"
      disabled={delegates.length === 0}
    >
      {copied ? (
        <>
          <Check className="mr-1.5 size-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="mr-1.5 size-4" />
          Copy JSON
        </>
      )}
    </Button>
  )
}
