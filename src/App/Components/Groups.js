import React from 'react'
import {getObject, delObject, updateObject,} from '../Libs/lsapi'

class Groups extends React.Component {
  constructor(props){
    super(props)
    this.state = {alterNameLabel:"Alterar nome"}
    this.handleChange = this.handleChange.bind(this)
    this.alterName = this.alterName.bind(this)
    this.delGroup   = this.delGroup.bind(this)
  }

  handleChange(evt){
    this.setState({alterNameLabel:"Salvar", newName:evt.target.value})
  }

  alterName(id){
    if(id){
      //Pega grupo
      const grp = getObject({key:'groups', typeResponse:'object', filter:[id, 'id', null]})
      //se não houver erro
      if(!grp.err){
          grp[0].name = this.state.newName
          const res = updateObject({key:'groups', typeResponse:'object', filter:[id, 'id', null], data:grp[0]})
          alert(res)
          window.location.reload()
      } else {
        alert(grp.err)
      }

    }
  }

  delGroup(id){
    if(id && confirm("Deseja realmente excluir esse grupo?")){
      const res = delObject({key:'groups', typeResponse:'object', filter:[id,'id',null]})
      if(!res.err){
        document.getElementById(id).style.display ='none'
      } else {
        console.log(res.err);
      }
    }
  }

  render(){
    let groupList
    const grps = getObject({key:'groups', typeResponse:'object'})
    if(!grps.err && grps.length > 0){
      groupList = grps.map((item,i) => {
        return(
            <tr key={i} id={item.id}>
              <td style={{width:'20%',textAlign:'left'}}>{item.name}</td>
              <td style={{width:'80%', textAlign:'right'}}>
                <input
                onChange={this.handleChange}
                className="w3-border grpInput"                                
                placeholder="Entre com novo nome"
                />
                <button
                className="w3-button"
                disabled={!this.state.newName}
                onClick={this.alterName.bind(this, item.id)}
                >
                {this.state.alterNameLabel}
                </button>
                <a
                className="w3-button w3-margin-left"
                onClick={this.delGroup.bind(this, item.id)}
                >
                Excluir
                </a>
              </td>
            </tr>
        )
      })
    } else {
      groupList = (
        <tr>
          <td className="w3-center" colSpan="2">Você não tem grupos!!</td>
        </tr>
      )
    }

    return(
      <div>
      <p>Gerenciar grupos</p>
      <table className="w3-table w3-bordered w3-margin-bottom">
        <thead>
          <tr>
          <th style={{width:'20%',textAlign:'left'}}>Nome</th>
          <th style={{width:'80%',textAlign:'right'}}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {groupList}
        </tbody>
        </table>
      </div>
    )
  }
}

export default Groups
