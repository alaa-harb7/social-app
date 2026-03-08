import { MdDone } from "react-icons/md";
import timeAgo from "../../utils/timeAgo";
import { Link } from "react-router-dom";

export default function NotificationItem({ notification, onMarkRead }) {
  // Graceful fallback for API variance between actor and entity fields if needed based on the previous code,
  // though we primarily use the requested `actor`
  const actor =
    notification.actor ||
    notification.user ||
    (notification.entityType === "user" ? notification.entity : null);
  const { type, entityType, entity, isRead, createdAt } = notification;

  const actorName = actor?.name || "Someone";
  const actorPhoto = actor?.photo || "https://i.pravatar.cc/150";

  const getNotificationMessage = (id) => {
    switch (type) {
      case "follow_user":
        return (
          <>
            <span
              className={`font-bold text-gray-900 dark:text-white ${id ? "hover:underline cursor-pointer" : ""} tracking-wide`}
            >
              {actorName}
            </span>{" "}
            followed you
          </>
        );
      case "like_post":
        return (
          <>
            <span
              className={`font-bold text-gray-900 dark:text-white tracking-wide ${id ? "hover:underline cursor-pointer hover:text-indigo-500" : ""}`}
            >
              {actorName}
            </span>{" "}
            liked your post
          </>
        );
      case "comment_post":
        return (
          <>
            <span
              className={`font-bold text-gray-900 dark:text-white tracking-wide ${id ? "hover:underline cursor-pointer hover:text-indigo-500" : ""}`}
            >
              {actorName}
            </span>{" "}
            commented on your post
          </>
        );
      case "share_post":
        return (
          <>
            <span
              className={`font-bold text-gray-900 dark:text-white tracking-wide ${id ? "hover:underline cursor-pointer hover:text-indigo-500" : ""}`}
            >
              {actorName}
            </span>{" "}
            shared your post
          </>
        );
      default:
        return (
          <>
            <span className="font-bold text-gray-900 dark:text-white tracking-wide">
              {actorName}
            </span>{" "}
            interacted with you
          </>
        );
    }
  };

  const bgClass = isRead
    ? "bg-transparent border-transparent"
    : "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-500/20";

  return (
    <div
      className={`p-4 mb-3 border border-gray-200 dark:border-gray-800 rounded-2xl flex items-start gap-4 transition-all hover:bg-gray-100 dark:hover:bg-gray-800/40 ${bgClass} relative overflow-hidden bg-white dark:bg-transparent shadow-sm dark:shadow-none`}
    >
      {!isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
      )}

      {/* Left side: Avatar */}
      <Link to={`/profile/${actor._id}`} className="shrink-0 relative mt-1">
        <img
          src={actorPhoto}
          alt={actorName}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-800"
        />
        {!isRead && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-500 border-2 border-white dark:border-[#111827] rounded-full"></div>
        )}
      </Link>

      {/* Center: Content */}
      <div className="flex-1 min-w-0 pr-2 sm:pr-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
          <Link
            to={`/profile/${actor._id}`}
            className="text-[15px] Ho text-gray-700 dark:text-gray-300 leading-snug break-words"
          >
            {getNotificationMessage(actor._id)}
          </Link>
        </div>

        {/* Post Preview */}
        {entityType === "post" && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-200 dark:border-gray-800/60 line-clamp-2">
            {entity?.unavailable ? (
              <span className="italic text-gray-400 dark:text-gray-500">
                This content is no longer available
              </span>
            ) : (
              entity?.body || (
                <span className="italic">Post content attached...</span>
              )
            )}
          </div>
        )}
      </div>

      {/* Right side: Time & Action */}
      <div className="shrink-0 flex flex-col items-end justify-between h-full min-h-[48px] py-1">
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
          {timeAgo(createdAt)}
        </span>

        <div className="mt-auto pt-4">
          {isRead ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <MdDone className="text-sm" /> Read
            </span>
          ) : (
            <button
              onClick={onMarkRead}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors uppercase tracking-wider bg-indigo-100 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-500/20 active:scale-95"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
