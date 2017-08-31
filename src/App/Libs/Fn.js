  //Gera token
  exports.getToken = () => {
    var token = ''
    for (var i = 4; i > 0; --i) {
      token += (Math.floor(Math.random() * 256)).toString(16);
    }
    return token;
  },

  //Show modal
  exports.showModal = (id) => {
    return document.getElementById(id).style.display = 'block'
  },

  //Pega data atual e formata
  exports.formatData = (date) => {
    const d = new Date(date)
    const day = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    return day + '/' + month + '/' + year
  }
