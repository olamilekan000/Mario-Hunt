import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { sound } from '../helpers/audio'

import MARIO from '../assets/mario-pose3.png'
import WARTS from '../assets/King_Wart.png'

class Board extends React.Component {

  constructor() {
    super()

    this.table = React.createRef()
    this.player = React.createRef()

    this.state = {
      numberOfBoardWidth: 5,
      numberOfBoardHeight: 5,
      currentRowPosition: 0,
      currentColumnPosition: 0,
      villain: [],
      data: [],
      moves: 0,
      display: 'none',
      tester: ''
    }
  }

  restartGame = (e) => {
    e.preventDefault()
    this.props.history.push('/')
  }

  removeVillain = (playerType) => {
    const getVillain = this.state.villain
    if (playerType === 'villain') {
      getVillain.pop()
    }
    if(this.state.villain.length < 1){
      this.setState({
        display: 'block'
      })

      sound('http://23.237.126.42/ost/winner-s-horse/euixkzos/13%20-%20Jingle%204.mp3')
    }
  }

  movePlayer = (attr, player, table) => {
    if(this.state.villain.length){
      if(attr === 'rowposition'){
        player.setAttribute(attr, this.state.currentRowPosition)
      }else{
        player.setAttribute(attr, this.state.currentColumnPosition)
      }

      const updatedRowPosition = this.state.currentRowPosition
      const updatedColumnPosition = this.state.currentColumnPosition

      const gameTableCells = table.rows[updatedRowPosition].cells

      if(gameTableCells.item(updatedColumnPosition).children[0]){
        const playerType = gameTableCells.item(updatedColumnPosition).children[0].id

        gameTableCells
          .item(updatedColumnPosition)
          .removeChild(table.rows[updatedRowPosition]
          .cells.item(updatedColumnPosition).children[0])

        this.removeVillain(playerType)
      }
      table
        .rows[updatedRowPosition]
        .cells
        .item(updatedColumnPosition).appendChild(player)
    }
  }

  handleKeyDown = (e) => {
    e.preventDefault()

    let player = this.player.current
    let rowposition =  parseInt(this.player.current.getAttribute('rowposition'), 10) || 2
    let columnposition =  parseInt(this.player.current.getAttribute('columnposition'), 10) || 2
    let table = this.table.current

    const numberOfBoardHeight = parseInt(this.props.boardSize, 10) || 5
    let { moves, villain } = this.state

    switch (e.key) {
      case 'ArrowUp':
        let newRowPosition = rowposition -= 1
        this.setState({
          currentRowPosition: (newRowPosition > 0 ? newRowPosition : 0),
          moves: villain.length ? (moves += 1) : moves
        })
        this.movePlayer('rowposition', player, table)
        break;

      case 'ArrowDown':
        let newRowPositionUp = rowposition += 1
        this.setState({
          moves: villain.length ? (moves += 1) : moves,
          currentRowPosition: (
            newRowPositionUp === numberOfBoardHeight ?
              newRowPositionUp -= 1 : newRowPositionUp)
        })
        this.movePlayer('rowposition', player, table)
        break;

      case 'ArrowRight':
        let newColumnPosition = columnposition +=1
        this.setState({
          moves: villain.length ? (moves += 1) : moves,
          currentColumnPosition: (
            newColumnPosition === numberOfBoardHeight ?
              newColumnPosition -= 1 : newColumnPosition)
        })
        this.movePlayer('columnposition', player, table)
        break;

      case 'ArrowLeft':
        let newColumnPositionLeft = columnposition -=1
        this.setState({
          moves: villain.length ? (moves += 1) : moves,
          currentColumnPosition: (newColumnPositionLeft > 0 ? newColumnPositionLeft : 0)
        })
        this.movePlayer('columnposition', player, table)
        break

      default:
        break;
    }

  }

  placePlayers = () => {

    const boardSize = parseInt(this.props.boardSize, 10) || 5
    this.setState({
      numberOfBoardHeight: boardSize,
      numberOfBoardWidth: boardSize
    })

    const getHalf = Math.floor(boardSize/2)

    let myColArr = []
    const myRowArr = []
    const numberOfTruthy = []


    const villain = <div
      id={`villain`}
      className={`${Math.random()}`}>
        <img src={WARTS} alt="wart"/>
      </div>

    const player = (i, j) => {
      this.setState({
        currentRowPosition: i,
        currentColumnPosition: j,
      })

      return (<div
        id="player"
        onClick={this.myPlayer}
        ref={this.player}
        rowposition={i} columnposition={j}><img src={MARIO} alt="mario"/></div>)
    }


    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {

        const truthy = i === Math.round(Math.random() * boardSize)
        const iAndJComparison = (i === getHalf && j === getHalf)
        if(truthy === true && iAndJComparison !== true){
          // pushes villain into array if true
          numberOfTruthy.push(truthy)
        }
        myColArr.push(<td key={j}>{ iAndJComparison ? player(i, j) : truthy ? villain : null }</td>)
      }

      myRowArr.push(<tr key={i} id={i}>{
        myColArr.map(data => data)
      }</tr>)
      myColArr = []
    }

    if(numberOfTruthy.length !== boardSize){
      return this.placePlayers()
    }else{
      this.setState({
        data: myRowArr,
        villain: numberOfTruthy,
      })
    }
  }

  componentDidMount() {
    this.placePlayers()
    window.onkeydown = this.handleKeyDown
  }

  render() {
    return (
       <div className="container">

        <div>
          <div style={{display: this.state.display, textAlign: 'center', alignItems: 'center'}}>
            <h6 className="blinking">It took you {this.state.moves}  moves to conquer King Wart!</h6>
          </div>
        </div>
        <div id="table">
          <table ref={this.table}>
            <thead>
            </thead>
            <tbody>
              {
                this.state.data.map( newData => newData)
              }
            </tbody>
          </table>
          <div className="test">
            <h5 style={{color: '#fff'}}>Moves: { this.state.moves }</h5>
            <button className="btn" onClick={this.restartGame}>Restart</button>
          </div>
        </div>
       </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    boardSize: state.board
  }
}

export default connect(mapStateToProps)(withRouter(Board))
