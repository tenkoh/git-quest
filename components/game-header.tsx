"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

type GameHeaderProps = {
  onReset: () => void
}

export function GameHeader({ onReset }: GameHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">GitQuest</h1>
        <Button onClick={onReset} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          リセット
        </Button>
      </div>
    </header>
  )
}
