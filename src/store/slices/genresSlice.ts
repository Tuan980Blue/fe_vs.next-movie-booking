import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { 
  GenreResponse, 
  CreateGenreRequest, 
  UpdateGenreRequest 
} from '@/models/movie'
import { 
  getGenresApi, 
  createGenreApi, 
  updateGenreApi, 
  deleteGenreApi 
} from '@/service/services/genreService'

export interface GenresState {
    items: GenreResponse[]
    loading: boolean
    error: string | null
    selectedGenre: GenreResponse | null
    searchKeyword: string
}

const initialState: GenresState = {
    items: [],
    loading: false,
    error: null,
    selectedGenre: null,
    searchKeyword: '',
}

/**
 * Async thunk for fetching all genres
 * 
 * USAGE WITH UNWRAP():
 * 
 * // Basic usage
 * try {
 *   const genres = await dispatch(fetchGenres()).unwrap()
 *   console.log('Genres:', genres)
 * } catch (error) {
 *   console.error('Error:', error) // error is the rejected value
 * }
 */
export const fetchGenres = createAsyncThunk<GenreResponse[], void>(
    'genres/fetchGenres',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getGenresApi()
            return response
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to fetch genres'
            return rejectWithValue(message) as any
        }
    }
)

/**
 * Create a new genre (Admin only)
 */
export const createGenre = createAsyncThunk<GenreResponse, CreateGenreRequest>(
    'genres/createGenre',
    async (genreData, { rejectWithValue }) => {
        try {
            const response = await createGenreApi(genreData)
            return response
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to create genre'
            return rejectWithValue(message) as any
        }
    }
)

/**
 * Update an existing genre (Admin only)
 */
export const updateGenre = createAsyncThunk<GenreResponse, { id: string; data: UpdateGenreRequest }>(
    'genres/updateGenre',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateGenreApi(id, data)
            return response
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to update genre'
            return rejectWithValue(message) as any
        }
    }
)

/**
 * Delete a genre (Admin only)
 */
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

const genresSlice = createSlice({
    name: 'genres',
    initialState,
    reducers: {
        setSearchKeyword(state, action: PayloadAction<string>) {
            state.searchKeyword = action.payload
        },
        setSelectedGenre(state, action: PayloadAction<GenreResponse | null>) {
            state.selectedGenre = action.payload
        },
        clearSelectedGenre(state) {
            state.selectedGenre = null
        },
        clearError(state) {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Genres
            .addCase(fetchGenres.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Failed to fetch genres'
            })
            
            // Create Genre
            .addCase(createGenre.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createGenre.fulfilled, (state, action) => {
                state.loading = false
                state.items.unshift(action.payload) // Add to beginning of list
            })
            .addCase(createGenre.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Failed to create genre'
            })
            
            // Update Genre
            .addCase(updateGenre.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateGenre.fulfilled, (state, action) => {
                state.loading = false
                const index = state.items.findIndex(genre => genre.id === action.payload.id)
                if (index !== -1) {
                    state.items[index] = action.payload
                }
                if (state.selectedGenre?.id === action.payload.id) {
                    state.selectedGenre = action.payload
                }
            })
            .addCase(updateGenre.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Failed to update genre'
            })
            
            // Delete Genre
            .addCase(deleteGenre.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteGenre.fulfilled, (state, action) => {
                state.loading = false
                state.items = state.items.filter(genre => genre.id !== action.payload)
                if (state.selectedGenre?.id === action.payload) {
                    state.selectedGenre = null
                }
            })
            .addCase(deleteGenre.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Failed to delete genre'
            })
            
            // Sync from other tab
            .addCase('SYNC_FROM_OTHER_TAB', (state, action: any) => {
                if (action.payload?.genres) {
                    return action.payload.genres
                }
            })
    }
})

export const { 
    setSearchKeyword, 
    setSelectedGenre, 
    clearSelectedGenre, 
    clearError 
} = genresSlice.actions

export default genresSlice.reducer
