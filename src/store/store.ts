import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from '@/store/slices/moviesSlice'
import genresReducer from '@/store/slices/genresSlice'

//Hàm configureStore là cách tạo store (kho chứa state trung tâm) trong Redux Toolkit.

export const store = configureStore({
    reducer: {
        //// nơi khai báo các slice reducer
        movies: moviesReducer,
        genres: genresReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(),
})

// Types cho toàn ứng dụng
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch