import { Card, CardBody, Avatar, Button } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { MdPersonAdd, MdDone } from "react-icons/md";
import { Link } from "react-router-dom";
import { authContext } from "../Context/AuthContext";
import { toast } from "react-toastify";

export default function SuggestedUserCard({ user, currentPage }) {
  // const [isFollowing, setIsFollowing] = useState(false);

  const { token } = useContext(authContext);
  const id = user._id;

  // const toggleFollow = () => {
  //   setIsFollowing(!isFollowing);
  // };

  const queryClient = useQueryClient();

  function getUserProfileData() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { data } = useQuery({
    queryKey: ["user", id],
    queryFn: getUserProfileData,
  });

  const isFollowing = data?.data?.data?.isFollowing;

  function handleFollowingUser() {
    axios
      .put(
        `https://route-posts.routemisr.com/users/${id}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        // queryClient.invalidateQueries({ queryKey: ["user", id] });
        queryClient.invalidateQueries({ queryKey: ["discoverUsers", currentPage] });
      })
      .catch(() => {
        toast.error("Failed to follow", { autoClose: 2000 });
      });
  }

  return (
    <Card
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500/40 
                 transition-all duration-300 shadow-sm dark:shadow-md hover:shadow-indigo-500/10 
                 hover:-translate-y-1 group"
    >
      <CardBody className="p-5 flex flex-col items-center text-center">
        {/* User Info Link */}
        <Link
          to={`/profile/${user._id}`}
          className="flex flex-col items-center group/link"
        >
          <Avatar
            src={user.photo}
            name={user.name}
            className="w-20 h-20 text-large mb-3 ring-2 ring-transparent group-hover/link:ring-indigo-500/50 transition-all"
            isBordered
            color={isFollowing ? "default" : "secondary"}
          />
          <div className="flex flex-col gap-0.5">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-300 transition-colors">
              {user.name}
            </h3>
            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              @{user.username}
            </span>
          </div>
        </Link>

        {/* Stats */}
        <div className="flex gap-4 mt-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
          <div className="flex flex-col">
            <span className="text-gray-900 dark:text-gray-300 text-sm font-bold">
              {user.followersCount}
            </span>
            <span>Followers</span>
          </div>
          {user.mutualFollowersCount > 0 && (
            <div className="flex flex-col border-l border-gray-200 dark:border-gray-800 pl-4">
              <span className="text-gray-900 dark:text-gray-300 text-sm font-bold">
                {user.mutualFollowersCount}
              </span>
              <span>Mutual</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full mt-6">
          <Button
            onPress={handleFollowingUser}
            fullWidth
            radius="full"
            variant={isFollowing ? "bordered" : "solid"}
            color={isFollowing ? "default" : "primary"}
            className={
              isFollowing
                ? "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
            }
            startContent={
              isFollowing ? (
                <MdDone className="text-lg" />
              ) : (
                <MdPersonAdd className="text-lg" />
              )
            }
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
