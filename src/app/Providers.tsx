"use client";

import NotificationList from "@/components/NotificationList";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NotificationList />
      {children}
    </div>
  );
}
