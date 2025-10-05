"use client"

import { useGame } from "@/lib/game-context"
import { GameHeader } from "@/components/game-header"
import { GitImageDisplay } from "@/components/git-image-display"
import { GamePanel } from "@/components/game-panel"
import { CompletionScreen } from "@/components/completion-screen"

export default function Home() {
  const { currentStep, showTip, showHint, isCorrectAndWaiting, steps, submitCommand, advanceToNextStep, reset } =
    useGame()

  const currentStepData = steps[currentStep]
  const isCompleted = currentStep >= steps.length

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GameHeader onReset={reset} />

      <main className="flex-1 flex items-center justify-center p-8">
        {isCompleted ? (
          <CompletionScreen onReset={reset} />
        ) : (
          <div className="w-[800px] h-[600px] flex gap-4">
            <div className="w-1/2 h-full">
              <GitImageDisplay imagePath={currentStepData.imagePath} />
            </div>
            <div className="w-1/2 h-full">
              <GamePanel
                instructionTitle={currentStepData.instructionTitle}
                instructionBody={currentStepData.instructionBody}
                stepNumber={currentStep + 1}
                totalSteps={steps.length}
                showTip={showTip}
                showHint={showHint}
                isCorrectAndWaiting={isCorrectAndWaiting}
                tip={currentStepData.tip}
                hint={currentStepData.hint}
                onSubmit={submitCommand}
                onNext={advanceToNextStep}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
