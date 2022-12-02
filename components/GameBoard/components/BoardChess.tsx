import { Color, Move, PieceSymbol, Square } from 'chess.js'
import React from 'react'
import { generalBackgroundColor, getSquareId } from '../helpers/order'
import styles from '../styles.module.scss'
import { useSelector } from 'react-redux'
import { RootState } from '../../../services/reduxjs'

interface PropsType {
	board: ({
		square: Square
		type: PieceSymbol
		color: Color
	} | null)[][]
	size: number
	choose: Square | undefined
	suggests: (Move | string)[] | undefined
	turn: Color
	isCheck: boolean
	onClick: (squareId: Square) => void
}

function BoardChess({
	board,
	size,
	onClick,
	turn,
	suggests,
	choose,
	isCheck,
}: PropsType) {
	const { homeColor } = useSelector((state: RootState) => state.game_state)

	return (
		<>
			{board.map((row, y) =>
				row.map((piece, x) => (
					<button
						key={Math.random() * Math.random()}
						style={{
							width: `${size}px`,
							height: `${size}px`,
							backgroundColor: generalBackgroundColor({
								x,
								y,
								isChoose: choose
									? choose.includes(getSquareId({ x, y }))
									: false,
								isCheck: isCheck && piece?.type == 'k' && piece?.color == turn,
							}),
						}}
						onClick={() => onClick(getSquareId({ x, y }))}
						className={styles.square}
						disabled={homeColor != turn}
					>
						{suggests &&
						suggests.some((suggest) =>
							suggest.toString().includes(getSquareId({ x, y }))
						) ? (
							<div className={styles.suggest} />
						) : null}
					</button>
				))
			)}
		</>
	)
}

export default React.memo(BoardChess)
