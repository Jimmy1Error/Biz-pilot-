import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Server, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Cpu, 
  HardDrive, 
  RefreshCw,
  Search,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { UserRole } from '../../types/index.ts';

export const AdminTab: React.FC = () => {
  const { user } = useApp();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'overview' | 'users' | 'logs' | 'health'>('overview');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Access Control check
  const isAuthorized = user?.role === 'super_admin' || user?.role === 'support_admin';

  if (!isAuthorized) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center text-red-800 space-y-3">
        <Lock className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold">Access Restricted (403 Forbidden)</h2>
        <p className="text-xs max-w-md mx-auto text-red-700">
          This portal requires <strong>Super Admin</strong> or <strong>Support Admin</strong> privileges. Your current session does not hold administrative rights.
        </p>
      </div>
    );
  }

  const sampleUsers = [
    { id: 'usr_01', name: 'Kashif Mehmood', business: 'Zahra Pret & Textiles', role: 'super_admin', email: 'kashif@kashifgarments.pk', plan: 'STARTER', status: 'Active', requests: 142 },
    { id: 'usr_02', name: 'Zainab Bibi', business: 'Noor Herbal Salon', role: 'user', email: 'zainab@noorherbal.pk', plan: 'BUSINESS', status: 'Active', requests: 489 },
    { id: 'usr_03', name: 'Fahad Qureshi', business: 'Karachi Biryani Hub', role: 'user', email: 'fahad@biryanihub.pk', plan: 'FREE', status: 'Active', requests: 28 },
    { id: 'usr_04', name: 'Hamza Tariq', business: 'Studio Pixels Agency', role: 'support_admin', email: 'hamza@studiopixels.pk', plan: 'PRO', status: 'Active', requests: 1204 },
    { id: 'usr_05', name: 'Sadia Siddiqui', business: 'Glow Skin Studio', role: 'user', email: 'sadia@glowskin.pk', plan: 'STARTER', status: 'Inactive', requests: 84 },
  ];

  const errorLogs = [
    { id: 'log_01', time: '10:42:15', level: 'WARN', component: 'AI Worker Router', message: 'User prompt length reached 1800 chars (truncated to 2048 budget)' },
    { id: 'log_02', time: '09:12:04', level: 'INFO', component: 'Payment Abstraction', message: 'JazzCash verification webhook acknowledged for sub_biz_99' },
    { id: 'log_03', time: '08:00:00', level: 'INFO', component: 'Cron Engine', message: 'Daily follow-up reminders dispatched to notification stream' },
    { id: 'log_04', time: 'Yesterday', level: 'WARN', component: 'Rate Limiter', message: 'IP 182.185.*.* hit 60 req/min threshold — safe throttle enforced' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-purple-600" />
            Admin Control Center (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Platform observability, user authorization, AI token utilization, and system health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-purple-100 px-3 py-1 font-bold text-xs text-purple-800 uppercase">
            {user?.role.replace('_', ' ')}
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
            {(['overview', 'users', 'logs', 'health'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveAdminSubTab(tab)}
                className={`rounded-lg px-3 py-1.5 capitalize font-bold transition ${
                  activeAdminSubTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeAdminSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="text-xs font-bold uppercase text-slate-400">Total Businesses</span>
              <div className="mt-1 text-2xl font-black text-slate-900">1,482</div>
              <span className="text-[11px] text-emerald-600 font-semibold">+64 this week</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="text-xs font-bold uppercase text-slate-400">Monthly AI Runs</span>
              <div className="mt-1 text-2xl font-black text-purple-700">48,920</div>
              <span className="text-[11px] text-purple-600 font-semibold">99.98% successful</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="text-xs font-bold uppercase text-slate-400">Active Subscriptions</span>
              <div className="mt-1 text-2xl font-black text-emerald-700">894</div>
              <span className="text-[11px] text-emerald-600 font-semibold">PKR 3.4M MRR equivalent</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="text-xs font-bold uppercase text-slate-400">System Uptime</span>
              <div className="mt-1 text-2xl font-black text-teal-700">99.99%</div>
              <span className="text-[11px] text-teal-600 font-semibold">Asia-South1 Cluster</span>
            </div>
          </div>

          {/* Feature Usage Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Feature Utilization (Last 30 Days)</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span>Customer WhatsApp Reply Generator</span>
                    <span className="font-bold">42% (20,540 runs)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span>Content Studio (Reels & Instagram)</span>
                    <span className="font-bold">29% (14,180 runs)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '29%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span>Follow-up Reminders & CRM Sync</span>
                    <span className="font-bold">18% (8,805 runs)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span>AI Business Intelligence Reports</span>
                    <span className="font-bold">11% (5,395 runs)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '11%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Security & RBAC Enforcement</h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Server-side authorization tokens verified per route.</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>AI Studio Gemini API keys kept strictly server-side (never leaked to browser).</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Automatic sliding window token rate-limiting active (max 60 req/min/IP).</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeAdminSubTab === 'users' && (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <h3 className="font-bold text-sm text-slate-900">User Accounts Directory</h3>
            <span className="text-xs text-slate-500">{sampleUsers.length} enrolled users</span>
          </div>

          <div className="divide-y divide-slate-100">
            {sampleUsers.map((u) => (
              <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{u.name}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-700">
                      {u.role}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {u.status}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {u.business} • <span className="font-mono">{u.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-600">
                  <span className="font-bold text-slate-900">{u.plan} Plan</span>
                  <span>{u.requests} AI requests</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAdminSubTab === 'logs' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Audit & Diagnostic Logs</h3>
          <div className="space-y-2 font-mono text-xs">
            {errorLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  log.level === 'WARN' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-800'
                }`}>
                  {log.level}
                </span>
                <span className="text-slate-400">{log.time}</span>
                <span className="font-bold text-purple-700">{log.component}:</span>
                <span className="text-slate-700">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAdminSubTab === 'health' && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
            <Cpu className="h-5 w-5 text-emerald-600" />
            <h4 className="font-bold text-xs text-slate-900">Compute / Cloud Run</h4>
            <div className="text-lg font-black text-slate-800">Healthy</div>
            <p className="text-[11px] text-slate-500">Latency: 48ms average response time</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
            <Server className="h-5 w-5 text-teal-600" />
            <h4 className="font-bold text-xs text-slate-900">Relational Database</h4>
            <div className="text-lg font-black text-slate-800">Operational</div>
            <p className="text-[11px] text-slate-500">Connection pool ready, lazy-initialized</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
            <Activity className="h-5 w-5 text-purple-600" />
            <h4 className="font-bold text-xs text-slate-900">AI Worker Endpoint</h4>
            <div className="text-lg font-black text-slate-800">Active (Gemini 2.5)</div>
            <p className="text-[11px] text-slate-500">Token budget active, timeout 15s</p>
          </div>
        </div>
      )}
    </div>
  );
};
