import React, { useState } from 'react'
import config from '@/config/site'
import { FiGithub, FiCopy } from 'react-icons/fi'

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
    <div className="max-w-2xl my-space-md! p-space-sm bg-elevation-surface-sunken dark:bg-elevation-surface-raised rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-md [&>*]:font-(family-name:--font-code)!">
          <span className="text-body-xs! text-subtle">Import</span>
          <code className="text-body-sm text-default border-0! cursor-pointer hover:bg-inverse-hovered/60 py-space-xs px-space-sm rounded-md">
            {importStatement}
          </code>
        </div>
        <button
          className="cursor-pointer"
          onClick={() => copyToClipboard(importStatement, setImportCopied)}
          aria-label="Copy import statement"
        >
          {importCopied ? (
            <span className="text-xs! text-success">Copied!</span>
          ) : (
            <FiCopy className="text-subtle" />
          )}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-md [&>*]:font-(family-name:--font-code)!">
          <span className="text-xs! text-subtle">Source</span>
          <a
            href={`${githubRepoUrl}/${sourcePath}`}
            className="flex items-center gap-space-sm hover:underline! py-space-xs px-space-sm rounded-md"
            target="_blank"
            rel="noreferrer"
          >
            <FiGithub className="text-gray-500" />
            <span className="text-sm text-default">{sourcePath}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
