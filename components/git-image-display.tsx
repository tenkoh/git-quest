"use client"

import { Card } from "@/components/ui/card"

type GitImageDisplayProps = {
  imagePath?: string
}

export function GitImageDisplay({ imagePath }: GitImageDisplayProps) {
  return (
    <Card className="w-full h-full flex items-center justify-center bg-muted">
      {imagePath ? (
        <img
          src={imagePath || "/placeholder.svg"}
          alt="Git graph visualization"
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <div className="text-muted-foreground text-sm">画像読み込み中...</div>
      )}
    </Card>
  )
}
