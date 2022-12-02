import React from 'react'
import styles from '../styles/signin.module.scss'
import { AiOutlineGoogle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { auth } from '../services/firebase'

function Signin() {
	const handleSignin = async () => {
		const provider = new GoogleAuthProvider()
		await signInWithPopup(auth, provider)
	}
	return (
		<div className={styles.container}>
			<button className={styles.btnSignin} onClick={handleSignin}>
				<AiOutlineGoogle size={20} />
				<span>Đăng nhập Google</span>
			</button>
		</div>
	)
}

export default Signin
