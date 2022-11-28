import { Chess, Color, Move, PieceSymbol, Square } from 'chess.js'
import React from 'react'
import { useSelector } from 'react-redux'
import BoardChess from '../components/Games/BoardChess'
import Piece from '../components/Games/Piece'
import RenderPlayer from '../components/RenderPlayer'
import { Position, useBaseSize, useCont, getSquareId } from '../helpers/order'
import { listenRoomPlaying, updateRoom } from '../services/firebase/api'
import { RootState } from '../services/reduxjs'

import styles from '../styles/Game.module.css'

interface GameType {
	board: ({
		square: Square
		type: PieceSymbol
		color: Color
	} | null)[][]
	turn: Color
	state: {
		isGameOver: boolean
		isCheck: boolean
		isPromotion: boolean
	}
}

function Game() {
	const chess: Chess = useCont(new Chess())
	const { homeColor, roomId, home, away } = useSelector(
		(state: RootState) => state.game_state
	)
	const { width } = useBaseSize()
	const boardSize = width > 500 ? 500 : width
	const squareSize = boardSize / 8

	const [game, setGame] = React.useState<GameType>({
		board: chess.board(),
		turn: chess.turn(),
		state: {
			isGameOver: chess.isGameOver(),
			isCheck: chess.isCheck(),
			isPromotion: false,
		},
	})


	const [movePiece, setMovePiece] = React.useState<
		| { from?: Square; to?: Square; moves?: Move[] | string[] | undefined }
		| undefined
	>()

	React.useEffect(() => {
		if (roomId) {
			listenRoomPlaying(roomId, (data) => {
				const move = data.move
				if (move) {
					if (move.color != homeColor) {
						setMovePiece({
							from: move.from,
							to: move.to,
						})
					}
				}
			})
		}
	}, [roomId, homeColor])

	const handleUpdateGame = React.useCallback(() => {
		setGame({
			board: chess.board(),
			turn: chess.turn(),
			state: {
				isGameOver: chess.isGameOver(),
				isCheck: chess.isCheck(),
				isPromotion: false,
			},
		})
	}, [chess])

	const handleChooseSquare = ({ x, y }: Position) => {
		const squareId = getSquareId({ x, y })
		const piece = chess.get(squareId)
		if (piece) {
			if (piece.color == homeColor) {
				return setMovePiece({
					from: squareId,
					moves: chess.moves({ square: squareId }),
				})
			}
		} else {
			if (movePiece?.from) {
				if (movePiece?.to) {
					return setMovePiece(undefined)
				}
			}
		}

		const beMove =
			movePiece?.moves &&
			movePiece.moves.some((m) => m.toString().includes(squareId))
		if (beMove) {
			return setMovePiece({ ...movePiece, to: squareId })
		} else {
			setMovePiece(undefined)
		}
	}

	const onMoved = async () => {
		if (!roomId) return
		if (movePiece && movePiece?.to && movePiece.from) {
			const move = chess.move(
				{ from: movePiece.from, to: movePiece.to },
				{ sloppy: true }
			)
			handleUpdateGame()
			setMovePiece(undefined)
			await updateRoom(roomId, {
				move,
			})
		}
	}

	return (
		<div className={styles.container}>
			<div style={{ padding: '0 10px', width: '100%', marginBottom: '20px' }}>
				<RenderPlayer
					title={away?.name}
					layout="horizontal"
					type="away"
					photoUrl={away?.photoURL}
				/>
			</div>
			<div
				className={styles.boardChess}
				id="board-chess"
				style={{
					width: boardSize,
					height: boardSize,
					transform: homeColor == 'b' ? 'rotate(180deg)' : 'rotate(0deg)',
				}}
			>
				<BoardChess
					board={game.board}
					onChooseSquare={handleChooseSquare}
					moves={movePiece?.moves}
					squareSize={squareSize}
					squareChoose={movePiece?.from}
					isCheck={homeColor == game.turn && game.state.isCheck}
				/>
				{game.board.map((row, y) =>
					row.map((piece, x) =>
						piece ? (
							<Piece
								onChooseSquare={handleChooseSquare}
								key={Math.random() * Math.random()}
								squareSize={squareSize}
								home={homeColor}
								moveTo={
									movePiece?.to &&
									movePiece.from &&
									movePiece.from.includes(getSquareId({ x, y }))
										? movePiece.to
										: undefined
								}
								startPos={{ x, y }}
								id={`${piece.color}${piece.type}`}
								disabled={homeColor != game.turn}
								onMoved={onMoved}
							/>
						) : null
					)
				)}
			</div>
			<div style={{ padding: '0 10px', width: '100%', marginTop: '20px' }}>
				<RenderPlayer title={home?.name} layout="horizontal" type="home" />
			</div>
		</div>
	)
}

export default Game
