import { Color } from 'chess.js'
import { useSelector } from 'react-redux'
import { RootState } from '../../services/reduxjs'
import styles from '../../styles/gameOver.module.scss'

interface PropsType {
	turn: Color
	handleFinish: () => void
}

function ModalGameOver({ turn, handleFinish }: PropsType) {
	const { homeColor, home, away } = useSelector(
		(state: RootState) => state.game_state
	)
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.heading}>Game Over !!!</div>
				<div className={styles.winner}>
					Winner:{' '}
					<span style={{ color: 'red', fontWeight: '600' }}>
						{turn == homeColor ? home?.name : away?.name}
					</span>
				</div>
				<button className={styles.btn} onClick={handleFinish}>
					Đồng ý
				</button>
			</div>
		</div>
	)
}

export default ModalGameOver
