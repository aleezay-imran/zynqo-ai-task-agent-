"use client";

import React from "react";
import { AppProvider, useApp } from "@/lib/store";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import DashboardScreen from "@/components/screens/DashboardScreen";
import TasksScreen from "@/components/screens/TasksScreen";
import CalendarScreen from "@/components/screens/CalendarScreen";
import DocumentsScreen from "@/components/screens/DocumentsScreen";
import EmailScreen from "@/components/screens/EmailScreen";
import AutomationScreen from "@/components/screens/AutomationScreen";
import ChatScreen from "@/components/screens/ChatScreen";
import SettingsScreen from "@/components/screens/SettingsScreen";
import CommandPalette from "@/components/search/CommandPalette";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import AuthGate from "@/components/auth/AuthGate";

function WorkspaceContent() {
  const { activeTab } = useApp();

  return (
    <div className="flex min-h-screen bg-[#F6F7FB] text-[#292C40]">
      {/* Primary Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {activeTab === "Overview" && <DashboardScreen />}
          {activeTab === "Tasks" && <TasksScreen />}
          {activeTab === "Calendar" && <CalendarScreen />}
          {activeTab === "Documents" && <DocumentsScreen />}
          {activeTab === "Email" && <EmailScreen />}
          {activeTab === "Automation" && <AutomationScreen />}
          {activeTab === "Chat" && <ChatScreen />}
          {activeTab === "Settings" && <SettingsScreen />}
        </main>
      </div>

      {/* Global Overlays and Modals */}
      <CommandPalette />
      <AddTaskModal />
      <OnboardingModal />
    </div>
  );
}

export default function Home() {
  return (
    <AuthGate>
      <AppProvider>
        <WorkspaceContent />
      </AppProvider>
    </AuthGate>
  );
}
