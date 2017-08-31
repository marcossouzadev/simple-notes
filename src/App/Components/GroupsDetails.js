import React from 'react'
import Groups from './Groups'

class GroupsDetails extends React.Component {
  openOptions(groups) {
      var i;
      var x = document.getElementsByClassName("groups");
      for (i = 0; i < x.length; i++) {
          x[i].style.display = "none";
      }
      document.getElementById(groups).style.display = "block";
  }

  render(){
    return (
      <div>
      <div className="w3-bar w3-teal">
        <a className="w3-button" onClick={this.openOptions.bind(this,'myGroup')}>Meus grupos</a>
      </div>
      <div id="myGroup" className="groups">
        <Groups />
      </div>
      <div id="memberOf" className="groups" style={{display:'none'}}>
        <h2>Notas</h2>
        <p>Notas</p>
      </div>
      </div>
    )
  }
}

export default GroupsDetails
