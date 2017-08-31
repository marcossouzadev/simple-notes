import React from 'react'
import { Link } from 'react-router-dom'
import { getObject } from '../Libs/lsapi'
import {showModal} from '../Libs/Fn'
import Profile from './Profile'

class NavBar extends React.Component {
  constructor() {
    super()
    //Pega usuário, essa função retorna um objeto
    this.state = {
      user: getObject({key:'user', typeResponse:'object'})[0]
    }
  }

  render() {
    return (
      <div>
        {/* Barra de navegação */}
        <div className="w3-bar w3-teal w3-border">
          <span className="w3-bar-item w3-tiny">Simple Notes</span>
          <span
            onClick={showModal.bind(this, 'profile')}
            title="Profile"
            className="w3-bar-item w3-button w3-right">
            ( <span className="fa fa-user"> {this.state.user.name}</span> )
          </span>
          <Link
            title="Adicionar nova nota"
            to="/Add"
            className="w3-bar-item w3-button w3-right">
            <i className="fa fa-plus">
            </i>
          </Link>
          <Link
            title="Minhas notas"
            to="/"
            className="w3-bar-item w3-button w3-right">
            <i className="fa fa-sticky-note">
            </i>
          </Link>
        </div>
        {/* Siderbar*/}
        <div
          className="w3-sidebar w3-bar-block w3-animate-right"
          style={{display:'none',width:'350px',right:0}}
          id="profile">
          <button
            className="w3-bar-item w3-button"
            onClick={() => {document.getElementById("profile").style.display = "none"}}>
            Fechar &times;
          </button>
          <Profile />
        </div>
      </div>
    )
  }
}

export default NavBar
