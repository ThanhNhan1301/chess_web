import React from 'react'
import { useDispatch } from 'react-redux'
import ModalModeGame from '../components/Modals/ModalModeGame'
import { auth } from '../services/firebase'
import { addGame } from '../services/reduxjs/reducers/game'
import styles from '../styles/Home.module.css'

function Home() {
	const [mode, setMode] = React.useState<'friend' | 'match' | undefined>()
	const dispatch = useDispatch()

	React.useEffect(() => {
		const user = auth.currentUser
		if (user) {
			dispatch(
				addGame({
					roomId: undefined,
					home: {
						name: user.displayName,
						photoURL: user.photoURL,
						uid: user.uid,
					},
				})
			)
		}
	}, [dispatch])

	return (
		<div className={styles.container}>
			<ModalModeGame type={mode} onClose={() => setMode(undefined)} />
			<button
				className={styles.btnPlayWithFriends}
				onClick={() => setMode('friend')}
			>
				Chơi với bạn bè
			</button>
			<button
				className={styles.btnPlayMatchPlayer}
				onClick={() => setMode('match')}
			>
				Tìm người chơi
			</button>
		</div>
	)
}

export default Home
