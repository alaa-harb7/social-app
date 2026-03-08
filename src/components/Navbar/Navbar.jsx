import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  // Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@heroui/react";
import { Link, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import logo from "../../assets/Luxi-Hosting-Logo.png";
import { useState, useContext } from "react";
import { authContext } from "../Context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  MdOutlineDynamicFeed,
  MdLogin,
  MdAppRegistration,
  MdOpenInNew,
  MdLogout,
  MdNotifications,
  MdSettings,
  MdDarkMode,
  MdLightMode,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";

/* ─── Reusable style strings ──────────────────────────────────────────────── */
const navLinkCls = ({ isActive }) => {
  const base =
    "relative flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 " +
    "after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:rounded-full after:bg-indigo-500 after:transition-all after:duration-300";

  return isActive
    ? `${base} text-indigo-600 dark:text-indigo-400 after:w-full`
    : `${base} text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 after:w-0 hover:after:w-full`;
};

const authLinkCls =
  "flex items-center gap-1.5 text-xs font-semibold tracking-widest " +
  "text-gray-500 dark:text-gray-400 " +
  "transition-colors duration-200 hover:text-indigo-600 dark:hover:text-indigo-400";

const ctaBtnCls =
  "px-5 py-2 flex items-center gap-1.5 text-xs font-bold tracking-widest text-white " +
  "bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full " +
  "shadow-[0_0_14px_rgba(109,40,217,0.45)] " +
  "transition-all duration-300 hover:scale-105 hover:shadow-[0_0_22px_rgba(109,40,217,0.75)]";

const mobileItemCls =
  "w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium " +
  "text-indigo-100 transition-all duration-200 " +
  "hover:bg-indigo-800/60 hover:text-white hover:translate-x-1";

const mobileLogoutCls =
  "w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium " +
  "text-red-400 transition-all duration-200 " +
  "hover:bg-red-900/40 hover:text-red-300 hover:translate-x-1";

export default function MyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const { token, logout, user } = useContext(authContext);

  const isUserLoggedIn = !!token;

  const menuItems = isUserLoggedIn
    ? ["My Profile", "Log Out"]
    : ["Feed", "Sign Up", "Log In"];

  const handleLogout = () => {
    logout();
  };

  const { data: notificationsData } = useQuery({
    queryKey: ["getNotifications"],
    queryFn: () =>
      axios.get("https://route-posts.routemisr.com/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: isUserLoggedIn,
  });

  const notifications = notificationsData?.data?.data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const menuIconMap = {
    "My Profile": <CgProfile className="text-lg shrink-0" />,
    "Log Out": <MdLogout className="text-lg shrink-0" />,
    "Sign Up": <MdAppRegistration className="text-lg shrink-0" />,
    "Log In": <MdLogin className="text-lg shrink-0" />,
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/60 dark:border-gray-700/50 shadow-sm"
    >
      {/* Hamburger – mobile only */}
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden text-gray-600 dark:text-gray-300"
      />

      {/* Brand */}
      <NavbarBrand>
        <img alt="logo" className="h-9 mr-2 drop-shadow-sm" src={logo} />
        <p className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-400 bg-clip-text text-transparent select-none">
          Social
        </p>
      </NavbarBrand>

      {/* Desktop nav links */}
      <NavbarContent className="hidden sm:flex gap-7 ml-8" justify="start">
        <NavbarItem>
          <NavLink to="/feed" className={navLinkCls}>
            <MdOutlineDynamicFeed className="text-base shrink-0" />
            Feed
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink to="/profile" className={navLinkCls}>
            <CgProfile className="text-base shrink-0" />
            Profile
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          {/* Notifications */}
          <NavLink
            to="/notifications"
            className={navLinkCls}
            aria-label="Notifications"
          >
            <MdNotifications className="text-base shrink-0" />
            Notifications
            {/* Unread badge */}
            {isUserLoggedIn && unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 flex min-w-[14px] h-3.5 px-1 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </NavLink>
        </NavbarItem>
      </NavbarContent>

      {/* Right-side area */}
      <NavbarContent as="div" justify="end">
        <NavbarContent className="gap-6 me-2" as="div" justify="end">
          {!isUserLoggedIn && (
            <>
              <NavbarItem className="hidden lg:flex">
                <Link to="/login" className={authLinkCls}>
                  <MdLogin className="text-base shrink-0" />
                  LOGIN
                </Link>
              </NavbarItem>
              <NavbarItem className="hidden lg:flex">
                <Link to="/register" className={authLinkCls}>
                  <MdAppRegistration className="text-base shrink-0" />
                  REGISTER
                </Link>
              </NavbarItem>
            </>
          )}

          <NavbarItem className="hidden lg:flex">
            <Link to="/feed" className={ctaBtnCls}>
              <MdOpenInNew className="text-base shrink-0" />
              SEE DETAIL
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* Theme toggle (Desktop & Mobile) */}
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            onPress={toggleTheme}
            aria-label="Toggle theme"
            className="text-gray-600 dark:text-gray-300 transition-transform hover:scale-110"
          >
            {theme === "dark" ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
          </Button>
        </NavbarItem>

        {/* Avatar dropdown */}
        {token ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform hover:scale-110 ring-offset-1 ring-2 ring-indigo-400"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src={user?.photo}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile">
                <Link
                  to="/profile"
                  className="w-full flex items-center gap-2 text-sm font-medium"
                >
                  <CgProfile className="text-base text-indigo-500 shrink-0 inline" />
                  My Profile
                </Link>
              </DropdownItem>
              <DropdownItem
              as={Link}
              to="/change-password"
                key="settings"
                className="w-full flex items-center gap-2 text-sm font-medium"
              >
                <MdSettings className="text-base text-indigo-500 shrink-0 inline mr-2" />
                Settings
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-sm font-medium"
              >
                <MdLogout className="text-base shrink-0 inline mr-2" />
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : null}
      </NavbarContent>

      {/* Mobile slide-in menu */}
      <NavbarMenu className="bg-white/95 dark:bg-indigo-950/95 backdrop-blur-lg pt-6 gap-1">
        {menuItems.map((item, index) => {
          const isLogout = item === "Log Out";
          return (
            <NavbarMenuItem key={`${item}-${index}`}>
              {isLogout ? (
                <button onClick={handleLogout} className={mobileLogoutCls}>
                  {menuIconMap[item]}
                  {item}
                </button>
              ) : (
                <Link
                  className={mobileItemCls}
                  to={`/${item.toLowerCase().replace(/ /g, "-")}`}
                >
                  {menuIconMap[item]}
                  {item}
                </Link>
              )}
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </Navbar>
  );
}
