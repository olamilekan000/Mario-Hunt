import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Landinpage from './components/WelcomePage'
import Board from './components/Board'
class App extends React.Component {
  render() {
    return (
       <BrowserRouter>
         <Switch>
           <Route exact path="/" component={Landinpage} />
           <Route path="/game" component={Board} />
         </Switch>
       </BrowserRouter>
    );
  }
}

export default App
