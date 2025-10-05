"use client";

import { type FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";

type CommandInputProps = {
  onSubmit: (command: string) => void;
  disabled?: boolean;
};

export function CommandInput({ onSubmit, disabled }: CommandInputProps) {
  const [command, setCommand] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit(command);
      setCommand("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-700 bg-black p-6"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-white font-semibold">$</span>
        <Input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Gitコマンドを入力してください..."
          className="font-mono flex-1 bg-black text-white border-gray-700 placeholder:text-gray-500 focus-visible:ring-gray-600"
          disabled={disabled}
          autoFocus
        />
      </div>
    </form>
  );
}
