import React from 'react'
import RenderPlayer from './RenderPlayer'
import styles from '../styles/MatchPlayer.module.css'
import { useSelector } from 'react-redux'
import { RootState } from '../services/reduxjs'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { getWaitingRooms } from '../services/firebase/api'

function MatchPlayer() {
	const { home } = useSelector((state: RootState) => state.game_state)

	React.useEffect(() => {
		;(async function () {
			const listWaitingRooms = await getWaitingRooms((error) =>
				console.log('Get Waiting Rooms error ::: ', error)
			)
			console.log(listWaitingRooms)
		})()
	}, [])

	return (
		<div className={styles.container}>
			<RenderPlayer photoUrl={home?.photoURL} title={home?.name} />
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

export default MatchPlayer
