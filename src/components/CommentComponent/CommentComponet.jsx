import { Input, Button } from "@heroui/react";
import { useContext, useRef, useEffect } from "react";
import { LuSend } from "react-icons/lu";
import { authContext } from "../Context/AuthContext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function CommentComponent({
  postId,
  commentId,
  queryKey,
  onReplySuccess,
  isEdit = false,
  comment = null,
  onEditSuccess,
  onCancelEdit,
}) {
  const { token } = useContext(authContext);

  const inputValue = useRef(null);

  useEffect(() => {
    if (isEdit && comment?.content && inputValue.current) {
      inputValue.current.value = comment.content;
      inputValue.current.focus();
    }
  }, [isEdit, comment]);

  function handleComment() {
    const commentBody = {
      content: inputValue?.current.value,
    };

    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      commentBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  function handleAddReply() {
    const replyBody = {
      content: inputValue?.current.value,
    };

    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,
      replyBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  function handleEditComment() {
    const content = inputValue?.current.value;
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      {
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  const queryClient = useQueryClient();

  const { isPending, mutate: submitAction } = useMutation({
    mutationFn: isEdit ? handleEditComment : (commentId ? handleAddReply : handleComment),
    onSuccess: (res) => {
      console.log(res);
      if (inputValue.current) {
        inputValue.current.value = "";
      }
      toast.success(
        `${isEdit ? "Comment updated" : commentId ? "Reply added" : "Comment added"} successfully`,
        {
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
      queryClient.invalidateQueries({ queryKey: queryKey });
      
      if (isEdit && onEditSuccess) {
        onEditSuccess();
      } else if (!isEdit && onReplySuccess) {
        onReplySuccess();
      }
    },
    onError: (error) => {
      console.error(error);
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        `Failed to ${isEdit ? "update comment" : commentId ? "add reply" : "add comment"}`;
      toast.error(message, { autoClose: 2000, hideProgressBar: true });
    },
  });

  return (
    <div className={`w-full ${isEdit ? "" : "px-5 py-3 border-t border-gray-200 dark:border-gray-800/50 mt-1"}`}>
      <Input
        ref={inputValue}
        placeholder={isEdit ? "Edit your comment..." : "Write a comment..."}
        classNames={{
          inputWrapper:
            "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 hover:border-indigo-400 dark:hover:border-indigo-500/30 hover:bg-gray-50 dark:hover:bg-gray-800/80 focus-within:!bg-white dark:focus-within:!bg-gray-800/90 focus-within:!border-indigo-400 dark:focus-within:!border-indigo-500/50 transition-colors shadow-none dark:shadow-sm py-1 h-auto",
          input: "text-gray-900 dark:text-gray-200 text-sm placeholder:text-gray-500",
        }}
        variant="bordered"
        radius="full"
        endContent={
          <Button
            isIconOnly
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full min-w-8 w-8 h-8 flex items-center justify-center -mr-1"
            onClick={() => {
              if (inputValue.current?.value.trim() && !isPending) {
                submitAction();
              }
            }}
            isLoading={isPending}
          >
            {!isPending && <LuSend size={15} className="mr-0.5 mt-0.5" />}
          </Button>
        }
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter" && inputValue.current?.value.trim()) {
            submitAction();
          } else if (e.key === "Escape" && isEdit && onCancelEdit) {
            onCancelEdit();
          }
        }}
      />
    </div>
  );
}
