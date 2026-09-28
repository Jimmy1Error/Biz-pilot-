import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  Globe, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  Check, 
  ChevronDown,
  Building2,
  HelpCircle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Language } from '../../types/index.ts';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { 
    user, 
    business, 
    language, 
    setLanguage, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    setIsCommandPaletteOpen,
    setIsOnboardingOpen,
    openAuthModal,
    logoutUser,
    setActiveTab,
    quota,
    plan
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'Business Standard' },
    { code: 'ur', label: 'اردو', sub: 'Urdu Nastaliq' },
    { code: 'hinglish', label: 'Hinglish / Roman Urdu', sub: 'WhatsApp Friendly' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 text-lg">BizPilot</span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-800 text-[10px] tracking-wide uppercase">
                AI
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
              Your AI Worker for Everyday Business
            </p>
          </div>
        </div>

        {/* Active Business Badge on Desktop */}
        <div className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 md:flex ml-3">
          <Building2 className="h-3.5 w-3.5 text-emerald-600" />
          <span className="font-semibold max-w-[140px] truncate">{business.name}</span>
          <span className="text-slate-400">•</span>
          <span className="text-[11px] font-medium text-slate-500">{business.currency}</span>
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="hidden max-w-md flex-1 px-4 md:block">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-500 transition-all hover:border-emerald-400 hover:bg-white hover:text-slate-700 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-emerald-600" />
            <span className="truncate">Tell BizPilot what you need...</span>
          </div>
          <kbd className="hidden items-center gap-0.5 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 lg:inline-flex shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right controls: Language, Notifications, Onboarding help, User menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 md:hidden"
          title="Search / Ask BizPilot"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLanguageMenu(!showLanguageMenu);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            title="Switch Language (English / Urdu / Hinglish)"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-600" />
            <span className="capitalize">{language === 'ur' ? 'اردو' : language === 'hinglish' ? 'Hinglish' : 'EN'}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showLanguageMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-400">Select Language</div>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLanguageMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                    language === l.code ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="font-medium">{l.label}</div>
                    <div className="text-[10px] text-slate-400">{l.sub}</div>
                  </div>
                  {language === l.code && <Check className="h-4 w-4 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowLanguageMenu(false);
              setShowProfileMenu(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">No notifications yet</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.linkTab) setActiveTab(notif.linkTab as any);
                        setShowNotifications(false);
                      }}
                      className={`cursor-pointer p-3.5 transition-colors hover:bg-slate-50 ${
                        !notif.read ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs font-semibold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Help / Onboarding Trigger */}
        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
          title="Business Setup Guide / Wizard"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* User Account / Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowLanguageMenu(false);
            }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 hover:bg-slate-50 sm:px-2.5 sm:py-1.5"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-800 text-xs">
              {user ? user.name.slice(0, 2).toUpperCase() : 'G'}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                {user ? user.name : 'Guest User'}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-medium text-emerald-600 uppercase">{plan}</span>
                {user?.role === 'super_admin' && (
                  <span title="Super Admin">
                    <ShieldCheck className="h-3 w-3 text-amber-500" />
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="hidden h-3 w-3 text-slate-400 sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-xs font-semibold text-slate-500">Signed in as</p>
                <p className="font-bold text-sm text-slate-900 truncate">{user ? user.email : 'guest@bizpilot.pk'}</p>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg">
                  <span>AI Quota:</span>
                  <span className="font-bold text-emerald-700">
                    {quota.aiRequestsUsed} / {quota.aiRequestsLimit} used
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  Business Profile & Settings
                </button>
                <button
                  onClick={() => {
                    setActiveTab('subscription');
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-slate-500" />
                    Subscription Plan
                  </span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-800 text-[10px]">
                    {plan}
                  </span>
                </button>
                {user?.role === 'super_admin' && (
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                    Admin Control Panel
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsOnboardingOpen(true);
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                  Relaunch Setup Wizard
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                {user ? (
                  <button
                    onClick={() => {
                      logoutUser();
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50"
                  >
                    <User className="h-3.5 w-3.5" />
                    Sign In / Register
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
