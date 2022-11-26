import { Players } from '../../configs'

import {
	getDocs,
	collection,
	query,
	where,
	DocumentData,
	doc,
	setDoc,
	onSnapshot,
	deleteDoc,
	updateDoc,
} from 'firebase/firestore'
import { auth, db } from '../firebase'


export async function getWaitingRooms(handleError?: (error: any) => void) {
	let res: DocumentData[] = []
	try {
		const ref = collection(db, 'WaitingRooms')
		const q = query(ref, where('isReady', '==', false))

		await getDocs(q).then((result) => {
			result.forEach((room) => room && res.push(room.data()))
		})

		return res
	} catch (error: any) {
		handleError && handleError(error)
	}
}

export const createWaitingRoom = async (
	id: string,
	handleError?: (error: any) => void
) => {
	try {
		const user = auth.currentUser
		const data = {
			isReady: false,
			roomId: id,
			members: [
				{
					name: user?.displayName,
					color: Players[Math.floor(Math.random() * Players.length)],
					uid: user?.uid,
					photoURL: user?.photoURL,
				},
			],
		}
		const refRoom = doc(db, 'WaitingRooms', id)
		await setDoc(refRoom, data)
		return data
	} catch (error) {
		console.log(error)
		handleError && handleError(error)
	}
}

export const listenWaitingRoom = (
	roomId: string,
	callback: (data: any) => void
) => {
	let unsubscribe
	if (!roomId) return
	const refWaitingRooms = doc(db, 'WaitingRooms', roomId)
	unsubscribe = onSnapshot(
		refWaitingRooms,
		(result) => callback && callback(result.data())
	)

	return unsubscribe
}

export const listenRoomPlaying = (
	roomId: string,
	callback: (data: any) => void
) => {
	let unsubscribe
	if (!roomId) return
	const refRoomPlaying = doc(db, 'Rooms', roomId)
	unsubscribe = onSnapshot(
		refRoomPlaying,
		(result) => callback && callback(result.data())
	)

	return unsubscribe
}

export const createRoomPlaying = async (
	roomId: string,
	data: any,
	handleError?: (error: any) => void
) => {
	try {
		if (!roomId) return
		const roomRef = doc(db, 'Rooms', roomId)
		await setDoc(roomRef, data)
		return roomId
	} catch (error) {
		handleError && handleError(error)
	}
}

export const deleteRoom = async (
	roomId: string,
	collection: string,
	handleError?: (error: any) => void
) => {
	if (!roomId || !collection) return
	try {
		const refRoom = doc(db, collection, roomId)
		await deleteDoc(refRoom)
	} catch (error) {
		handleError && handleError(error)
	}
}

export const addMemberInWaitingRoom = async (
	roomId: string,
	data: any,
	handleError?: (error: any) => void
) => {
	try {
		if (!roomId || !data) throw 'Error invalid'
		const roomRef = doc(db, 'WaitingRooms', roomId)
		await updateDoc(roomRef, data)
	} catch (error) {
		handleError && handleError(error)
	}
}

export const updateRoom = async (
	roomId: string,
	data: any,
	handleError?: (error: any) => void
) => {
	try {
		if (!roomId || !data) throw 'Error invalid'
		const refRoom = doc(db, 'Rooms', roomId)
		await updateDoc(refRoom, data)
	} catch (error) {
		handleError && handleError(error)
	}
}
