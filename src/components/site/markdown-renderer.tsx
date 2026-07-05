"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useState } from "react"
import { Check, Copy } from "lucide-react"

function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false)
  const code = String(children).replace(/\n$/, "")
  
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-6">
      <pre className="bg-[#0d0d0f] border border-border rounded-xl p-5 overflow-x-auto text-sm font-mono leading-relaxed">
        <code className={className}>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-muted/50 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, className, children, ...props }: any) {
          const isBlock = !props.inline
          if (isBlock) {
            return <CodeBlock className={className}>{children}</CodeBlock>
          }
          return (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">
              {children}
            </code>
          )
        },
        h1: ({ children }) => <h1 className="text-4xl font-serif font-bold mt-12 mb-6 leading-tight">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-serif font-bold mt-10 mb-4">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-bold mt-8 mb-3">{children}</h3>,
        p: ({ children }) => <p className="leading-8 mb-6 text-foreground/90">{children}</p>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-6 py-1 my-8 italic text-muted-foreground">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
        li: ({ children }) => <li className="leading-7">{children}</li>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">
            {children}
          </a>
        ),
        hr: () => <hr className="my-12 border-border" />,
        img: ({ src, alt }) => (
          <img src={src} alt={alt} className="w-full rounded-xl my-8 border border-border" />
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-8">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => <th className="border border-border px-4 py-2 bg-muted font-bold text-left">{children}</th>,
        td: ({ children }) => <td className="border border-border px-4 py-2">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
