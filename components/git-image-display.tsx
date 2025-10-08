"use client";

import Image from "next/image";
import nextConfig from "../next.config.mjs";

import { Card } from "@/components/ui/card";

const BASE_PATH = nextConfig.basePath || "";

type GitImageDisplayProps = {
  imagePath?: string;
};

export function GitImageDisplay({ imagePath }: GitImageDisplayProps) {
  const deployedPath = `${BASE_PATH}${imagePath || "/images/placeholder.svg"}`
  return (
    <Card className="w-full h-full flex items-center justify-center bg-muted">
      {imagePath ? (
        <div className="relative w-full h-full">
          <Image
            src={deployedPath}
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
