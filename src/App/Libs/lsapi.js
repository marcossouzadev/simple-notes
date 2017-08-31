//Simples API para manipulação do localstorage genericamente

//Mensagem de retorno
const msg = {
  err:{
    reqError:"Solicitação incorreta.",
    storageError:"Inconsistência no storage local.",
    resTypeError:"Informe que tipo de resposta deseja.",
    reqFilterError:"Informe o 'filter' a ser usado.",
    reqParams:"Paramentros de filtro inválidos.",
    resPrepare:"Erro ao preparar solicitação.",
    resObjduplicated:"Objeto duplicado.",
    reqPropError:"A propriedade solicitada não existe!",
    reqFilterNull:"'typeResponse' deve está setada como 'object'",
    resUpdateError:"Não foi enviado dados válidos para atualzar.",
    resUpdatedNull:"Nenhum registro foi atualizado",
    resDeleteNull:"Nenhum registro foi deletado!"
  },
  success:{
    'created':"Registro realizado com sucesso!",
    'updated':"Registro atualizado com sucesso!",
    'deleted':'Registro deletado com sucesso!'
  }
}

//******** Funções auxiliares ********
const Prepare = function(configs){
    let result
    let dataObj
    try {
      //Verifica se foi enviado configs
      if(!configs || !configs.key || !configs.typeResponse) throw msg.err.reqError

      if(!localStorage.getItem(configs.key) && configs.create === true){
        localStorage.setItem(configs.key, JSON.stringify([]))
      }

      //Pega chave no localstorage
      const data = localStorage.getItem(configs.key)

      //Verifica se existe a chave no localstorage
      if(!data) throw msg.err.storageError

      //Verifica que tipo de dados deve retornar
      if(configs.typeResponse == 'object' && data.length > 0){
        dataObj = JSON.parse(data)
      }
      if(configs.typeResponse == 'string'){
        dataObj = data
      }

      //Verifica se foi devolvido algo
      if(!dataObj) throw msg.err.storageError

      //Devolve o Objeto solicitado.
      result = dataObj

    } catch (e) {
      //seta em result um objeto contendo erro
      result = {err:e}
    } finally {
      //Retorna o result
      return result
    }
}

const SetFilter =  function(configs){
  let result
  let dataObj
  try {
    //Prepara para execução (aqui retorna string || obejeto || erro)
    const execute = Prepare(configs)

    //Verifica se houve erros
    if(execute.err) throw msg.err.err;

    //Verifica se retorno
    if(typeof execute != 'object') throw msg.err.reqFilterNull

    //Verifica se foi enviado filtro (filter é um array com 2 elemento, um é a chave o outro é uma prop)
    //['identificador', 'é um id || props',"valor da propriedade" ]
    if(!configs.filter || configs.filter.length < 3) throw msg.err.reqFilterError

    switch (configs.filter[1]) {
      case 'id':
        //Retora o objeto inteiro referente ao ID
        dataObj = execute.filter((item) => { return item.id == configs.filter[0]})
        //Verifica se retornou UM objeto
        if(dataObj.length > 1) throw msg.err.resObjduplicated
        break;

      case 'prop':

        //Retorna o objeto solicitado
        const f = execute.filter((item) => {
          return item.id == configs.filter[0]
        })

        //seta em dataObj objeto a propriedade solicitada
        dataObj = f[0][configs.filter[2]]
        if(!dataObj) throw msg.err.reqPropError
        break;
      default:
        //Se nenhuma opção for valida retorna mensagem de erro de paramentros
        dataObj = msg.err.reqParams
    }

    //Se dataObj estiver vazio ou undefined retorna erro de tipo de daddos
    if(!dataObj || dataObj.length <= 0) throw msg.err.storageError

    //Retorna objeto filtrado
    result = dataObj

  } catch (e) {
      result = {err:e}
  } finally {
    return result
  }
}

const BuildToken = function(){
  let token = new Date().getSeconds()
  for(let i=8; i > 0; --i){
    token += (Math.floor(Math.random() * 512)).toString(16)
  }
  return token
}
//********** Funções Principais **********************

//Pega todos os item de um obejeto
exports.getObject = function(cfg){
  let response
  try {
    //Prepara para execução
    const execute = Prepare(cfg)

    if(execute.err) throw execute.err

    //Retorna o resultado
    response = execute
  } catch (e) {
    response = {err:e}
  } finally {
    return response
  }
}

//Pega apenas um item do objeto
exports.getObjectByFilter = function(cfg){
  let response
  let dataObj
  try {

    //Set retorno em dataObj
    dataObj = SetFilter(cfg)

    if(dataObj.err) throw dataObj.err

    //Retorna resultado
    response = dataObj

  } catch (e) {
    response = {err:e}
  } finally {
    return response
  }
}

//Insere objeto no localstorage
exports.saveObject =  function(cfg){
  let response
  try {

    //const data = localStorage.getItem(cfg.key)
    const execute = Prepare(cfg)
    if(execute.err) throw execute.err

    if(typeof cfg.data != 'object') throw Erros.reqParams

    cfg.data.id = BuildToken()
    execute.push(cfg.data)

    response = msg.success.created
    localStorage.setItem(cfg.key, JSON.stringify(execute))

  } catch (e) {
    response = {err:e}
  } finally {
    return response
  }
}


//Atualizar objeto
exports.updateObject =  function(cfg){
  let response
  let dataObj

  try {
    //Verifica se foi enviado valor para atualizar
    if(!cfg.data) throw msg.err.resUpdateError

    if(!cfg.filter || cfg.filter.length < 3) throw msg.err.reqFilterError

    //Remove do objeto o id por proteção caso seja enviado id diferente
    delete cfg.data.id

    //Pega localStorage
    const execute = Prepare(cfg)
    //Guarda o numero de registros
    const count = execute.length
    //Verifica se pegou algo do localStorage
    if(execute.err) throw execute.err

    if(typeof execute != 'object') throw msg.err.reqFilterNull

    //Remove o objeto antigo
    execute.filter((item, idx) => {
      if(item.id == cfg.filter[0]){
        execute.splice(idx,1)
        if(execute.length == count) throw msg.err.resUpdatedNull
      }
    })

    //seta o novo objeto com mesmo id
    cfg.data.id = cfg.filter[0]
    //jogo novo objeto pra dentro do array
    execute.push(cfg.data)

    //Guarda no localStorage (Verificar porque está salvando com vazio)
    localStorage.setItem(cfg.key, JSON.stringify(execute))

    //Retorna Mensagem de sucesso
    response = msg.success.updated
  } catch (e) {
    response = {err:e}
  } finally {
    return response
  }
}

exports.delObject = function(cfg){
  let response
  try {
    //Verifica se foi passado dados necessarios
    if(!cfg.filter || cfg.filter.length < 3 || !cfg.filter[0]) throw msg.err.reqParams

    //Pega o localStorage
     const execute = Prepare(cfg)
     //Guarda a quantidado de registro inicial
     const n = execute.length

     //Verifica se retornou um objeto
     if(typeof execute != 'object') throw msg.err.reqFilterNull

     //excluir o item passado
     execute.filter((item, idx) => {
       if(item.id == cfg.filter[0]){
         execute.splice(idx,1)
       }
     })

     //Verifica se foi retirado algum registro
     if(execute.length != n - 1) throw msg.err.resDeleteNull
     //Grava no localStorage
     localStorage.setItem(cfg.key, JSON.stringify(execute))
     //Retorna mensagem de sucesso
     response = msg.success.deleted
  } catch (e) {
    response = {err:e}
  } finally {
    return response
  }
}
