import { DocumentData } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GameBoard from '../components/GameBoard'
import ModalGameType from '../components/Modals/GameType'
import ModalGameOver from '../components/Modals/ModalGameOver'
import { auth } from '../services/firebase'
import {
	addMemberRoom,
	createNewRooms,
	getRooms,
	snapshotRoom,
} from '../services/firebase/api'
import { RootState } from '../services/reduxjs'
import game, { addGame, MemberType } from '../services/reduxjs/reducers/game'
import styles from '../styles/home.module.scss'

function Home() {
	const { roomId } = useSelector((state: RootState) => state.game_state)
	const [waiting, setWaiting] = useState<string | undefined>()

	const user = auth.currentUser

	const [gameType, setGameType] = useState<
		'match-friend' | 'match-player' | undefined
	>()

	const dispatch = useDispatch()

	useEffect(() => {
		if (waiting) {
			snapshotRoom(
				waiting,
				(data) => {
					if (data) {
						const { members } = data
						if (members.length == 2) {
							const home = members.filter(
								(member: MemberType) => member.uid == user?.uid
							)[0]

							const away = members.filter(
								(member: MemberType) => member.uid != user?.uid
							)[0]

							dispatch(
								addGame({
									roomId: data.id,
									home,
									away,
									homeColor: home.color,
								})
							)
							setGameType(undefined)
						} else {
							if (members[0].uid != user?.uid) {
								;(async () => {
									const dataUpdate = {
										members: [
											...members,
											{
												name: user?.displayName,
												uid: user?.uid,
												photoURL: user?.photoURL,
												color: members[0].color == 'w' ? 'b' : 'w',
											},
										],
										isReady: true,
									}
									await addMemberRoom(waiting, dataUpdate)
								})()
							}
						}
					}
				},
				(error) => console.log('Listen Room Data Error::: ', error)
			)
		}
	}, [waiting, user?.displayName, user?.photoURL, user?.uid, dispatch])

	useEffect(() => {
		if (gameType == 'match-player') {
			;(async () => {
				const rooms = await getRooms()
				if (rooms?.length) {
					const room =
						rooms.filter(
							(room: DocumentData) => room.members[0].uid == user?.uid
						)[0] || rooms[Math.floor(Math.random() * rooms.length)]
					setWaiting(room.id)
				} else {
					const room = await createNewRooms()
					if (room) {
						setWaiting(room.id)
					}
				}
			})()
		}
	}, [gameType, user?.uid])

	return (
		<>
			{roomId && <div>roomId:: {roomId}</div>}
			<div className={styles.container}>
				{roomId ? (
					<GameBoard />
				) : (
					<div>
						<button className={`${styles.btn} ${styles.btnMatchFriend}`}>
							Chơi với bạn bè
						</button>
						<button
							className={`${styles.btn} ${styles.btnMatchPlayer}`}
							onClick={() => setGameType('match-player')}
						>
							Tìm người chơi
						</button>
					</div>
				)}
				<ModalGameType type={gameType} />
			</div>
		</>
	)
}

export default Home
