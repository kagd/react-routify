jest.mock('../createRoute')
jest.mock('../beginRouting')

import React from 'react'
import renderer from 'react-test-renderer'
import Router from '../Router'
import createRoute from '../createRoute'
import beginRouting from '../beginRouting'

test('default state should render null', () => {
  const Home = () => <div>home</div>
  const routes = [{ path: '/', component: Home }]
  const component = renderer.create(<Router routes={routes} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('beginRouting should be called', () => {
  const Home = () => <div>home</div>
  const routes = [{ path: '/', component: Home }]
  renderer.create(<Router routes={routes} />)
  expect(beginRouting).toBeCalled()
})

test('navigate should update the component', () => {
  const createRouteCallbacks = {}

  createRoute.mockImplementation((path, callback) => {
    createRouteCallbacks[path] = callback
  })

  const Home = () => <div>home</div>
  const About = () => <div>about</div>

  const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About }
  ]

  const component = renderer.create(<Router routes={routes} />)

  let tree

  createRouteCallbacks['/']()
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  createRouteCallbacks['/about']()
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('route information should exist on props', () => {
  const createRouteCallbacks = {}

  createRoute.mockImplementation((path, callback) => {
    createRouteCallbacks[path] = callback
  })

  const Home = ({ route }) => <div>{route.params.info}</div>

  const routes = [
    { path: '/', component: Home },
  ]

  const component = renderer.create(<Router routes={routes} />)

  createRouteCallbacks['/']({params: {info: 'shinfo'}})
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('onEnter is called when component is rendered', () => {
  const createRouteCallbacks = {}
  const onEnterCallback = jest.fn()

  createRoute.mockImplementation((path, callback) => {
    createRouteCallbacks[path] = callback
  })

  const Home = () => <div>Home</div>

  const routes = [
    { path: '/', component: Home, onEnter: onEnterCallback },
  ]

  renderer.create(<Router routes={routes} />)

  createRouteCallbacks['/']()
  expect(onEnterCallback).toHaveBeenCalled()
})

test('onLeave is called when component is unmounted', () => {
  const createRouteCallbacks = {}
  const onLeaveCallback = jest.fn()

  createRoute.mockImplementation((path, callback) => {
    createRouteCallbacks[path] = callback
  })

  const Home = () => <div>Home</div>

  const routes = [
    { path: '/', component: Home, onLeave: onLeaveCallback },
    { path: '/home2', component: Home },
  ]

  renderer.create(<Router routes={routes} />)

  createRouteCallbacks['/']()
  expect(onLeaveCallback).not.toHaveBeenCalled()
  createRouteCallbacks['/home2']()
  expect(onLeaveCallback).toHaveBeenCalled()
})

test('previous component onLeave is called next component onEnter', () => {
  const createRouteCallbacks = {}
  const onLeaveCallback = jest.fn()
  const onEnterCallback = jest.fn()
  const called = []

  createRoute.mockImplementation((path, callback) => {
    createRouteCallbacks[path] = callback
  })
  onLeaveCallback.mockImplementation(() => {
    called.push('onLeave')
  })
  onEnterCallback.mockImplementation(() => {
    called.push('onEnter')
  })
  const Home = () => <div>Home</div>

  const routes = [
    { path: '/', component: Home, onLeave: onLeaveCallback },
    { path: '/home2', component: Home, onEnter: onEnterCallback },
  ]

  renderer.create(<Router routes={routes} />)

  createRouteCallbacks['/']()
  createRouteCallbacks['/home2']()
  expect(called).toEqual(['onLeave','onEnter'])
})

test('it doesn\'t call onEnter/onLeave if same state is called', () => {
  const createRouteCallbacks = {}
  const onLeaveCallback = jest.fn()
  const onEnterCallback = jest.fn()

  createRoute.mockImplementation((path, callback) => {
    createRouteCallbacks[path] = callback
  })
  const Home = () => <div>Home</div>

  const routes = [
    { path: '/', component: Home, onEnter: onEnterCallback, onLeave: onLeaveCallback },
  ]

  renderer.create(<Router routes={routes} />)

  createRouteCallbacks['/']()
  createRouteCallbacks['/']()
  expect(onEnterCallback).toHaveBeenCalledTimes(1)
  expect(onLeaveCallback).toHaveBeenCalledTimes(0)
})
