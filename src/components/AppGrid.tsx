import { CalendarDays, Users, ArrowRightLeft } from "lucide-react";
import Link from "next/link";

const apps = [
  {
    name: "Attendance",
    icon: Users,
    href: "/attendance",
    description: "Track and manage attendance records",
    disabled: false,
  },
  {
    name: "Events",
    icon: CalendarDays,
    href: "/events",
    description: "Organize and manage club events",
    disabled: true,
  },
  {
    name: "Redirects",
    icon: ArrowRightLeft,
    href: "/redirects",
    description: "Manage URL redirects and links",
    disabled: true,
  },
];

export function AppGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      {apps.map((app) => (
        <div
          key={app.name}
          className={`group relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all aspect-square flex flex-col items-center justify-center gap-2 ${
            app.disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-md cursor-pointer"
          }`}
        >
          {!app.disabled ? (
            <Link href={`/apps${app.href}`} className="contents">
              <AppContent app={app} />
            </Link>
          ) : (
            <AppContent app={app} />
          )}
        </div>
      ))}
    </div>
  );
}

function AppContent({ app }: { app: (typeof apps)[number] }) {
  return (
    <>
      <app.icon
        className={`w-8 h-8 ${
          app.disabled
            ? "text-gray-400 dark:text-gray-500"
            : "text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
        } transition-colors`}
      />
      <div className="text-center">
        <h3
          className={`text-base font-semibold ${
            app.disabled
              ? "text-gray-400 dark:text-gray-500"
              : "text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          }`}
        >
          {app.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {app.description}
        </p>
      </div>
    </>
  );
}
