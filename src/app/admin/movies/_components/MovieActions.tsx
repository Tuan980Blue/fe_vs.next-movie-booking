"use client";

import { useState } from 'react';
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

  const statusOptions = [
    { value: MovieStatus.Draft, label: 'Draft', color: 'text-gray-600' },
    { value: MovieStatus.ComingSoon, label: 'Coming Soon', color: 'text-blue-600' },
    { value: MovieStatus.NowShowing, label: 'Now Showing', color: 'text-green-600' },
    { value: MovieStatus.Archived, label: 'Archived', color: 'text-red-600' },
  ];

  const getStatusLabel = (status: MovieStatus) => {
    return statusOptions.find(option => option.value === status)?.label || 'Unknown';
  };

  const getStatusColor = (status: MovieStatus) => {
    return statusOptions.find(option => option.value === status)?.color || 'text-gray-600';
  };

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
      <div className="relative">
        <button
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
          title="Change Status"
          disabled={loading}
        >
          <ArrowPathIcon className="h-4 w-4" />
        </button>
        
        {showStatusMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Change Status
              </div>
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    movie.status === option.value ? 'bg-gray-50 font-medium' : ''
                  } ${option.color}`}
                  disabled={movie.status === option.value}
                >
                  {option.label}
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

      {/* Status Badge */}
      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(movie.status)} bg-gray-100`}>
        {getStatusLabel(movie.status)}
      </span>
    </div>
  );
}
