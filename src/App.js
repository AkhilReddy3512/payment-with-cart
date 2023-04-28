import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./components/checkout";
import Success from "./components/Success";
import Failure from './components/Failure';
import "./App.css"

const App = () => {
  return (
	<div>
	  <Router>
		<Routes>
			<Route index element={<Checkout />}/>
			<Route path="success" element={<Success />} />
			<Route path="failure" element={<Failure />} />
		</Routes>
	  </Router>

	</div>
  )
}

export default App
