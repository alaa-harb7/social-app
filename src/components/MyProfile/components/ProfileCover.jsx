import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { HiArrowsExpand, HiOutlineCamera } from "react-icons/hi";
import { authContext } from "../../Context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MdDone } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FiUserPlus } from "react-icons/fi";


export default function ProfileCover({
  photo,
  name,
  userId,
  isFollowing,
  cover = null,
}) {
  const { token, userId: myUserId } = useContext(authContext);
  const profilePhotoRef = useRef(null);
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(photo);

  const coverInputRef = useRef(null);
  const [coverFile, setCoverFile] = useState(null);
  const [privacy, setPrivacy] = useState("public");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();

  /* ───────────── Mutation ───────────── */
  const { mutate, isPending } = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("photo", file);

      return axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: () => {
      toast.success("Photo uploaded successfully", { autoClose: 2000 });
      queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
    },

    onError: () => {
      toast.error("Failed to upload photo", { autoClose: 2000 });
      setPreview(photo); // rollback لو فشل
    },
  });

  /* ───────────── Handle Upload ───────────── */
  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // preview فوري
    setPreview(URL.createObjectURL(file));

    // رفع مباشر
    mutate(file);
  }

  function handleFollowingUser() {
    axios
      .put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["getPosts"] });
        queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      })
      .catch(() => {
        toast.error("Failed to follow", { autoClose: 2000 });
      });
  }

  // @PUT  https://route-posts.routemisr.com/users/upload-cover
  // @DELETE https://route-posts.routemisr.com/users/cover

  function handleSelectCover(e) {
    const file = e.target.files[0];
    if (!file) return;

    setCoverFile(file);
    onOpen(); // فتح modal
  }

  const { mutate: uploadCover, isPending: isUploadingCover } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("cover", coverFile);
      formData.append("privacy", privacy);

      return axios.put(
        "https://route-posts.routemisr.com/users/upload-cover",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      toast.success("Cover uploaded successfully", { autoClose: 2000 });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });

      setCoverFile(null);
      onClose();
    },
    onError: () => {
      toast.error("Failed to upload cover", { autoClose: 2000 });
    },
  });

  function handleCoverUpload() {
    if (!coverFile) return;
    uploadCover();
  }

  function handleDeleteCover() {
    return axios.delete("https://route-posts.routemisr.com/users/cover", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { isPending: isPendingCover, mutate: deleteCover } = useMutation({
    mutationFn: handleDeleteCover,
    onSuccess: () => {
      toast.success("Cover deleted successfully", { autoClose: 2000 });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },

    onError: () => {
      toast.error("Failed to Delete Cover", { autoClose: 2000 });
      setPreview(photo); // rollback لو فشل
    },
  });

  return (
    <div className="relative">
      <div className="group relative w-full h-44 sm:h-56 md:h-64 overflow-hidden rounded-none">
        {cover ? (
          <img src={cover} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-violet-900 to-indigo-800" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {userId === myUserId && (
          <>
            {/* Hidden Input for Cover - placed outside conditional so Change Cover button can access it */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={coverInputRef}
              onChange={handleSelectCover}
            />

            {cover === null ? (
              <div className="hidden group-hover:flex">
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 hover:bg-black/70
                     backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full
                     border border-white/20 transition-all duration-200 hover:scale-105"
                >
                  <HiOutlineCamera className="text-sm" />
                  Add Cover
                </button>
              </div>
            ) : (
              <div className="absolute bottom-3 right-3 flex items-center hidden gap-2 group-hover:flex">
                <button
                  onClick={onViewOpen}
                  className="flex justify-center items-center gap-1.5 bg-black/50 hover:bg-black/70
                     backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full
                     border border-white/20 transition-all duration-200 hover:scale-105"
                >
                  <HiArrowsExpand className="text-sm" />
                  <p>View Cover</p>
                </button>
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="flex justify-center items-center gap-1.5 bg-black/50 hover:bg-black/70
                     backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full
                     border border-white/20 transition-all duration-200 hover:scale-105"
                >
                  <HiOutlineCamera className="text-sm" />
                  <p>Change Cover</p>
                </button>
                <button
                  onClick={() => deleteCover()}
                  disabled={isPendingCover}
                  className="flex justify-center items-center gap-1.5 bg-black/50 hover:bg-black/70
                     backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full
                     border border-white/20 transition-all duration-200 hover:scale-105"
                >
                  <RiDeleteBin5Line className="text-sm" />
                  <p>{isPendingCover ? "Removing..." : "Remove Cover"}</p>
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal Handle upload Cover */}
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          classNames={{
            base: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white transition-colors duration-300",
            header: "border-b border-gray-100 dark:border-gray-800",
            footer: "border-t border-gray-100 dark:border-gray-800",
            closeButton: "hover:bg-gray-100 dark:hover:bg-white/10 active:bg-gray-200 dark:active:bg-white/10 text-gray-500 dark:text-white",
          }}
        >
          <ModalContent className="text-gray-900 dark:text-white">
            {() => (
              <>
                <ModalHeader>Cover post privacy</ModalHeader>

                <ModalBody className="py-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose who can see the post generated for your new cover
                    photo.
                  </p>

                  <Select
                    label="Privacy"
                    variant="bordered"
                    selectedKeys={new Set([privacy])}
                    onSelectionChange={(keys) => {
                      const selectedVal = Array.from(keys)[0];
                      if (selectedVal) setPrivacy(selectedVal);
                    }}
                    classNames={{
                      trigger:
                        "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white data-[hover=true]:border-indigo-500",
                      popoverContent:
                        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white shadow-xl ",
                      value: "text-gray-900 dark:text-white data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-white/10",
                    }}
                  >
                    <SelectItem
                      key="public"
                      textValue="Public"
                      className="text-gray-900 dark:text-white data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-white/10"
                    >
                      Public
                    </SelectItem>
                    <SelectItem
                      key="friends"
                      textValue="Followers"
                      className="text-gray-900 dark:text-white data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-white/10"
                    >
                      Followers
                    </SelectItem>
                    <SelectItem
                      key="onlyMe"
                      textValue="Only me"
                      className="text-gray-900 dark:text-white data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-white/10"
                    >
                      Only me
                    </SelectItem>
                  </Select>
                </ModalBody>

                <ModalFooter>
                  <Button
                    variant="light"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>

                  <Button
                    color="primary"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                    onPress={handleCoverUpload}
                    isLoading={isUploadingCover}
                  >
                    Save cover
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Modal Handle View Cover */}
        <Modal
          isOpen={isViewOpen}
          onClose={onViewClose}
          size="4xl"
          backdrop="blur"
          classNames={{
            base: "bg-transparent shadow-none",
            closeButton: "hover:bg-white/10 active:bg-white/10 text-white z-50 text-xl font-bold bg-black/50 p-2",
          }}
        >
          <ModalContent>
            {() => (
              <ModalBody className="p-0 flex items-center justify-center">
                <img src={cover} alt="Cover" className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl" />
              </ModalBody>
            )}
          </ModalContent>
        </Modal>
      </div>

      {/* ───────────── Avatar ───────────── */}
      <div className="absolute left-5 sm:left-8 -bottom-12 sm:-bottom-14 group">
        <div className="relative">
          <Avatar
            src={preview}
            name={name}
            isBordered
            color="secondary"
            className="w-24 h-24 sm:w-28 sm:h-28 text-2xl ring-4 ring-white dark:ring-gray-900 shadow-xl"
          />

          {isPending && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
              <span className="text-white text-xs font-medium">
                Uploading...
              </span>
            </div>
          )}

          {/* Hidden File Input */}
          {userId === myUserId && (
            <div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={profilePhotoRef}
                onChange={handlePhotoUpload}
              />

              {/* Camera Hover Overlay */}
              <button
                onClick={() => profilePhotoRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/50
                       flex items-center justify-center opacity-0 group-hover:opacity-100
                       transition-all duration-200"
              >
                <HiOutlineCamera className="text-white text-xl" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ───────────── Edit Profile Button ───────────── */}
      {userId === myUserId && (
        <Link
          to="/change-password"
          className="flex justify-end px-5 sm:px-8 pt-3 pb-1"
        >
          <Button
            variant="bordered"
            size="sm"
            startContent={<FaRegEdit className="text-sm" />}
            className="border-indigo-500/60 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-400
                     transition-all duration-200 font-medium rounded-full"
          >
            Change Password
          </Button>
        </Link>
      )}
      {userId !== myUserId && (
        <>
          {!isFollowing ? (
            <div className="flex justify-end px-5 sm:px-8 pt-3 pb-1">
              <Button
                onClick={handleFollowingUser}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white 
                 transition-all duration-200 font-medium rounded-full px-6"
              >
                <FiUserPlus className="text-md" />
                Follow 
              </Button>
            </div>
          ) : (
            <div className="flex justify-end px-5 sm:px-8 pt-3 pb-1">
              <Button
                onClick={handleFollowingUser}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white 
                 transition-all duration-200 font-medium rounded-full px-6"
              >
                Following <MdDone className="text-lg" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
