import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../services/reduxjs'
import '../styles/globals.css'
import { auth } from '../services/firebase'

export default function App({ Component, pageProps, router }: AppProps) {
	useEffect(() => {
		auth.onAuthStateChanged((user) =>
			user ? router.push('/') : router.push('/signin')
		)
	}, [])

	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	)
}
