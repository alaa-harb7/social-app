import React, { useContext, useState, useMemo } from "react";
import { authContext } from "../Context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../Loader/Loader";
import NotificationHeader from "./NotificationHeader";
import NotificationFilters from "./NotificationFilters";
import NotificationItem from "./NotificationItem";
import { Helmet } from "react-helmet";

export default function Notifications() {
  const { token } = useContext(authContext);
  const [activeTab, setActiveTab] = useState("all");

  const queryClient = useQueryClient();

  function handleGetNotifications() {
    return axios.get("https://route-posts.routemisr.com/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { data, isLoading } = useQuery({
    queryKey: ["getNotifications"],
    queryFn: handleGetNotifications,
  });

  const notifications = data?.data?.data?.notifications ?? [];

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);

  const handleMarkAllRead = () => {
    axios
      .patch("https://route-posts.routemisr.com/notifications/read-all", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["getNotifications"] });
      });
  };

  const handleMarkRead = (id) => {
    axios
      .patch(
        `https://route-posts.routemisr.com/notifications/${id}/read`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["getNotifications"] });
      });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111827] text-gray-900 dark:text-white py-10 transition-colors duration-300">
      <Helmet>
        <title>Notifications – Social</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <NotificationHeader onMarkAllRead={handleMarkAllRead} />

        <NotificationFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadCount={unreadCount}
        />

        <div className="flex flex-col gap-0 mt-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkRead={() => handleMarkRead(notification._id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-gray-900/30 rounded-2xl border border-gray-200 dark:border-gray-800/50 shadow-sm dark:shadow-none">
              <div className="bg-gray-100 dark:bg-gray-800/80 p-4 rounded-full mb-4">
                <span className="text-3xl">🔔</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
                {activeTab === "unread"
                  ? "You've caught up on all your notifications!"
                  : "When you get likes, comments, or followers, they'll show up here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
