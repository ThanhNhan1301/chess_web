import Image from 'next/image'
import { useSelector } from 'react-redux'
import { RootState } from '../services/reduxjs'
import styles from '../styles/RenderPlayer.module.css'

interface PropsType {
	photoUrl?: ReturnType<typeof require> | undefined
	title?: string | null | undefined
	isActive?: boolean
	type?: 'home' | 'away'
	layout?: 'vertical' | 'horizontal'
}

function RenderPlayer({
	photoUrl,
	title = '',
	isActive = false,
	type = 'away',
	layout = 'vertical',
}: PropsType) {
	const { home } = useSelector((state: RootState) => state.game_state)
	return (
		<div
			className={`${styles.container} ${type == 'home' && styles.home} ${
				layout == 'vertical' && styles.vertical
			}`}
		>
			<Image
				src={photoUrl || home?.photoURL}
				alt="player"
				width={60}
				height={60}
				className={styles.img}
				priority={true}
			/>
			<span className={`${styles.title} ${isActive && styles.active}`}>
				{title || home?.name}
			</span>
		</div>
	)
}

export default RenderPlayer
