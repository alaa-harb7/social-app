import { Avatar, CardHeader, useDisclosure } from "@heroui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { MdBookmarkBorder, MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useContext, useRef, useState } from "react";
import { authContext } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostModal } from "../PostModal/PostModal";
import { Link } from "react-router-dom";
import { GoBookmarkSlash } from "react-icons/go";

export default function Cardheader({
  userName,
  userPhoto,
  postDate,
  userID,
  postID,
  postBody = "",
  queryKey,
  bookmarked = false,
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { token, userId } = useContext(authContext);
  const queryClient = useQueryClient();

  const [body, setBody] = useState(postBody);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const bodyRef = useRef(null);

  /* ── Image helpers ── */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Delete post ── */
  function handleDeletePost() {
    axios
      .delete(`https://route-posts.routemisr.com/posts/${postID}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: queryKey ?? ["getPosts"] });
        queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
        toast.success("Post deleted successfully", { autoClose: 2000 });
      })
      .catch(() => {
        toast.error("Failed to delete post", { autoClose: 2000 });
      });
  }

  /* ── Edit post mutation ── */
  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("body", body);
      if (fileInputRef.current?.files[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }
      return axios.put(
        `https://route-posts.routemisr.com/posts/${postID}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      toast.success("Post updated successfully", { autoClose: 2000 });
      queryClient.invalidateQueries({ queryKey: queryKey ?? ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
      onClose();
      clearImage();
    },
    onError: () => {
      toast.error("Failed to update post", { autoClose: 2000 });
    },
  });

  function handleBookmark() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postID}/bookmark`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  const { mutate: addBookmark } = useMutation({
    mutationFn: handleBookmark,
    onSuccess: () => {
      toast.success(
        `Post ${bookmarked ? "unbookmarked" : "bookmarked"}  successfully`,
        { autoClose: 2000 },
      );
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", userID] });
      queryClient.invalidateQueries({ queryKey: ["postDetails", postID] });

      if (queryKey) queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error("Failed to bookmark post", { autoClose: 2000 });
    },
  });

  /* ── Open edit modal pre-filled with current body ── */
  function openEditModal() {
    setBody(postBody);
    clearImage();
    onOpen();
  }

  return (
    <CardHeader className="flex px-5 pt-5 pb-3 justify-between">
      <div className="flex gap-4">
        <Avatar
          as={Link}
          to={`/profile/${userID}`}
          src={userPhoto}
          size="md"
          isBordered
          color="primary"
        />
        <div className="flex flex-col">
          <Link
            to={`/profile/${userID}`}
            className="text-md font-semibold text-gray-800 dark:text-white hover:underline"
          >
            {userName}
          </Link>
          <p className="text-small text-gray-400">{postDate}</p>
        </div>
      </div>

      <Dropdown
        placement="bottom-end"
        classNames={{
          content: "min-w-[175px] bg-white rounded-2xl shadow-lg mt-1",
        }}
      >
        <DropdownTrigger>
          <button className="text-gray-400 dark:hover:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center rounded-full dark:hover:bg-gray-800/50 hover:bg-gray-200 ">
            <BsThreeDotsVertical size={20} />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Post Actions" variant="light" className="p-2">
          <DropdownItem
            onClick={addBookmark}
            key="delete"
            textValue="Delete"
            className="py-2 px-3 text-black hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex flex-row items-center gap-2 justify-start w-full">
              {!bookmarked ? (
                <>
                  <MdBookmarkBorder size={18} />
                  <span className="text-sm font-medium">Save Post</span>
                </>
              ) : (
                <>
                  <GoBookmarkSlash size={18} />
                  <span className="text-sm font-medium">Unsave Post</span>
                </>
              )}
            </div>
          </DropdownItem>
          {userId === userID && (
            <>
              <DropdownItem
                onClick={openEditModal}
                key="edit"
                textValue="Edit"
                className="py-2 px-3 text-black hover:bg-gray-100 rounded-xl transition-colors mt-1"
              >
                <div className="flex flex-row items-center gap-2 justify-start w-full">
                  <FaRegEdit size={16} />
                  <span className="text-sm font-medium">Edit</span>
                </div>
              </DropdownItem>

              <DropdownItem
                onClick={handleDeletePost}
                key="delete"
                textValue="Delete"
                className="py-2 px-3 text-black hover:bg-red-200 rounded-xl transition-colors"
              >
                <div className="flex flex-row items-center gap-2 justify-start w-full">
                  <MdDeleteOutline className="text-red-500" size={18} />
                  <span className="text-sm font-medium text-red-500">
                    Delete
                  </span>
                </div>
              </DropdownItem>
            </>
          )}
        </DropdownMenu>
      </Dropdown>

      {/* Edit Post Modal */}
      <PostModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        body={body}
        setBody={setBody}
        bodyRef={bodyRef}
        fileInputRef={fileInputRef}
        imagePreview={imagePreview}
        clearImage={clearImage}
        handleImageChange={handleImageChange}
        onSubmit={() => mutate()}
        isPending={isPending}
        modalTitle="Edit Post"
        submitLabel="Save Changes"
      />
    </CardHeader>
  );
}
