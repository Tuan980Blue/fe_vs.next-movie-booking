import { useState } from 'react';
import { GenreResponse, CreateGenreRequest, UpdateGenreRequest } from '@/models/movie';

interface GenreFormProps {
  genre?: GenreResponse | null;
  onSubmit: (data: CreateGenreRequest | UpdateGenreRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function GenreForm({ genre, onSubmit, onCancel, loading = false }: GenreFormProps) {
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
