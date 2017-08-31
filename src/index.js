import React from 'react'
import ReactDom from 'react-dom'
import App from './App/App'

ReactDom.render(
    <App />,
    document.querySelector('[data-js=app]')
)
