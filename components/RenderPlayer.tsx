import Image from 'next/image'
import styles from '../styles/RenderPlayer.module.css'

interface PropsType {
	photoUrl: ReturnType<typeof require> | undefined
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
	return (
		<div
			className={`${styles.container} ${type == 'home' && styles.home} ${
				layout == 'vertical' && styles.vertical
			}`}
		>
			<Image
				src={photoUrl}
				alt="player"
				width={60}
				height={60}
				className={styles.img}
				priority={true}
			/>
			<span className={`${styles.title} ${isActive && styles.active}`}>
				{title}
			</span>
		</div>
	)
}

export default RenderPlayer
