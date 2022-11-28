import { createSlice } from '@reduxjs/toolkit'
import { Color } from 'chess.js'

export interface MemberType {
	name: string | undefined | null
	uid: string | undefined
	photoURL: ReturnType<typeof require>
	color?: Color
}

interface GameType {
	roomId: string | undefined
	home?: MemberType
	away?: MemberType
	homeColor?: Color
}

export const initialRoomValue: GameType = {
	roomId: undefined,
}

const slice = createSlice({
	name: 'game_state',
	initialState: initialRoomValue,
	reducers: {
		addGame: (state, action: { payload: GameType; type: string }) => {
			return (state = action.payload)
		},
	},
})

export default slice.reducer

export const { addGame } = slice.actions
