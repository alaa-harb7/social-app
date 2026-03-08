import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Avatar,
} from "@heroui/react";
import { useState, useContext, useRef } from "react";
import { authContext } from "../Context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaImage } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";
import PostModal from "../PostModal/PostModal";

export default function AddPost() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { token, user } = useContext(authContext);
  const queryClient = useQueryClient();

  const [body, setBody] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const bodyRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submitPost = () => {
    const formData = new FormData();
    formData.append("body", body);
    if (fileInputRef.current?.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    return axios.post("https://route-posts.routemisr.com/posts", formData, {
      headers: { token },
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: submitPost,
    onSuccess: () => {
      toast.success("Post added successfully");
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      onClose();
      setBody("");
      clearImage();
    },
  });

  return (
    <>
      {/* Trigger UI */}
      <div className="w-full max-w-xl mx-auto mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="flex items-center gap-3">
          <Avatar
            src={user?.photo || "https://placeimg.com/64/64/any"}
            size="md"
            className="shrink-0"
          />
          <button
            onClick={onOpen}
            className="flex-1 bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-800 text-left px-4 py-3 rounded-full border border-gray-200 dark:border-gray-700/50 hover:border-indigo-400 dark:hover:border-indigo-500/30 transition-all text-gray-500 dark:text-gray-400 text-sm cursor-text"
          >
            What's on your mind?
          </button>
        </div>
      </div>

      {/* Modal UI */}
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
        userPhoto={user?.photo}
      />
    </>
  );
}
