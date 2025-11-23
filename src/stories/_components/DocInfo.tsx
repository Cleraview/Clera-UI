import React, { useState } from 'react'
import config from '@/config/site'
import { FiGithub, FiCopy } from 'react-icons/fi'
import { cn } from '@/utils'

type DocInfoProps = {
  importStatement: string
  sourcePath: string
}

export const DocInfo: React.FC<DocInfoProps> = ({
  importStatement,
  sourcePath,
}) => {
  const [importCopied, setImportCopied] = useState(false)
  const githubRepoUrl = config.repoUrl + '/tree/main/src'

  const copyToClipboard = (
    text: string,
    setCopied: (copied: boolean) => void
  ) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-space-md! p-space-sm bg-ds-elevation-surface-sunken dark:bg-ds-elevation-surface-raised rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-md [&>*]:font-(family-name:--font-code)!">
          <span className="text-body-xs! text-ds-subtle">Import</span>
          <code className="text-body-sm text-ds-default border-0! cursor-pointer hover:bg-ds-inverse-hovered/60 py-space-xs px-space-sm rounded-md">
            {importStatement}
          </code>
        </div>
        <button
          className={cn(
            'cursor-pointer',
            !importCopied ? 'text-ds-default' : 'text-ds-success'
          )}
          onClick={() => copyToClipboard(importStatement, setImportCopied)}
          aria-label="Copy import statement"
        >
          {importCopied ? (
            <span className="text-body-xs!">Copied!</span>
          ) : (
            <FiCopy />
          )}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-md [&>*]:font-(family-name:--font-code)!">
          <span className="text-body-xs! text-ds-subtle">Source</span>
          <a
            href={`${githubRepoUrl}/${sourcePath}`}
            className="flex items-center gap-space-sm hover:underline! py-space-xs px-space-sm rounded-md"
            target="_blank"
            rel="noreferrer"
          >
            <FiGithub />
            <span className="text-body-sm">{sourcePath}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
