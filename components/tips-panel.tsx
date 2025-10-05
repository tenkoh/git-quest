"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

type TipsPanelProps = {
  showTip: boolean
  showHint: boolean
  tip?: string
  hint?: string
}

export function TipsPanel({ showTip, showHint, tip, hint }: TipsPanelProps) {
  if (!showTip && !showHint) {
    return null
  }

  return (
    <div className="space-y-3">
      {showTip && tip && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <span className="font-semibold">正解！</span> {tip}
          </AlertDescription>
        </Alert>
      )}

      {showHint && hint && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <span className="font-semibold">ヒント:</span> {hint}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
