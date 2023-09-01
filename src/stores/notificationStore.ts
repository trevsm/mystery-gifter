import { create } from "zustand";

type Notification = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

type NotificationState = {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
};

const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification: Notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    })),
}));

export default useNotificationStore;
