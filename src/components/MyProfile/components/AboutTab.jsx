import {
  MdEmail,
  MdCake,
  MdPerson,
  MdCalendarMonth,
} from "react-icons/md";
import { formatDate, formatJoinDate } from "../helpers";

export default function AboutTab({ user }) {
  const rows = [
    {
      icon: <MdEmail className="text-indigo-600 dark:text-indigo-400 text-lg shrink-0" />,
      label: "Email",
      value: user.email,
    },
    {
      icon: <MdPerson className="text-indigo-600 dark:text-indigo-400 text-lg shrink-0" />,
      label: "Gender",
      value: user.gender.charAt(0).toUpperCase() + user.gender.slice(1),
    },
    {
      icon: <MdCake className="text-indigo-600 dark:text-indigo-400 text-lg shrink-0" />,
      label: "Date of Birth",
      value: formatDate(user.dateOfBirth),
    },
    {
      icon: <MdCalendarMonth className="text-indigo-600 dark:text-indigo-400 text-lg shrink-0" />,
      label: "Joined",
      value: formatJoinDate(user.createdAt),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 shadow-sm dark:shadow-none transition-colors">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-4
                     hover:bg-indigo-500/5 transition-colors duration-150"
        >
          {row.icon}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <span className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-wide font-medium w-24 shrink-0">
              {row.label}
            </span>
            <span className="text-sm text-gray-800 dark:text-gray-200">{row.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
