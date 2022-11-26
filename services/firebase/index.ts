import { getApp, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
	apiKey: 'AIzaSyAHRnjRUphD3meLIC9g5IrmclOVYUB80eM',
	authDomain: 'game-592c2.firebaseapp.com',
	projectId: 'game-592c2',
	storageBucket: 'game-592c2.appspot.com',
	messagingSenderId: '305375953080',
	appId: '1:305375953080:web:b98e66bd7e164012c3344d',
	measurementId: 'G-C5MZ89VKQD',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
