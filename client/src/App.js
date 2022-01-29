import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import MainPage from './Mainpage'
import View from './view'


class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route path="/view" component={View} />
					<Route path="/" component={MainPage} />

				</Switch>
			</BrowserRouter>
		)
	}
}

export default App;
