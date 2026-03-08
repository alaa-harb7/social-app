import { useContext } from "react";
import { MdOutlineBookmarks } from "react-icons/md";
import { authContext } from "../../Context/AuthContext";
import PostCard from "../../postCard/PostCard";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Loader/Loader";
import axios from "axios";

export default function BookmarksTab() {
  const { token, userId } = useContext(authContext);
  function getBookmarks() {
    return axios.get(`https://route-posts.routemisr.com/users/bookmarks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { data, isLoading } = useQuery({
    queryKey: ["getBookmarks"],
    queryFn: getBookmarks,
  });

  if (isLoading) return <Loader />;
  const bookmarks = data?.data?.data?.bookmarks || [];
  return (
    <>
      {bookmarks.length > 0 ? (
        <div className="flex flex-col gap-2">
          {bookmarks.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              queryKey={["userPosts", userId]}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-14 gap-3
                 bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-800 rounded-xl transition-colors"
        >
          <MdOutlineBookmarks className="text-4xl text-gray-600" />
          <p className="text-gray-500 font-medium">No bookmarks yet</p>
          <p className="text-gray-600 text-sm">Saved posts will appear here.</p>
        </div>
      )}
    </>
  );
}
