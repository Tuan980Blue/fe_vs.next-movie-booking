import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    CreateMovieRequest,
    MovieListResponse,
    MovieResponse,
    MovieSearchParams,
    MovieStatus,
    UpdateMovieRequest
} from "@/models";
import {
    changeMovieStatusApi,
    createMovieApi,
    deleteMovieApi,
    getMoviesApi,
    getMovieStatsApi,
    updateMovieApi
} from "@/service";

export const fetchMovies = createAsyncThunk<MovieListResponse, MovieSearchParams | undefined>(
    'movies/fetchMovies',
    async (params, { rejectWithValue }) => {
        try {
            const response = await getMoviesApi(params ?? {})
            return response
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to fetch movies'
            //Nếu thất bại → dùng rejectWithValue() để đẩy message vào rejected
            // This message will be available in the catch block when using unwrap()
            return rejectWithValue(message) as any
        }
    }
)

/**
 * Create a new movie (Admin/Manager only)
 */
export const createMovie = createAsyncThunk<MovieResponse, CreateMovieRequest>(
    'movies/createMovie',
    async (movieData, { rejectWithValue }) => {
        try {
            const response = await createMovieApi(movieData)
            return response
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to create movie'
            return rejectWithValue(message) as any
        }
    }
)

/**
 * Update an existing movie (Admin/Manager only)
 */
export const updateMovie = createAsyncThunk<MovieResponse, { id: string; data: UpdateMovieRequest }>(
    'movies/updateMovie',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateMovieApi(id, data)
            return response
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to update movie'
            return rejectWithValue(message) as any
        }
    }
)

/**
 * Delete a movie (Admin only)
 */
export const deleteMovie = createAsyncThunk<string, string>(
    'movies/deleteMovie',
    async (id, { rejectWithValue }) => {
        try {
            await deleteMovieApi(id)
            return id
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to delete movie'
            return rejectWithValue(message) as any
        }
    }
)

/**
 * Change movie status (Admin/Manager only)
 */
export const changeMovieStatus = createAsyncThunk<MovieResponse, { id: string; status: MovieStatus }>(
    'movies/changeMovieStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await changeMovieStatusApi(id, status)
            return response
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to change movie status'
            return rejectWithValue(message) as any
        }
    }
)

/**
 * Get movie statistics (Admin only)
 */
export const fetchMovieStats = createAsyncThunk<any, void>(
    'movies/fetchMovieStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getMovieStatsApi()
            return response
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to fetch movie stats'
            return rejectWithValue(message) as any
        }
    }
)