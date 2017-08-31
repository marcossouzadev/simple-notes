import React from 'react'
import { getToken } from '../Libs/Fn'
import {getObject, saveObject} from '../Libs/lsapi'
import GroupsDetails from './GroupsDetails'

class AddGroups extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      id:getToken(),
      name:'',
      owner_group_id:getObject({key:'user', typeResponse:'object'})[0].id,
      created_at:new Date()
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSaveGruoup = this.handleSaveGruoup.bind(this)
  }
  //Lida com adição de grupo
  handleSaveGruoup(evt){
    evt.preventDefault()
    //Salva objeto
    saveObject({key:'groups', typeResponse:'object', data:this.state, create:true})

    //Obtem elemento para setar a resposta
    const qs = document.querySelector('[data-js=resCreateGrupo]')

    //Remove classe para exbir mensagem
    qs.classList.remove('w3-hide')

    //Limpa campo name
    this.setState({'name':''})

    //Recarrega uma pagina após inserção
    setTimeout(()=> {
      qs.classList.add('w3-hide')
    },2000)
  }

  //Lida com
  handleChange(evt){
    this.setState({'name':evt.target.value})
  }

  render(){
    return(
      <div>
      <h5 className="w3-text-teal">Criar grupo</h5>
      <div className="w3-row-paddind">
      <div className="w3-half">
      <input
      name="grupo"
      value={this.state.name}
      onChange={this.handleChange}
      className="w3-input w3-tiny w3-border"
      placeholder="Nome do grupo"
      />
      </div>
      <div className="w3-half">
      <button
      onClick={this.handleSaveGruoup}
      className="w3-button w3-tiny w3-border w3-blue"
      disabled={!this.state.name}>
      Criar
      </button>
      <span
      className="w3-text-green w3-hide w3-animate-right w3-text-bold w3-tiny"
      data-js="resCreateGrupo"> Grupo criado</span>
      </div>
      </div>
      <br />
      <a href="#"
      className="w3-text-blue"
      onClick={() => { document.getElementById('groupsDetails').style.display = 'block' }}
      >Gerenciar Grupos
      </a>
      {/*<!-- The Modal --> */}
      <div id="groupsDetails" className="w3-modal">
      <div className="w3-modal-content">
      <div className="w3-container">
      <span
      onClick={() => { document.getElementById('groupsDetails').style.display = 'none' }}
      className="w3-button w3-display-topright">&times;</span>
      <GroupsDetails />
      </div>
      </div>
      </div>
      </div>
    )
  }
}

export default AddGroups
