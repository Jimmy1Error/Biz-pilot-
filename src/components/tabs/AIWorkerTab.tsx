import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  Clock, 
  MessageSquare, 
  Share2, 
  Layers, 
  BarChart3, 
  Users, 
  ShoppingBag,
  ExternalLink,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Language } from '../../types/index.ts';

export const AIWorkerTab: React.FC = () => {
  const { 
    business, 
    products, 
    knowledge, 
    language, 
    setLanguage, 
    executeAIWorker, 
    addFollowUp,
    addTemplate,
    setActiveTab 
  } = useApp();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{
    id: string;
    userQuery: string;
    response: any;
    timestamp: string;
  }>>([
    {
      id: 'h_1',
      userQuery: 'Customer says delivery is late for Lahore shipment.',
      response: {
        intent: 'Customer Support / Delivery Issue',
        toolUsed: 'customer_reply()',
        suggestedOutput: 'Assalam-o-Alaikum! We sincerely apologize for the delay in receiving your order. Due to high courier traffic, TCS/Leopards has scheduled delivery for today by 5:00 PM. We are actively monitoring your tracking number and will ensure it reaches your doorstep safely. Thank you for your patience with Zahra Pret!',
        actionText: 'Copy WhatsApp Reply',
        language: 'en',
      },
      timestamp: 'Today, 10:14 AM'
    }
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedTemplateId, setSavedTemplateId] = useState<string | null>(null);

  const internalTools = [
    { name: 'customer_reply()', desc: 'Auto-craft polite responses, policies & price queries' },
    { name: 'generate_social_content()', desc: 'Instagram, Facebook & TikTok caption & video scripts' },
    { name: 'generate_product_description()', desc: 'SEO-ready sales copy & feature lists' },
    { name: 'create_follow_up()', desc: 'Turn reminders into scheduled tasks with message drafts' },
    { name: 'create_business_report()', desc: 'Daily, weekly activity & revenue synthesis' },
    { name: 'lead_summary()', desc: 'Analyze CRM leads & negotiation readiness' },
    { name: 'marketing_campaign()', desc: 'Eid, seasonal flash sales & holiday promotions' },
    { name: 'general_business_assistant()', desc: 'Strategy, pricing models & everyday operations' },
  ];

  const presets = [
    "Customer says delivery is late.",
    "Write a WhatsApp reply for a customer asking about price.",
    "Create 7 Instagram posts for my clothing store.",
    "Turn these product details into a sales message.",
    "Create a promotion for Eid with 15% discount.",
    "Customer asking if Cash on Delivery is available in Peshawar.",
  ];

  const handleSend = async (textToRun?: string) => {
    const q = textToRun || prompt;
    if (!q.trim()) return;

    setLoading(true);

    try {
      const result = await executeAIWorker(q);
      
      const newEntry = {
        id: 'hist_' + Date.now(),
        userQuery: q,
        response: result,
        timestamp: 'Just now'
      };

      setHistory(prev => [newEntry, ...prev]);
      setPrompt('');
    } catch (err: any) {
      alert(err?.message || 'Error executing AI request.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToTemplates = (entry: any) => {
    addTemplate({
      title: `${entry.response.intent} (${new Date().toLocaleDateString()})`,
      category: 'Customer Support',
      language: language,
      content: entry.response.suggestedOutput,
      tags: ['AI-Generated', entry.response.toolUsed]
    });
    setSavedTemplateId(entry.id);
    setTimeout(() => setSavedTemplateId(null), 2000);
  };

  const handleScheduleFollowup = (entry: any) => {
    addFollowUp({
      customerName: 'Customer Inquiry',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      reminderNote: `Follow-up regarding: ${entry.userQuery.slice(0, 50)}`,
      messageDraft: entry.response.suggestedOutput,
      status: 'Pending',
      priority: 'medium',
    });
    setActiveTab('follow-ups');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bot className="h-6 w-6 text-emerald-600" />
            BizPilot AI Orchestration Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Intelligent task classification, business memory routing, and real-time execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Output Language:</span>
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                language === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ur')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                language === 'ur' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              اردو
            </button>
            <button
              onClick={() => setLanguage('hinglish')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                language === 'hinglish' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hinglish
            </button>
          </div>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Command prompt box & active tool directory */}
        <div className="space-y-4 lg:col-span-1">
          {/* Command Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Direct AI Instruction</span>
            </div>

            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Write a WhatsApp reply for customer asking price..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !prompt.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Classifying & Routing...</span>
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  <span>Execute with BizPilot</span>
                </>
              )}
            </button>

            {/* Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Example Scenarios</span>
              <div className="mt-2 space-y-1.5">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(p);
                      handleSend(p);
                    }}
                    className="w-full text-left rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-[11px] font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Connected Internal Tools */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
              Registered Internal Tools (8)
            </h3>
            <div className="space-y-2">
              {internalTools.map((t, idx) => (
                <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5">
                  <code className="text-xs font-mono font-bold text-emerald-800">{t.name}</code>
                  <p className="mt-0.5 text-[11px] text-slate-500">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Execution History & Structured Output */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-800">Orchestration Logs & Outputs</h2>
            <span className="text-xs text-slate-400">{history.length} responses</span>
          </div>

          <div className="space-y-4">
            {history.map((entry) => (
              <div 
                key={entry.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-150"
              >
                {/* User Prompt */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                      U
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400">User Command</span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">{entry.userQuery}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{entry.timestamp}</span>
                </div>

                {/* Structured Output Card */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        Intent: {entry.response.intent}
                      </span>
                      <span className="rounded-md border border-emerald-300 bg-white px-2 py-0.5 text-[11px] font-mono text-emerald-900">
                        {entry.response.toolUsed}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(entry.response.suggestedOutput, entry.id)}
                        className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition"
                      >
                        {copiedId === entry.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedId === entry.id ? 'Copied!' : 'Copy Reply'}</span>
                      </button>

                      <button
                        onClick={() => handleSaveToTemplates(entry)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        title="Save to Template Library"
                      >
                        <Bookmark className="h-3.5 w-3.5" />
                        <span>{savedTemplateId === entry.id ? 'Saved!' : 'Save Template'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Main text */}
                  <div className={`rounded-xl border border-slate-200 bg-white p-4 text-xs sm:text-sm leading-relaxed text-slate-800 shadow-2xs whitespace-pre-line ${
                    language === 'ur' ? 'urdu-text' : ''
                  }`}>
                    {entry.response.suggestedOutput}
                  </div>

                  {/* Breakdown if present */}
                  {entry.response.structuredDetails && (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs space-y-1.5">
                      <div className="font-bold text-slate-700">Structured Campaign Breakdown:</div>
                      {entry.response.structuredDetails.hook && (
                        <div><strong className="text-emerald-700">Hook:</strong> {entry.response.structuredDetails.hook}</div>
                      )}
                      {entry.response.structuredDetails.cta && (
                        <div><strong className="text-emerald-700">CTA:</strong> {entry.response.structuredDetails.cta}</div>
                      )}
                      {entry.response.structuredDetails.visualConcept && (
                        <div><strong className="text-purple-700">Visual Concept:</strong> {entry.response.structuredDetails.visualConcept}</div>
                      )}
                    </div>
                  )}

                  {/* Action row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-emerald-100 text-[11px] text-slate-500">
                    <button
                      onClick={() => handleScheduleFollowup(entry)}
                      className="flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>Convert to Scheduled Follow-up</span>
                    </button>

                    <div className="flex items-center gap-1 text-slate-400">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      <span>Draft only — not transmitted externally</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
