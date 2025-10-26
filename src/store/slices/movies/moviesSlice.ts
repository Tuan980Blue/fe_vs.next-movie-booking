import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  MovieResponse, 
  MovieSearchParams,
} from '@/models/movie'
import { MoviesState } from './moviesTypes'
import {changeMovieStatus, createMovie, deleteMovie, fetchMovies, fetchMovieStats, updateMovie} from './moviesThunks'

const initialState: MoviesState = {
    items: [],
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    loading: false,
    error: null,
    lastQuery: null,
    stats: null,
    selectedMovie: null,
}

//Gom reducer + action vào một “slice” duy nhất
const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setMovies(state, action: PayloadAction<MovieResponse[]>) {
            state.items = action.payload
        },
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
        resetMovies: ()=> ({...initialState}),
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
    }
})

export const {
    setMovies,
    setPage, 
    setPageSize, 
    clearError, 
    setSelectedMovie, 
    clearSelectedMovie,
    resetMovies
} = moviesSlice.actions

export default moviesSlice.reducer

