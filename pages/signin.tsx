import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth } from '../services/firebase'
import styles from '../styles/Signin.module.css'

function Signin() {
	const handleSignin = React.useCallback(async () => {
		const providerGoogle = new GoogleAuthProvider()
		await signInWithPopup(auth, providerGoogle)
	}, [])
	return (
		<div className={styles.container}>
			<button className={styles.btnSignin} onClick={handleSignin}>
				Đăng nhập Google
			</button>
		</div>
	)
}

export default Signin
