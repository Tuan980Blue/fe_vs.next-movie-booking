"use client";

import { useState, useEffect } from 'react';
import { GenreResponse, CreateGenreRequest, UpdateGenreRequest } from '@/models/movie';
import { 
  getGenresApi, 
  createGenreApi, 
  updateGenreApi, 
  deleteGenreApi 
} from '@/service/services/genreService';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ManageGenres() {
  const [genres, setGenres] = useState<GenreResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponse | null>(null);
  const [genreToDelete, setGenreToDelete] = useState<GenreResponse | null>(null);

  // Load genres
  const loadGenres = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getGenresApi();
      setGenres(data);
    } catch (err) {
      setError('Failed to load genres');
      console.error('Error loading genres:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  // Filter genres based on search
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Handle create genre
  const handleCreateGenre = async (data: CreateGenreRequest) => {
    try {
      setLoading(true);
      await createGenreApi(data);
      setShowCreateModal(false);
      await loadGenres(); // Reload genres
    } catch (err) {
      setError('Failed to create genre');
      console.error('Error creating genre:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle update genre
  const handleUpdateGenre = async (data: UpdateGenreRequest) => {
    if (!selectedGenre) return;

    try {
      setLoading(true);
      await updateGenreApi(selectedGenre.id, data);
      setShowEditModal(false);
      setSelectedGenre(null);
      await loadGenres(); // Reload genres
    } catch (err) {
      setError('Failed to update genre');
      console.error('Error updating genre:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete genre
  const handleDeleteGenre = async () => {
    if (!genreToDelete) return;

    try {
      setLoading(true);
      await deleteGenreApi(genreToDelete.id);
      setShowDeleteModal(false);
      setGenreToDelete(null);
      await loadGenres(); // Reload genres
    } catch (err) {
      setError('Failed to delete genre');
      console.error('Error deleting genre:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit click
  const handleEditClick = (genre: GenreResponse) => {
    setSelectedGenre(genre);
    setShowEditModal(true);
  };

  // Handle delete click
  const handleDeleteClick = (genre: GenreResponse) => {
    setGenreToDelete(genre);
    setShowDeleteModal(true);
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
          <PlusIcon className="h-5 w-5" />
          Thêm thể loại
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm thể loại..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
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
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
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
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
                      <div className="text-sm text-gray-900">{(genre as GenreResponse).movieCount}</div>
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
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(genre)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Xóa"
                        >
                          <TrashIcon className="h-4 w-4" />
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
            setSelectedGenre(null);
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

// Genre Form Component
interface GenreFormProps {
  genre?: GenreResponse | null;
  onSubmit: (data: CreateGenreRequest | UpdateGenreRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

function GenreForm({ genre, onSubmit, onCancel, loading = false }: GenreFormProps) {
  const [formData, setFormData] = useState({
    name: genre?.name || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên thể loại là bắt buộc';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên thể loại phải có ít nhất 2 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {genre ? 'Chỉnh sửa thể loại' : 'Thêm thể loại mới'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên thể loại *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nhập tên thể loại..."
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-primary-pink rounded-md hover:bg-primary-pink/90 focus:outline-none focus:ring-2 focus:ring-primary-pink disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : genre ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal Component
interface DeleteConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

function DeleteConfirmModal({ title, message, onConfirm, onCancel, loading = false }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}
