"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type ScenarioStep = {
  id: number
  instructionTitle: string
  instructionBody: string
  acceptedCommands: string[]
  tip?: string
  hint?: string
  imagePath?: string
  graphState: {
    local: string[]
    remote: string[]
  }
}

type GameState = {
  currentStep: number
  showTip: boolean
  showHint: boolean
  lastCommand: string
  isCorrectAndWaiting: boolean
  steps: ScenarioStep[]
  submitCommand: (command: string) => void
  advanceToNextStep: () => void
  reset: () => void
}

const scenarios: ScenarioStep[] = [
  {
    id: 1,
    instructionTitle: "リモートリポジトリをクローンしてください",
    instructionBody: "",
    acceptedCommands: ["git clone https://example.com/lecture.git"],
    tip: "リモートリポジトリを丸ごとコピーし、作業の出発点を作ります",
    hint: "git clone <リポジトリURL> を使用します",
    imagePath: "/images/step-1.svg",
    graphState: {
      local: [],
      remote: ["Remote (https://example.com/lecture.git):", "* def456 (origin/main) initial commit"],
    },
  },
  {
    id: 2,
    instructionTitle: "作業ブランチ feature を作成してください",
    instructionBody: "",
    acceptedCommands: ["git checkout -b feature", "git switch -c feature"],
    tip: "mainを安定させ、機能ごとに作業を分離できます",
    hint: "git checkout -b <ブランチ名> または git switch -c <ブランチ名> を使用します",
    imagePath: "/images/step-2.svg",
    graphState: {
      local: ["Local:", "* def456 (HEAD -> main) initial commit"],
      remote: ["Remote (https://example.com/lecture.git):", "* def456 (origin/main) initial commit"],
    },
  },
  {
    id: 3,
    instructionTitle: "fileA.md を編集してコミットしてください",
    instructionBody: "",
    acceptedCommands: ['git add fileA.md && git commit -m "edit fileA"'],
    tip: "addはステージ、commitは履歴確定。役割を分けて考えましょう",
    hint: 'git add <ファイル名> && git commit -m "<メッセージ>" を使用します',
    imagePath: "/images/step-3.svg",
    graphState: {
      local: ["Local:", "* def456 (HEAD -> feature, main) initial commit"],
      remote: ["Remote (https://example.com/lecture.git):", "* def456 (origin/main) initial commit"],
    },
  },
  {
    id: 4,
    instructionTitle: "新しいブランチ feature/refactor を作成してください",
    instructionBody: "",
    acceptedCommands: ["git checkout -b feature/refactor", "git switch -c feature/refactor"],
    tip: "機能をさらに細かく分けることで、変更を管理しやすくなります",
    hint: "git checkout -b <ブランチ名> または git switch -c <ブランチ名> を使用します",
    imagePath: "/images/step-4.svg",
    graphState: {
      local: ["Local:", "* def456 (HEAD -> feature) initial commit"],
      remote: ["Remote (https://example.com/lecture.git):", "* def456 (origin/main) initial commit"],
    },
  },
  {
    id: 5,
    instructionTitle: "fileA.md をリファクタリングしてコミットしてください",
    instructionBody: "",
    acceptedCommands: ['git add fileA.md && git commit -m "refactor fileA"'],
    tip: "小さな単位でコミットすることで、変更履歴が追いやすくなります",
    hint: 'git add <ファイル名> && git commit -m "<メッセージ>" を使用します',
    imagePath: "/images/step-5.svg",
    graphState: {
      local: ["Local:", "* def456 (HEAD -> feature/refactor, feature) initial commit"],
      remote: ["Remote (https://example.com/lecture.git):", "* def456 (origin/main) initial commit"],
    },
  },
  {
    id: 6,
    instructionTitle: "feature ブランチに戻ってください",
    instructionBody: "",
    acceptedCommands: ["git checkout feature", "git switch feature"],
    tip: "ブランチを切り替えることで、異なる作業を並行して進められます",
    hint: "git checkout <ブランチ名> または git switch <ブランチ名> を使用します",
    imagePath: "/images/step-6.svg",
    graphState: {
      local: ["Local:", "* ghi789 (feature/refactor) refactor fileA", "* def456 (HEAD -> feature) initial commit"],
      remote: ["Remote (https://example.com/lecture.git):", "* def456 (origin/main) initial commit"],
    },
  },
  {
    id: 7,
    instructionTitle: "feature/refactor ブランチをマージしてください",
    instructionBody: "",
    acceptedCommands: ["git merge feature/refactor"],
    tip: "別系統の変更を統合し、履歴を一つにまとめます",
    hint: "git merge <ブランチ名> を使用します",
    imagePath: "/images/step-7.svg",
    graphState: {
      local: ["Local:", "* ghi789 (feature/refactor) refactor fileA", "* def456 (HEAD -> feature) initial commit"],
      remote: ["Remote (https://example.com/lecture.git):", "* def456 (origin/main) initial commit"],
    },
  },
  {
    id: 8,
    instructionTitle: "feature ブランチをリモートにプッシュしてください",
    instructionBody: "",
    acceptedCommands: ["git push -u origin feature"],
    tip: "-uオプションで追跡設定。次回以降は git push のみでOK",
    hint: "git push -u origin <ブランチ名> を使用します",
    imagePath: "/images/step-8.svg",
    graphState: {
      local: [
        "Local:",
        "* jkl012 (HEAD -> feature) Merge branch 'feature/refactor' into feature",
        "|\\",
        "| * ghi789 (feature/refactor) refactor fileA",
        "* | def456 initial commit",
        "|/",
      ],
      remote: ["Remote (https://example.com/lecture.git):", "* def456 (origin/main) initial commit"],
    },
  },
  {
    id: 9,
    instructionTitle: "リモートでPull Requestを作成し、マージされたことを確認したら「ok」と入力してください",
    instructionBody: "",
    acceptedCommands: ["ok"],
    tip: "リモートでは通常、Pull Requestを経て変更を取り込みます",
    hint: "「ok」と入力してください",
    imagePath: "/images/step-9.svg",
    graphState: {
      local: [
        "Local:",
        "* jkl012 (HEAD -> feature) Merge branch 'feature/refactor' into feature",
        "|\\",
        "| * ghi789 (feature/refactor) refactor fileA",
        "* | def456 initial commit",
        "|/",
      ],
      remote: [
        "Remote (https://example.com/lecture.git):",
        "* jkl012 (origin/feature) Merge branch 'feature/refactor' into feature",
        "|\\",
        "| * ghi789 refactor fileA",
        "* | def456 initial commit",
        "| |/",
        "|/",
      ],
    },
  },
  {
    id: 10,
    instructionTitle: "main ブランチに戻ってください",
    instructionBody: "",
    acceptedCommands: ["git checkout main", "git switch main"],
    tip: "mainブランチで最新の変更を取り込む準備をします",
    hint: "git checkout main または git switch main を使用します",
    imagePath: "/images/step-10.svg",
    graphState: {
      local: [
        "Local:",
        "* jkl012 (feature) Merge branch 'feature/refactor' into feature",
        "|\\",
        "| * ghi789 (feature/refactor) refactor fileA",
        "* | def456 initial commit",
        "|/",
        "* def456 (HEAD -> main) initial commit",
      ],
      remote: [
        "Remote (https://example.com/lecture.git):",
        "* jkl012 (origin/feature) Merge branch 'feature/refactor' into feature",
        "|\\",
        "| * ghi789 refactor fileA",
        "* | def456 initial commit",
        "| |/",
        "|/",
        "* def456 (origin/main) initial commit",
      ],
    },
  },
  {
    id: 11,
    instructionTitle: "リモートの最新の変更を取り込んでください",
    instructionBody: "",
    acceptedCommands: ["git pull"],
    tip: "fetch + merge をまとめたコマンドです",
    hint: "git pull を使用します",
    imagePath: "/images/step-11.svg",
    graphState: {
      local: [
        "Local:",
        "* jkl012 (feature) Merge branch 'feature/refactor' into feature",
        "|\\",
        "| * ghi789 (feature/refactor) refactor fileA",
        "* | def456 initial commit",
        "|/",
        "* def456 (HEAD -> main) initial commit",
      ],
      remote: [
        "Remote (https://example.com/lecture.git):",
        "* mno345 (origin/main) Merge pull request #1 from feature",
        "|\\",
        "| * jkl012 (origin/feature) Merge branch 'feature/refactor' into feature",
        "| |\\",
        "| | * ghi789 refactor fileA",
        "| * | def456 initial commit",
        "| |/",
        "|/",
        "* def456 (origin/main) initial commit",
      ],
    },
  },
]

