import { MdCake, MdCalendarMonth, MdEmail, MdPerson } from "react-icons/md";
import { formatDate, formatJoinDate } from "../helpers";

export default function ProfileInfo({ user }) {
  const infoItems = [
    {
      icon: <MdEmail className="text-indigo-500 dark:text-indigo-400 text-base shrink-0" />,
      label: user.email,
    },
    {
      icon: <MdPerson className="text-indigo-500 dark:text-indigo-400 text-base shrink-0" />,
      label: user.gender.charAt(0).toUpperCase() + user.gender.slice(1),
    },
    {
      icon: <MdCake className="text-indigo-500 dark:text-indigo-400 text-base shrink-0" />,
      label: formatDate(user.dateOfBirth),
    },
    {
      icon: <MdCalendarMonth className="text-indigo-500 dark:text-indigo-400 text-base shrink-0" />,
      label: `Joined ${formatJoinDate(user.createdAt)}`,
    },
  ];

  return (
    <div className="px-5 sm:px-8 mt-14 sm:mt-16">
      {/* Name + username */}
      <div className="mb-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          {user.name}
        </h1>
        <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mt-0.5">
          @{user.username}
        </p>
      </div>

      {/* Meta info row */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
        {infoItems.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400"
          >
            {item.icon}
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
