import { configureStore } from '@reduxjs/toolkit'

//Hàm configureStore là cách tạo store (kho chứa state trung tâm) trong Redux Toolkit.

export const store = configureStore({
    reducer: {
        //// nơi khai báo các slice reducer
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().,
})

export type RootState = ReturnType<typeof store.getState>
//store.getState là một hàm trả về toàn bộ state hiện tại của Redux.
// ReturnType<typeof store.getState> lấy kiểu trả về của hàm đó.

export type AppDispatch = typeof store.dispatch
//store.dispatch là hàm dùng để gửi (dispatch) action tới store.
// typeof store.dispatch lấy kiểu dữ liệu của hàm dispatch này.
// AppDispatch được dùng để đảm bảo bạn có type safety khi gọi dispatch trong TypeScript.