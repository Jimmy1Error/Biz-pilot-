import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Copy,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Lead, LeadStatus } from '../../types/index.ts';

export const LeadManagerTab: React.FC = () => {
  const { 
    leads, 
    addLead, 
    updateLead, 
    deleteLead, 
    addFollowUp, 
    business, 
    products, 
    executeAIWorker,
    setActiveTab 
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'name'>('date');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [aiFollowupLead, setAiFollowupLead] = useState<Lead | null>(null);
  const [aiGeneratedDraft, setAiGeneratedDraft] = useState<string>('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    source: 'WhatsApp',
    productInterest: products[0]?.name || 'Luxury Velvet Suit',
    status: 'New' as LeadStatus,
    notes: '',
    estimatedValue: 12000,
    followUpDate: new Date().toISOString().split('T')[0],
  });

  const statuses: LeadStatus[] = ['New', 'Contacted', 'Interested', 'Negotiating', 'Won', 'Lost'];
  const sources = ['All', 'WhatsApp', 'Instagram', 'Facebook', 'Walk-in', 'Website', 'Referral'];

  // Filtered and sorted leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.productInterest.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchesSource = sourceFilter === 'All' || l.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  }).sort((a, b) => {
    if (sortBy === 'value') return (b.estimatedValue || 0) - (a.estimatedValue || 0);
    if (sortBy === 'name') return a.customerName.localeCompare(b.customerName);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleOpenAdd = () => {
    setEditingLead(null);
    setFormData({
      customerName: '',
      phone: '+92 ',
      email: '',
      source: 'WhatsApp',
      productInterest: products[0]?.name || '',
      status: 'New',
      notes: '',
      estimatedValue: 10000,
      followUpDate: new Date().toISOString().split('T')[0],
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (l: Lead) => {
    setEditingLead(l);
    setFormData({
      customerName: l.customerName,
      phone: l.phone,
      email: l.email || '',
      source: l.source,
      productInterest: l.productInterest,
      status: l.status,
      notes: l.notes,
      estimatedValue: l.estimatedValue || 0,
      followUpDate: l.followUpDate || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.phone.trim()) return;

    if (editingLead) {
      updateLead(editingLead.id, {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        source: formData.source,
        productInterest: formData.productInterest,
        status: formData.status,
        notes: formData.notes,
        estimatedValue: Number(formData.estimatedValue),
        followUpDate: formData.followUpDate,
      });
    } else {
      addLead({
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        source: formData.source,
        productInterest: formData.productInterest,
        status: formData.status,
        notes: formData.notes,
        estimatedValue: Number(formData.estimatedValue),
        followUpDate: formData.followUpDate,
      });
    }

    setIsAddModalOpen(false);
  };

  // Generate AI Follow-up Draft specifically for this lead
  const handleAIFollowup = async (lead: Lead) => {
    setAiFollowupLead(lead);
    setGeneratingAI(true);
    setAiGeneratedDraft('');

    try {
      const prompt = `Write an authentic, highly persuasive WhatsApp follow-up message for Pakistani customer ${lead.customerName} who inquired about ${lead.productInterest} (status: ${lead.status}, notes: ${lead.notes}). Mention our Cash on Delivery and stock urgency.`;
      const res = await executeAIWorker(prompt);
      setAiGeneratedDraft(res.suggestedOutput);
    } catch {
      setAiGeneratedDraft(`Assalam-o-Alaikum ${lead.customerName}! Following up on your inquiry about ${lead.productInterest}. We have only 2 pieces left in stock. Should we dispatch with Cash on Delivery (COD) today?`);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleScheduleFromAI = () => {
    if (!aiFollowupLead) return;

    addFollowUp({
      customerName: aiFollowupLead.customerName,
      customerPhone: aiFollowupLead.phone,
      leadId: aiFollowupLead.id,
      date: new Date().toISOString().split('T')[0],
      time: '15:00',
      reminderNote: `Follow-up on ${aiFollowupLead.productInterest}`,
      messageDraft: aiGeneratedDraft,
      status: 'Pending',
      priority: 'high',
    });

    setAiFollowupLead(null);
    setActiveTab('follow-ups');
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New': return 'bg-cyan-100 text-cyan-800';
      case 'Contacted': return 'bg-slate-200 text-slate-700';
      case 'Interested': return 'bg-blue-100 text-blue-800';
      case 'Negotiating': return 'bg-purple-100 text-purple-800';
      case 'Won': return 'bg-emerald-100 text-emerald-800';
      case 'Lost': return 'bg-rose-100 text-rose-800';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-600" />
            Lead Manager & CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track inquiries, manage negotiations, and trigger AI-tailored follow-ups.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, phone, or product..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Source filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="font-semibold text-slate-500">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1 text-xs">
            <span className="font-semibold text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="date">Most Recent</option>
              <option value="value">Highest Value</option>
              <option value="name">Customer Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table / Responsive Cards */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <Users className="mx-auto h-8 w-8 text-slate-300" />
            <p className="font-semibold text-slate-700">No matching customer leads found.</p>
            <p>Add your first WhatsApp or Instagram lead using the button above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLeads.map((l) => (
              <div 
                key={l.id}
                className="p-4 transition hover:bg-slate-50/70 sm:px-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Lead Info */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">{l.customerName}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(l.status)}`}>
                        {l.status}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {l.source}
                      </span>
                      {l.followUpDate && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700">
                          <Clock className="h-3 w-3" />
                          Follow-up: {l.followUpDate}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="font-medium text-slate-800">{l.productInterest}</span>
                      {l.estimatedValue && (
                        <span className="font-extrabold text-emerald-700">
                          Rs. {l.estimatedValue.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {l.notes && (
                      <p className="text-xs text-slate-500 line-clamp-1 italic">
                        "{l.notes}"
                      </p>
                    )}

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {l.phone}
                      </span>
                      {l.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {l.email}
                        </span>
                      )}
                      <span>Added {new Date(l.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAIFollowup(l)}
                      className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>AI Follow-up</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(l)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                      title="Edit Lead"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete lead record for ${l.customerName}?`)) {
                          deleteLead(l.id);
                        }
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingLead ? 'Edit Lead Record' : 'Record New Customer Lead'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
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
                    placeholder="e.g. Ayesha Khan"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Lead Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option>WhatsApp</option>
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>Walk-in</option>
                    <option>Website</option>
                    <option>Referral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Pipeline Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Product / Service Interest</label>
                <input
                  type="text"
                  value={formData.productInterest}
                  onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                  placeholder="e.g. Royal Embroidered Velvet 3-Piece"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Estimated Value (PKR)</label>
                  <input
                    type="number"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Follow-up Due Date</label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Notes & Preferences</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Customer requested size Medium measurements and COD shipping to Peshawar..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                >
                  {editingLead ? 'Update Lead' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Follow-up Generation Modal */}
      {aiFollowupLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setAiFollowupLead(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  AI Follow-up: {aiFollowupLead.customerName}
                </h3>
              </div>
              <button onClick={() => setAiFollowupLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                <div><strong>Inquiry:</strong> {aiFollowupLead.productInterest} ({aiFollowupLead.source})</div>
                <div><strong>Status:</strong> {aiFollowupLead.status}</div>
                {aiFollowupLead.notes && <div><strong>Context:</strong> {aiFollowupLead.notes}</div>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Generated Follow-up Message</label>
                {generatingAI ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 text-center text-xs text-emerald-800">
                    <Sparkles className="mx-auto h-5 w-5 animate-spin mb-1 text-emerald-600" />
                    BizPilot is personalizing follow-up message...
                  </div>
                ) : (
                  <textarea
                    rows={5}
                    value={aiGeneratedDraft}
                    onChange={(e) => setAiGeneratedDraft(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-emerald-500"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(aiGeneratedDraft);
                    setCopiedDraft(true);
                    setTimeout(() => setCopiedDraft(false), 2000);
                  }}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {copiedDraft ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedDraft ? 'Copied' : 'Copy Message'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAIFollowup(aiFollowupLead)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Regenerate
                  </button>
                  <button
                    type="button"
                    onClick={handleScheduleFromAI}
                    className="flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Schedule Follow-up Task</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
