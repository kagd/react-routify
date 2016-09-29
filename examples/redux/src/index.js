import React from 'react'
import ReactDOM from 'react-dom'
import { ReduxRouter, routeReducer, Link } from '../../../lib'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import Users from './Users'

const rootReducer = combineReducers({
  route: routeReducer
})

const store = createStore(rootReducer, window.devToolsExtension && window.devToolsExtension())

const Home = () => <div>Home</div>
const About = () => <div>About</div>

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/users/:id', component: Users }
]

const rootComponent = (
  <Provider store={store}>
    <div>
      <Link to="/" activeClassName="active">Home</Link>
      <Link to="/about" activeClassName="active">About</Link>
      <Link to="/users/10" activeClassName="active">user 10</Link>
      <ReduxRouter routes={routes} store={store} />
    </div>
  </Provider>
)

ReactDOM.render(
  rootComponent,
  document.getElementById('root')
)
