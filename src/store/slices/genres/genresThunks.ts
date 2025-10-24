import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    getGenresApi,
    createGenreApi,
    updateGenreApi,
    deleteGenreApi,
} from '@/service/services/genreService'
import {
    GenreResponse,
    CreateGenreRequest,
    UpdateGenreRequest,
} from '@/models/movie'

// Fetch all genres
export const fetchGenres = createAsyncThunk<GenreResponse[], void>(
    'genres/fetchGenres',
    async (_, { rejectWithValue }) => {
        try {
            return await getGenresApi()
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to fetch genres'
            return rejectWithValue(message) as any
        }
    }
)

// Create a new genre
export const createGenre = createAsyncThunk<GenreResponse, CreateGenreRequest>(
    'genres/createGenre',
    async (data, { rejectWithValue }) => {
        try {
            return await createGenreApi(data)
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to create genre'
            return rejectWithValue(message) as any
        }
    }
)

// Update genre
export const updateGenre = createAsyncThunk<
    GenreResponse,
    { id: string; data: UpdateGenreRequest }
>('genres/updateGenre', async ({ id, data }, { rejectWithValue }) => {
    try {
        return await updateGenreApi(id, data)
    } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || 'Failed to update genre'
        return rejectWithValue(message) as any
    }
})

// Delete genre
export const deleteGenre = createAsyncThunk<string, string>(
    'genres/deleteGenre',
    async (id, { rejectWithValue }) => {
        try {
            await deleteGenreApi(id)
            return id
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to delete genre'
            return rejectWithValue(message) as any
        }
    }
)
