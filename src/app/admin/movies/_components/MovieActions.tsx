"use client";

import { useState, useEffect, useRef } from 'react';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { MovieResponse, MovieStatus } from '@/models/movie';

interface MovieActionsProps {
  movie: MovieResponse;
  onEdit: (movie: MovieResponse) => void;
  onDelete: (movie: MovieResponse) => void;
  onView: (movie: MovieResponse) => void;
  onChangeStatus: (movie: MovieResponse, status: MovieStatus) => void;
  loading?: boolean;
}

export default function MovieActions({
  movie,
  onEdit,
  onDelete,
  onView,
  onChangeStatus,
  loading = false
}: MovieActionsProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusMenu(false);
      }
    };

    if (showStatusMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusMenu]);

  const statusOptions = [
    { value: MovieStatus.Draft, label: 'Draft', color: 'text-gray-600' },
    { value: MovieStatus.ComingSoon, label: 'Coming Soon', color: 'text-blue-600' },
    { value: MovieStatus.NowShowing, label: 'Now Showing', color: 'text-green-600' },
    { value: MovieStatus.Archived, label: 'Archived', color: 'text-red-600' },
  ];

  const handleStatusChange = (newStatus: MovieStatus) => {
    onChangeStatus(movie, newStatus);
    setShowStatusMenu(false);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* View Button */}
      <button
        onClick={() => onView(movie)}
        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
        title="View Details"
        disabled={loading}
      >
        <EyeIcon className="h-4 w-4" />
      </button>

      {/* Edit Button */}
      <button
        onClick={() => onEdit(movie)}
        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
        title="Edit Movie"
        disabled={loading}
      >
        <PencilIcon className="h-4 w-4" />
      </button>

      {/* Status Change Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
          title="Change Status"
          disabled={loading}
        >
          <ArrowPathIcon className="h-4 w-4" />
        </button>

        {showStatusMenu && (
          <div 
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 border border-gray-200"
            style={{
              position: 'absolute',
              right: '0',
              top: '100%',
              marginTop: '8px',
              width: '192px',
              backgroundColor: 'white',
              borderRadius: '6px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              zIndex: 9999,
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ padding: '4px 0' }}>
              <div 
                className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100"
              >
                Change Status
              </div>
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    movie.status === option.value ? 'bg-gray-50 font-medium' : ''
                  } ${option.color}`}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    fontSize: '14px',
                    display: 'block',
                    backgroundColor: movie.status === option.value ? '#f9fafb' : 'transparent',
                    fontWeight: movie.status === option.value ? '500' : 'normal',
                    color: option.value === MovieStatus.Draft ? '#6b7280' :
                           option.value === MovieStatus.ComingSoon ? '#2563eb' :
                           option.value === MovieStatus.NowShowing ? '#16a34a' :
                           '#dc2626',
                    border: 'none',
                    cursor: movie.status === option.value ? 'not-allowed' : 'pointer',
                    opacity: movie.status === option.value ? 0.6 : 1
                  }}
                  disabled={movie.status === option.value}
                  onMouseEnter={(e) => {
                    if (movie.status !== option.value) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (movie.status !== option.value) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{option.label}</span>
                    {movie.status === option.value && (
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>Current</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(movie)}
        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
        title="Delete Movie"
        disabled={loading}
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
