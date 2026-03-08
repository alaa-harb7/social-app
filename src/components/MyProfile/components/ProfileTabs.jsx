import { useState } from "react";
import { BsPostcard } from "react-icons/bs";
import { MdOutlineBookmarks, MdOutlinePersonAdd } from "react-icons/md";
import PostsTab from "./PostsTab";
import BookmarksTab from "./BookmarksTab";
import AboutTab from "./AboutTab";

const TABS = [
  { id: "posts", label: "Posts", icon: <BsPostcard className="text-base" /> },
  {
    id: "bookmarks",
    label: "Bookmarks",
    icon: <MdOutlineBookmarks className="text-base" />,
  },
  {
    id: "about",
    label: "About",
    icon: <MdOutlinePersonAdd className="text-base" />,
  },
];

export default function ProfileTabs({ user }) {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="mt-6">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 px-5 sm:px-8">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-3 sm:px-5 py-3 text-sm font-medium
                border-b-2 transition-all duration-200 mr-1
                ${
                  isActive
                    ? "border-indigo-600 dark:border-indigo-500 text-indigo-700 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      <div className="px-5 sm:px-8 py-6">
        {activeTab === "posts" && <PostsTab userId={user.id} />}
        {activeTab === "bookmarks" && <BookmarksTab />}
        {activeTab === "about" && <AboutTab user={user} />}
      </div>
    </div>
  );
}
