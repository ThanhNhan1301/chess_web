import type { AppProps } from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import { auth } from '../services/firebase'
import store from '../services/reduxjs'
import '../styles/globals.css'

export default function App({ Component, pageProps, router }: AppProps) {
	React.useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				router.push('/')
			} else {
				router.push('/signin')
			}
		})
		return unsubscribe
	}, [])

	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	)
}
