import { useContext, useRef, useCallback } from "react";
import { authContext } from "../Context/AuthContext";
import { feedFilterContext } from "../Context/FeedFilterContext";
import axios from "axios";
import PostCard from "../postCard/PostCard";
import Loader from "../Loader/Loader";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { MdOutlineBookmarks } from "react-icons/md";
import { Spinner } from "@heroui/react";

export default function Home() {
  const { token, userId } = useContext(authContext);
  const { feedFilter } = useContext(feedFilterContext);

  function getPosts({ pageParam = 1 }) {
    const limit = 10;
    if (feedFilter === "myPosts") {
      return axios.get(
        `https://route-posts.routemisr.com/users/${userId}/posts`,
        {
          params: { limit, page: pageParam },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    }
    if (feedFilter === "saved") {
      return axios.get(`https://route-posts.routemisr.com/users/bookmarks`, {
        // Bookmarks might not be paginated, but we try passing anyway
        params: { limit, page: pageParam },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    // "all" or default fallback
    return axios.get("https://route-posts.routemisr.com/posts", {
      params: {
        limit,
        page: pageParam,
        sort: "-createdAt",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["getPosts", feedFilter],
    queryFn: getPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const limit = 10;
      const posts =
        lastPage?.data?.data?.posts || lastPage?.data?.data?.bookmarks || [];
      if (posts.length === limit) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  const observerRef = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading || isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-red-500 font-semibold bg-red-500/10 p-4 rounded-lg">
          Error: {error?.message || "Failed to load posts"}
        </p>
      </div>
    );
  }

  const allPosts =
    data?.pages?.flatMap(
      (page) => page?.data?.data?.posts || page?.data?.data?.bookmarks || []
    ) || [];

  return (
    <div className="text-gray-900 dark:text-white">
      <Helmet>
        <title>
          {feedFilter === "myPosts"
            ? "My Posts"
            : feedFilter === "saved"
              ? "Saved Posts"
              : "Feed"}
        </title>
      </Helmet>

      {feedFilter === "saved" && allPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-800 rounded-xl mt-4">
          <MdOutlineBookmarks className="text-5xl text-gray-400 dark:text-gray-600 mb-2" />
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No bookmarks yet</p>
          <p className="text-gray-500 text-sm">Saved posts will appear here.</p>
        </div>
      ) : (
        <>
          {!allPosts || allPosts.length === 0 ? (
            <div className="flex justify-center items-center p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl mt-4 shadow-sm dark:shadow-none">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No posts available right now.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-4">
              {allPosts.map((post, index) => {
                const isLast = allPosts.length === index + 1;
                return (
                  <div
                    ref={isLast ? lastPostElementRef : null}
                    key={post._id}
                    className="w-full"
                  >
                    <PostCard post={post} queryKey={["getPosts", feedFilter]} />
                  </div>
                );
              })}

              {isFetchingNextPage && (
                <div className="flex justify-center py-6 w-full">
                  <Spinner size="md" color="primary" label="Loading more posts..." />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
