import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Bot, 
  ArrowRight, 
  MessageSquareQuote, 
  Users, 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { NavTab } from '../../types/index.ts';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    executeAIWorker, 
    setActiveTab,
    business,
    language 
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isCommandPaletteOpen) return null;

  const quickPrompts = [
    { label: 'Write WhatsApp reply for customer asking price', icon: MessageSquareQuote, tab: 'customer-reply' as NavTab },
    { label: 'Create 7 Instagram posts for festive lawn drop', icon: Sparkles, tab: 'content-studio' as NavTab },
    { label: 'Follow up with today’s active leads', icon: Users, tab: 'follow-ups' as NavTab },
    { label: 'Summarize my daily business activity', icon: BarChart3, tab: 'reports' as NavTab },
    { label: 'Create an Eid promotion announcement', icon: Layers, tab: 'content-studio' as NavTab },
  ];

  const handleExecute = async (promptToRun?: string) => {
    const text = promptToRun || input;
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await executeAIWorker(text);
      setResult(res);
    } catch (err: any) {
      setResult({
        intent: 'System Notice',
        toolUsed: 'general_business_assistant',
        suggestedOutput: err?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setIsCommandPaletteOpen(false);
    setResult(null);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={handleClose} 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative mt-8 sm:mt-16 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Search Input */}
        <div className="flex items-center border-b border-slate-100 p-3 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleExecute();
              if (e.key === 'Escape') handleClose();
            }}
            placeholder="Tell BizPilot what you need... (e.g. Write a WhatsApp reply for price)"
            className="flex-1 bg-transparent px-3 text-sm sm:text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
            autoFocus
          />

          {input && (
            <button
              onClick={() => setInput('')}
              className="mr-2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => handleExecute()}
            disabled={loading || !input.trim()}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Ask BizPilot</span>
          </button>

          <button 
            onClick={handleClose}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
          {/* AI Result Presentation */}
          {result && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 items-center gap-1 rounded-md bg-emerald-600 px-2 text-[11px] font-bold text-white uppercase">
                    <Bot className="h-3 w-3" />
                    {result.intent || 'AI Response'}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-800">
                    Tool: <code className="font-mono">{result.toolUsed || 'bizpilot_worker'}</code>
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(result.suggestedOutput)}
                  className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Reply'}</span>
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed shadow-2xs font-normal">
                {result.suggestedOutput}
              </div>

              {result.structuredDetails && (
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs space-y-2">
                  <div className="font-bold text-slate-700">Content Breakdown:</div>
                  {result.structuredDetails.hook && (
                    <div><span className="font-semibold text-emerald-700">Hook:</span> {result.structuredDetails.hook}</div>
                  )}
                  {result.structuredDetails.cta && (
                    <div><span className="font-semibold text-emerald-700">Call to Action:</span> {result.structuredDetails.cta}</div>
                  )}
                  {result.structuredDetails.hashtags && (
                    <div className="text-slate-500 font-mono text-[11px]">
                      {result.structuredDetails.hashtags.join(' ')}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Knowledge source: {business.name} Policies & Products</span>
                <span className="text-slate-400">Not sent automatically (draft only)</span>
              </div>
            </div>
          )}

          {/* Quick Prompts List */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Suggested Business Commands
            </div>
            <div className="grid gap-2 sm:grid-cols-1">
              {quickPrompts.map((q, idx) => {
                const Icon = q.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(q.label);
                      handleExecute(q.label);
                    }}
                    className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                        "{q.label}"
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="rounded bg-white px-1.5 py-0.5 border border-slate-200 font-mono text-[10px]">ESC</span>
            <span>to close</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Multi-language: English, Urdu & Hinglish</span>
          </div>
        </div>
      </div>
    </div>
  );
};
