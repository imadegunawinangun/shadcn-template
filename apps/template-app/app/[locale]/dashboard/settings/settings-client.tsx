"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { ProfileSettings, MediaSettings } from "@workspace/settings";
import { User, Blocks, Bot } from "lucide-react";
import { UserAiSettingsForm } from "./user-ai-settings-form";

interface SettingsClientProps {
  profileData: {
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  workspaceId: string;
}

export function SettingsClient({ profileData, workspaceId }: SettingsClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="w-full h-11 bg-muted/50 rounded-xl animate-pulse" />
        <div className="h-[400px] bg-card/50 rounded-xl border border-border/50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden bg-muted/50 p-1 rounded-xl h-11 border border-border/50 shadow-sm">
          <TabsTrigger value="profile" className="rounded-lg px-6 data-[state=active]:shadow-sm gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="media" className="rounded-lg px-6 data-[state=active]:shadow-sm gap-2">
            <Blocks className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="ai" className="rounded-lg px-6 data-[state=active]:shadow-sm gap-2">
            <Bot className="h-4 w-4" />
            My AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 outline-none animate-in fade-in-50 duration-500 bg-card/50 p-6 rounded-xl border border-border/50 shadow-sm backdrop-blur-md">
          <ProfileSettings initialData={profileData} />
        </TabsContent>

        <TabsContent value="media" className="space-y-4 outline-none animate-in fade-in-50 duration-500 bg-card/50 p-6 rounded-xl border border-border/50 shadow-sm backdrop-blur-md">
          <MediaSettings workspaceId={workspaceId} />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4 outline-none animate-in fade-in-50 duration-500 bg-card/50 p-6 rounded-xl border border-border/50 shadow-sm backdrop-blur-md">
          <UserAiSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
