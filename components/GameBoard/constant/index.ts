import { PieceSymbol, Color } from 'chess.js'

export const COLORS_BOARD = ['white', '#6D9886', '#C69749']

export type PieceIdType = `${Color}${PieceSymbol}`

export const Players: Color[] = ['w', 'b']

export const PIECES: Record<PieceIdType | any, ReturnType<typeof require>> = {
	br: require('../assets/pieces/br.png'),
	bn: require('../assets/pieces/bn.png'),
	bb: require('../assets/pieces/bb.png'),
	bq: require('../assets/pieces/bq.png'),
	bk: require('../assets/pieces/bk.png'),
	bp: require('../assets/pieces/bp.png'),
	wr: require('../assets/pieces/wr.png'),
	wn: require('../assets/pieces/wn.png'),
	wb: require('../assets/pieces/wb.png'),
	wq: require('../assets/pieces/wq.png'),
	wk: require('../assets/pieces/wk.png'),
	wp: require('../assets/pieces/wp.png'),
}

export const PROMOTIONS: PieceSymbol[] = ['q', 'r', 'n', 'b']
