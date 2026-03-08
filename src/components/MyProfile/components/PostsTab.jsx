import { useQuery } from "@tanstack/react-query";
import { BsPostcard } from "react-icons/bs";
import Loader from "../../Loader/Loader";
import { useContext } from "react";
import { authContext } from "../../Context/AuthContext";
import axios from "axios";
import PostCard from "../../postCard/PostCard";

export default function PostsTab({ userId }) {
  const { token } = useContext(authContext);
  function getUserPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${userId}/posts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: getUserPosts,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-red-500 font-semibold bg-red-500/10 p-4 rounded-lg">
          Error: {error}
        </p>
      </div>
    );
  }
  const userPosts = data.data.data.posts;
  return (
    <>
      {!userPosts || userPosts.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-14 gap-3
                 bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-800 rounded-xl transition-colors"
        >
          <BsPostcard className="text-4xl text-gray-600" />
          <p className="text-gray-500 font-medium">No posts yet</p>
          <p className="text-gray-600 text-sm">
            Posts will appear here once added.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {userPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              queryKey={["userPosts", userId]}
            />
          ))}
        </div>
      )}
    </>
  );
}
