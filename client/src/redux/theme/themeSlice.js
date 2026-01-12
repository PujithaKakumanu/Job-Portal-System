import { createSlice } from '@reduxjs/toolkit'

const theme = localStorage.getItem('theme') || 'light'

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    value: theme,
  },
  reducers: {
    toggleTheme: (state) => {
      state.value === 'dark' ? state.value = 'light' : state.value = 'dark'
      localStorage.setItem('theme', state.value)
    },
  },
})

export const { toggleTheme } = themeSlice.actions

export default themeSlice.reducer