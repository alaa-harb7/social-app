import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  ModalHeader,
  Image,
} from "@heroui/react";
import { FaHeart, FaComment, FaShareAlt, FaShare } from "react-icons/fa";
import Cardheader from "../CardHeader/CardHeader";
import { Link } from "react-router-dom";
import CommentComponent from "../CommentComponent/CommentComponet";
import Comment from "../Comment/Comment";
import axios from "axios";
import { useContext } from "react";
import { authContext } from "../Context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PiUsers } from "react-icons/pi";
import timeAgo from "../../utils/timeAgo";

export default function PostCard({
  post,
  isPostDetails = false,
  comments = [],
  isCommentsLoading = false,
  commentsError = null,
  queryKey,
}) {
  const { token, userId } = useContext(authContext);
  // Try to use common fields if they exist from the Route API
  const authorId = post.user?._id;
  const userName = post.user?.name || "Anonymous User";
  const userPhoto = post.user?.photo || "https://i.pravatar.cc/150";
  const postDate = post.createdAt ? timeAgo(post.createdAt) : "";

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isLikesOpen,
    onOpen: onLikesOpen,
    onClose: onLikesClose,
  } = useDisclosure();

  const queryClient = useQueryClient();

  // if topComment = null
  const comment = post.topComment ? post.topComment : "";

  function handleAddLike() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  const { mutate: addLike } = useMutation({
    mutationFn: handleAddLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", authorId] });
      queryClient.invalidateQueries({ queryKey: ["postDetails", post._id] });
      if (queryKey) queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error("Failed to like post", { autoClose: 2000 });
    },
  });

  function handleSharePost() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/share`,
      {
        body: `Sharing post by ${post.user?.name}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
  }

  const { mutate: sharePost } = useMutation({
    mutationFn: handleSharePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", authorId] });
      queryClient.invalidateQueries({ queryKey: ["postDetails", post._id] });
      if (queryKey) queryClient.invalidateQueries({ queryKey });
      toast.success("Post shared successfully!", { autoClose: 2000 });
    },
    onError: () => {
      toast.error("Failed to share post", { autoClose: 2000 });
    },
  });

  function getPostLikes() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${post._id}/likes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["postLikes", post._id],
    queryFn: getPostLikes,
  });
  const likes = data?.data?.data?.likes || [];
  console.log("getPostlikes", likes);
  // Correct isLiked logic: check if CURRENT LOGGED-IN USER ID is in likes array
  const isLiked = post.likes?.includes(userId);
  const isShared = post.isShare;
  console.log(` isLiked: ${isLiked}`);
  console.log(` isShared: ${isShared}`);

  return (
    <Card className="w-full max-w-xl mx-auto mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm dark:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
      <Cardheader
        userName={userName}
        userPhoto={userPhoto}
        postDate={postDate}
        userID={authorId}
        postID={post._id}
        postBody={post.body}
        queryKey={queryKey}
        bookmarked={post.bookmarked}
      />
      <CardBody className="px-5 py-2">
        {post.title && (
          <p className="text-lg font-bold text-gray-800 dark:text-indigo-100 mb-2">
            {post.title}
          </p>
        )}
        {post.body && (
          <Link
            to={`/post/${post._id}`}
            className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
          >
            {post.body}
          </Link>
        )}

        {post.image && (
          <div className="mt-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-950 flex justify-center border border-gray-200 dark:border-gray-800">
            <img
              onClick={onViewOpen}
              src={post.image}
              alt="Post Image"
              className="max-h-[400px] w-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
      </CardBody>
      <Divider className="bg-gray-200 dark:bg-gray-800 mx-5 w-auto" />
      <CardFooter className="flex justify-between px-5 py-3">
        <Button
          variant="light"
          disableRipple
          className={`flex items-center gap-2 bg-transparent data-[hover=true]:bg-transparent ${
            isLiked ? "text-red-500 " : "text-gray-500 dark:text-gray-400 "
          }`}
        >
          <FaHeart
            onClick={addLike}
            className={`text-lg transition-colors ${
              isLiked ? "text-red-500" : ""
            }`}
          />

          <div
            onClick={likes.length > 0 && onLikesOpen}
            className={`flex items-center gap-1  ${likes.length > 0 && "hover:underline"}`}
          >
            <span className="hidden sm:inline">Like</span>
            {post.likesCount !== 0 && <span>{post.likesCount}</span>}
          </div>
        </Button>
        <Button
          as={Link}
          to={`/post/${post._id}`}
          variant="light"
          disableRipple
          className="text-gray-500 dark:text-gray-400 flex items-center gap-2 bg-transparent data-[hover=true]:bg-transparent"
        >
          <FaComment className="text-lg" />
          <span className="hidden sm:inline">Comment</span>
          {post.commentsCount !== 0 ? <span>{post.commentsCount} </span> : null}
        </Button>
        <Button
          onClick={sharePost}
          variant="light"
          disableRipple
          className={`flex items-center gap-2 text-gray-500 dark:text-gray-400 bg-transparent data-[hover=true]:bg-transparent`}
        >
          <FaShareAlt className={`text-lg `} />
          <span className="hidden sm:inline">Share</span>
          {post.sharesCount !== 0 ? <span>{post.sharesCount}</span> : null}
        </Button>
      </CardFooter>
      <CommentComponent postId={post._id} queryKey={queryKey} />
      {isPostDetails ? (
        <CardFooter className="flex flex-col items-start px-5 py-3 gap-4 mt-2 bg-gray-50 dark:bg-transparent rounded-b-xl border-t border-gray-100 dark:border-transparent mt-2">
          <h3 className="text-lg font-bold text-gray-800 dark:text-indigo-100 mb-1">
            Comments {post.commentsCount > 0 ? `(${post.commentsCount})` : ""}
          </h3>

          {isCommentsLoading ? (
            <div className="flex justify-center items-center w-full py-6">
              <span className="text-indigo-400/80 text-sm animate-pulse">
                Loading comments...
              </span>
            </div>
          ) : commentsError ? (
            <div className="w-full bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <span className="text-red-400 text-sm">
                Failed to load comments.
              </span>
            </div>
          ) : comments.length > 0 ? (
            <div className="flex flex-col gap-1 w-full">
              {comments.map((c) => (
                <Comment
                  key={c._id}
                  comment={c}
                  postId={post._id}
                  queryKey={queryKey}
                />
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-6 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-800/50 shadow-sm dark:shadow-none">
              <span className="text-gray-600 dark:text-gray-500 text-sm">
                No comments yet. Be the first to share your thoughts!
              </span>
            </div>
          )}
        </CardFooter>
      ) : comment ? (
        <CardFooter className="flex flex-col items-start px-5 py-3 gap-0 bg-gray-50 dark:bg-transparent border-t border-gray-100 dark:border-transparent mt-2">
          <div className="flex items-center gap-2 mb-[-10px] z-10 pl-1">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400/80 uppercase tracking-wider">
              Top Comment
            </span>
          </div>
          <Comment comment={comment} postId={post._id} queryKey={queryKey} />
        </CardFooter>
      ) : null}
      {/*---------------- Modal ------------- */}
      <Modal
        isOpen={isViewOpen}
        onClose={onViewClose}
        size="5xl"
        backdrop="blur"
        classNames={{
          base: "bg-transparent shadow-none",
          closeButton:
            "hover:bg-black/30  active:bg-white/30  text-white z-50 text-xl font-bold bg-black/50 p-2",
        }}
      >
        <ModalContent>
          {() => (
            <ModalBody className="p-0 flex items-center justify-center">
              <img
                src={post.image}
                alt="Cover"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
      {/* Modal to get all post likes */}
      <Modal
        isOpen={isLikesOpen}
        scrollBehavior="inside"
        onClose={onLikesClose}
        size="md"
        backdrop="blur"
        classNames={{
          base: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 ",
          header: "border-b border-gray-100 dark:border-gray-800/50",
          footer: "border-t border-gray-100 dark:border-gray-800/50",
          closeButton:
            "hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-800/50 text-gray-500 dark:text-gray-400",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center text-xl font-bold gap-2 text-gray-900 dark:text-indigo-100">
                <PiUsers className="text-2xl text-indigo-500 dark:text-indigo-400" />
                People who reacted
              </ModalHeader>
              <ModalBody className="p-4 flex flex-col gap-3">
                {likes.length > 0 ? (
                  likes.map((like) => (
                    <Card
                      as={Link}
                      to={`/profile/${like._id}`}
                      key={like._id || like.username}
                      className="w-full shrink-0 bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800/50 shadow-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <CardHeader className="flex gap-4 p-3">
                        <Image
                          alt={like.name}
                          className="object-cover rounded-full border border-gray-300 dark:border-gray-700"
                          height={45}
                          src={like.photo || "https://i.pravatar.cc/150"}
                          width={45}
                        />
                        <div className="flex flex-col justify-center">
                          <p className="text-md font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                            {like.name}
                          </p>
                          {like.username && (
                            <p className="text-sm text-gray-500">
                              @{like.username}
                            </p>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No reactions yet.
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}
{
  /* Modal Handle View Cover */
}
