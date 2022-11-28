import { useSelector } from 'react-redux'
import { RootState } from '../services/reduxjs'
import { MemberType } from '../services/reduxjs/reducers/game'
import { auth } from '../services/firebase'
import React from 'react'
import { Square } from 'chess.js'
import { COLORS_BOARD } from '../configs'

export interface Position {
	x: number
	y: number
}

export const generalRoomId = (): string => {
	return Math.round((Math.random() + Math.random()) * 100000).toString()
}

export const useBaseSize = () => {
	const [windowSize, setWindowSize] = React.useState<{
		width: number
		height: number
	}>({ width: 0, height: 0 })

	const updateDimensions = () => {
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		})
	}

	React.useEffect(() => {
		updateDimensions()
		window.addEventListener('resize', updateDimensions)
		return () => window.removeEventListener('resize', updateDimensions)
	}, [])

	return windowSize
}

export const useBackgroundColor = ({
	x,
	y,
	isChoose = false,
	isMove = false,
}: {
	x: number
	y: number
	isChoose?: boolean | undefined
	isMove?: boolean | undefined
}) => {
	if (isChoose) return COLORS_BOARD[2]
	if (isMove) return '#ddd'
	return y % 2 == 0 ? COLORS_BOARD[x % 2] : COLORS_BOARD[1 - (x % 2)]
}

export function useCont(initialValue: any) {
	const ref = React.useRef<any>()

	if (!ref.current) {
		ref.current = {
			value: typeof initialValue == 'function' ? initialValue() : initialValue,
		}
	}
	return ref.current.value
}

export const getSquareId = (position: Position): Square => {
	const { x, y } = position
	const symbolX = String.fromCharCode('a'.charCodeAt(0) + x)
	const symbolY = 8 - y
	const squareId: Square = `${symbolX}${symbolY}` as Square
	return squareId
}

export const getTransition = (squareId: Square = 'a1', size: number = 0) => {
	const transformX = (squareId[0].charCodeAt(0) - 'a'.charCodeAt(0)) * size
	const transformY = (8 - Number.parseInt(squareId[1])) * size

	return {
		transformX,
		transformY,
	}
}
