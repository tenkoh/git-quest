"use client"

import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

type CompletionScreenProps = {
  onReset: () => void
}

export function CompletionScreen({ onReset }: CompletionScreenProps) {
  return (
    <div className="rounded-lg border bg-card p-12 text-center">
      <Trophy className="h-16 w-16 mx-auto mb-6 text-yellow-500" />
      <h2 className="text-3xl font-bold mb-4">おめでとうございます！</h2>
      <p className="text-muted-foreground mb-8 text-lg">
        Gitの基本的なワークフローを完了しました。
        <br />
        チーム開発での基本的な流れを理解できましたね！
      </p>
      <Button onClick={onReset} size="lg">
        もう一度挑戦する
      </Button>
    </div>
  )
}
