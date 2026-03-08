import axios from "axios";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { authContext } from "../Context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import PostCard from "../postCard/PostCard";

export default function PostDetails() {
  const { token } = useContext(authContext);

  const { id } = useParams();

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  function getComments(){
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["postDetails", id],
    queryFn: getPostDetails,
  });

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["postComments", id],
    queryFn: getComments,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-red-500 font-semibold bg-red-500/10 p-4 rounded-lg">
          Error: {error.message || "Failed to load post details"}
        </p>
      </div>
    );
  }

  const post = data?.data?.data?.post;
  // Fallback to empty array if comments are still loading or failed
  const allComments = commentsData?.data?.data?.comments || [];
  console.log(commentsData)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111827] text-gray-900 dark:text-white p-4 sm:p-8 transition-colors duration-300">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => window.history.back()} 
            className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            &larr; Back to Feed
          </button>
        </div>
        <PostCard 
          post={post} 
          isPostDetails 
          comments={allComments} 
          isCommentsLoading={isCommentsLoading} 
          commentsError={commentsError} 
          queryKey={["postComments", id]}
          
        />
      </div>
    </div>
  );
}
