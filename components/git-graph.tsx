"use client"

type GitGraphProps = {
  local: string[]
  remote: string[]
}

export function GitGraph({ local, remote }: GitGraphProps) {
  const formatLineWithHead = (line: string) => {
    const headPattern = /$$HEAD -> [^)]+$$/
    const match = line.match(headPattern)

    if (match) {
      const headText = match[0]
      const beforeHead = line.substring(0, match.index)
      const afterHead = line.substring(match.index! + headText.length)

      return (
        <>
          {beforeHead}
          <span className="text-green-600 font-bold">{headText}</span>
          {afterHead}
        </>
      )
    }

    return line
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="font-mono text-sm space-y-4">
        {local.length > 0 && (
          <div>
            {local.map((line, index) => (
              <div key={index} className="text-foreground whitespace-pre">
                {formatLineWithHead(line)}
              </div>
            ))}
          </div>
        )}

        {remote.length > 0 && (
          <div className="mt-4">
            {remote.map((line, index) => (
              <div key={index} className="text-foreground whitespace-pre">
                {line}
              </div>
            ))}
          </div>
        )}

        {local.length === 0 && remote.length === 0 && (
          <div className="text-muted-foreground text-center py-8">リポジトリをクローンしてください</div>
        )}
      </div>
    </div>
  )
}
