import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { 
  MovieListResponse, 
  MovieResponse, 
  MovieSearchParams, 
  CreateMovieRequest, 
  UpdateMovieRequest,
  MovieStatus,
  GenreResponse
} from '@/models/movie'
import { 
  getMoviesApi, 
  createMovieApi, 
  updateMovieApi, 
  deleteMovieApi, 
  changeMovieStatusApi,
  getMovieStatsApi
} from '@/service/services/movieService'
import { getGenresApi } from '@/service/services/genreService'

export interface MoviesState {
    items: MovieResponse[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    loading: boolean
    error: string | null
    lastQuery: MovieSearchParams | null  //Lưu lại bộ lọc cuối cùng (vd: thể loại, tên phim, trang, etc.), sau này refresh truyền vào.
    genres: GenreResponse[]
    stats: {
        totalMovies: number
        draftMovies: number
        comingSoonMovies: number
        nowShowingMovies: number
        archivedMovies: number
    } | null
    selectedMovie: MovieResponse | null
}

const initialState: MoviesState = {
    items: [],
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    loading: false,
    error: null,
    lastQuery: null,
    genres: [],
    stats: null,
    selectedMovie: null,
}

/**
 * Async thunk for fetching movies
 * 
 * USAGE WITH UNWRAP():
 * 
 * // Basic usage
 * try {
 *   const movieData = await dispatch(fetchMovies(params)).unwrap()
 *   console.log('Movies:', movieData.items)
 * } catch (error) {
 *   console.error('Error:', error) // error is the rejected value
 * }
 * 
 * // Chaining operations
 * try {
 *   const data = await dispatch(fetchMovies(params)).unwrap()
 *   const processedData = await dispatch(processMovies(data)).unwrap()
 * } catch (error) {
 *   // Handle any error from either operation
 * }
 * 
 * // Conditional operations
 * try {
 *   const movieData = await dispatch(fetchMovies(params)).unwrap()
 *   if (movieData.items.length === 0) {
 *     // Handle empty results
 *   }
 * } catch (error) {
 *   // Handle API errors
 * }
 */
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

/**
 * Get all genres
 */
export const fetchGenres = createAsyncThunk<GenreResponse[], void>(
    'movies/fetchGenres',
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

//Gom reducer + action vào một “slice” duy nhất
const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload
        },
        setPageSize(state, action: PayloadAction<number>) {
            state.pageSize = action.payload
        },
        clearError(state) {
            state.error = null
        },
        setSelectedMovie(state, action: PayloadAction<MovieResponse | null>) {
            state.selectedMovie = action.payload
        },
        clearSelectedMovie(state) {
            state.selectedMovie = null
        },
    },
    //xử lý kết quả của createAsyncThunk
    extraReducers: (builder) => {
        builder  //Builder "xây dựng" danh sách các action handler// .addCase(Loại action, hàm xử lý)
            // Fetch Movies
            .addCase(fetchMovies.pending, (state, action) => {
                state.loading = true
                state.error = null
                state.lastQuery = (action.meta.arg as MovieSearchParams | undefined) ?? null
                //meta là nơi Redux Toolkit lưu thông tin phụ (metadata) của action.
                // arg chính là tham số bạn truyền cho thunk khi dispatch.
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload.items
                state.page = action.payload.page
                state.pageSize = action.payload.pageSize
                state.totalItems = action.payload.totalItems
                state.totalPages = action.payload.totalPages
                console.log("State", state)
                console.log("ACTION", action)
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Unknown error'
            })
            
            // Create Movie
            .addCase(createMovie.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createMovie.fulfilled, (state, action) => {
                state.loading = false
                state.items.unshift(action.payload) // Add to beginning of list
                state.totalItems += 1
            })
            .addCase(createMovie.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Failed to create movie'
            })
            
            // Update Movie
            .addCase(updateMovie.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateMovie.fulfilled, (state, action) => {
                state.loading = false
                const index = state.items.findIndex(movie => movie.id === action.payload.id)
                if (index !== -1) {
                    state.items[index] = action.payload
                }
                if (state.selectedMovie?.id === action.payload.id) {
                    state.selectedMovie = action.payload
                }
            })
            .addCase(updateMovie.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Failed to update movie'
            })
            
            // Delete Movie
            .addCase(deleteMovie.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteMovie.fulfilled, (state, action) => {
                state.loading = false
                state.items = state.items.filter(movie => movie.id !== action.payload)
                state.totalItems -= 1
                if (state.selectedMovie?.id === action.payload) {
                    state.selectedMovie = null
                }
            })
            .addCase(deleteMovie.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Failed to delete movie'
            })
            
            // Change Movie Status
            .addCase(changeMovieStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(changeMovieStatus.fulfilled, (state, action) => {
                state.loading = false
                const index = state.items.findIndex(movie => movie.id === action.payload.id)
                if (index !== -1) {
                    state.items[index] = action.payload
                }
                if (state.selectedMovie?.id === action.payload.id) {
                    state.selectedMovie = action.payload
                }
            })
            .addCase(changeMovieStatus.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Failed to change movie status'
            })
            
            // Fetch Movie Stats
            .addCase(fetchMovieStats.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMovieStats.fulfilled, (state, action) => {
                state.loading = false
                state.stats = action.payload
            })
            .addCase(fetchMovieStats.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Failed to fetch movie stats'
            })
            
            // Fetch Genres
            .addCase(fetchGenres.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.loading = false
                state.genres = action.payload
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Failed to fetch genres'
            })
    }
})

export const { 
    setPage, 
    setPageSize, 
    clearError, 
    setSelectedMovie, 
    clearSelectedMovie 
} = moviesSlice.actions

console.log("Slice", moviesSlice)
export default moviesSlice.reducer

