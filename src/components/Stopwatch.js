import React, { PureComponent } from "react";

class Stopwatch extends PureComponent {
	state = {
		interval: null,
		currentMs: 0,
		lapTimes: [],
	};

	constructor(props) {
		super(props);

		// How often, in milliseconds, timer gets updated.
		this.tickFrequency = props.frequency || 10;
		this.msSoFar = 0;
	}

	nextId() {
		this.uniqueId = this.uniqueId || 0;
		return this.uniqueId++;
	}

	startStop() {
		if (this.state.interval) {
			clearInterval(this.state.interval);
			this.setState({ interval: null });
			this.msSoFar = this.state.currentMs;
		} else {
			this.startTime = Date.now();

			var newInterval = setInterval(() => {
				this.setState({ currentMs: this.msSoFar + Date.now() - this.startTime });
			}, this.tickFrequency);

			this.setState({ interval: newInterval });
		}
	}

	grabLapTime() {
		this.setState((currState) => {
			var currLapTimes = [...currState.lapTimes];

			var newTime = this.msToDisplayTime(currState.currentMs);
			// Only capture lap time if it's not 0 and hasn't already been captured
			if (
				currLapTimes[currLapTimes.length - 1] !== newTime &&
				currState.currentMs !== 0
			) {
				currLapTimes.push(newTime);
			}

			// console.log("[grabLapTime], lap times:", currLapTimes);

			return {
				lapTimes: currLapTimes,
			};
		});
	}

	msToSeconds(ms) {
		return Math.floor((ms % 60000) / 1000);
	}

	// Convert timer milliseconds to display time, formatted MM:SS:T (T = Tenth of a second).
	msToDisplayTime(ms) {
		// console.log("[msToDisplayTime], current ms:", ms);

		var minutes = Math.floor(ms / 60000);
		var seconds = Math.floor((ms % 60000) / 1000);

		// i.e. the number of milliseconds transpired after the current second
		var msBetweenSecs = ms - seconds * 1000 - minutes * 60 * 1000;
		var secTenth = Math.floor(msBetweenSecs / 100);

		var displayTime =
			(minutes < 10 ? "0" : "") +
			minutes +
			":" +
			(seconds < 10 ? "0" : "") +
			seconds +
			":" +
			secTenth;

		// console.log("[msToDisplayTime], displayTime:", displayTime)

		return displayTime;
	}

	render() {
		//console.log("[render]")
		var clipPathY = 100 - ((this.msToSeconds(this.state.currentMs) / 60).toFixed(4) * 100);
		// console.log("clipPathY:", clipPathY)

		return (
			<div className="stopwatch">
				<div className="buttons">
					<button onClick={this.startStop.bind(this)}>
						{this.state.interval ? "Stop" : "Start"}
					</button>
					<button onClick={this.grabLapTime.bind(this)}>Lap</button>
				</div>

				<div className="time-display">
					<div className="progress" style={{clipPath: `polygon(0 ${clipPathY}%, 100% ${clipPathY}%, 100% 100%, 0 100%)`}}></div>

					<div className="time">
						{this.msToDisplayTime(this.state.currentMs)}
					</div>
				</div>

				<div className="lap-times">
					{this.state.lapTimes.map((lapTime, indx) => {
						return (
							<div key={this.nextId()}>{`${
								indx + 1
							}. ${lapTime}`}</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default Stopwatch;
