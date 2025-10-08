"use client";

import { useEffect } from "react";

import { CommandInput } from "@/components/command-input";
import { TipsPanel } from "@/components/tips-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type GamePanelProps = {
  instructionTitle: string;
  instructionBody: string;
  stepNumber: number;
  totalSteps: number;
  showTip: boolean;
  showHint: boolean;
  isCorrectAndWaiting: boolean;
  tip?: string;
  hint?: string;
  onSubmit: (command: string) => void;
  onNext: () => void;
};

export function GamePanel({
  instructionTitle,
  instructionBody,
  stepNumber,
  totalSteps,
  showTip,
  showHint,
  isCorrectAndWaiting,
  tip,
  hint,
  onSubmit,
  onNext,
}: GamePanelProps) {
  useEffect(() => {
    if (!isCorrectAndWaiting) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.repeat) {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCorrectAndWaiting, onNext]);

  return (
    <Card className="w-full md:h-full p-6 flex flex-col gap-4">
      <div className="flex-shrink-0">
        <div className="text-sm text-muted-foreground mb-2">
          ステップ {stepNumber} / {totalSteps}
        </div>
        <h2 className="text-lg font-semibold">{instructionTitle}</h2>
        {instructionBody && (
          <p className="mt-2 text-sm text-muted-foreground">
            {instructionBody}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <TipsPanel
          showTip={showTip}
          showHint={showHint}
          tip={tip}
          hint={hint}
        />
      </div>

      <div className="flex-shrink-0">
        {isCorrectAndWaiting ? (
          <div className="flex justify-end">
            <Button onClick={onNext} className="cursor-pointer" size="lg">
              次へ (Enter)
            </Button>
          </div>
        ) : (
          <CommandInput onSubmit={onSubmit} />
        )}
      </div>
    </Card>
  );
}
