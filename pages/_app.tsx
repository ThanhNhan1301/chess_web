import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React from 'react'
import { Provider } from 'react-redux'
import { auth } from '../services/firebase'
import store from '../services/reduxjs'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
	const route = useRouter()

	React.useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				route.push('/')
			} else {
				route.push('/signin')
			}
		})
		return unsubscribe
	}, [route])

	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	)
}
