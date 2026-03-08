import { Avatar, Button } from "@heroui/react";
import { useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { MdExplore, MdPersonAdd, MdDone } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

/* ─── Compact user row ─────────────────────────────────────────────────────── */
function SidebarUserRow({ user }) {
  const { token } = useContext(authContext);
  const queryClient = useQueryClient();
  const id = user._id;

  const { data } = useQuery({
    queryKey: ["user", id],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  const isFollowing = data?.data?.data?.isFollowing;

  function handleFollow() {
    axios
      .put(
        `https://route-posts.routemisr.com/users/${id}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["sidebarSuggestions"] });
        queryClient.invalidateQueries({ queryKey: ["user", id] });
      })
      .catch(() => toast.error("Failed to follow", { autoClose: 2000 }));
  }

  return (
    <div className="flex items-center gap-3 py-2.5">
      {/* Avatar */}
      <Link to={`/profile/${id}`} className="shrink-0">
        <Avatar
          src={user.photo}
          name={user.name}
          size="sm"
          isBordered
          color={isFollowing ? "default" : "secondary"}
          className="w-9 h-9 ring-1 ring-indigo-500/30 transition-transform hover:scale-105"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/profile/${id}`}>
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
            {user.name}
          </p>
        </Link>
        <p className="text-xs text-gray-500 truncate">@{user.username}</p>
        <p className="text-[11px] text-gray-600 mt-0.5">
          {user.followersCount}{" "}
          <span className="text-gray-500">followers</span>
        </p>
      </div>

      {/* Follow button */}
      <Button
        onPress={handleFollow}
        size="sm"
        radius="full"
        variant={isFollowing ? "bordered" : "solid"}
        color={isFollowing ? "default" : "primary"}
        isIconOnly={false}
        className={
          "text-xs px-3 shrink-0 " +
          (isFollowing
            ? "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20")
        }
        startContent={
          isFollowing ? (
            <MdDone className="text-sm" />
          ) : (
            <MdPersonAdd className="text-sm" />
          )
        }
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}

/* ─── Right Sidebar ────────────────────────────────────────────────────────── */
export default function RightSidebar() {
  const { token } = useContext(authContext);

  const { data, isLoading, error } = useQuery({
    queryKey: ["sidebarSuggestions"],
    queryFn: () =>
      axios.get("https://route-posts.routemisr.com/users/suggestions", {
        params: { limit: 6, sort: "-createdAt", page: 1 },
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  const suggestions = data?.data?.data?.suggestions ?? [];

  return (
    <aside className="sticky top-20 h-fit hidden xl:flex flex-col gap-0">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400">
          <MdExplore className="text-base" />
        </div>
        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">
          People You May Know
        </h2>
      </div>

      {/* User list */}
      <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 divide-y divide-gray-100 dark:divide-gray-800/50 shadow-sm dark:shadow-none">
        {isLoading && (
          <div className="py-6 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <p className="py-4 text-xs text-red-500 dark:text-red-400 text-center">
            Could not load suggestions.
          </p>
        )}

        {!isLoading &&
          !error &&
          suggestions.map((user) => (
            <SidebarUserRow key={user._id} user={user} />
          ))}
      </div>

      {/* See all link */}
      {!isLoading && !error && suggestions.length > 0 && (
        <Link
          to="/discover"
          className="mt-3 text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          See all suggestions →
        </Link>
      )}
    </aside>
  );
}
