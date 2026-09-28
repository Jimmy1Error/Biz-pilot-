import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  MessageSquareQuote, 
  Sparkles, 
  Users, 
  Clock, 
  ShoppingBag, 
  BarChart3, 
  BookOpen, 
  Layers, 
  CreditCard, 
  ShieldCheck, 
  Settings, 
  ChevronRight,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { NavTab } from '../../types/index.ts';

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', onItemClick }) => {
  const { 
    activeTab, 
    setActiveTab, 
    business, 
    followUps, 
    leads, 
    quota, 
    plan, 
    user 
  } = useApp();

  const pendingFollowupsCount = followUps.filter(f => f.status === 'Pending').length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    if (onItemClick) onItemClick();
  };

  const navGroups = [
    {
      group: 'Core AI Workspace',
      items: [
        {
          tab: 'dashboard' as NavTab,
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          tab: 'ai-worker' as NavTab,
          label: 'AI Worker Engine',
          icon: Bot,
          badge: 'HOT',
          badgeColor: 'bg-emerald-100 text-emerald-800',
        },
      ],
    },
    {
      group: 'Sales & Communications',
      items: [
        {
          tab: 'customer-reply' as NavTab,
          label: 'Customer Reply',
          icon: MessageSquareQuote,
          badge: null,
        },
        {
          tab: 'content-studio' as NavTab,
          label: 'Content Studio',
          icon: Sparkles,
          badge: null,
        },
        {
          tab: 'leads' as NavTab,
          label: 'Lead Manager (CRM)',
          icon: Users,
          badge: newLeadsCount > 0 ? `${newLeadsCount} new` : null,
          badgeColor: 'bg-blue-100 text-blue-800',
        },
        {
          tab: 'follow-ups' as NavTab,
          label: 'Follow-up Engine',
          icon: Clock,
          badge: pendingFollowupsCount > 0 ? `${pendingFollowupsCount}` : null,
          badgeColor: 'bg-amber-100 text-amber-900 font-bold',
        },
      ],
    },
    {
      group: 'Intelligence & Assets',
      items: [
        {
          tab: 'products' as NavTab,
          label: 'Products & Services',
          icon: ShoppingBag,
          badge: null,
        },
        {
          tab: 'reports' as NavTab,
          label: 'Business Reports',
          icon: BarChart3,
          badge: 'AI',
          badgeColor: 'bg-teal-100 text-teal-800',
        },
        {
          tab: 'knowledge' as NavTab,
          label: 'Business Knowledge',
          icon: BookOpen,
          badge: null,
        },
        {
          tab: 'templates' as NavTab,
          label: 'Template Library',
          icon: Layers,
          badge: null,
        },
      ],
    },
    {
      group: 'System & Administration',
      items: [
        {
          tab: 'subscription' as NavTab,
          label: 'Plan & Usage Limits',
          icon: CreditCard,
          badge: plan,
          badgeColor: 'bg-slate-200 text-slate-800',
        },
        ...(user?.role === 'super_admin' || user?.role === 'support_admin' ? [
          {
            tab: 'admin' as NavTab,
            label: 'Admin Dashboard',
            icon: ShieldCheck,
            badge: 'RBAC',
            badgeColor: 'bg-purple-100 text-purple-800',
          }
        ] : []),
        {
          tab: 'settings' as NavTab,
          label: 'Settings & Privacy',
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  const aiPercentage = Math.min(100, Math.round((quota.aiRequestsUsed / quota.aiRequestsLimit) * 100));

  return (
    <aside className={`flex h-full w-64 flex-col border-r border-slate-200 bg-white select-none ${className}`}>
      {/* Business Header in Sidebar */}
      <div className="border-b border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-sm shadow-sm">
            {business.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-bold text-slate-900">{business.name}</h2>
            <p className="truncate text-xs text-slate-500">{business.businessType}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {group.group}
            </h3>
            <div className="mt-1 space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeTab === item.tab;
                const Icon = item.icon;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleNav(item.tab)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-500/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`h-4 w-4 shrink-0 transition-transform ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`ml-2 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Monthly AI Usage Card */}
      <div className="border-t border-slate-100 p-3 bg-slate-50/70">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-bold text-slate-700">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Monthly AI Quota
            </span>
            <span className="font-extrabold text-emerald-700">
              {quota.aiRequestsUsed}/{quota.aiRequestsLimit}
            </span>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                aiPercentage > 85 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${aiPercentage}%` }}
            />
          </div>

          <button
            onClick={() => handleNav('subscription')}
            className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200"
          >
            <span>Upgrade to unlock higher limits</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
