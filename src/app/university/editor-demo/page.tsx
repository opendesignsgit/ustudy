"use client";

import React from 'react';
import { LexicalEditor } from '../dashboard/components/LexicalEditor';
import '../dashboard/components/LexicalEditor.css';

export default function UniversityEditorDemo() {
  const [content, setContent] = React.useState('<p>Welcome to the University Content Editor Demo!</p><p>This is a demonstration of the Lexical rich text editor implementation.</p>');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    console.log('Content updated:', newContent);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              University Content Editor Demo
            </h1>
            <p className="text-gray-600 mt-2">
              This demonstrates the Lexical rich text editor implemented for university content management.
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University Content
              </label>
              <div className="border rounded-lg overflow-hidden">
                <LexicalEditor
                  initialContent={content}
                  onChange={handleContentChange}
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Features Demonstrated:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Rich text editing with toolbar</li>
                <li>Headings (H1-H6), Bold, Italic, Underline</li>
                <li>Bullet and numbered lists</li>
                <li>Link insertion</li>
                <li>Quote blocks</li>
                <li>Undo/Redo functionality</li>
                <li>Real-time content updates</li>
              </ul>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Integration Notes:</h3>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>This editor is integrated into the university dashboard at <code className="bg-white px-1 rounded">/university/dashboard</code></li>
                <li>Content can be saved to browser storage or database</li>
                <li>Compatible with Payload CMS Lexical editor</li>
                <li>Used in the &quot;Content Editor&quot; tab of the university dashboard</li>
              </ul>
            </div>
            
            <div className="mt-6">
              <button 
                onClick={() => alert('In the full implementation, this would save to the database')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Save Content (Demo)
              </button>
              <a 
                href="/university/dashboard" 
                className="ml-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium inline-block"
              >
                Go to Full Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}