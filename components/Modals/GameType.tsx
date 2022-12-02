import Image from 'next/image'
import { useEffect } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { auth } from '../../services/firebase'
import styles from '../../styles/modal.module.scss'

interface PropsType {
	type: 'match-player' | 'match-friend' | undefined
}

function MatchFriend() {
	return <div>Match Friend</div>
}

function MatchPlayer() {
	const user = auth.currentUser
	if (!user) return null
	const photoURL = user.photoURL as ReturnType<typeof require>
	return (
		<div className={styles.matchPlayer}>
			<div className={styles.matchPlayer_userInfo}>
				<Image
					src={photoURL}
					alt="image_user"
					width={80}
					height={80}
					priority={true}
					className={styles.matchPlayer_userInfo_image}
				/>
				<span className={styles.matchPlayer_userInfo_name}>
					{user.displayName}
				</span>
			</div>
			<div className={styles.loading}>
				<div className={styles.loading_wrapper}>
					<AiOutlineLoading3Quarters
						size={26}
						color="green"
						className={styles.loading_icon}
					/>
				</div>
			</div>
			<div className={styles.matchPlayer_userInfo}>
				<Image
					src={'/k-image.jpg'}
					alt="image_user"
					width={80}
					height={80}
					priority={true}
					className={styles.matchPlayer_userInfo_image}
				/>
				<span className={styles.matchPlayer_userInfo_name}>
					{user.displayName}
				</span>
			</div>
		</div>
	)
}

function GameType({ type }: PropsType) {
	if (!type) return null

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				{type == 'match-friend' ? <MatchFriend /> : <MatchPlayer />}
			</div>
		</div>
	)
}

export default GameType
