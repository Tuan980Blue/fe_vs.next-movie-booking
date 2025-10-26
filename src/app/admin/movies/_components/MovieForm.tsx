"use client";

import {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@/store/reduxhooks';
import {
    CreateMovieRequest,
    UpdateMovieRequest,
    MovieResponse,
    MovieStatus,
} from '@/models/movie';
import {fetchGenres, resetGenres} from "@/store/slices/genres";

interface MovieFormProps {
    movie?: MovieResponse | null;
    onSubmit: (data: CreateMovieRequest | UpdateMovieRequest) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export default function MovieForm({movie, onSubmit, onCancel, loading = false}: MovieFormProps) {
    const dispatch = useAppDispatch();
    const {items: genres} = useAppSelector((state) => state.genres);

    const [formData, setFormData] = useState<CreateMovieRequest>({
        title: '',
        originalTitle: '',
        durationMinutes: 0,
        rated: '',
        description: '',
        releaseDate: '',
        posterUrl: '',
        backdropUrl: '',
        trailerUrl: '',
        director: '',
        actors: '',
        status: MovieStatus.Draft,
        genreIds: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        dispatch(fetchGenres());

        // Populate form if editing existing movie
        if (movie) {
            setFormData({
                title: movie.title,
                originalTitle: movie.originalTitle || '',
                durationMinutes: movie.durationMinutes,
                rated: movie.rated || '',
                description: movie.description || '',
                releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
                posterUrl: movie.posterUrl || '',
                backdropUrl: movie.backdropUrl || '',
                trailerUrl: movie.trailerUrl || '',
                director: movie.director || '',
                actors: movie.actors || '',
                status: movie.status,
                genreIds: movie.genres?.map(g => g.id) || [],
            });
        }

        // RESET: khi unmout
        return () => {
            dispatch(resetGenres())
        }
    }, [movie, dispatch]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (formData.durationMinutes <= 0) {
            newErrors.durationMinutes = 'Duration must be greater than 0';
        }

        if (!formData.genreIds || formData.genreIds.length === 0) {
            newErrors.genreIds = 'At least one genre is required';
        }

        if (formData.posterUrl && !isValidUrl(formData.posterUrl)) {
            newErrors.posterUrl = 'Invalid URL format';
        }

        if (formData.backdropUrl && !isValidUrl(formData.backdropUrl)) {
            newErrors.backdropUrl = 'Invalid URL format';
        }

        if (formData.trailerUrl && !isValidUrl(formData.trailerUrl)) {
            newErrors.trailerUrl = 'Invalid URL format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            await onSubmit(formData);
        }
    };

    const handleInputChange = (field: keyof CreateMovieRequest, value: any) => {
        setFormData(prev => ({...prev, [field]: value}));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    const handleGenreToggle = (genreId: string) => {
        setFormData(prev => ({
            ...prev,
            genreIds: (prev.genreIds || []).includes(genreId)
                ? (prev.genreIds || []).filter(id => id !== genreId)
                : [...(prev.genreIds || []), genreId]
        }));
    };

    const statusOptions = [
        {value: MovieStatus.Draft, label: 'Draft'},
        {value: MovieStatus.ComingSoon, label: 'Coming Soon'},
        {value: MovieStatus.NowShowing, label: 'Now Showing'},
        {value: MovieStatus.Archived, label: 'Archived'},
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter movie title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Original Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Title
                    </label>
                    <input
                        type="text"
                        value={formData.originalTitle}
                        onChange={(e) => handleInputChange('originalTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter original title"
                    />
                </div>

                {/* Duration */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes) *
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="600"
                        value={formData.durationMinutes}
                        onChange={(e) => handleInputChange('durationMinutes', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.durationMinutes ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter duration in minutes"
                    />
                    {errors.durationMinutes && <p className="text-red-500 text-sm mt-1">{errors.durationMinutes}</p>}
                </div>

                {/* Rated */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rated
                    </label>
                    <input
                        type="text"
                        value={formData.rated}
                        onChange={(e) => handleInputChange('rated', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., PG-13, R"
                    />
                </div>

                {/* Release Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Release Date
                    </label>
                    <input
                        type="date"
                        value={formData.releaseDate}
                        onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Director */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Director
                    </label>
                    <input
                        type="text"
                        value={formData.director}
                        onChange={(e) => handleInputChange('director', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter director name"
                    />
                </div>

                {/* Actors */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Actors
                    </label>
                    <input
                        type="text"
                        value={formData.actors}
                        onChange={(e) => handleInputChange('actors', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter actor names (comma separated)"
                    />
                </div>

                {/* Poster URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Poster URL
                    </label>
                    <input
                        type="url"
                        value={formData.posterUrl}
                        onChange={(e) => handleInputChange('posterUrl', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.posterUrl ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://example.com/poster.jpg"
                    />
                    {errors.posterUrl && <p className="text-red-500 text-sm mt-1">{errors.posterUrl}</p>}
                </div>

                {/* Backdrop URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backdrop URL
                    </label>
                    <input
                        type="url"
                        value={formData.backdropUrl}
                        onChange={(e) => handleInputChange('backdropUrl', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.backdropUrl ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://example.com/backdrop.jpg"
                    />
                    {errors.backdropUrl && <p className="text-red-500 text-sm mt-1">{errors.backdropUrl}</p>}
                </div>

                {/* Trailer URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trailer URL
                    </label>
                    <input
                        type="url"
                        value={formData.trailerUrl}
                        onChange={(e) => handleInputChange('trailerUrl', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.trailerUrl ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://youtube.com/watch?v=..."
                    />
                    {errors.trailerUrl && <p className="text-red-500 text-sm mt-1">{errors.trailerUrl}</p>}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter movie description"
                />
            </div>

            {/* Genres */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genres *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {genres.map(genre => (
                        <label key={genre.id} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={(formData.genreIds || []).includes(genre.id)}
                                onChange={() => handleGenreToggle(genre.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{genre.name}</span>
                        </label>
                    ))}
                </div>
                {errors.genreIds && <p className="text-red-500 text-sm mt-1">{errors.genreIds}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : movie ? 'Update Movie' : 'Create Movie'}
                </button>
            </div>
        </form>
    );
}
