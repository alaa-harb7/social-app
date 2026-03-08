import { Tabs, Tab } from "@heroui/react";

export default function NotificationFilters({ activeTab, setActiveTab, unreadCount }) {
  return (
    <div className="mb-6">
      <Tabs 
        selectedKey={activeTab} 
        onSelectionChange={setActiveTab}
        aria-label="Notification filters"
        color="secondary"
        classNames={{
          tabList: "bg-white dark:bg-gray-800/50 p-1 border border-gray-200 dark:border-gray-800/80 rounded-xl shadow-sm dark:shadow-none",
          cursor: "bg-indigo-500 dark:bg-indigo-600 shadow-sm shadow-indigo-500/30",
          tab: "h-10 px-6",
          tabContent: "text-gray-600 dark:text-gray-400 group-data-[selected=true]:text-white font-bold tracking-wide"
        }}
      >
        <Tab key="all" title="All" />
        <Tab 
          key="unread" 
          title={
            <div className="flex items-center gap-2">
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="flex h-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/20 px-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {unreadCount}
                </span>
              )}
            </div>
          } 
        />
      </Tabs>
    </div>
  );
}
