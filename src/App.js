import React from "react";
import "./App.css";
import Stopwatch from "./components/Stopwatch";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Stopwatch</h1>
			</header>

			<Stopwatch />
		</div>
	);
}

export default App;
