import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import styles from '../styles/MatchPlayer.module.css'
import RenderPlayer from './RenderPlayer'

function MatchPlayer() {
	return (
		<div className={styles.container}>
			<RenderPlayer type="home" />
			<div className={styles.space}>
				<div className={styles.line} />
				<div className={styles.loading}>
					<AiOutlineLoading3Quarters
						size={26}
						color="blueviolet"
						className={styles.icon}
					/>
				</div>
			</div>
			<RenderPlayer
				photoUrl="/other/user.png"
				title="Đang tìm người chơi..."
				isActive={true}
			/>
		</div>
	)
}

export default React.memo(MatchPlayer)
