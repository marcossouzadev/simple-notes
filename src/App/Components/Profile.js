import React from 'react'
import {Router} from 'react-router-dom'
import {getObject, updateObject} from '../Libs/lsapi'
import AddGroups from './AddGroups'


class Profile extends React.Component {
  constructor() {
    super()
    this.status = true
    this.state = getObject({key:'user', typeResponse:'object'})[0]
    this.handleChange = this.handleChange.bind()
    this.handleSubmit = this.handleSubmit.bind()
  }

  handleChange = (e) => {
    this.status = false
    this.setState({ [e.target.name]: e.target.value })
  }

  //Lida com ação de salvar dados
  handleSubmit = () => {

    const msg = updateObject({
      key:'user',
      typeResponse:'object',
      filter:[this.state.id,'id',null],
      data:this.state
      }) //Salva objeto no localstorage

    document.querySelector('[data-js=updateProfile]').innerHTML = msg //Mensagem de retorno
  }
  //Lida com tabs da tela Gerenciar grupos
  handleOpenOpt(opt){
    var i;
    var x = document.getElementsByClassName("opts");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";
    }
    document.getElementById(opt).style.display = "block"; //exibe tabs
  }


  render() {
    return (
      <div className="sn-note">
        <div className="w3-container">
          <h4 className="w3-panel w3-blue-grey">Olá {this.state.name}</h4>
        </div>

        <form className="w3-container" onSubmit={this.handleSubmit}>
          <label className="w3-text-teal"><b>Nome</b></label>
          <input
            name="name"
            className="w3-input w3-border w3-light-grey"
            type="text" value={this.state.name}
            placeholder="Digite seu nome"
            onChange={this.handleChange}
          />
        <br />
        <label className="w3-text-teal">Configurações</label>
        <div className="w3-bar w3-light-grey">
            <span className="w3-button" onClick={this.handleOpenOpt.bind(this, 'groups')}>
              <i className="fa fa-users sn-padding-5" />Grupos
            </span>
          </div>
          <div id="groups" className="w3-container opts w3-animate-right" style={{display:'none'}}>
            <AddGroups />
          </div>
        <p>
          <span data-js="updateProfile" className="w3-left w3-text-green" />
            <button
              data-js="cadastrar"
              disabled={this.status}
              className="w3-btn w3-blue-grey w3-right sn-margin-top-5">
                Salvar
            </button>
        </p>
        </form>
      </div>
    )
  }
}
export default Profile
