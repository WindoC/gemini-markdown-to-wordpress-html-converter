
import React, { useState, useEffect, useRef } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface OutputPanelProps {
  html: string;
  isLoading: boolean;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ html, isLoading }) => {
  const [copyText, setCopyText] = useState('Copy HTML');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (copyText === 'Copied!') {
      const timer = setTimeout(() => setCopyText('Copy HTML'), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyText]);

  useEffect(() => {
    // Always scroll to bottom when content updates (e.g. streaming)
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [html, isLoading]);

  const handleCopy = () => {
    if (html) {
      navigator.clipboard.writeText(html);
      setCopyText('Copied!');
    }
  };

  return (
    <div className="flex flex-col bg-slate-800/50 rounded-lg shadow-xl border border-slate-700 h-[60vh] md:h-auto">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-300">HTML Output</h2>
        <button
          onClick={handleCopy}
          disabled={!html || isLoading}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
        >
          <ClipboardIcon className="w-5 h-5 mr-2" />
          {copyText}
        </button>
      </div>
      <div className="flex-grow p-1">
        <textarea
          ref={textareaRef}
          id="html-output"
          value={ html || ( isLoading ? "Generating HTML..." : "" )}
          placeholder="Your generated HTML will appear here."
          readOnly
          className="w-full h-full bg-slate-900 rounded-b-md p-4 text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none font-mono text-sm"
        />
      </div>
    </div>
  );
};

export default OutputPanel;
