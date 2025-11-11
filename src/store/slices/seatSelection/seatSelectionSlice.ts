import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SeatSelectionState = {
    selectedSeatIds: string[]
}

const initialState: SeatSelectionState = {
    selectedSeatIds: [],
}

const seatSelectionSlice = createSlice({
    name: 'seatSelection',
    initialState,
    reducers: {
        setSelectedSeatIds(state, action: PayloadAction<string[]>) {
            state.selectedSeatIds = action.payload
        },
        clearSelectedSeatIds(state) {
            state.selectedSeatIds = []
        },
        toggleSeatId(state, action: PayloadAction<string>) {
            const id = action.payload
            if (state.selectedSeatIds.includes(id)) {
                state.selectedSeatIds = state.selectedSeatIds.filter(x => x !== id)
            } else {
                state.selectedSeatIds = [...state.selectedSeatIds, id]
            }
        },
    },
})

export const { setSelectedSeatIds, clearSelectedSeatIds, toggleSeatId } = seatSelectionSlice.actions
export default seatSelectionSlice.reducer


