import React from 'react'
import { formatData } from '../Libs/Fn'
import { getObject,getObjectByFilter, delObject } from '../Libs/lsapi'
import UpdateNote from './UpdateNote'

class Note extends React.Component {
  constructor(props) {
    super(props)
    //Retorna o array as notas se existirem
    this.state = {
      notes: getObject({key:'notes', typeResponse:'object'}),
      user:getObject({key:'user', typeResponse:'object'})[0],
      currNote:''
    }
  }

  //Lida com a exclusão da nota
  handleDelete = (id) => {
    if(id && confirm("Deseja realmente excluir essa nota? ") === true){
      //Exclui a nota se existir
      delObject({key:'notes', typeResponse:"object", filter:[id, null,null]})
      //Recarrega pagina
      location.reload()
    }
  }

  //Grava id a ser editado para recuperar na proxima pagina
  handleIdToChange = (id) => {
    if(id){
      sessionStorage.setItem('idToEdit', id)
    }
  }
  //Pega nome do grupo para exibição
  handleGetGroupName(id){
    const name = getObjectByFilter({key:'groups', typeResponse:'object', filter:[id,'prop', 'name']})
    if(!id || name.err){
      return "Sem grupo"
    } else {
      return name;
    }
  }

  render() {
    //Incializa variavéis para uso posterior
    let cards;
    let items = [];
    //Verifica qual URL está para filtrar o array de objetos
    if(!this.state.notes.err){
      switch (this.props.location.pathname) {
        case "/getByGroup":
        items = this.state.notes.filter((item) => {return item.group == sessionStorage.getByGroup})
        break;
        case "/":
        items = this.state.notes.filter((item) => { return item.owner_id == this.state.user.id })
        break;
      }
    }
    //Verifica se retornou algum objeto
    if (items.length > 0) {

      //Mapeia o array e faz o loop para exibição
      cards = items.map((item, i) => {        
        return (          
          <div className="w3-left" key={i} >
            <div className="w3-card-4 sn-width-300 sn-margin-left-10">
              <header className="w3-container w3-light-grey">
                {this.state.user.name}
                <div className="w3-dropdown-hover w3-light-grey w3-right">
                  <span
                    id={'ic' + item.id}
                    className="w3-right fa fa-lock sn-padding-5">
                  </span>
                  <div className="w3-dropdown-content w3-bar-block w3-border">
                     <a
                      onClick={this.handleIdToChange.bind(this, item.id)}
                      href="/Edit"
                      className="w3-bar-item w3-button">
                      <span className="fa fa-hashtag sn-padding-5">
                      </span>
                      Editar
                    </a>
                    <a
                      onClick={this.handleDelete.bind(this, item.id)}
                      className="w3-bar-item w3-button">
                      <span className="fa fa-trash sn-padding-5">
                      </span>
                      Excluir
                    </a>
                  </div>
                </div>
                <span className="w3-tiny w3-padding">
                  {formatData(item.created_at)}
                </span>
              </header>
              <div className="w3-container">
                <h5>
                  {item.title}
                </h5>
                <p dangerouslySetInnerHTML={ {__html: item.content} } />
              </div>
              <div  className="w3-container w3-light-grey w3-padding">
                Grupo: <a 
                        href="/getByGroup"
                        onClick={() =>{sessionStorage.setItem('getByGroup',item.group)}}
                       >
                        {this.handleGetGroupName(item.group)}
                      </a>
              </div>
            </div>
          </div>
        )
      })
    } else {
      //Caso array retorne nada exibe essa mensagmem
      cards =
      <div className="w3-panel w3-light-blue w3-display-middle">
        <p>
          Não há notas a serem exibidas
        </p>
      </div>
    }
    return (
      <div>
        {cards}
      </div>
    )
  }
}

export default Note
