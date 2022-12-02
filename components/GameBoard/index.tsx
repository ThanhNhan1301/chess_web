import { Chess, Color, PieceSymbol, Square } from 'chess.js'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { snapshotRoom, updateRoom } from '../../services/firebase/api'
import { RootState } from '../../services/reduxjs'
import { addGame, initialRoomValue } from '../../services/reduxjs/reducers/game'
import ModalGameOver from '../Modals/ModalGameOver'
import ModalPromotion from '../Modals/ModalPromotion'
import BoardChess from './components/BoardChess'
import Piece from './components/Piece'
import { useCont, useDimensions } from './helpers/order'
import styles from './styles.module.scss'

interface GameType {
	board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
	turn: Color
	state: {
		isGameOver: boolean
		isCheck: boolean
	}
}

function GameBoard() {
	const { home, away, homeColor, roomId } = useSelector(
		(state: RootState) => state.game_state
	)
	const [move, setMove] = useState<
		| {
				from?: Square
				to?: Square
				promotion?: { type?: PieceSymbol; active: boolean }
		  }
		| undefined
	>()

	const { width } = useDimensions()
	const boardSize = width > 450 ? 450 : width - 20
	const squareSize = boardSize / 8

	const dispatch = useDispatch()

	const chess: Chess = useCont(new Chess())

	const [game, setGame] = useState<GameType>({
		board: chess.board(),
		turn: chess.turn(),
		state: {
			isGameOver: chess.isGameOver(),
			isCheck: chess.isCheck(),
		},
	})

	const updateGame = useCallback(() => {
		setMove(undefined)
		setGame({
			board: chess.board(),
			turn: chess.turn(),
			state: {
				isGameOver: chess.isGameOver(),
				isCheck: chess.isCheck(),
			},
		})
	}, [chess])

	// Xử lý di chuyển + cập nhật game
	const handleMovePiece = useCallback(async () => {
		if (move && move.from && move.to) {
			if (move.promotion?.active) return

			const newMove = chess.move(
				{
					from: move.from,
					to: move.to,
					promotion: move?.promotion?.type,
				},
				{ sloppy: true }
			)
			updateGame()
			await updateRoom(roomId, { move: newMove }, (error) =>
				console.log('Update Game Error::: ', error)
			)
		}
	}, [chess, move, roomId, updateGame])

	// Xử lý chọn ô cờ
	const handleChooseSquare = useCallback(
		(squareId: Square) => {
			const piece = chess.get(squareId)
			if (piece && piece.color == homeColor) {
				return setMove({ from: squareId })
			}

			if (move?.from) {
				const beMove = move.from
					? chess
							.moves({ square: move.from })
							.some((move) => move.toString().includes(squareId))
					: false
				if (beMove) {
					const pieceChoose = chess.get(move.from)
					if (
						pieceChoose &&
						pieceChoose.type == 'p' &&
						['1', '8'].includes(squareId[1])
					) {
						return setMove({
							...move,
							to: squareId,
							promotion: { active: true },
						})
					} else {
						return setMove({ ...move, to: squareId })
					}
				}
			}
			return setMove(undefined)
		},
		[move, chess, homeColor]
	)

	const handleOnChoosePromotion = useCallback(
		async (type: PieceSymbol) => {
			if (move?.from && move?.to && type) {
				const newMove = chess.move({
					from: move.from,
					to: move.to,
					promotion: type,
				})
				updateGame()
				await updateRoom(roomId, { move: newMove }, (error) =>
					console.log('Update Game Error::: ', error)
				)
			}
		},
		[move, chess, updateGame, roomId]
	)

	const updatePoint = useCallback(async () => {
		//handle update point game, up level,
		await updateRoom(roomId, { isFinish: true }, (error) =>
			console.log('Update Game Error::: ', error)
		)
	}, [roomId])

	const handleFinish = useCallback(() => {
		chess.reset()
		updateGame()
		updatePoint()
		dispatch(addGame(initialRoomValue))
	}, [chess, updateGame, updatePoint, dispatch])

	// Lấy dữ liệu nước đi của người chơi
	useEffect(() => {
		if (roomId) {
			snapshotRoom(
				roomId,
				(data) => {
					if (!data) return dispatch(addGame(initialRoomValue))
					if (data.move && data.move.color != homeColor) {
						return setMove({
							from: data.move.from,
							to: data.move.to,
							promotion: { active: false, type: data?.move?.promotion },
						})
					}
				},
				(error) => console.log('Listen room data::: ', error)
			)
		}
	}, [roomId, homeColor, dispatch])

	return (
		<>
			{game.state.isGameOver ? (
				<ModalGameOver turn={game.turn} handleFinish={handleFinish} />
			) : null}
			<div
				className={styles.board}
				style={{
					width: `${boardSize}px`,
					height: `${boardSize}px`,
					transform: homeColor == 'w' ? 'rotate(0deg)' : 'rotate(180deg)',
				}}
			>
				{move?.promotion?.active ? (
					<ModalPromotion
						handleOnChoosePromotion={handleOnChoosePromotion}
						size={boardSize * 0.9}
					/>
				) : null}
				<BoardChess
					board={game.board}
					size={squareSize}
					onClick={handleChooseSquare}
					choose={move?.from}
					suggests={move?.from ? chess.moves({ square: move.from }) : undefined}
					turn={game.turn}
					isCheck={game.state.isCheck}
				/>
				{game.board.map((row, y) =>
					row.map((piece, x) =>
						piece ? (
							<Piece
								squareId={piece.square}
								key={piece.square}
								size={squareSize}
								position={{ x, y }}
								move={move}
								id={`${piece.color}${piece.type}`}
								disabled={game.turn != homeColor}
								onClick={handleChooseSquare}
								onMoved={handleMovePiece}
							/>
						) : null
					)
				)}
			</div>
		</>
	)
}

export default GameBoard
