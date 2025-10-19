import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MovieListResponse, MovieResponse, MovieSearchParams } from '@/models/movie'
import { getMoviesApi } from '@/service/services/movieService'

export interface MoviesState {
    items: MovieResponse[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    loading: boolean
    error: string | null
    lastQuery: MovieSearchParams | null  //Lưu lại bộ lọc cuối cùng (vd: thể loại, tên phim, trang, etc.), sau này refresh truyền vào.
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
}

export const fetchMovies = createAsyncThunk<MovieListResponse, MovieSearchParams | undefined>(
    'movies/fetchMovies',
    async (params, { rejectWithValue }) => {
        try {
            const response = await getMoviesApi(params ?? {})
            return response
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to fetch movies'
            //Nếu thất bại → dùng rejectWithValue() để đẩy message vào rejected
            return rejectWithValue(message) as any
        }
    }
)

//Gom reducer + action vào một “slice” duy nhất
const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {  //xử lý các action không liên quan đến side effect
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload
        },
        setPageSize(state, action: PayloadAction<number>) {
            state.pageSize = action.payload
        },
        clearError(state) {
            state.error = null
        },
    },
    //xử lý kết quả của createAsyncThunk
    extraReducers: (builder) => {
        builder  //Builder “xây dựng” danh sách các action handler// .addCase(Loại action, hàm xử lý)
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
    }
})

export const { setPage, setPageSize, clearError } = moviesSlice.actions

export default moviesSlice.reducer

