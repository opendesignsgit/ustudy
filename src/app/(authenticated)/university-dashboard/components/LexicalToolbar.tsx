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
import { $generateNodesFromDOM } from '@lexical/html';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { $createLinkNode } from '@lexical/link';
import { $createHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

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

  const insertHorizontalRule = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.extract();
        const hr = $createHorizontalRuleNode();
        if (nodes.length === 0) {
          selection.insertNodes([hr, $createParagraphNode()]);
        } else {
          const lastNode = nodes[nodes.length - 1];
          lastNode.insertAfter(hr);
          hr.insertAfter($createParagraphNode());
        }
      }
    });
  }, [editor]);

  const insertContentBlock = useCallback((blockType: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const content = prompt(`Enter content for ${blockType}:`);
        if (content) {
          let blockElement: any;
          
          switch (blockType) {
            case 'callout':
              blockElement = `<div class="content-block callout-block"><div class="callout-content"><strong>💡 Callout:</strong> ${content}</div></div>`;
              break;
            case 'hero':
              blockElement = `<div class="content-block hero-block"><h2 class="hero-title">${content}</h2><p class="hero-subtitle">Add your hero subtitle here</p></div>`;
              break;
            case 'feature':
              blockElement = `<div class="content-block feature-block"><h3 class="feature-title">${content}</h3><p class="feature-description">Add feature description here</p></div>`;
              break;
            case 'stats':
              blockElement = `<div class="content-block stats-block"><div class="stat-item"><span class="stat-number">${content}</span><span class="stat-label">Statistic Label</span></div></div>`;
              break;
            default:
              blockElement = `<div class="content-block generic-block">${content}</div>`;
          }
          
          // Insert the HTML block
          const parser = new DOMParser();
          const dom = parser.parseFromString(blockElement, 'text/html');
          const blockNodes = $generateNodesFromDOM(editor, dom);
          selection.insertNodes([...blockNodes, $createParagraphNode()]);
        }
      }
    });
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
        <strong>B</strong>
      </button>
      <button
        className={`toolbar-item ${isItalic ? 'active' : ''}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
          setIsItalic(!isItalic);
        }}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        className={`toolbar-item ${isUnderline ? 'active' : ''}`}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
          setIsUnderline(!isUnderline);
        }}
        title="Underline"
      >
        <u>U</u>
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
        1.
      </button>
      
      <div className="divider" />
      
      <button
        className="toolbar-item"
        onClick={insertLink}
        title="Insert Link"
      >
        🔗
      </button>
      
      <button
        className="toolbar-item"
        onClick={insertHorizontalRule}
        title="Insert Horizontal Rule"
      >
        ―
      </button>
      
      <div className="divider" />
      
      {/* Content Blocks Dropdown */}
      <select
        className="toolbar-select"
        onChange={(e) => {
          const value = e.target.value;
          if (value && value !== 'blocks') {
            insertContentBlock(value);
            e.target.value = 'blocks'; // Reset selection
          }
        }}
        defaultValue="blocks"
        title="Insert Content Blocks"
      >
        <option value="blocks">+ Add Block</option>
        <option value="hero">Hero Section</option>
        <option value="feature">Feature Block</option>
        <option value="callout">Callout Box</option>
        <option value="stats">Statistics</option>
      </select>
    </div>
  );
}