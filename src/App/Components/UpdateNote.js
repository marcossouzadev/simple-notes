import React from 'react'
import TinyMCEImput from 'react-tinymce-input'
import { Link } from 'react-router-dom'
import { getObject, getObjectByFilter, updateObject } from '../Libs/lsapi'

class UpdateNote extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeRichText =  this.handleChangeRichText.bind(this)
  }

  componentWillMount(){

    if(sessionStorage.idToEdit){
      const id = sessionStorage.idToEdit
      const note = getObjectByFilter({key:'notes', typeResponse:'object',filter:[id,'id',null]})
      this.setState({
        id: note[0].id,
        title: note[0].title,
        content: note[0].content,
        group: note[0].group,
        owner_id: note[0].owner_id,
        created_at: new Date(),
      })
    }
  }

  componentDidMount(){
    let options = []
    const items = getObject({key:'groups', typeResponse:'object'})
    items.forEach(function(item){
      options.push(<option key={item.id} value={item.id}>{item.name}</option>)
    })
    //Popula o select dos grupos
    this.setState({opts: options})
  }

  //Trata as mudanças de estados do componente
  handleChange(e) {
    this.setState({[e.target.name]:e.target.value})
  }

  //Trata mudanças no reich text
  handleChangeRichText(data){
    this.setState({'content': data})
  }

  //Trata a submissão do formulário
  handleSubmit(e) {
    e.preventDefault()
    const msg = updateObject({key:'notes', typeResponse:'object', filter:[this.state.id,'id', null], data:this.state})
    const tag = document.querySelector('[data-js=tagReturn]')
    delete sessionStorage.idToEdit
    tag.style.display = 'block';
    tag.innerHTML = msg
    setTimeout(()=>{
      location.assign('/')
    }, 1000)
  }

  render(){
    return (
      <div className="w3-card sn-note sn-width-500 w3-animate-right">
      <header>
      <h2 className=" w3-light-grey w3-text-teal w3-padding"><i className="fa fa-sticky-note w3-padding" />Editar nota</h2>
      </header>
      <span data-js="tagReturn" className="w3-padding w3-green" style={{display:'none'}}></span>
      <form className="w3-container" onSubmit={this.handleSubmit}>
      <label className="w3-text-teal"><b>Titulo</b></label>
      <input
      name="title"
      value={this.state.title}
      onChange={this.handleChange}
      className="w3-input w3-border w3-light-grey"
      type="text"
      />
      <label className="w3-text-teal"><b>Nota</b></label>
      <TinyMCEImput
      name="content"
      value={this.state.content}
      tinymceConfig={{
        plugins: 'link',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
      }}
      onChange={this.handleChangeRichText.bind(this.state.content)}
      />
      <label className="w3-text-teal">Adiciona ao grupo de: </label>
      <select className="w3-select" name="group" onChange={this.handleChange}>
        <option value={this.state.group} defaultValue>Selecione outra opção</option>        
        {this.state.opts}
      </select>

      <button disabled={!this.state.title || !this.state.content}
        className="w3-btn w3-blue-grey w3-right sn-margin-top-5"
        >Atualizar
      </button>
      <Link to="/" className="w3-btn w3-red w3-right sn-margin-top-5 sn-margin-right-5">
      Cancelar
      </Link>
      </form>
      </div>
    )
  }

}

export default UpdateNote
