"use client";

import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '@/store/reduxhooks';
import {
    CreateMovieRequest,
    UpdateMovieRequest,
    MovieResponse,
    MovieStatus,
    MovieSearchDto
} from '@/models/movie';
import MovieStats from './_components/MovieStats';
import MovieModal from './_components/MovieModal';
import DeleteConfirmModal from './_components/DeleteConfirmModal';
import MovieActions from './_components/MovieActions';
import {PlusIcon, MagnifyingGlassIcon, FunnelIcon} from '@heroicons/react/24/outline';
import {
    changeMovieStatus,
    clearSelectedMovie,
    createMovie,
    deleteMovie,
    fetchMovies, resetMovies, setSelectedMovie,
    updateMovie
} from "@/store/slices/movies";
import {clearError} from "@/store/slices/genres";
import {useSignalRGroup} from "@/hooks/useSignalRGroup";
import {handleMoviesUpdated} from "@/handlers";

export default function ManageMovies() {
    const dispatch = useAppDispatch();
    const {
        items,
        loading,
        error,
        page,
        pageSize,
        totalItems,
        totalPages,
        selectedMovie
    } = useAppSelector((state) => state.movies);

    // Local state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState<MovieResponse | null>(null);
    const [searchParams, setSearchParams] = useState<MovieSearchDto>({
        page: 1,
        pageSize: 20,
        search: '',
        status: undefined,
        sortBy: 'createdAt',
        sortDirection: 'desc'
    });

    // Load initial data
    useEffect(() => {
        const loadMovies = async () => {
            try {
                await dispatch(fetchMovies(searchParams)).unwrap();
            } catch (error) {
                console.error('Failed to load movies:', error);
            }
        };
        loadMovies();

        return() => {
            dispatch(resetMovies())
        }
    }, [dispatch, searchParams]);

    //Join group movies
    useSignalRGroup("movies", "movies_updated", () => handleMoviesUpdated(dispatch))

    // Handle create movie
    const handleCreateMovie = async (data: CreateMovieRequest) => {
        try {
            await dispatch(createMovie(data)).unwrap();
            setShowCreateModal(false);
            // Refresh the list
            dispatch(fetchMovies(searchParams));
        } catch (error) {
            console.error('Failed to create movie:', error);
        }
    };

    // Handle update movie
    const handleUpdateMovie = async (data: UpdateMovieRequest) => {
        if (!selectedMovie) return;

        try {
            await dispatch(updateMovie({id: selectedMovie.id, data})).unwrap();
            setShowEditModal(false);
            dispatch(clearSelectedMovie());
            // Refresh the list
            dispatch(fetchMovies(searchParams));
        } catch (error) {
            console.error('Failed to update movie:', error);
        }
    };

    // Handle delete movie
    const handleDeleteMovie = async () => {
        if (!movieToDelete) return;

        try {
            await dispatch(deleteMovie(movieToDelete.id)).unwrap();
            setShowDeleteModal(false);
            setMovieToDelete(null);
            // Refresh the list
            dispatch(fetchMovies(searchParams));
        } catch (error) {
            console.error('Failed to delete movie:', error);
        }
    };

    // Handle change movie status
    const handleChangeStatus = async (movie: MovieResponse, status: MovieStatus) => {
        try {
            await dispatch(changeMovieStatus({id: movie.id, status})).unwrap();
            // Refresh the list
            dispatch(fetchMovies(searchParams));
        } catch (error) {
            console.error('Failed to change movie status:', error);
        }
    };

    // Handle edit movie
    const handleEditMovie = (movie: MovieResponse) => {
        dispatch(setSelectedMovie(movie));
        setShowEditModal(true);
    };

    // Handle delete movie
    const handleDeleteClick = (movie: MovieResponse) => {
        setMovieToDelete(movie);
        setShowDeleteModal(true);
    };

    // Handle view movie
    const handleViewMovie = (movie: MovieResponse) => {
        dispatch(setSelectedMovie(movie));
        // You can implement a view modal or navigate to a detail page
        console.log('View movie:', movie);
        setShowEditModal(true);
    };

    // Handle search
    const handleSearch = (search: string) => {
        setSearchParams(prev => ({...prev, search, page: 1}));
    };

    // Handle status filter
    const handleStatusFilter = (status: MovieStatus | undefined) => {
        setSearchParams(prev => ({...prev, status, page: 1}));
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => ({...prev, page: newPage}));
    };

    // Clear error
    const handleClearError = () => {
        dispatch(clearError());
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    // Get status badge color
    const getStatusBadgeColor = (status: MovieStatus) => {
        switch (status) {
            case MovieStatus.Draft:
                return 'bg-gray-100 text-gray-800';
            case MovieStatus.ComingSoon:
                return 'bg-blue-100 text-blue-800';
            case MovieStatus.NowShowing:
                return 'bg-green-100 text-green-800';
            case MovieStatus.Archived:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: MovieStatus) => {
        switch (status) {
            case MovieStatus.Draft:
                return 'Draft';
            case MovieStatus.ComingSoon:
                return 'Coming Soon';
            case MovieStatus.NowShowing:
                return 'Now Showing';
            case MovieStatus.Archived:
                return 'Archived';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Movie Management</h1>
                    <p className="text-gray-600">Manage movies in your cinema system</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-colors"
                >
                    <PlusIcon className="h-5 w-5"/>
                    Thêm phim mới
                </button>
            </div>

            {/* Stats */}
            <MovieStats/>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <MagnifyingGlassIcon
                                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchParams.search || ''}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center space-x-2">
                        <FunnelIcon className="h-5 w-5 text-gray-400"/>
                        <select
                            value={searchParams.status ?? ''}
                            onChange={(e) => handleStatusFilter(e.target.value ? parseInt(e.target.value) : undefined)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value={MovieStatus.Draft}>Draft</option>
                            <option value={MovieStatus.ComingSoon}>Coming Soon</option>
                            <option value={MovieStatus.NowShowing}>Now Showing</option>
                            <option value={MovieStatus.Archived}>Archived</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="text-red-600">
                                <strong>Error:</strong> {error}
                            </div>
                        </div>
                        <button
                            onClick={handleClearError}
                            className="text-red-600 hover:text-red-800"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading movies...</span>
                </div>
            )}

            {/* Movies Table */}
            {!loading && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Movie
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Release Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Genres
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((movie) => (
                                <tr key={movie.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {movie.posterUrl && (
                                                <img
                                                    className="h-12 w-8 object-cover rounded mr-3"
                                                    src={movie.posterUrl}
                                                    alt={movie.title}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {movie.title}
                                                </div>
                                                {movie.originalTitle && (
                                                    <div className="text-sm text-gray-500">
                                                        {movie.originalTitle}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {movie.durationMinutes} min
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(movie.releaseDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(movie.status)}`}>
                        {getStatusLabel(movie.status)}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex flex-wrap gap-1">
                                            {movie.genres?.slice(0, 2).map((genre) => (
                                                <span
                                                    key={genre.id}
                                                    className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                                                >
                            {genre.name}
                          </span>
                                            ))}
                                            {movie.genres && movie.genres.length > 2 && (
                                                <span className="text-xs text-gray-500">
                            +{movie.genres.length - 2} more
                          </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <MovieActions
                                            movie={movie}
                                            onEdit={handleEditMovie}
                                            onDelete={handleDeleteClick}
                                            onView={handleViewMovie}
                                            onChangeStatus={handleChangeStatus}
                                            loading={loading}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div
                            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page <= 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
                                        <span className="font-medium">
                      {Math.min(page * pageSize, totalItems)}
                    </span>{' '}
                                        of <span className="font-medium">{totalItems}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page <= 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    page === i + 1
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page >= totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!loading && items.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🎬</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No movies found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchParams.search || searchParams.status !== undefined
                            ? 'Try adjusting your search criteria'
                            : 'Get started by creating your first movie'}
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PlusIcon className="h-5 w-5 mr-2"/>
                        Add Movie
                    </button>
                </div>
            )}

            {/* Modals */}
            <MovieModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateMovie as (data: CreateMovieRequest | UpdateMovieRequest) => Promise<void>}
                loading={loading}
            />

            <MovieModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    dispatch(clearSelectedMovie());
                }}
                movie={selectedMovie}
                onSubmit={handleUpdateMovie as (data: CreateMovieRequest | UpdateMovieRequest) => Promise<void>}
                loading={loading}
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setMovieToDelete(null);
                }}
                movie={movieToDelete}
                onConfirm={handleDeleteMovie}
                loading={loading}
            />
        </div>
    );
}
