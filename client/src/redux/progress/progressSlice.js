import { createSlice } from '@reduxjs/toolkit'

export const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    value: 0,
  },
  reducers: {
    setProgress: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { setProgress } = progressSlice.actions

export default progressSlice.reducer