"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Settings,
  Users,
  MessageCircle,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/auth";
import { User } from "@/types/auth";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface MenuItem {
  title: string;
  href?: string;
  submenu?: { title: string; href: string }[];
}

interface DashboardNavbarProps {
  user: User;
}

export default function DashboardNavbar({ user }: DashboardNavbarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const authenticatedMenuItems: MenuItem[] = [
    { title: "Dashboard", href: "/dashboard/student" },
    {
      title: "Questions",
      submenu: [
        { title: "Question Pool", href: "/student/question-pool" },
        { title: "KCSE Questions", href: "/student/question-pool/kcse" },
        { title: "KCPE Questions", href: "/student/question-pool/kcpe" },
        { title: "Form 1-4 Questions", href: "/student/question-pool/form" },
        {
          title: "Topic-wise Questions",
          href: "/student/question-pool/topics",
        },
        {
          title: "Difficulty Levels",
          href: "/student/question-pool/difficulty",
        },
      ],
    },
    {
      title: "Past Papers & Exams",
      submenu: [
        { title: "All Exams", href: "/student/exams" },
        { title: "KCSE 2023", href: "/student/exams/kcse-2023" },
        { title: "KCSE 2022", href: "/student/exams/kcse-2022" },
        { title: "KCSE 2021", href: "/student/exams/kcse-2021" },
        { title: "Alliance Mock Papers", href: "/student/exams/alliance-mock" },
        { title: "Starehe School Mock", href: "/student/exams/starehe-mock" },
        { title: "Mang'u Mock Papers", href: "/student/exams/mangu-mock" },
        { title: "County Mock Exams", href: "/student/exams/county-mock" },
      ],
    },
    { title: "Continue Practice", href: "/student/practice/continue" },
  ];

  const profileMenuItems = [
    { title: "Profile", href: "/student/profile", icon: Users },
    { title: "Settings", href: "/student/settings", icon: Settings },
    { title: "Refer Friends", href: "/student/refer", icon: Users },
    { title: "Contact Us", href: "/contact", icon: MessageCircle },
  ];

 const handleLogout = async () => {
  try {
    await logout();
    window.location.href = "/";
  } catch {
    window.location.href = "/login";
  }
};

  const toggleMenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  const handleLogoClick = () => {
    router.push("/dashboard/student");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setExpandedMenu(null);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMenuActive = (item: MenuItem) => {
    if (item.href && pathname === item.href) return true;
    if (item.submenu) {
      return item.submenu.some(
        (subitem) =>
          pathname === subitem.href || pathname.startsWith(subitem.href + "/")
      );
    }
    return false;
  };

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard/student" className="flex items-center">
              <button onClick={handleLogoClick} className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="StudyPool Logo"
                  width={100}
                  height={40}
                  className="mr-2"
                />
                <div className="flex items-center">
                  <span className="font-bold text-[#182b5c] text-2xl">
                    STUDY
                  </span>
                  <span className="font-bold text-[#ff914d] text-2xl">
                    pool
                  </span>
                </div>
              </button>
            </Link>
          </div>

          {/* Menu Items */}
          <div className="hidden lg:flex items-center space-x-1" ref={menuRef}>
            {authenticatedMenuItems.map((item) => {
              const isActive = isMenuActive(item);
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              return (
                <div key={item.title} className="relative">
                  {hasSubmenu ? (
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-blue-700 bg-blue-50"
                          : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedMenu === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-blue-700 bg-blue-50"
                          : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.title}</span>
                    </Link>
                  )}

                  {/* Submenu Dropdown */}
                  {hasSubmenu && expandedMenu === item.title && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.submenu!.map((subitem, index) => (
                        <Link
                          key={subitem.title}
                          href={subitem.href}
                          className={`block px-4 py-2.5 text-sm transition-colors ${
                            pathname === subitem.href ||
                            pathname.startsWith(subitem.href + "/")
                              ? "text-blue-700 bg-blue-50 font-medium"
                              : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                          } ${
                            index === 0
                              ? "border-b border-gray-100 mb-1 pb-3"
                              : ""
                          }`}
                          onClick={() => setExpandedMenu(null)}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {initials}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user.first_name}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.first_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {profileMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:text-blue-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 mt-1 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden border-t border-gray-200 px-4 py-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="space-y-1">
          {authenticatedMenuItems.map((item) => {
            const isActive = isMenuActive(item);
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <div key={item.title}>
                {hasSubmenu ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "text-blue-700 bg-blue-50"
                          : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedMenu === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedMenu === item.title && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                        {item.submenu!.map((subitem) => (
                          <Link
                            key={subitem.title}
                            href={subitem.href}
                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                              pathname === subitem.href ||
                              pathname.startsWith(subitem.href + "/")
                                ? "text-blue-700 bg-blue-50 font-medium"
                                : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                            }`}
                            onClick={() => setExpandedMenu(null)}
                          >
                            {subitem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "text-blue-700 bg-blue-50"
                        : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