const GameContext = createContext<GameState | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showTip, setShowTip] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [lastCommand, setLastCommand] = useState("")
  const [isCorrectAndWaiting, setIsCorrectAndWaiting] = useState(false)

  const submitCommand = (command: string) => {
    const step = scenarios[currentStep]

    if (!step) return

    const isCorrect = step.acceptedCommands.some((accepted) => command.trim().toLowerCase() === accepted.toLowerCase())

    if (isCorrect) {
      setShowTip(true)
      setShowHint(false)
      setLastCommand(command)
      setIsCorrectAndWaiting(true)
    } else {
      setShowTip(false)
      setShowHint(true)
      setLastCommand(command)
      setIsCorrectAndWaiting(false)
    }
  }

  const advanceToNextStep = () => {
    setCurrentStep(currentStep + 1)
    setShowTip(false)
    setShowHint(false)
    setIsCorrectAndWaiting(false)
    setLastCommand("")
  }

  const reset = () => {
    setCurrentStep(0)
    setShowTip(false)
    setShowHint(false)
    setLastCommand("")
    setIsCorrectAndWaiting(false)
  }

  return (
    <GameContext.Provider
      value={{
        currentStep,
        showTip,
        showHint,
        lastCommand,
        isCorrectAndWaiting,
        steps: scenarios,
        submitCommand,
        advanceToNextStep,
        reset,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
