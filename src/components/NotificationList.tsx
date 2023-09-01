import React from "react";
import NotificationSnackbar from "./NotificationSnackbar";
import useNotificationStore from "@/stores/notificationStore";

const NotificationList: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <>
      {notifications.map((notification) => (
        <NotificationSnackbar
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
          open={true}
          onClose={removeNotification}
        />
      ))}
    </>
  );
};

export default NotificationList;
