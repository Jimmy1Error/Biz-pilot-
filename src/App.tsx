/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/layout/Header.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { MobileNav } from './components/layout/MobileNav.tsx';
import { CommandPalette } from './components/common/CommandPalette.tsx';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';

// Tab Components
import { DashboardTab } from './components/tabs/DashboardTab.tsx';
import { AIWorkerTab } from './components/tabs/AIWorkerTab.tsx';
import { CustomerReplyTab } from './components/tabs/CustomerReplyTab.tsx';
import { ContentStudioTab } from './components/tabs/ContentStudioTab.tsx';
import { LeadManagerTab } from './components/tabs/LeadManagerTab.tsx';
import { FollowUpTab } from './components/tabs/FollowUpTab.tsx';
import { ProductCatalogTab } from './components/tabs/ProductCatalogTab.tsx';
import { ReportTab } from './components/tabs/ReportTab.tsx';
import { KnowledgeBaseTab } from './components/tabs/KnowledgeBaseTab.tsx';
import { TemplateLibraryTab } from './components/tabs/TemplateLibraryTab.tsx';
import { SubscriptionTab } from './components/tabs/SubscriptionTab.tsx';
import { AdminTab } from './components/tabs/AdminTab.tsx';
import { SettingsTab } from './components/tabs/SettingsTab.tsx';

const MainLayout: React.FC = () => {
  const { activeTab, business } = useApp();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'ai-worker':
        return <AIWorkerTab />;
      case 'customer-reply':
        return <CustomerReplyTab />;
      case 'content-studio':
        return <ContentStudioTab />;
      case 'leads':
        return <LeadManagerTab />;
      case 'follow-ups':
        return <FollowUpTab />;
      case 'products':
        return <ProductCatalogTab />;
      case 'reports':
        return <ReportTab />;
      case 'knowledge':
        return <KnowledgeBaseTab />;
      case 'templates':
        return <TemplateLibraryTab />;
      case 'subscription':
        return <SubscriptionTab />;
      case 'admin':
        return <AdminTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Desktop Responsive Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Main Content Area Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Sticky Top Header */}
        <Header onToggleMobileMenu={() => setIsMobileDrawerOpen(true)} />

        {/* Scrollable Main Stage */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
          <div className="mx-auto max-w-7xl">
            {renderActiveTab()}
          </div>
        </main>

        {/* Mobile Fixed Bottom Nav + Slide-over Drawer */}
        <MobileNav 
          isDrawerOpen={isMobileDrawerOpen} 
          onCloseDrawer={() => setIsMobileDrawerOpen(false)}
          onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        />
      </div>

      {/* Global Interactive Overlays */}
      <CommandPalette />
      <OnboardingWizard />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
