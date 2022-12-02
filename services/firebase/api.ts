import { generalRoomId } from './../../components/GameBoard/helpers/order'
import { Players } from './../../components/GameBoard/constant/index'
import { MemberType } from './../reduxjs/reducers/game'
import { Move } from 'chess.js'
import {
	collection,
	doc,
	DocumentData,
	getDocs,
	onSnapshot,
	query,
	setDoc,
	updateDoc,
	where,
} from 'firebase/firestore'
import { db, auth } from '../firebase'

export interface RoomData {
	isReady: boolean
	isFinish: boolean
	move: Move | string | null
	members: MemberType[]
	id: string
}

export async function getRooms(handleError?: (error: any) => void) {
	try {
		let data: DocumentData[] = []
		const q = query(collection(db, 'Rooms'), where('isReady', '==', false))
		const querySnapshot = await getDocs(q)
		querySnapshot.forEach((doc) => doc && data.push(doc.data()))
		return data
	} catch (error) {
		handleError && handleError(error)
	}
}

export async function createNewRooms(handleError?: (error: any) => void) {
	try {
		const user = auth.currentUser
		if (!user) throw 'Chua dang nhap'
		const roomId = generalRoomId()

		const data: RoomData = {
			id: roomId,
			isReady: false,
			isFinish: false,
			members: [
				{
					name: user.displayName,
					uid: user.uid,
					photoURL: user.photoURL,
					color: Players[Math.floor(Math.random() * 2)],
				},
			],
			move: null,
		}
		const ref = doc(db, 'Rooms', roomId)
		await setDoc(ref, data)
		return data
	} catch (error) {
		handleError && handleError(error)
		return undefined
	}
}

export async function updateRoom(
	roomId: string | undefined,
	data: any,
	handleError?: (error: any) => void
) {
	try {
		if (!roomId || !data) throw 'Lỗi không xác định...'
		const ref = doc(db, 'Rooms', roomId)
		return await updateDoc(ref, data)
	} catch (error) {
		return handleError && handleError(error)
	}
}

export async function addMemberRoom(
	roomId: string,
	data: any,
	handleError?: (error: any) => void
) {
	try {
		await updateDoc(doc(db, 'Rooms', roomId), data)
	} catch (error) {
		handleError && handleError(error)
	}
}

export async function snapshotRoom(
	roomId: string,
	getData: (data: DocumentData | RoomData| undefined) => void,
	handleError?: (error: any) => void
) {
	try {
		onSnapshot(doc(db, 'Rooms', roomId), (result) => {
			const data = result.data()
			getData(data)
		})
	} catch (error) {
		handleError && handleError(error)
	}
}
