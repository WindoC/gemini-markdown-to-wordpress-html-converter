
import React, { useRef, useEffect } from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface InputPanelProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onConvert: () => void;
  isLoading: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ value, onChange, onConvert, isLoading }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when value changes, but only if user is not currently focusing/typing
    // to avoid jumping the view while editing the top of a long document.
    if (textareaRef.current && document.activeElement !== textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [value]);

  return (
    <div className="flex flex-col bg-slate-800/50 rounded-lg shadow-xl border border-slate-700 h-[60vh] md:h-auto">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <label htmlFor="markdown-input" className="text-lg font-semibold text-slate-300">
          Markdown Input
        </label>
        <button
          onClick={onConvert}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Converting...
            </>
          ) : (
            <>
              <MagicWandIcon className="w-5 h-5 mr-2" />
              Convert to HTML
            </>
          )}
        </button>
      </div>
      <div className="flex-grow p-1">
        <textarea
          ref={textareaRef}
          id="markdown-input"
          value={value}
          onChange={onChange}
          placeholder={`# Your Markdown Title\n\n- A list item\n- Another list item\n\n**Bold text** and *italic text*.\n\n[A link to Google](https://google.com)\n\n\`\`\`javascript\nconsole.log("Hello, world!");\n\`\`\``}
          className="w-full h-full bg-slate-900 rounded-b-md p-4 text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none font-mono text-sm"
        />
      </div>
    </div>
  );
};

export default InputPanel;
