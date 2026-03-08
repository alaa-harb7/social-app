import { Input, Button, Pagination } from "@heroui/react";
import { useContext, useState } from "react";
import { MdSearch, MdExplore } from "react-icons/md";
import SuggestedUserCard from "./SuggestedUserCard";
import { Helmet } from "react-helmet";
import axios from "axios";
import { authContext } from "../Context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";

export default function Discover() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  const { token } = useContext(authContext);

  function getDiscoverUsers() {
    return axios.get("https://route-posts.routemisr.com/users/suggestions", {
      params: {
        limit,
        sort: "-createdAt",
        page: currentPage,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["discoverUsers", currentPage],
    queryFn: getDiscoverUsers,
    keepPreviousData: true,
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

  const suggestions = data.data.data.suggestions;
  const pagination = data.data.meta.pagination;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111827] text-gray-900 dark:text-white transition-colors duration-300">
      <Helmet>
        <title>Discover People – Social</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-500 mb-1">
              <MdExplore className="text-3xl" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Explore
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Discover <span className="text-indigo-600 dark:text-indigo-500">People</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md">
              Expand your network and follow interesting people from around the
              world.
            </p>
          </div>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {suggestions.map((user) => (
            <SuggestedUserCard key={user._id} user={user} currentPage={currentPage} />
          ))}
        </div>

        {/* Pagination UI */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-3xl mb-10 overflow-hidden relative shadow-sm dark:shadow-none transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
          <div className="absolute top-0 right-0 w-1 h-full bg-indigo-600"></div>

          <div className="flex items-center mx-auto gap-2">
            <Pagination
              total={pagination.numberOfPages}
              initialPage={1}
              color="secondary"
              page={currentPage}
              onChange={setCurrentPage}
              showControls
              classNames={{
                wrapper: "gap-2",
                item: "bg-gray-100 dark:bg-gray-800 border-none text-gray-600 dark:text-gray-400 hover:bg-indigo-600 hover:text-white dark:hover:text-black hover:cursor-pointer hover:font-bold transition-all rounded-xl w-10 h-10",
                cursor:
                  "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30 rounded-xl w-10 h-10",
                prev: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl w-10 h-10 transition-colors",
                next: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl w-10 h-10 transition-colors",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
