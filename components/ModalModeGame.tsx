import React from 'react'

import { AiFillCloseSquare } from 'react-icons/ai'
import styles from '../styles/Modal.module.css'
import MatchPlayer from './MatchPlayer'
import PlayFriend from './PlayFriend'

interface PropsType {
	type: 'friend' | 'match' | undefined
	onClose: () => void
}

export default function ModalModeGame({ type, onClose }: PropsType) {
	if (!type) return null
	return (
		<div className={styles.modal}>
			<div className={styles.modal_content}>
				<AiFillCloseSquare
					className={styles.btnClose}
					size={36}
					color="red"
					onClick={onClose}
				/>
				{type == 'friend' ? <PlayFriend /> : <MatchPlayer />}
			</div>
		</div>
	)
}
