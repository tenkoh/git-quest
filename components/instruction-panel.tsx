"use client";

type InstructionPanelProps = {
  instruction: string;
  stepNumber: number;
  totalSteps: number;
};

export function InstructionPanel({
  instruction,
  stepNumber,
  totalSteps,
}: InstructionPanelProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">課題</h2>
        <span className="text-sm text-muted-foreground">
          ステップ {stepNumber} / {totalSteps}
        </span>
      </div>
      <p className="text-foreground">{instruction}</p>
    </div>
  );
}
