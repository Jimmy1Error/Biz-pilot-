import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  Users, 
  Clock, 
  MessageSquareQuote, 
  BarChart3, 
  ShoppingBag, 
  ArrowRight, 
  Copy, 
  Check, 
  Plus, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Zap,
  PhoneCall,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { NavTab } from '../../types/index.ts';

export const DashboardTab: React.FC = () => {
  const { 
    business, 
    leads, 
    followUps, 
    products, 
    quota, 
    plan, 
    setActiveTab, 
    executeAIWorker,
    updateFollowUp,
    setIsCommandPaletteOpen 
  } = useApp();

  const [commandInput, setCommandInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<any | null>(null);
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);

  const pendingFollowups = followUps.filter(f => f.status === 'Pending');
  const newLeads = leads.filter(l => l.status === 'New');
  const wonLeads = leads.filter(l => l.status === 'Won');

  const totalWonValue = wonLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

  const sampleCommands = [
    "Write a WhatsApp reply for a customer asking about price.",
    "Create 7 Instagram posts for my clothing store.",
    "Follow up with today's leads.",
    "Summarize my business activity.",
    "Create a promotion for Eid.",
    "Turn these product details into a sales message.",
  ];

  const handleRunCommand = async (textToRun?: string) => {
    const query = textToRun || commandInput;
    if (!query.trim()) return;

    setLoading(true);
    setAiOutput(null);

    try {
      const res = await executeAIWorker(query);
      setAiOutput(res);
    } catch (err: any) {
      setAiOutput({
        intent: 'System Notice',
        toolUsed: 'general_business_assistant',
        suggestedOutput: err?.message || 'Failed to execute command. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraftId(id);
    setTimeout(() => setCopiedDraftId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-xl sm:flex-row sm:items-center sm:p-8">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            <span>BizPilot Autonomous Worker Active</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Welcome back, {business.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Here is your daily pulse. BizPilot is ready to draft replies, follow up with leads, and generate high-converting social campaigns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('ai-worker')}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500 shadow-md shadow-emerald-600/30"
          >
            <Bot className="h-4 w-4" />
            <span>Ask BizPilot</span>
          </button>
          <button
            onClick={() => setActiveTab('customer-reply')}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            <MessageSquareQuote className="h-4 w-4 text-emerald-400" />
            <span>Fast WhatsApp Reply</span>
          </button>
        </div>
      </div>

      {/* Main AI Command Box Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">AI Command Center</h2>
              <p className="text-[11px] text-slate-500">Autonomous intent detection & tool routing</p>
            </div>
          </div>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            Default: PKR / Pakistan
          </span>
        </div>

        {/* Input Bar */}
        <div className="relative mt-2">
          <textarea
            rows={2}
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleRunCommand();
              }
            }}
            placeholder="Tell BizPilot what you need... (e.g. Write a WhatsApp reply for customer asking price)"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 pr-28 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition shadow-2xs"
          />

          <div className="absolute right-2.5 bottom-2.5">
            <button
              onClick={() => handleRunCommand()}
              disabled={loading || !commandInput.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <span>Routing...</span>
              ) : (
                <>
                  <span>Execute</span>
                  <Send className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Example Command Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400">Quick Commands:</span>
          {sampleCommands.slice(0, 4).map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCommandInput(cmd);
                handleRunCommand(cmd);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900"
            >
              "{cmd}"
            </button>
          ))}
        </div>

        {/* AI Result Card */}
        {aiOutput && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Intent: {aiOutput.intent}
                </span>
                <span className="text-[11px] font-medium text-emerald-800">
                  Tool: <code className="font-mono text-emerald-950 font-bold">{aiOutput.toolUsed}</code>
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(aiOutput.suggestedOutput, 'ai_cmd')}
                className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                {copiedDraftId === 'ai_cmd' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedDraftId === 'ai_cmd' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-normal shadow-2xs">
              {aiOutput.suggestedOutput}
            </div>

            <div className="text-[10px] text-slate-400">
              * BizPilot generated this using your saved business policies and products. Never claim messages were sent externally without an integrated messaging connection.
            </div>
          </div>
        )}
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Pending Follow-ups</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{pendingFollowups.length}</div>
          <p className="mt-1 text-[11px] text-amber-600 font-semibold">Scheduled today</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Active Leads</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{leads.length}</div>
          <p className="mt-1 text-[11px] text-blue-600 font-semibold">{newLeads.length} new this week</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Won Orders</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{wonLeads.length}</div>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
            Rs. {totalWonValue.toLocaleString()} value
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">AI Generations</span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{quota.aiRequestsUsed}</div>
          <p className="mt-1 text-[11px] text-slate-500">{quota.aiRequestsLimit - quota.aiRequestsUsed} remaining</p>
        </div>

        <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Products in Catalog</span>
            <ShoppingBag className="h-4 w-4 text-teal-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{products.length}</div>
          <p className="mt-1 text-[11px] text-teal-600 font-semibold">Ready for AI quoting</p>
        </div>
      </div>

      {/* Secondary Quick Action Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <button
          onClick={() => setActiveTab('content-studio')}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:border-emerald-300 hover:shadow-xs group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Create Content</span>
          <span className="text-[10px] text-slate-400">7 Platforms</span>
        </button>

        <button
          onClick={() => setActiveTab('customer-reply')}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:border-emerald-300 hover:shadow-xs group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
            <MessageSquareQuote className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Customer Reply</span>
          <span className="text-[10px] text-slate-400">WhatsApp / COD</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:border-emerald-300 hover:shadow-xs group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
            <Users className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Add Lead</span>
          <span className="text-[10px] text-slate-400">Track Customer</span>
        </button>

        <button
          onClick={() => setActiveTab('follow-ups')}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:border-emerald-300 hover:shadow-xs group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
            <Clock className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Create Follow-up</span>
          <span className="text-[10px] text-slate-400">Schedule & Draft</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:border-emerald-300 hover:shadow-xs group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
            <BarChart3 className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Generate Report</span>
          <span className="text-[10px] text-slate-400">Daily / Weekly</span>
        </button>
      </div>

      {/* Two Columns: Today's Follow-ups & Recent Leads */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Follow-ups */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">Today's Due Follow-ups</h3>
            </div>
            <button
              onClick={() => setActiveTab('follow-ups')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View all ({followUps.length})</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {pendingFollowups.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                🎉 No pending follow-ups today! All set.
              </div>
            ) : (
              pendingFollowups.slice(0, 3).map((f) => (
                <div key={f.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{f.customerName}</span>
                      <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                        Due: {f.time}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">{f.customerPhone}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">{f.reminderNote}</p>

                  <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-[11px] text-slate-700 italic">
                    "{f.messageDraft}"
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => copyToClipboard(f.messageDraft, f.id)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {copiedDraftId === f.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedDraftId === f.id ? 'Copied' : 'Copy Message'}</span>
                    </button>
                    <button
                      onClick={() => updateFollowUp(f.id, { status: 'Completed' })}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      <Check className="h-3 w-3" />
                      <span>Mark Done</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Leads Pipeline */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <h3 className="font-bold text-sm text-slate-900">Recent Leads & Inquiries</h3>
            </div>
            <button
              onClick={() => setActiveTab('leads')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Manage CRM</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {leads.slice(0, 4).map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-3 transition hover:bg-white hover:border-emerald-300">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 truncate">{l.customerName}</span>
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                      {l.source}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{l.productInterest}</p>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    l.status === 'Won' ? 'bg-emerald-100 text-emerald-800' :
                    l.status === 'Interested' ? 'bg-blue-100 text-blue-800' :
                    l.status === 'Negotiating' ? 'bg-purple-100 text-purple-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {l.status}
                  </span>
                  {l.estimatedValue && (
                    <div className="text-[11px] font-extrabold text-slate-800">
                      Rs. {l.estimatedValue.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
