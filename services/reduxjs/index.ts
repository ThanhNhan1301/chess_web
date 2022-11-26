import { configureStore } from '@reduxjs/toolkit'
import gameState from './reducers/game'

const store = configureStore({
	reducer: {
		game_state: gameState,
	},
})

export default store

export type RootState = ReturnType<typeof store.getState>
