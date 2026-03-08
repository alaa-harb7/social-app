import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import AddPost from "../AddPost/AddPost";

/* Routes that get the 3-column layout */
const FEED_ROUTES = ["/", "/feed"];

export default function Layout() {
  const { pathname } = useLocation();
  const isFeedRoute = FEED_ROUTES.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full">
        {isFeedRoute ? (
          /* ── 3-column feed layout ── */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_280px] gap-6 items-start">

              <LeftSidebar />
              
              <div className="min-w-0">
                <AddPost />
                <Outlet />
              </div>

              <RightSidebar />
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <Footer />
    </div>
  );
}
