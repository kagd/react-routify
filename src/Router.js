import { Component, PropTypes, createElement } from 'react'
import createRoute from './createRoute'
import beginRouting from './beginRouting'

class Router extends Component {
  constructor() {
    super()

    this.state = {
      component: null,
      context: null,
      onEnter: null,
      onLeave: null,
      path: null
    }
  }

  componentDidMount() {
    this.props.routes.forEach((route) => {
      const {
        component,
        onEnter,
        onLeave,
        path
      } = route
      createRoute(path, (context) => {
        this.setState({
          component,
          context,
          onEnter,
          onLeave,
          path
        })
      })
    })

    beginRouting()
  }

  /*
   * since this component will update only when the path
   * changes, componentWillUpdate will only be called on
   * route change 
   */
  componentWillUpdate(){
    if(this.state.onLeave){
      this.state.onLeave()
    }
  }
  
  /*
   * since this component will update only when the path
   * changes, componentDidUpdate will only be called on render
   */
  componentDidUpdate(){
    if(this.state.onEnter) {
      this.state.onEnter()
    }
  }

  /*
   * if the current state path matches the nextState path
   * do not update the component
   */
  shouldComponentUpdate(nextProps, nextState){
    return this.state.path !== nextState.path
  }

  render() {
    if(!this.state.component) {
      return null
    }

    return createElement(this.state.component, {
      route: this.state.context
    })
  }
}

Router.propTypes = {
  routes: PropTypes.array.isRequired
}

export default Router
