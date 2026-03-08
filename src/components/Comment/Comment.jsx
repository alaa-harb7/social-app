import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useContext, useState } from "react";
import { authContext } from "../Context/AuthContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { BsReply } from "react-icons/bs";
import axios from "axios";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import CommentComponent from "../CommentComponent/CommentComponet";
import timeAgo from "../../utils/timeAgo";

export default function Comment({ comment, postId, queryKey = ["getPosts"] }) {
  if (!comment) return null;
  const { commentCreator, content, createdAt } = comment;
  const { userId, token } = useContext(authContext);

  const [isReplyingLoading, setIsReplyingLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [addReply, setAddReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  // console.log(`commentCreator: ${commentCreator._id}`);


  const isCommentLiked = comment.likes.includes(userId);

  function handleDeleteComment() {
    axios
      .delete(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        queryClient.invalidateQueries({ queryKey: queryKey });
        toast.success("Comment deleted successfully", {
          autoClose: 2000,
          closeOnClick: true,
        });
      })
      .catch(() => {
        toast.error("Failed to delete comment", {
          autoClose: 2000,
          closeOnClick: true,
        });
      });
  }

  function handleGetReplies() {
    setIsReplyingLoading(true);
    return axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  function handleAddCommentLike(){
    axios
      .put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        queryClient.invalidateQueries({ queryKey: queryKey });
      })
      .catch(() => {
        toast.error("Failed to like comment", {
          autoClose: 2000,
          closeOnClick: true,
        });
      });
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["replies", comment._id],
    queryFn: handleGetReplies,
    enabled: !comment.isReply,
  });

  const replies = data?.data?.data?.replies || [];

  return (
    <div className="flex gap-3 mt-4 w-full group">
      <Avatar
        as={Link}
        to={`/profile/${commentCreator._id}`}
        src={commentCreator?.photo || "https://i.pravatar.cc/150"}
        size="sm"
        className="shrink-0 mt-1 cursor-pointer hover:opacity-80 transition-opacity"
      />
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-800/80 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-200 dark:border-gray-700/50 hover:border-indigo-400 dark:hover:border-indigo-500/30 transition-colors shadow-none dark:shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-1">
            <Link
              to={`/profile/${commentCreator._id}`}
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 cursor-pointer hover:underline"
            >
              {commentCreator?.name || "Anonymous User"}
            </Link>
            <span className="text-xs text-gray-500 font-medium">
              {createdAt
                ? timeAgo(createdAt)
                : ""}
            </span>
          </div>
          {isEditing ? (
            <div className="mt-2 w-full">
              <CommentComponent
                postId={postId}
                comment={comment}
                isEdit={true}
                queryKey={queryKey}
                onEditSuccess={() => setIsEditing(false)}
                onCancelEdit={() => setIsEditing(false)}
              />
              <button 
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors mt-1 ml-4"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 mt-1.5 ml-1">
          <button onClick={handleAddCommentLike} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors group/like">
            <AiFillHeart
              size={16}
              className={`${
                isCommentLiked
                  ? "text-red-500 dark:text-red-400 group-hover/like:scale-110 transition-transform"
                  : "text-gray-400 group-hover/like:scale-110 transition-transform"
              }`}
            />
            <span className= {`text-xs font-bold ${isCommentLiked ? "text-red-500 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>Like</span>
          </button>
          <button
            onClick={() => setAddReply(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group/reply"
          >
            <BsReply
              size={16}
              className="group-hover/reply:scale-110 transition-transform"
            />
            <span>Reply</span>
          </button>
        </div>

        {addReply && (
          <div className="relative">
            <CommentComponent
              postId={postId}
              commentId={comment._id}
              queryKey={queryKey}
              onReplySuccess={() => {
                setAddReply(false);
                setShowReplies(true);
              }}
            />
            <button 
              onClick={() => setAddReply(false)}
              className="absolute -bottom-2 right-6 text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {!comment.isReply && replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-sm font-medium text-gray-400 mt-2 hover:text-indigo-400 transition-colors flex items-center gap-1"
          >
            {showReplies ? "Hide replies" : `View ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
          </button>
        )}

        {showReplies && (
          <div className="mt-2 pl-4 border-l-2 border-gray-300 dark:border-gray-700/50 space-y-2">
            {isLoading ? (
              <p className="text-xs text-gray-500 animate-pulse py-2">
                Loading replies...
              </p>
            ) : error ? (
              <p className="text-xs text-red-400 py-2">
                Failed to load replies
              </p>
            ) : replies.length > 0 ? (
              replies.map((reply) => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  queryKey={["replies", comment._id]}
                />
              ))
            ) : (
              <p className="text-xs text-gray-500 py-2">No replies yet</p>
            )}
          </div>
        )}
      </div>

      {userId === commentCreator?._id && (
        <div>
          <Dropdown
            placement="bottom-end"
            classNames={{
              content: "min-w-[100px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg mt-1",
            }}
          >
            <DropdownTrigger>
              <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800/50">
                <BsThreeDotsVertical size={20} />
              </button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Post Actions"
              variant="light"
              className="p-2"
            >
              <DropdownItem
                onClick={handleDeleteComment}
                key="delete"
                textValue="Delete"
                className="py-2 px-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <div className="flex flex-row items-center gap-2 justify-start w-full">
                  <MdDeleteOutline size={18} />
                  <span className="text-sm font-medium">Delete</span>
                </div>
              </DropdownItem>
              <DropdownItem
                key="edit"
                onClick={() => setIsEditing(true)}
                textValue="Edit"
                className="py-2 px-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors mt-1"
              >
                <div className="flex flex-row items-center gap-2 justify-start w-full">
                  <FaRegEdit size={16} />
                  <span className="text-sm font-medium">Edit</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}
    </div>
  );
}
