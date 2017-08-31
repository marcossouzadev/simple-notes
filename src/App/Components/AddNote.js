import React from 'react'
import { Link } from 'react-router-dom'
import TinyMCEImput from 'react-tinymce-input'
import { getObject,getObjectByFilter, saveObject } from '../Libs/lsapi'

class Notes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      content: '',
      owner_id: getObject({key:'user', typeResponse:'object'})[0].id,
      created_at: new Date(),
      group:'',
      opts:[]
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeRichText = this.handleChangeRichText.bind(this)
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
    this.setState({'content':data})
  }

  //Trata a submissão do formulário
  handleSubmit(e) {
    e.preventDefault()
    delete this.state.opts
    let msg
    msg = saveObject({key:'notes', typeResponse:'object', data:this.state, create:true})
    const tag = document.querySelector('[data-js="tagReturn"]')
    tag.style.display = 'block';    
    tag.innerHTML = msg
    setTimeout(()=>{
      location.assign("/")
    }, 1000)
  }

  render() {
    return (
      <div className="w3-card sn-note sn-width-500 w3-animate-right">
      <header>
      <h2 className=" w3-light-grey w3-text-teal w3-padding"><i className="fa fa-sticky-note w3-padding" />Adicione sua nota</h2>
      </header>
      <span data-js="tagReturn" className="w3-padding w3-green" style={{display:'none'}}></span>
      <form className="w3-container" onSubmit={this.handleSubmit}>
      <label className="w3-text-teal"><b>Titulo</b></label>
      <input
      name="title"
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
        <option value="" defaultValue>Escolha um grupo</option>
        {this.state.opts}
      </select>
      <button disabled={!this.state.title || !this.state.content}  className="w3-btn w3-blue-grey w3-right sn-margin-top-5">Salvar</button>
      <Link to="/" className="w3-btn w3-red w3-right sn-margin-top-5 sn-margin-right-5">
      Cancelar
      </Link>
      </form>
      </div>
    )
  }
}

export default Notes
