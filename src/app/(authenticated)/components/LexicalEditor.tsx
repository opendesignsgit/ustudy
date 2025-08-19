'use client'

import React, { useEffect, useState } from 'react'
import { $getRoot, $getSelection } from 'lexical'
import { 
  LexicalComposer,
  InitialConfigType
} from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { TRANSFORMERS } from '@lexical/markdown'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

// Lexical nodes
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { CodeNode, CodeHighlightNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListNode, ListItemNode } from '@lexical/list'

// Theme for styling
const theme = {
  paragraph: 'text-base leading-relaxed mb-4',
  heading: {
    h1: 'text-4xl font-bold mb-6 mt-8',
    h2: 'text-3xl font-bold mb-5 mt-7',
    h3: 'text-2xl font-bold mb-4 mt-6',
    h4: 'text-xl font-bold mb-3 mt-5',
    h5: 'text-lg font-bold mb-2 mt-4',
    h6: 'text-base font-bold mb-2 mt-3'
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal list-inside mb-4',
    ul: 'list-disc list-inside mb-4',
    listitem: 'mb-1',
  },
  link: 'text-blue-600 hover:text-blue-800 underline',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
    code: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono',
  },
  code: 'bg-gray-100 border border-gray-300 rounded p-4 mb-4 font-mono text-sm',
  quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-4',
}

// Toolbar component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  const formatText = (format: string) => {
    editor.dispatchCommand({ type: `FORMAT_TEXT_COMMAND` }, format)
  }

  const formatHeading = (headingSize: string) => {
    editor.update(() => {
      const selection = $getSelection()
      if (selection !== null) {
        // Format as heading
        editor.dispatchCommand({ type: 'FORMAT_ELEMENT_COMMAND' }, headingSize)
      }
    })
  }

  const insertList = (listType: string) => {
    editor.dispatchCommand({ type: `INSERT_${listType.toUpperCase()}_LIST_COMMAND` }, undefined)
  }

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-gray-300 bg-gray-50">
      {/* Text Formatting */}
      <div className="flex gap-1">
        <button
          onClick={() => formatText('bold')}
          className={`px-3 py-1 rounded border ${isBold ? 'bg-blue-500 text-white' : 'bg-white'} hover:bg-blue-100`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => formatText('italic')}
          className={`px-3 py-1 rounded border ${isItalic ? 'bg-blue-500 text-white' : 'bg-white'} hover:bg-blue-100`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => formatText('underline')}
          className={`px-3 py-1 rounded border ${isUnderline ? 'bg-blue-500 text-white' : 'bg-white'} hover:bg-blue-100`}
          title="Underline"
        >
          <u>U</u>
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Headings */}
      <div className="flex gap-1">
        <button
          onClick={() => formatHeading('h1')}
          className="px-3 py-1 rounded border bg-white hover:bg-blue-100 text-sm"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => formatHeading('h2')}
          className="px-3 py-1 rounded border bg-white hover:bg-blue-100 text-sm"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => formatHeading('h3')}
          className="px-3 py-1 rounded border bg-white hover:bg-blue-100 text-sm"
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Lists */}
      <div className="flex gap-1">
        <button
          onClick={() => insertList('unordered')}
          className="px-3 py-1 rounded border bg-white hover:bg-blue-100 text-sm"
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => insertList('ordered')}
          className="px-3 py-1 rounded border bg-white hover:bg-blue-100 text-sm"
          title="Numbered List"
        >
          1. List
        </button>
      </div>
    </div>
  )
}

// On change plugin to track content changes
function OnChangePlugin({ onChange }: { onChange: (content: string) => void }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot()
        const content = root.getTextContent()
        // For now, we'll use text content. In production, you'd want to serialize the full editor state
        onChange(JSON.stringify(editorState.toJSON()))
      })
    })
  }, [editor, onChange])

  return null
}

// Custom error boundary
function CustomErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="lexical-error-boundary">
      {children}
    </div>
  )
}

// Main editor component
interface LexicalEditorProps {
  initialContent?: string
  onChange: (content: string) => void
  placeholder?: string
}

export function LexicalEditor({ 
  initialContent = '', 
  onChange, 
  placeholder = 'Start writing...' 
}: LexicalEditorProps) {
  const initialConfig: InitialConfigType = {
    namespace: 'UniversityContentEditor',
    theme,
    onError: (error) => {
      console.error('Lexical Error:', error)
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
      ListNode,
      ListItemNode,
    ],
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="min-h-96 p-4 outline-none resize-none" 
                aria-placeholder={placeholder}
                placeholder={
                  <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={CustomErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LinkPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </LexicalComposer>
    </div>
  )
}