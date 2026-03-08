import { Button } from "@heroui/react";

export default function NotificationHeader({ onMarkAllRead }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
          Notifications
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
          Realtime updates for likes, comments, shares, and follows.
        </p>
      </div>
      <Button
        onPress={onMarkAllRead}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full px-6 py-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
      >
        Mark all as read
      </Button>
    </div>
  );
}
