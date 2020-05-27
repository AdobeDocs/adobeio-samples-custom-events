/*  */
import React from 'react'
import PropTypes from 'prop-types'
import ErrorBoundary from 'react-error-boundary'

import actions from './config.json'

/* Here is your entry point React Component, this class has access to the Adobe Experience Cloud Shell runtime object */

export default class App extends React.Component {
  constructor (props) {
    super(props)

    // error handler on UI rendering failure
    this.onError = (e, componentStack) => {}

    // component to show if UI fails rendering
    this.fallbackComponent = ({ componentStack, error }) => (
      <React.Fragment>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Something went wrong :(</h1>
        <pre>{ componentStack + '\n' + error.message }</pre>
      </React.Fragment>
    )

    console.log('runtime object:', this.props.runtime)
  }

  static get propTypes () {
    return {
      runtime: PropTypes.any
    }
  }

render () {
  return (
    // ErrorBoundary wraps child components to handle eventual rendering errors
    <ErrorBoundary onError={this.onError} FallbackComponent={this.fallbackComponent} >
    <section class="banner style1 orient-left content-align-left image-position-right fullscreen onload-image-fade-in onload-content-fade-right">
        <div class="content">
            <h1>Basel</h1>
              <p class="major">A city in northwestern Switzerland on the river Rhine. Basel is Switzerland's third-most-populous city. The city is known for its many internationally renowned museums, ranging from the Kunstmuseum, the first collection of art accessible to the public in Europe (1661) and the largest museum of art in the whole of Switzerland.</p>
              <ul class="action">
                <li><a href={actions.event}>Like</a></li>
              </ul>
        </div>
        <div class="image">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Basel_-_M%C3%BCnsterpfalz1.jpg/2560px-Basel_-_M%C3%BCnsterpfalz1.jpg" alt="" />
        </div>
      </section>
    </ErrorBoundary>
  )
  }
}
