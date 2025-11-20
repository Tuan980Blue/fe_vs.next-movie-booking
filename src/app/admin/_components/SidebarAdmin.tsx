"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthContext';
import { 
  HomeIcon, 
  FilmIcon, 
  UsersIcon, 
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
  Bars3Icon,
  Cog6ToothIcon,
  ChartBarIcon,
  TicketIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface SidebarAdminProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

export default function SidebarAdmin({ isOpen, onClose }: SidebarAdminProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand menu items based on current path
  useEffect(() => {
    const currentExpanded: string[] = [];
    
    if (pathname.startsWith('/admin/movies')) {
      currentExpanded.push('Quản lý phim');
    }
    if (pathname.startsWith('/admin/users')) {
      currentExpanded.push('Quản lý người dùng');
    }
    if (pathname.startsWith('/admin/bookings')) {
      currentExpanded.push('Quản lý đặt vé');
    }
    if (pathname.startsWith('/admin/tickets')) {
      currentExpanded.push('Quản lý vé');
    }
    if (pathname.startsWith('/admin/settings')) {
      currentExpanded.push('Cài đặt');
    }
    
    setExpandedItems(currentExpanded);
  }, [pathname]);

  const menuItems: MenuItem[] = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <ChartBarIcon className="size-4" />
    },
    {
      href: "/admin/movies",
      label: "Quản lý phim",
      icon: <FilmIcon className="size-4" />,
      children: [
        { href: "/admin/movies", label: "Danh sách phim", icon: <FilmIcon className="size-4" /> },
        { href: "/admin/movies/add", label: "Thêm phim mới", icon: <FilmIcon className="size-4" /> },
        { href: "/admin/movies/categories", label: "Quản lý thể loại", icon: <FilmIcon className="size-4" /> }
      ]
    },
    {
      href: "/admin/users",
      label: "Quản lý người dùng",
      icon: <UsersIcon className="size-4" />,
      children: [
        { href: "/admin/users", label: "Danh sách người dùng", icon: <UsersIcon className="size-4" /> },
        { href: "/admin/users/roles", label: "Phân quyền", icon: <UsersIcon className="size-4" /> }
      ]
    },
    {
      href: "/admin/bookings",
      label: "Quản lý đặt vé",
      icon: <ClipboardDocumentListIcon className="size-4" />,
      children: [
        { href: "/admin/bookings", label: "Danh sách đơn đặt vé", icon: <ClipboardDocumentListIcon className="size-4" /> }
      ]
    },
    {
      href: "/admin/tickets",
      label: "Quản lý vé",
      icon: <TicketIcon className="size-4" />,
      children: [
        { href: "/admin/tickets", label: "Trang chủ", icon: <TicketIcon className="size-4" /> },
        { href: "/admin/tickets/check-ticket", label: "Check-in vé", icon: <TicketIcon className="size-4" /> }
      ]
    },
    {
      href: "/admin/settings",
      label: "Cài đặt",
      icon: <Cog6ToothIcon className="size-4" />,
      children: [
        { href: "/admin/settings/general", label: "Cài đặt chung", icon: <Cog6ToothIcon className="size-4" /> },
        { href: "/admin/settings/pricing", label: "Giá vé", icon: <Cog6ToothIcon className="size-4" /> }
      ]
    }
  ];

  const toggleExpanded = (itemLabel: string) => {
    setExpandedItems(prev => 
      prev.includes(itemLabel) 
        ? prev.filter(item => item !== itemLabel)
        : [...prev, itemLabel]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    // Use exact match for all routes to prevent parent/child conflicts
    return pathname === href;
  };

  const isParentActive = (item: MenuItem) => {
    if (!item.children) return false;
    return item.children.some(child => isActive(child.href));
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const active = isActive(item.href);
    const parentActive = isParentActive(item);

    if (hasChildren) {
      return (
        <li key={item.label} className="hs-accordion">
          <button
            type="button"
            onClick={() => toggleExpanded(item.label)}
            className={`hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg transition-colors ${
              parentActive 
                ? 'bg-gray-100 text-gray-800 font-medium' 
                : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900 focus:outline-hidden focus:bg-gray-100'
            }`}
            aria-expanded={isExpanded}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {isExpanded ? (
              <ChevronDownIcon className="size-4 text-gray-600 transition-transform duration-200" />
            ) : (
              <ChevronRightIcon className="size-4 text-gray-600 transition-transform duration-200" />
            )}
          </button>

          <div
            className={`hs-accordion-content w-full overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
            role="region"
            aria-labelledby={`accordion-${item.label}`}
          >
            <ul className="pt-1 ps-7 space-y-1">
              {item.children?.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg transition-colors ${
                      isActive(child.href) 
                        ? 'bg-primary-pink text-white font-medium' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-hidden focus:bg-gray-100'
                    }`}
                    onClick={() => {
                      // Close sidebar on mobile after navigation
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    {child.icon}
                    <span>{child.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>
      );
    }

    return (
      <li key={item.href}>
        <Link
          href={item.href}
          className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg transition-colors ${
            active 
              ? 'bg-primary-pink text-white font-medium' 
              : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900 focus:outline-hidden focus:bg-gray-100'
          }`}
          onClick={() => {
            // Close sidebar on mobile after navigation
            if (window.innerWidth < 1024) {
              onClose();
            }
          }}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 start-0 bottom-0 z-50 w-64 bg-white border-e border-gray-300 shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto lg:shadow-none lg:h-full`}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Header */}
          <header className="p-4 flex justify-between items-center gap-x-2">
            <Link 
              href="/admin" 
              className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 hover:opacity-80 transition-opacity"
              aria-label="Brand"
            >
              🎭 Admin Panel
            </Link>

            <div className="lg:hidden -me-2">
              <button
                type="button"
                onClick={onClose}
                className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="shrink-0 size-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </header>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-gray-800 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600">
            <div className="pb-0 px-2 w-full flex flex-col flex-wrap">
              <ul className="space-y-1">
                {menuItems.map((item) => renderMenuItem(item))}
              </ul>
            </div>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-pink rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">
                  {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.fullName || 'Admin'}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
