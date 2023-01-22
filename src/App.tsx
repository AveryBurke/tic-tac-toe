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
    updateStateOfPlay(r, c)
    setCurrentPlayer(togglePlayer(currentPlayer))
  }

  const updateStateOfPlay = (r: number, c: number) => {
    const row: `r${number}` = `r${r}`
    const col: `c${number}` = `c${c}`
    const nextRowCount = stateOfPlay[row]![currentPlayer] + 1
    const nextColCount = stateOfPlay[col]![currentPlayer] + 1
    let nextAntiDiagCount = stateOfPlay['d0']![currentPlayer]
    let nextDiagCount = stateOfPlay['d1']![currentPlayer]
    if (r + c === 2) {
      ++nextAntiDiagCount
    }
    if (r === c) {
      ++nextDiagCount
    }
    if (nextRowCount === 3 || nextColCount === 3 || nextDiagCount === 3 || nextAntiDiagCount === 3) {
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
        [currentPlayer]: nextAntiDiagCount
      },
      [`d${1}`]: {
        ...stateOfPlay[`d${1}`],
        [currentPlayer]: nextDiagCount
      }
    })
  }


  return (
    <div className="gridContainer">
      <div className="playerWindow" data-testid="pw">{winner ? winner + " wins!" : currentPlayer + "'s turn"}</div>
      {grid.map((row, r) => {
        return <div key={`row${r}`} className='row'>{
          row.map((value, c) => {
            return <div
              key={`${r},${c}`}
              className={`cell ${value || winner ? '' : 'clickable'}`} data-testid={`cell-${r},${c}`}
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
      <div className="button" data-testid="reset" onClick={() => { handleReset() }}>reset game</div>
    </div>
  )
}

export default app
