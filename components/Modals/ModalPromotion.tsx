import { PieceSymbol } from 'chess.js'
import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../services/reduxjs'
import styles from '../../styles/promotion.module.scss'
import { PIECES, PROMOTIONS } from '../GameBoard/constant'

interface PropsType {
	handleOnChoosePromotion: (type: PieceSymbol) => void
	size: number
}
function ModalPromotion({ handleOnChoosePromotion, size }: PropsType) {
	const { homeColor } = useSelector((state: RootState) => state.game_state)
	const squareSize = (size - 40 * 3) / 4
	return (
		<div className={styles.container}>
			<div
				className={styles.content}
				style={{
					width: `${size}px`,
					transform: homeColor == 'w' ? 'rotate(0deg)' : 'rotate(180deg)',
				}}
			>
				{PROMOTIONS.map((type) => (
					<div
						key={type}
						className={styles.piece}
						style={{
							width: `${squareSize}px`,
							height: `${squareSize}px`,
						}}
						onClick={() => handleOnChoosePromotion(type)}
					>
						<Image
							src={PIECES[`${homeColor}${type}`]}
							alt="promotion"
							width={squareSize - 10}
							height={squareSize - 10}
						/>
					</div>
				))}
			</div>
		</div>
	)
}

export default ModalPromotion
