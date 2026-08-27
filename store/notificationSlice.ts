import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { randomUUID } from "crypto";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = { notifications: [] };

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<Notification, "id">>) {
      state.notifications.push({
        ...action.payload,
        id: Math.random().toString(36).slice(2),
      });
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
