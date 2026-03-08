import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Avatar,
} from "@heroui/react";
import { FaImage } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";

export function PostModal({
  isOpen,
  onOpenChange,
  body,
  setBody,
  bodyRef,
  fileInputRef,
  imagePreview,
  clearImage,
  handleImageChange,
  onSubmit,
  isPending,
  userPhoto,
  modalTitle = "Create Post",
  submitLabel = "Post",
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none transition-colors duration-300",
        header: "border-b border-gray-100 dark:border-gray-800/50",
        footer: "border-t border-gray-100 dark:border-gray-800/50",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="text-gray-900 dark:text-indigo-100">
              {modalTitle}
            </ModalHeader>

            <ModalBody className="py-4">
              <div className="flex items-center gap-3 mb-2">
                <Avatar src={userPhoto} size="sm" />
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                  You
                </span>
              </div>

              <Textarea
                ref={bodyRef}
                placeholder="What do you want to talk about?"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                minRows={4}
                classNames={{
                  input: "text-gray-800 dark:text-gray-200 text-base",
                  inputWrapper:
                    "bg-gray-100 dark:bg-gray-800/30 border-none shadow-none",
                }}
              />

              {imagePreview && (
                <div className="relative mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-75 object-cover"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 text-gray-50 dark:text-white hover:text-red-500 transition-colors bg-black/30 rounded-full"
                  >
                    <IoMdCloseCircle size={24} />
                  </button>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="flex justify-between">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <Button
                  isIconOnly
                  variant="light"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaImage size={20} />
                </Button>
              </div>

              <Button
                className="bg-indigo-600 text-white"
                onPress={onSubmit}
                isLoading={isPending}
                isDisabled={!body.trim()}
              >
                {submitLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default PostModal;
