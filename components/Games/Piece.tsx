import { Color, Square } from 'chess.js'
import Image from 'next/image'
import React from 'react'
import { transform } from 'typescript'
import { PIECES } from '../../configs'
import { getTransition, Position, useBaseSize } from '../../helpers/order'
import styles from '../../styles/Game.module.css'

interface PropsType {
	startPos: Position
	id: ReturnType<typeof require>
	home: Color | undefined
	onChooseSquare: (value: Position) => void
	disabled: boolean
	moveTo: Square | undefined
	onMoved: () => void
	squareSize: number
}

function Piece({
	startPos: { x, y },
	id,
	home,
	disabled,
	moveTo,
	squareSize,
	onChooseSquare,
	onMoved,
}: PropsType) {
	const idEl = `${id}-${x}-${y}`

	React.useEffect(() => {
		let timeout: NodeJS.Timeout
		if (moveTo) {
			const el = document.querySelector(`#${idEl}`)
			if (!el) return
			const { transformX, transformY } = getTransition(moveTo, squareSize)
			const offset = {
				x: x * squareSize,
				y: y * squareSize,
			}
			timeout = setTimeout(() => onMoved(), 500)
			el.animate(
				[
					{
						transform: `translate(${transformX - offset.x}px, ${
							transformY - offset.y
						}px)`,
					},
				],
				{ duration: 500, fill: 'forwards' }
			)
		}

		return () => clearTimeout(timeout)
	}, [moveTo])

	return (
		<button
			style={{
				width: `${squareSize}px`,
				height: `${squareSize}px`,
				position: 'absolute',
				top: `${y * squareSize}px`,
				left: `${x * squareSize}px`,
				backgroundColor: moveTo ? 'orange' : 'transparent',
				boxShadow: 'none',
				borderRadius: 0,
				zIndex: moveTo ? 50 : 10,
			}}
			id={idEl}
			className={styles.square}
			onClick={() => onChooseSquare({ x, y })}
			disabled={disabled}
		>
			<Image
				src={PIECES[id]}
				alt="piece"
				style={{
					width: squareSize - 20,
					height: squareSize - 20,
					transform: home == 'b' ? 'rotate(180deg)' : 'rotate(0deg)',
				}}
				priority={true}
			/>
		</button>
	)
}

export default React.memo(Piece)
