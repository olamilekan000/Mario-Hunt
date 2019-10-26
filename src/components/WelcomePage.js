import React from 'react'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import M from 'materialize-css'

import { sound } from '../helpers/audio'

import WARTS from '../assets/King_Wart.png'
import MARIO from '../assets/mario-pose3.png'

class Landingpage extends React.Component {

  state = {
    boards: this.props.boardSize,
    boardSize: ''
  }

  handleChange = (e) => {
    e.preventDefault()
    this.setState({
      boardSize: e.target.value
    })
  }

  startGame = (e) => {
    e.preventDefault()
    const  { boardSize }= this.state

    if(boardSize > 2 ) {
      this.props.setBoardSize(boardSize)
      this.props.history.push(`/game`)
    }else {
      M.toast({html: 'Please choose an appropriate board size.'})
    }
  }

  componentDidMount() {
    sound('http://www.mariomayhem.com/downloads/sound_tracks/Super_Mario_Bros._1/07-castle-complete.mp3')

    this.setState({
      boardSize: 5
    })
  }

  render() {
    return (
       <div className="container">
         <div id="title" className="blinking">
          <h4 className="center">Mario Hunt!</h4>
         </div>
         <div id="images">
           <img src={MARIO} alt="villains" id="king_warts"/>
           <img src={WARTS} alt="villains" id="king_warts"/>
         </div>
          <h5 style={{color: '#fff'}}>Select the number of boards <br /> you'd like to play on</h5>
         <div>
           <p style={{color: '#fff'}}>Board is 5 by default</p>
            <form>
              <input
                type="number"
                placeholder="5"
                onChange={this.handleChange}
                /><br />
              <button className="btn" onClick={this.startGame}>Let's Play!!!</button>
            </form>
         </div>
       </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    boardSize: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBoardSize: (size) => {
      dispatch({
        type: 'SET_BOARD',
        board: size
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Landingpage))
