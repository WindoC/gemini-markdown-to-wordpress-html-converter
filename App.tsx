
import React, { useState, useCallback } from 'react';
import { convertToHtmlStream } from './services/geminiService';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [html, setHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(async () => {
    if (!markdown.trim()) {
      setError('Markdown input cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHtml('');

    try {
      await convertToHtmlStream(markdown, (chunk) => {
        setHtml((prevHtml) => prevHtml + chunk);
      });
    } catch (err) {
      setError(err instanceof Error ? `An error occurred: ${err.message}` : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [markdown]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8 flex flex-col">
      <Header />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6">
        <InputPanel
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          onConvert={handleConvert}
          isLoading={isLoading}
        />
        <OutputPanel html={html} isLoading={isLoading} />
      </main>
      {error && (
        <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg border border-red-700">
          {error}
        </div>
      )}
      <footer className="text-center text-slate-500 mt-8 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
