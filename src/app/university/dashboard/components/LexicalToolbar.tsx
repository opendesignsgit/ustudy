"use client";

import React, { useCallback, useState } from 'react';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { $createLinkNode } from '@lexical/link';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const formatParagraph = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  }, [editor]);

  const formatHeading = useCallback((headingSize: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  }, [editor]);

  const formatQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  }, [editor]);

  const formatBulletList = useCallback(() => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const formatNumberedList = useCallback(() => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const linkNode = $createLinkNode(url);
          selection.insertNodes([linkNode]);
        }
      });
    }
  }, [editor]);

  return (
    <div className="toolbar">
      <button
        className="toolbar-item"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="Undo"
      >
        ↶
      </button>
      <button
        className="toolbar-item"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="Redo"
      >
        ↷
      </button>
      <div className="divider" />
      
      <select
        className="toolbar-select"
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'paragraph') {
            formatParagraph();
          } else if (value === 'quote') {
            formatQuote();
          } else if (value.startsWith('h')) {
            formatHeading(value as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
          }
        }}
      >
        <option value="paragraph">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
        <option value="quote">Quote</option>
      </select>
      
      <div className="divider" />
      
      <button
        className={`toolbar-item ${isBold ? 'active' : ''}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
          setIsBold(!isBold);
        }}
        title="Bold"
      >
        B
      </button>
      <button
        className={`toolbar-item ${isItalic ? 'active' : ''}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
          setIsItalic(!isItalic);
        }}
        title="Italic"
      >
        I
      </button>
      <button
        className={`toolbar-item ${isUnderline ? 'active' : ''}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
          setIsUnderline(!isUnderline);
        }}
        title="Underline"
      >
        U
      </button>
      
      <div className="divider" />
      
      <button
        className="toolbar-item"
        onClick={formatBulletList}
        title="Bullet List"
      >
        •
      </button>
      <button
        className="toolbar-item"
        onClick={formatNumberedList}
        title="Numbered List"
      >
        #
      </button>
      
      <div className="divider" />
      
      <button
        className="toolbar-item"
        onClick={insertLink}
        title="Insert Link"
      >
        🔗
      </button>
    </div>
  );
}