import { PieceSymbol, Color } from 'chess.js'

export const COLORS_BOARD = ['white', '#6D9886', '#C69749']

export type PieceIdType = `${Color}${PieceSymbol}`

export const Players: Color[] = ['w', 'b']

export const PIECES: Record<PieceIdType | any, ReturnType<typeof require>> = {
	br: require('../assets/chess/prices/br.png'),
	bn: require('../assets/chess/prices/bn.png'),
	bb: require('../assets/chess/prices/bb.png'),
	bq: require('../assets/chess/prices/bq.png'),
	bk: require('../assets/chess/prices/bk.png'),
	bp: require('../assets/chess/prices/bp.png'),
	wr: require('../assets/chess/prices/wr.png'),
	wn: require('../assets/chess/prices/wn.png'),
	wb: require('../assets/chess/prices/wb.png'),
	wq: require('../assets/chess/prices/wq.png'),
	wk: require('../assets/chess/prices/wk.png'),
	wp: require('../assets/chess/prices/wp.png'),
}

export const PROMOTIONS: PieceSymbol[] = ['q', 'r', 'n', 'b']
