import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Luxi-Hosting-Logo.png";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaGithub 
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { name: "Home", path: "/feed" },
      { name: "Discover", path: "/discover" },
      { name: "Profile", path: "/profile" },
      { name: "Settings", path: "/change-password" },
    ],
    useful: [
      { name: "About", path: "/about" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms & Conditions", path: "/terms" },
    ],
    social: [
      { icon: <FaFacebookF size={18} />, path: "#", color: "hover:text-blue-500" },
      { icon: <FaTwitter size={18} />, path: "#", color: "hover:text-sky-400" },
      { icon: <FaInstagram size={18} />, path: "#", color: "hover:text-pink-500" },
      { icon: <FaLinkedinIn size={18} />, path: "#", color: "hover:text-blue-400" },
      { icon: <FaGithub size={18} />, path: "#", color: "hover:text-gray-100" },
    ],
  };

  return (
    <footer className="w-full bg-white dark:bg-[#111827] backdrop-blur-md border-t border-gray-200 dark:border-gray-800/60 pt-12 pb-8 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Column 1: Brand & About */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <img alt="logo" className="h-8 mr-2 drop-shadow-sm" src={logo} />
              <p className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-400 bg-clip-text text-transparent">
                Social
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
              Connect, share, and discover amazing content in our modern social community. Built for creators and dreamers.
            </p>
            <div className="flex items-center gap-4 mt-2">
              {footerLinks.social.map((item, idx) => (
                <a
                  key={idx}
                  href={item.path}
                  className={`text-gray-500 transition-all duration-300 transform hover:scale-110 ${item.color}`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest mb-6">Navigation</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="h-1 w-0 bg-indigo-500 rounded-full transition-all duration-300 group-hover:w-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest mb-6">Support</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.useful.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="h-1 w-0 bg-indigo-500 rounded-full transition-all duration-300 group-hover:w-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter/CTA */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest mb-6">Stay Connected</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Join our community and stay updated with the latest trends.
            </p>
            <div className="flex flex-col gap-2">
              <button className="px-5 py-2.5 text-xs font-bold tracking-widest text-white bg-gradient-to-r from-violet-600 to-indigo-500 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02]">
                JOIN US NOW
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} <span className="font-semibold text-gray-700 dark:text-gray-400">Social App</span>. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/help" className="text-[10px] uppercase font-bold text-gray-600 hover:text-gray-400 tracking-tighter transition-colors">Help Center</Link>
            <Link to="/status" className="text-[10px] uppercase font-bold text-gray-600 hover:text-gray-400 tracking-tighter transition-colors">System Status</Link>
            <Link to="/cookies" className="text-[10px] uppercase font-bold text-gray-600 hover:text-gray-400 tracking-tighter transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
