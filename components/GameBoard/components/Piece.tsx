import { Square } from 'chess.js'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { RootState } from '../../../services/reduxjs'
import styles from '../styles.module.scss'
import { PIECES } from '../constant'
import { getSquareId, getTransition, Position } from '../helpers/order'
import { useEffect } from 'react'

interface PropsType {
	size: number
	position: Position
	id: ReturnType<typeof require>
	disabled: boolean
	move: { from?: Square; to?: Square } | undefined
	squareId: Square
	onClick: (squareId: Square) => void
	onMoved: () => void
}

function Piece({
	size,
	position: { x, y },
	id,
	disabled,
	squareId,
	move,
	onClick,
	onMoved,
}: PropsType) {
	const { homeColor } = useSelector((state: RootState) => state.game_state)

	// Xử lý di chuyển quân cờ
	useEffect(() => {
		if (move && move.from && move.to && move.from.includes(squareId)) {
			const el = document.querySelector(`#${squareId}`)
			if (!el) return
			const { transformX, transformY } = getTransition(move.to, size)
			const animation = el.animate(
				[
					{
						transform: `translate(${transformX - x * size}px,${
							transformY - y * size
						}px)`,
					},
				],
				{
					duration: 350,
					fill: 'forwards',
				}
			)
			animation.addEventListener('finish', onMoved)
		}
	}, [move])

	return (
		<button
			id={squareId}
			style={{
				width: `${size}px`,
				height: `${size}px`,
				top: `${y * size}px`,
				left: `${x * size}px`,
				zIndex: move?.to ? 50 : 10,
			}}
			className={`${styles.square} ${styles.piece}`}
			onClick={() => onClick(squareId)}
			disabled={disabled}
		>
			<Image
				src={PIECES[id]}
				alt="image_piece"
				width={size - 16}
				height={size - 16}
				style={{
					transform: homeColor == 'w' ? 'rotate(0deg)' : 'rotate(180deg)',
				}}
			/>
		</button>
	)
}

export default Piece
