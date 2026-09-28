import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Check, 
  Copy, 
  X, 
  Edit2, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  Phone,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { FollowUp, FollowUpStatus } from '../../types/index.ts';

export const FollowUpTab: React.FC = () => {
  const { 
    followUps, 
    addFollowUp, 
    updateFollowUp, 
    deleteFollowUp, 
    executeAIWorker 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | FollowUpStatus>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FollowUp | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '+92 ',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    reminderNote: '',
    messageDraft: '',
    status: 'Pending' as FollowUpStatus,
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const [aiLoading, setAiLoading] = useState(false);

  const filtered = followUps.filter(f => statusFilter === 'All' || f.status === statusFilter);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      customerName: '',
      customerPhone: '+92 ',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      reminderNote: '',
      messageDraft: '',
      status: 'Pending',
      priority: 'medium',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f: FollowUp) => {
    setEditingItem(f);
    setFormData({
      customerName: f.customerName,
      customerPhone: f.customerPhone || '',
      date: f.date,
      time: f.time,
      reminderNote: f.reminderNote,
      messageDraft: f.messageDraft,
      status: f.status,
      priority: f.priority,
    });
    setIsModalOpen(true);
  };

  const handleAIGenerateDraft = async () => {
    if (!formData.customerName.trim()) {
      alert('Please enter a customer name first.');
      return;
    }

    setAiLoading(true);
    try {
      const prompt = `Write a polite, engaging WhatsApp follow-up message for Pakistani customer ${formData.customerName}. Context: ${formData.reminderNote || 'Inquiry follow-up'}. Include Cash on Delivery mention.`;
      const res = await executeAIWorker(prompt);
      setFormData(prev => ({ ...prev, messageDraft: res.suggestedOutput }));
    } catch {
      setFormData(prev => ({
        ...prev,
        messageDraft: `Assalam-o-Alaikum ${formData.customerName}! Just following up regarding your recent inquiry. Would you like us to reserve your suit and dispatch today?`
      }));
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) return;

    if (editingItem) {
      updateFollowUp(editingItem.id, formData);
    } else {
      addFollowUp(formData);
    }
    setIsModalOpen(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="h-6 w-6 text-amber-500" />
            Follow-up Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Never lose a sale. Schedule reminders with AI-drafted messages ready to send on WhatsApp or SMS.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-2xs">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
          {(['All', 'Pending', 'Completed', 'Skipped'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 font-bold transition ${
                statusFilter === s ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} tasks
        </span>
      </div>

      {/* Follow-up Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500 space-y-2 shadow-sm">
            <Clock className="mx-auto h-8 w-8 text-slate-300" />
            <p className="font-semibold text-slate-700">No follow-ups matching this filter.</p>
            <p>Schedule a new follow-up using the button above.</p>
          </div>
        ) : (
          filtered.map(f => (
            <div 
              key={f.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-3 transition hover:border-emerald-300"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    f.status === 'Completed' ? 'bg-emerald-500' :
                    f.status === 'Skipped' ? 'bg-slate-300' : 'bg-amber-500'
                  }`} />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{f.customerName}</h3>
                    {f.customerPhone && (
                      <span className="text-[11px] text-slate-500">{f.customerPhone}</span>
                    )}
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    f.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                    f.status === 'Skipped' ? 'bg-slate-100 text-slate-600' :
                    'bg-amber-100 text-amber-900'
                  }`}>
                    {f.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Due: {f.date} at {f.time}</span>
                </div>
              </div>

              {f.reminderNote && (
                <p className="text-xs font-medium text-slate-700">
                  <strong>Reminder:</strong> {f.reminderNote}
                </p>
              )}

              {/* Message Draft */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs text-slate-800 font-normal leading-relaxed relative">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Ready WhatsApp Message Draft:
                </div>
                "{f.messageDraft}"
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(f.messageDraft, f.id)}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {copiedId === f.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedId === f.id ? 'Copied Draft' : 'Copy Message'}</span>
                  </button>

                  {f.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => updateFollowUp(f.id, { status: 'Completed' })}
                        className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Mark Completed</span>
                      </button>
                      <button
                        onClick={() => updateFollowUp(f.id, { status: 'Skipped' })}
                        className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
                      >
                        Skip
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(f)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    title="Edit Task"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this follow-up task?')) deleteFollowUp(f.id);
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingItem ? 'Edit Follow-up Task' : 'Schedule Business Follow-up'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Ahmed Raza"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Customer WhatsApp</label>
                  <input
                    type="text"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Reminder Goal / Note</label>
                <input
                  type="text"
                  value={formData.reminderNote}
                  onChange={(e) => setFormData({ ...formData, reminderNote: e.target.value })}
                  placeholder="e.g. Confirm 5-piece wedding order discount and delivery address..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">WhatsApp Message Draft</label>
                  <button
                    type="button"
                    onClick={handleAIGenerateDraft}
                    disabled={aiLoading}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>{aiLoading ? 'Drafting...' : 'AI Auto-Draft'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={formData.messageDraft}
                  onChange={(e) => setFormData({ ...formData, messageDraft: e.target.value })}
                  placeholder="The message you will send to the customer on the follow-up day..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
