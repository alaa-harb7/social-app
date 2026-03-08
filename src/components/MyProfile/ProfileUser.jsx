import { Helmet } from "react-helmet";
import ProfileCover from "./components/ProfileCover";
import ProfileInfo from "./components/ProfileInfo";
import ProfileStats from "./components/ProfileStats";
import ProfileTabs from "./components/ProfileTabs";
import axios from "axios";
import { useContext } from "react";
import { authContext } from "../Context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";

export default function MyProfile() {
  const { token, userId } = useContext(authContext);
  const { id } = useParams();

  function getUserProfileData() {

    return axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: getUserProfileData,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-red-500 font-semibold bg-red-500/10 p-4 rounded-lg">
          Error: {error}
        </p>
      </div>
    );
  }
  console.log(data);

  const user = data.data.data.user;
  const isFollowing = data.data.data.isFollowing;
  console.log(user)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111827] text-gray-900 dark:text-white transition-colors duration-300">
      <Helmet>
        <title>User Profile</title>
      </Helmet>

      {/* Centered container */}
      <div className="max-w-3xl mx-auto pb-16">
        {/* Card wrapper */}
        <div className="bg-white dark:bg-gray-900/60 border-x border-gray-200 dark:border-gray-800/60 shadow-sm dark:shadow-xl min-h-screen transition-colors duration-300">
          {/* 1. Cover image + avatar + edit button */}
          <ProfileCover
            cover={user.cover}
            photo={user.photo}
            name={user.name}
            userId={user._id}
            isFollowing={isFollowing}
          />

          {/* 2. Name, @username, meta info */}
          <ProfileInfo user={user} />

          {/* Soft divider */}
          <div className="mx-5 sm:mx-8 mt-5 border-t border-gray-200 dark:border-gray-800/70" />

          {/* 3. Followers / Following / Bookmarks */}
          <ProfileStats
            followersCount={user.followersCount}
            followingCount={user.followingCount}
            bookmarksCount={user.bookmarksCount}
          />

          {/* 4. Posts / Bookmarks / About tabs */}
          <ProfileTabs user={user} />
        </div>
      </div>
    </div>
  );
}
