"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/reduxhooks';
import { fetchMovieStats } from '@/store/slices/movies/moviesSlice';

export default function MovieStats() {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovieStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statItems = [
    {
      label: 'Total Movies',
      value: stats.totalMovies,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: '🎬'
    },
    {
      label: 'Draft',
      value: stats.draftMovies,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      icon: '📝'
    },
    {
      label: 'Coming Soon',
      value: stats.comingSoonMovies,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: '⏰'
    },
    {
      label: 'Now Showing',
      value: stats.nowShowingMovies,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '🎭'
    },
    {
      label: 'Archived',
      value: stats.archivedMovies,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: '📦'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            </div>
            <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
              <span className="text-2xl">{item.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
