"use client";

import { CompletionScreen } from "@/components/completion-screen";
import { GameHeader } from "@/components/game-header";
import { GamePanel } from "@/components/game-panel";
import { GitImageDisplay } from "@/components/git-image-display";
import { useGame } from "@/lib/game-context";

export default function Home() {
  const {
    currentStep,
    showTip,
    showHint,
    isCorrectAndWaiting,
    steps,
    submitCommand,
    advanceToNextStep,
    reset,
  } = useGame();

  const currentStepData = steps[currentStep];
  const isCompleted = currentStep >= steps.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GameHeader onReset={reset} />

      <main className="flex-1 flex items-start md:items-center justify-center p-4 md:p-8">
        {isCompleted ? (
          <CompletionScreen onReset={reset} />
        ) : (
          <div className="w-full max-w-[800px] flex flex-col md:flex-row gap-4 h-auto md:h-[480px]">
            <div className="order-2 md:order-1 w-full md:w-1/2 h-64 md:h-full">
              <GitImageDisplay imagePath={currentStepData.imagePath} />
            </div>
            <div className="order-1 md:order-2 w-full md:w-1/2 md:h-full">
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
  );
}
