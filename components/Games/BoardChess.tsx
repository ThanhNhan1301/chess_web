import { Color, Move, PieceSymbol, Square } from 'chess.js'
import React from 'react'
import { useSelector } from 'react-redux'
import { COLORS_BOARD } from '../../configs'
import { Position, getSquareId } from '../../helpers/order'
import { RootState } from '../../services/reduxjs'

interface PropsType {
	board: ({
		square: Square
		type: PieceSymbol
		color: Color
	} | null)[][]
	squareChoose: Square | undefined
	moves: Move[] | String[] | undefined
	squareSize: number
	isCheck: boolean
	onChooseSquare: (value: Position) => void
}

function BoardChess({
	board,
	moves,
	squareSize,
	squareChoose,
	isCheck,
	onChooseSquare,
}: PropsType) {
	const { homeColor } = useSelector((state: RootState) => state.game_state)

	const generalBackgroundColor = React.useCallback(
		({
			x,
			y,
			isChoose,
			isCheck,
		}: {
			x: number
			y: number
			isChoose: boolean
			isCheck: boolean
		}): string => {
			if (isChoose) return 'orange'
			if (isCheck) return 'red'
			return y % 2 == 0 ? COLORS_BOARD[x % 2] : COLORS_BOARD[1 - (x % 2)]
		},
		[]
	)

	return (
		<>
			{board.map((row, y) =>
				row.map((piece, x) => (
					<button
						key={Math.random() * Math.random()}
						style={{
							position: 'relative',
							width: `${squareSize}px`,
							height: `${squareSize}px`,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							boxShadow: 'none',
							borderRadius: 0,
							padding: 0,
							background: generalBackgroundColor({
								x,
								y,
								isChoose: squareChoose
									? squareChoose.includes(getSquareId({ x, y }))
									: false,
								isCheck:
									isCheck && piece?.type == 'k' && homeColor == piece.color,
							}),
						}}
						onClick={() => onChooseSquare({ x, y })}
					>
						{moves &&
							moves.some((m) =>
								m.toString().includes(getSquareId({ x, y }))
							) && (
								<div
									style={{
										width: `${squareSize - 8}px`,
										height: `${squareSize - 8}px`,
										borderRadius: 4,
										position: 'absolute',
										border: `2px solid orange`,
									}}
								/>
							)}
					</button>
				))
			)}
		</>
	)
}

export default React.memo(BoardChess)
