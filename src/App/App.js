import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Note from './Components/Note'
import AddNote from './Components/AddNote'
import UpdateNote from './Components/UpdateNote'
import NavBar from './Components/NavBar'
import {saveObject} from './Libs/lsapi'

class App extends React.Component {

  render() {
    //Verifica se existe um token no localStorage
    if (!localStorage.user) {
      saveObject({key:'user', typeResponse:'object', data:{name:'Guest'}, create:true})
    }
    return (
      <Router>
        <div>
          <NavBar />
          <Switch>
            <Route exact path="/" component={Note} />
            <Route exact path="/getByGroup" component={Note} />
            <Route exact path="/Add" component={AddNote} />
            <Route exact path="/Edit" component={UpdateNote} />
            <Route render={() => window.location.assign('/')} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
