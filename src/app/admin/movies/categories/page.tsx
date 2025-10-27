"use client";

import {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@/store/reduxhooks';
import {GenreResponse, CreateGenreRequest, UpdateGenreRequest} from '@/models/movie';
import {
    setSearchKeyword,
    setSelectedGenre,
    clearError, resetGenres
} from '@/store/slices/genres/genresSlice';
import {PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon} from '@heroicons/react/24/outline';
import GenreForm from "@/app/admin/movies/categories/_components/GenreForm";
import DeleteConfirmModal from "@/app/admin/movies/categories/_components/DeleteConfirmModal";
import {createGenre, deleteGenre, fetchGenres, updateGenre} from "@/store/slices/genres";
import {useSignalRGroup} from "@/hooks/useSignalRGroup";
import {handleGenresUpdated} from "@/handlers";

export default function ManageGenres() {
    const dispatch = useAppDispatch();
    const {items: genres, loading, error, searchKeyword, selectedGenre} = useAppSelector((state) => state.genres);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [genreToDelete, setGenreToDelete] = useState<GenreResponse | null>(null);

    // Load genres on component mount
    useEffect(() => {
        dispatch(fetchGenres());

        return() => {
            dispatch(resetGenres())
        }
    }, [dispatch]);

    //Join group genre
    useSignalRGroup("genres", "genres_updated", () => handleGenresUpdated(dispatch))

    // Filter genres based on search
    const filteredGenres = genres.filter(genre =>
        genre.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    // Handle create genre
    const handleCreateGenre = async (data: CreateGenreRequest) => {
        try {
            await dispatch(createGenre(data)).unwrap();
            setShowCreateModal(false);
        } catch (err) {
            console.error('Error creating genre:', err);
        }
    };

    // Handle update genre
    const handleUpdateGenre = async (data: UpdateGenreRequest) => {
        if (!selectedGenre) return;

        try {
            await dispatch(updateGenre({id: selectedGenre.id, data})).unwrap();
            setShowEditModal(false);
            dispatch(setSelectedGenre(null));
        } catch (err) {
            console.error('Error updating genre:', err);
        }
    };

    // Handle delete genre
    const handleDeleteGenre = async () => {
        if (!genreToDelete) return;

        try {
            await dispatch(deleteGenre(genreToDelete.id)).unwrap();
            setShowDeleteModal(false);
            setGenreToDelete(null);
        } catch (err) {
            console.error('Error deleting genre:', err);
        }
    };

    // Handle edit click
    const handleEditClick = (genre: GenreResponse) => {
        dispatch(setSelectedGenre(genre));
        setShowEditModal(true);
    };

    // Handle delete click
    const handleDeleteClick = (genre: GenreResponse) => {
        setGenreToDelete(genre);
        setShowDeleteModal(true);
    };

    // Handle search change
    const handleSearchChange = (value: string) => {
        dispatch(setSearchKeyword(value));
    };

    // Handle error dismiss
    const handleErrorDismiss = () => {
        dispatch(clearError());
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý thể loại</h1>
                    <p className="text-gray-600">Quản lý các thể loại phim trong hệ thống</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-colors"
                >
                    <PlusIcon className="h-5 w-5"/>
                    Thêm thể loại
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tổng thể loại</p>
                            <p className="text-2xl font-bold text-gray-900">{genres.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Đang sử dụng</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {genres.filter(g => (g as GenreResponse).movieCount > 0).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Chưa sử dụng</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {genres.filter(g => (g as GenreResponse).movieCount === 0).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon
                            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Tìm kiếm thể loại..."
                            value={searchKeyword}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={handleErrorDismiss}
                                className="text-red-400 hover:text-red-600"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Genres Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Danh sách thể loại</h3>
                </div>

                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink mx-auto"></div>
                        <p className="mt-2 text-gray-600">Đang tải...</p>
                    </div>
                ) : filteredGenres.length === 0 ? (
                    <div className="p-6 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có thể loại</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchKeyword ? 'Không tìm thấy thể loại nào phù hợp.' : 'Bắt đầu bằng cách thêm thể loại đầu tiên.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên thể loại
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số phim
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredGenres.map((genre) => (
                                <tr key={genre.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{genre.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div
                                            className="text-sm text-gray-900">{(genre as GenreResponse).movieCount}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (genre as GenreResponse).movieCount > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}>
                        {(genre as GenreResponse).movieCount > 0 ? 'Đang sử dụng' : 'Chưa sử dụng'}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleEditClick(genre)}
                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <PencilIcon className="h-4 w-4"/>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(genre)}
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Xóa"
                                            >
                                                <TrashIcon className="h-4 w-4"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Genre Modal */}
            {showCreateModal && (
                <GenreForm
                    onSubmit={handleCreateGenre}
                    onCancel={() => setShowCreateModal(false)}
                    loading={loading}
                />
            )}

            {/* Edit Genre Modal */}
            {showEditModal && selectedGenre && (
                <GenreForm
                    genre={selectedGenre}
                    onSubmit={handleUpdateGenre}
                    onCancel={() => {
                        setShowEditModal(false);
                        dispatch(setSelectedGenre(null));
                    }}
                    loading={loading}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && genreToDelete && (
                <DeleteConfirmModal
                    title="Xóa thể loại"
                    message={`Bạn có chắc chắn muốn xóa thể loại "${genreToDelete.name}"? Hành động này không thể hoàn tác.`}
                    onConfirm={handleDeleteGenre}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setGenreToDelete(null);
                    }}
                    loading={loading}
                />
            )}
        </div>
    );
}
