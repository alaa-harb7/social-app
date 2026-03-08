import { Tooltip } from "@heroui/react";
import {
  MdOutlineBookmarks,
  MdOutlinePeople,
} from "react-icons/md";
import { RiUserFollowLine } from "react-icons/ri";

function StatCard({ icon, value, label }) {
  return (
    <Tooltip content={`View ${label}`} placement="top" delay={400}>
      <button
        className="flex-1 flex flex-col items-center gap-1 py-4 px-3
                   bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl
                   hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-gray-100 dark:hover:bg-indigo-500/5
                   hover:-translate-y-0.5 transition-all duration-200
                   shadow-sm hover:shadow-indigo-500/10 hover:shadow-md
                   cursor-pointer group min-w-[90px] transition-colors"
      >
        <div className="text-indigo-600 dark:text-indigo-400 mb-0.5 group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          {value.toLocaleString()}
        </span>
        <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">
          {label}
        </span>
      </button>
    </Tooltip>
  );
}

export default function ProfileStats({ followersCount, followingCount, bookmarksCount }) {
  return (
    <div className="px-5 sm:px-8 mt-5">
      <div className="flex gap-3">
        <StatCard
          icon={<MdOutlinePeople className="text-2xl" />}
          value={followersCount}
          label="Followers"
        />
        <StatCard
          icon={<RiUserFollowLine className="text-2xl" />}
          value={followingCount}
          label="Following"
        />
        <StatCard
          icon={<MdOutlineBookmarks className="text-2xl" />}
          value={bookmarksCount}
          label="Bookmarks"
        />
      </div>
    </div>
  );
}
