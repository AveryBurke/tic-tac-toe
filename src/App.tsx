import React, { useState } from "react";

//types
type Player = 'X' | 'O'
type GridValue = Player | null
type Grid = GridValue[][]
type PlayState = { [key: `r${number}` | `c${number}` | `d${number}`]: { 'X': number, 'O': number } }

//static
const emptyGrid: Grid = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]
const initialPlayState = {
  r0: { X: 0, O: 0 }, c0: { X: 0, O: 0 },
  r1: { X: 0, O: 0 }, c1: { X: 0, O: 0 },
  r2: { X: 0, O: 0 }, c2: { X: 0, O: 0 },
  d0: { X: 0, O: 0 }, d1: { X: 0, O: 0 },
}
const togglePlayer = (player: Player): Player => player === 'O' ? 'X' : 'O'

const app = () => {
  //state
  const [grid, setGrid] = useState<Grid>(emptyGrid)
  const [stateOfPlay, setStateOfPlay] = useState<PlayState>(initialPlayState)
  const [currentPlayer, setCurrentPlayer] = useState<Player>("O")
  const [winner, setWinner] = useState<GridValue>(null)

  const handleReset = () => {
    setGrid(emptyGrid)
    setCurrentPlayer('O')
    setStateOfPlay(initialPlayState)
    setWinner(null)
  }

  const handleClick = (r: number, c: number) => {
    const nextGrid = [...grid.map(row => [...row])]
    nextGrid[r]![c]! = currentPlayer
    setGrid(nextGrid)
    setCurrentPlayer(togglePlayer(currentPlayer))
    updateStateOfPlay(r, c)
  }

  const updateStateOfPlay = (r: number, c: number) => {
    const row: `r${number}` = `r${r}`
    const col: `c${number}` = `c${c}`
    const nextRowCount = stateOfPlay[row]![currentPlayer] + 1
    const nextColCount = stateOfPlay[col]![currentPlayer] + 1
    let antiDiagCount = stateOfPlay['d0']![currentPlayer]
    let diagCount = stateOfPlay['d1']![currentPlayer]
    if (r + c === 2) {
      ++antiDiagCount
    }
    if (r === c) {
      ++diagCount
    }
    if (nextRowCount === 3 || nextColCount === 3 || diagCount === 3 || antiDiagCount === 3) {
      setWinner(currentPlayer)
    }
    setStateOfPlay({
      ...stateOfPlay,
      [row]: {
        ...stateOfPlay[row],
        [currentPlayer]: nextRowCount
      },
      [col]: {
        ...stateOfPlay[col],
        [currentPlayer]: nextColCount
      },
      [`d${0}`]: {
        ...stateOfPlay[`d${0}`],
        [currentPlayer]: antiDiagCount
      },
      [`d${1}`]: {
        ...stateOfPlay[`d${1}`],
        [currentPlayer]: diagCount
      }
    })
  }


  return (
    <div className="gridContainer">
      <div className="playerWindow">{winner ? winner + " wins!" : currentPlayer + "'s turn"}</div>
      {grid.map((row, r) => {
        return <div key={`row${r}`} className='row'>{
          row.map((value, c) => {
            return <div
              key={`${r},${c}`}
              className={`cell ${value || winner ? '' : 'clickable'}`}
              onClick={() => {
                //don't allow a click event if the cell is filled or if there is a winner
                if (!value && !winner) {
                  handleClick(r, c)
                }
              }}
            >{value}</div>
          })
        }</div>
      })}
      <div className="button" onClick={() => { handleReset() }}>reset game</div>
    </div>
  )
}

export default app
