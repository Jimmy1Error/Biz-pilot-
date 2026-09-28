import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Users, 
  Sparkles, 
  MoreHorizontal, 
  X, 
  MessageSquareQuote, 
  Clock, 
  ShoppingBag, 
  BarChart3, 
  BookOpen, 
  Layers, 
  CreditCard, 
  ShieldCheck, 
  Settings,
  Building2,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { NavTab } from '../../types/index.ts';

interface MobileNavProps {
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ 
  isDrawerOpen, 
  onCloseDrawer, 
  onOpenDrawer 
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    business, 
    leads, 
    followUps, 
    quota, 
    user,
    plan 
  } = useApp();

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    onCloseDrawer();
  };

  const pendingFollowups = followUps.filter(f => f.status === 'Pending').length;
  const newLeads = leads.filter(l => l.status === 'New').length;

  return (
    <>
      {/* Mobile Bottom Fixed Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md lg:hidden shadow-lg">
        {/* Dashboard */}
        <button
          onClick={() => handleSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 p-1 transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        {/* Leads */}
        <button
          onClick={() => handleSelectTab('leads')}
          className={`relative flex flex-col items-center justify-center gap-1 p-1 transition-colors ${
            activeTab === 'leads' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-5 w-5" />
          {newLeads > 0 && (
            <span className="absolute -top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">
              {newLeads}
            </span>
          )}
          <span className="text-[10px]">Leads</span>
        </button>

        {/* Center Prominent AI Worker Button */}
        <button
          onClick={() => handleSelectTab('ai-worker')}
          className="relative -top-3 flex flex-col items-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 transition-transform active:scale-95">
            <Bot className="h-6 w-6" />
          </div>
          <span className="mt-0.5 text-[10px] font-bold text-emerald-800">BizPilot AI</span>
        </button>

        {/* Content Studio */}
        <button
          onClick={() => handleSelectTab('content-studio')}
          className={`flex flex-col items-center justify-center gap-1 p-1 transition-colors ${
            activeTab === 'content-studio' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-[10px]">Content</span>
        </button>

        {/* More / Menu Drawer */}
        <button
          onClick={onOpenDrawer}
          className={`relative flex flex-col items-center justify-center gap-1 p-1 text-slate-500 hover:text-slate-800`}
        >
          <MoreHorizontal className="h-5 w-5" />
          {pendingFollowups > 0 && (
            <span className="absolute -top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">
              {pendingFollowups}
            </span>
          )}
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* Slide-over Drawer for All Pages on Mobile */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            onClick={onCloseDrawer} 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative flex w-4/5 max-w-sm flex-col bg-white shadow-2xl h-full">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm">
                  {business.name.slice(0, 1)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 truncate max-w-[170px]">{business.name}</h3>
                  <p className="text-[11px] text-slate-500">{business.city}, {business.country}</p>
                </div>
              </div>
              <button 
                onClick={onCloseDrawer}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold uppercase text-slate-400">Main Features</div>
              
              <button
                onClick={() => handleSelectTab('dashboard')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  activeTab === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => handleSelectTab('ai-worker')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  activeTab === 'ai-worker' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bot className="h-4 w-4" />
                <span>AI Worker (Command Box)</span>
              </button>

              <button
                onClick={() => handleSelectTab('customer-reply')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  activeTab === 'customer-reply' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <MessageSquareQuote className="h-4 w-4" />
                <span>Customer Reply Generator</span>
              </button>

              <button
                onClick={() => handleSelectTab('content-studio')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  activeTab === 'content-studio' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Content Studio</span>
              </button>

              <button
                onClick={() => handleSelectTab('leads')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  activeTab === 'leads' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4" />
                  <span>Lead Manager (CRM)</span>
                </div>
                {newLeads > 0 && (
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800">
                    {newLeads}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleSelectTab('follow-ups')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  activeTab === 'follow-ups' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4" />
                  <span>Follow-up Engine</span>
                </div>
                {pendingFollowups > 0 && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
                    {pendingFollowups} due
                  </span>
                )}
              </button>

              <div className="mt-3 px-3 py-1 text-[11px] font-bold uppercase text-slate-400">Business Assets</div>

              <button
                onClick={() => handleSelectTab('products')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  activeTab === 'products' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Products & Services DB</span>
              </button>

              <button
                onClick={() => handleSelectTab('reports')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  activeTab === 'reports' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>AI Business Reports</span>
              </button>

              <button
                onClick={() => handleSelectTab('knowledge')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  activeTab === 'knowledge' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Business Knowledge & Policies</span>
              </button>

              <button
                onClick={() => handleSelectTab('templates')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  activeTab === 'templates' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Template Library</span>
              </button>

              <div className="mt-3 px-3 py-1 text-[11px] font-bold uppercase text-slate-400">Account & Billing</div>

              <button
                onClick={() => handleSelectTab('subscription')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  activeTab === 'subscription' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4" />
                  <span>Plans & Limits</span>
                </div>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                  {plan}
                </span>
              </button>

              {user?.role === 'super_admin' && (
                <button
                  onClick={() => handleSelectTab('admin')}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                    activeTab === 'admin' ? 'bg-purple-700 text-white' : 'text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin Control Portal</span>
                </button>
              )}

              <button
                onClick={() => handleSelectTab('settings')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                  activeTab === 'settings' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Settings, Privacy & Terms</span>
              </button>
            </div>

            {/* Bottom Quick Card */}
            <div className="border-t border-slate-100 p-3 bg-slate-50">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  AI Monthly Usage
                </span>
                <span className="font-extrabold text-emerald-700">
                  {quota.aiRequestsUsed}/{quota.aiRequestsLimit}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
