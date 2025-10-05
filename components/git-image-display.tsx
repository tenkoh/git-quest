"use client";

import Image from "next/image";

import { Card } from "@/components/ui/card";

type GitImageDisplayProps = {
  imagePath?: string;
};

export function GitImageDisplay({ imagePath }: GitImageDisplayProps) {
  return (
    <Card className="w-full h-full flex items-center justify-center bg-muted">
      {imagePath ? (
        <div className="relative w-full h-full">
          <Image
            src={imagePath || "/placeholder.svg"}
            alt="Git graph visualization"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            unoptimized
          />
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">画像読み込み中...</div>
      )}
    </Card>
  );
}
