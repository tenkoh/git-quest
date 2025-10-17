"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

export type ScenarioStep = {
  id: number;
  instructionTitle: string;
  instructionBody: string;
  acceptedCommands: string[];
  tip?: string;
  hint?: string;
  imagePath?: string;
};

type GameState = {
  currentStep: number;
  showTip: boolean;
  showHint: boolean;
  lastCommand: string;
  isCorrectAndWaiting: boolean;
  steps: ScenarioStep[];
  submitCommand: (command: string) => void;
  advanceToNextStep: () => void;
  reset: () => void;
};

const scenarios: ScenarioStep[] = [
  {
    id: 1,
    instructionTitle: "リモートリポジトリをクローンしてください",
    instructionBody:
      "リモートリポジトリのURLは https://example.com/lecture.git です。",
    acceptedCommands: ["git clone https://example.com/lecture.git"],
    tip: "リモートリポジトリを丸ごとコピーして、ローカルでの作業を開始します。",
    hint: "git clone <リポジトリURL> を使用します",
    imagePath: "/images/git-lecture-001.svg",
  },
  {
    id: 2,
    instructionTitle: "作業ブランチを作成し、ブランチを切り替えてください",
    instructionBody: "ブランチ名は feature とします。",
    acceptedCommands: [
      "git checkout -b feature",
      "git switch -c feature",
      "git branch feature && git checkout feature",
      "git branch feature && git switch feature",
    ],
    tip: "作業内容ごとにブランチを分けるのが一般的です。checkout -b や switch -c で新規作成と切り替えを同時に行えますが、git branch で作成してから git checkout/git switch で切り替える方法もあります。",
    hint:
      "git checkout -b <ブランチ名> や git switch -c <ブランチ名>、または git branch <ブランチ名> && git checkout <ブランチ名> を使用します",
    imagePath: "/images/git-lecture-002.svg",
  },
  {
    id: 3,
    instructionTitle: "編集したファイルをステージングしてください",
    instructionBody:
      "ファイル file.md を編集したとして、ステージングしてください。",
    acceptedCommands: ["git add file.md", "git add ."],
    tip: "git add <ファイル名> で変更をステージングエリアに追加します。現在のディレクトリ以下の全てを追加するには git add . を使用します",
    hint: "git add <ファイル名> を使用します",
    imagePath: "/images/git-lecture-003.svg",
  },
  {
    id: 4,
    instructionTitle: "ステージングしたファイルをコミットしてください",
    instructionBody:
      "ステージングエリアの内容をコミットしてください。コミットメッセージは edit file.md とします。",
    acceptedCommands: [
      "git commit -m 'edit file.md'",
      'git commit -m "edit file.md"',
    ],
    tip: "コミットは変更履歴の単位です。意味のある単位でコミットすることが推奨されます",
    hint: 'git commit -m "<メッセージ>" を使用します',
    imagePath: "/images/git-lecture-004.svg",
  },
  {
    id: 5,
    instructionTitle: "新しい作業用ブランチを作成し、ブランチを切り替えてください",
    instructionBody: "ブランチ名は feature/refactor とします。",
    acceptedCommands: [
      "git checkout -b feature/refactor",
      "git switch -c feature/refactor",
      "git branch feature/refactor && git checkout feature/refactor",
      "git branch feature/refactor && git switch feature/refactor",
    ],
    tip: "作業をさらに細かく分けることで、変更を管理しやすくなります。git checkout -b や git switch -c のほか、git branch で作成してから切り替える方法でも対応できます",
    hint:
      "git checkout -b <ブランチ名> や git switch -c <ブランチ名>、または git branch <ブランチ名> && git checkout <ブランチ名> を使用します",
    imagePath: "/images/git-lecture-005.svg",
  },
  {
    id: 6,
    instructionTitle:
      "もう一度、編集したファイルをステージングしてコミットしてください",
    instructionBody:
      "先ほど行ったステージングとコミットを同時に行います。 && でコマンドを連結してください(前後の半角スペース付き)。コミットメッセージは refactor file.md とします。",
    acceptedCommands: [
      'git add file.md && git commit -m "refactor file.md"',
      "git add file.md && git commit -m 'refactor file.md'",
      'git add . && git commit -m "refactor file.md"',
      "git add . && git commit -m 'refactor file.md'",
    ],
    tip: "小さな単位でコミットすることで、変更履歴が追いやすくなります",
    hint: 'git add <ファイル名> && git commit -m "<メッセージ>" を使用します',
    imagePath: "/images/git-lecture-006.svg",
  },
  {
    id: 7,
    instructionTitle: "変更をマージするために元のブランチに戻ってください",
    instructionBody: "feature ブランチに戻ります。",
    acceptedCommands: [
      "git checkout feature",
      "git switch feature",
    ],
    tip: "ブランチを切り替えることで、異なる作業内容に移動できます",
    hint: "git checkout <ブランチ名> または git switch <ブランチ名> を使用します",
    imagePath: "/images/git-lecture-007.svg",
  },
  {
    id: 8,
    instructionTitle: "作業ブランチをマージしてください",
    instructionBody:
      "feature/refactor ブランチを feature ブランチにマージします。",
    acceptedCommands: ["git merge feature/refactor"],
    tip: "別ブランチの変更を取り込みます。競合が発生した場合は手動で解決する必要があります。",
    hint: "git merge <ブランチ名> を使用します",
    imagePath: "/images/git-lecture-008.svg",
  },
  {
    id: 9,
    instructionTitle: "ブランチをリモートにプッシュしてください",
    instructionBody:
      "feature ブランチをリモートにプッシュします。リモートに feature ブランチはまだ存在しません。",
    acceptedCommands: [
      "git push -u origin feature",
      "git push --set-upstream origin feature",
    ],
    tip: "-u オプション(または --set-upstream オプション)でローカルのブランチをリモートに送信します。次回以降は git push のみでOK。",
    hint: "git push -u origin <ブランチ名> を使用します",
    imagePath: "/images/git-lecture-009.svg",
  },
  {
    id: 10,
    instructionTitle: "[説明のみ] リモートリポジトリでの変更の取り込み",
    instructionBody:
      "リモートリポジトリでは、コードレビューを経て作業ブランチ(今回は feature ブランチ)の変更を main ブランチに取り込みます。GitHubではPull Request機能を使用します。内容を理解したら ok と入力してください。",
    acceptedCommands: ["ok"],
    tip: "Pull RequestはGitHubなどのホスティングサービスで提供される機能で、コードレビューとマージを効率化します",
    hint: "「ok」と入力してください",
    imagePath: "/images/git-lecture-010.svg",
  },
  {
    id: 11,
    instructionTitle: "リモートの main ブランチの変更を取り込んでください",
    instructionBody:
      "ローカルの main ブランチに切り替えた後、リモートの変更を取り込みます。コマンドは && で連結してください(前後の半角スペース付き)。",
    acceptedCommands: [
      "git checkout main && git pull",
      "git switch main && git pull",
      "git checkout main && git pull origin main",
      "git switch main && git pull origin main",
    ],
    tip: "git pull はリモートの最新の変更を取得してローカルに反映します。必要に応じてリモート名とブランチ名を指定することもできます",
    hint:
      "git checkout main または git switch main で main ブランチに切り替えた後、git pull (必要なら git pull origin main) を使用します",
    imagePath: "/images/git-lecture-011.svg",
  },
];

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [isCorrectAndWaiting, setIsCorrectAndWaiting] = useState(false);

  const submitCommand = (command: string) => {
    const step = scenarios[currentStep];

    if (!step) return;

    const isCorrect = step.acceptedCommands.some(
      (accepted) => command.trim().toLowerCase() === accepted.toLowerCase(),
    );

    if (isCorrect) {
      setShowTip(true);
      setShowHint(false);
      setLastCommand(command);
      setIsCorrectAndWaiting(true);
    } else {
      setShowTip(false);
      setShowHint(true);
      setLastCommand(command);
      setIsCorrectAndWaiting(false);
    }
  };

  const advanceToNextStep = () => {
    setCurrentStep(currentStep + 1);
    setShowTip(false);
    setShowHint(false);
    setIsCorrectAndWaiting(false);
    setLastCommand("");
  };

  const reset = () => {
    setCurrentStep(0);
    setShowTip(false);
    setShowHint(false);
    setLastCommand("");
    setIsCorrectAndWaiting(false);
  };

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
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
