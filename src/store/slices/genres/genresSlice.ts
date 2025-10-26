import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GenresState } from './genresTypes'
import { fetchGenres, createGenre, updateGenre, deleteGenre } from './genresThunks'
import { GenreResponse } from '@/models/movie'

const initialState: GenresState = {
    items: [],
    loading: false,
    error: null,
    selectedGenre: null,
    searchKeyword: '',
}

const genresSlice = createSlice({
    name: 'genres',
    initialState,
    reducers: {
        setGenres(state, action: PayloadAction<GenreResponse[]>) {
            state.items = action.payload
        },
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
        resetGenres: () => ({ ...initialState }),
    },
    extraReducers: (builder) => {
        builder
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
                state.error =
                    (action.payload as string) || action.error.message || 'Failed to fetch genres'
            })

            // create
            .addCase(createGenre.pending, (state) => { state.loading = true })
            .addCase(createGenre.fulfilled, (state, action) => {
                state.items.unshift(action.payload)
            })
            .addCase(createGenre.rejected, (state, action) =>{
                state.loading = false
                state.error = action.error.message || 'Failed to create genre'
            })

            // update
            .addCase(updateGenre.pending, (state) => { state.loading = true })
            .addCase(updateGenre.fulfilled, (state, action) => {
                const index = state.items.findIndex((g) => g.id === action.payload.id)
                if (index !== -1) state.items[index] = action.payload
                if (state.selectedGenre?.id === action.payload.id) state.selectedGenre = action.payload
            })
            .addCase(updateGenre.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to create genre'
            })

            // delete
            .addCase(deleteGenre.pending, (state) => { state.loading = true })
            .addCase(deleteGenre.fulfilled, (state, action) => {
                state.items = state.items.filter((g) => g.id !== action.payload)
                if (state.selectedGenre?.id === action.payload) state.selectedGenre = null
            })
            .addCase(deleteGenre.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to create genre'
            })
    },
})

export const {setGenres, setSearchKeyword, setSelectedGenre, clearSelectedGenre, clearError, resetGenres} =
    genresSlice.actions

export default genresSlice.reducer
