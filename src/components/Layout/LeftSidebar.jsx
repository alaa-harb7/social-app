import { Link, useLocation } from "react-router-dom";
import {
  MdOutlineDynamicFeed,
  MdOutlinePeople,
  MdOutlineBookmarks,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useContext } from "react";
import { feedFilterContext } from "../Context/FeedFilterContext";

const navItems = [
  { label: "Feed", filterType: "all", icon: <MdOutlineDynamicFeed className="text-xl shrink-0" /> },
  { label: "My Posts", filterType: "myPosts", icon: <CgProfile className="text-xl shrink-0" /> },
  { label: "Community", path: "/discover", icon: <MdOutlinePeople className="text-xl shrink-0" /> },
  { label: "Saved", filterType: "saved", icon: <MdOutlineBookmarks className="text-xl shrink-0" /> },
];

export default function LeftSidebar() {
  const { pathname } = useLocation();
  const { feedFilter, setFeedFilter } = useContext(feedFilterContext);

  return (
    <aside className="sticky top-20 h-fit hidden lg:flex flex-col gap-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-3 mb-2">
        Menu
      </p>

      {navItems.map((item) => {
        // If it's a navigation item, check pathname. If it's a filter, check feedFilter.
        const isActive = item.path 
          ? pathname === item.path 
          : feedFilter === item.filterType;

        const baseClasses = "flex items-center w-full text-left gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ";
        const activeClasses = isActive 
          ? "bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800/70 hover:text-indigo-600 dark:hover:text-indigo-300";

        const iconBaseClasses = "flex items-center justify-center w-8 h-8 rounded-lg transition-colors ";
        const iconActiveClasses = isActive 
          ? "bg-indigo-200 dark:bg-indigo-600/30 text-indigo-600 dark:text-indigo-400" 
          : "text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400";

        if (item.path) {
          return (
            <Link
              key={item.label}
              to={item.path}
              className={baseClasses + activeClasses}
            >
              <span className={iconBaseClasses + iconActiveClasses}>{item.icon}</span>
              {item.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
            </Link>
          );
        }

        return (
          <button
            key={item.label}
            onClick={() => setFeedFilter(item.filterType)}
            className={baseClasses + activeClasses}
          >
            <span className={iconBaseClasses + iconActiveClasses}>{item.icon}</span>
            {item.label}
            {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
          </button>
        );
      })}

    </aside>
  );
}
