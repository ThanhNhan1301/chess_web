import { useRouter } from 'next/router'
import React from 'react'
import { AiFillCloseSquare } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { setTimeout } from 'timers/promises'
import { MemberName } from 'typescript'
import MatchPlayer from '../components/MatchPlayer'
import PlayFriend from '../components/PlayFriend'
import { useGeneralRoomId } from '../helpers/order'
import { auth } from '../services/firebase'
import {
	addMemberInWaitingRoom,
	createRoomPlaying,
	createWaitingRoom,
	deleteRoom,
	getWaitingRooms,
	listenWaitingRoom,
} from '../services/firebase/api'

import { RootState } from '../services/reduxjs'
import { addGame, MemberType } from '../services/reduxjs/reducers/game'
import styles from '../styles/Home.module.css'

function Home() {
	const gameState = useSelector((state: RootState) => state.game_state)
	const [mode, setMode] = React.useState<'friend' | 'match' | undefined>()
	const [roomId, setRoomId] = React.useState<string | undefined>()
	const router = useRouter()
	const dispatch = useDispatch()
	const user = auth.currentUser

	const handleMatchPlayer = async function () {
		const listWaitingRooms = await getWaitingRooms()
		if (listWaitingRooms?.length) {
			const { roomId } =
				listWaitingRooms[Math.floor(Math.random() * listWaitingRooms.length)]
			setRoomId(roomId)
		} else {
			const id = useGeneralRoomId()
			await createWaitingRoom(id, (error) =>
				console.log('Error create Waiting Room::: ', error)
			)
			setRoomId(id)
		}
	}

	React.useEffect(() => {
		if (user) {
			dispatch(
				addGame({
					...gameState,
					home: {
						name: user.displayName,
						uid: user.uid,
						photoURL: user.photoURL,
					},
				})
			)
		}
	}, [dispatch, user])

	React.useEffect(() => {
		if (gameState.roomId) {
			setMode(undefined)
			setRoomId(undefined)
			router.push('/game')
		}
	}, [gameState.roomId])

	React.useEffect(() => {
		let timeout
		if (mode) {
			if (mode == 'match') {
				handleMatchPlayer()
			}
		}
	}, [mode, roomId])

	React.useEffect(() => {
		if (roomId && user) {
			listenWaitingRoom(roomId, async (data) => {
				if (data) {
					const members = data.members as MemberType[]
					if (members.length == 2) {
						const away = members.filter((m: MemberType) => m.uid != user.uid)[0]
						const home = members.filter((m: MemberType) => m.uid == user.uid)[0]
						if (members[0].uid == user.uid) {
							await createRoomPlaying(roomId, {
								members,
								roomId,
								move: null,
								isFinish: false,
							})
						} else {
							await deleteRoom(roomId, 'WaitingRooms', (error) =>
								console.log('Delete waiting room error::: ', error)
							)
						}
						dispatch(
							addGame({
								home,
								away,
								roomId,
								homeColor: home.color,
							})
						)
					} else {
						if (members[0].uid != user.uid) {
							await addMemberInWaitingRoom(roomId, {
								members: [
									...members,
									{
										name: user.displayName,
										uid: user.uid,
										photoURL: user.photoURL,
										color: members[0] && members[0].color == 'w' ? 'b' : 'w',
									},
								],
								isReady: true,
							})
						}
					}
				}
			})
		}
	}, [roomId])

	return (
		<div className={styles.container}>
			{mode && (
				<div className={styles.modal}>
					<div className={styles.modal_content}>
						<AiFillCloseSquare
							className={styles.btnClose}
							size={36}
							color="red"
							onClick={() => setMode(undefined)}
						/>
						{mode == 'friend' ? <PlayFriend /> : <MatchPlayer />}
					</div>
				</div>
			)}

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
