import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './theme/themeSlice'
import progressReducer from './progress/progressSlice'
import userReducer from './user/userSlice'

export default configureStore({
  reducer: {
    theme : themeReducer,
    progress : progressReducer,
    user : userReducer,
  },
})

