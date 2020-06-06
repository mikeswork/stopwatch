import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import TimeList from "./TimeList";

export default function Stopwatch(props) {
	// console.log("[Stopwatch]");

	const tickFrequency = props.frequency;
	const startTime = useRef();

	const [interval, intervalSet] = useState(null);
	const [time, setTime] = useState({ msSoFar: 0, currentMs: 0 });
	const [lapTimes, setLapTimes] = useState([]);

	const startStop = useCallback(() => {
		// Start timer
		if (!interval) {
			startTime.current = Date.now();

			// Increment timer every tickFrequency
			var newInterval = setInterval(() => {
				// console.log("msSoFar", msSoFar, "+ Date.now()", Date.now(), "- startTime", startTime )
				setTime(Object.assign({}, time, { currentMs: time.msSoFar + Date.now() - startTime.current }));
			}, tickFrequency);

			intervalSet(newInterval);

			// Stop timer
		} else {
			clearInterval(interval);
			intervalSet(null);
			// console.log("msSoFar", msSoFar, "= currentMs", currentMs);
			setTime(Object.assign({}, time, { msSoFar: time.currentMs }));
		}
	}, [interval, time, tickFrequency])

	const reset = useCallback(() => {
		// Stop timer if running
		if (interval)
			startStop();

		// Reset all timer data
		intervalSet(null);
		setTime({ msSoFar: 0, currentMs: 0 });
		setLapTimes([]);
	}, [interval, startStop])

	const grabLapTime = useCallback(() => {
		var currLapTimes = [...lapTimes];

		var newTime = msToDisplayTime(time.currentMs);
		// Only capture lap time if it's not 0 and hasn't already been captured
		if (currLapTimes[currLapTimes.length - 1] !== newTime && time.currentMs !== 0) {
			currLapTimes.push(newTime);
			setLapTimes(currLapTimes);
		}

		console.log("[grabLapTime], lap times:", currLapTimes);
	}, [lapTimes, time])

	function msToSeconds(ms) {
		return Math.floor((ms % 60000) / 1000);
	}

	// Convert timer milliseconds to display time, formatted MM:SS:T (T = Tenth of a second).
	function msToDisplayTime(ms) {
		// console.log("[msToDisplayTime], current ms:", ms);

		var minutes = Math.floor(ms / 60000);
		var seconds = Math.floor((ms % 60000) / 1000);

		// i.e. the number of milliseconds transpired after the current second
		var msBetweenSecs = ms - seconds * 1000 - minutes * 60 * 1000;
		var secTenth = Math.floor(msBetweenSecs / 100);

		var displayTime =
			(minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds + ":" + secTenth;

		// console.log("[msToDisplayTime], displayTime:", displayTime)

		return displayTime;
	}

	//console.log("[render]")
	var clipPathY = 100 - (msToSeconds(time.currentMs) / 60).toFixed(4) * 100;
	// console.log("clipPathY:", clipPathY)

	return (
		<div className="stopwatch">
			<div className="buttons">
				<button onClick={startStop}>{interval ? "Stop" : "Start"}</button>
				<button onClick={grabLapTime}>Lap</button>
				<button onClick={reset}>Reset</button>
			</div>

			<div className="time-display">
				<div
					className="progress"
					style={{ clipPath: `polygon(0 ${clipPathY}%, 100% ${clipPathY}%, 100% 100%, 0 100%)` }}
				></div>

				<div className="time">{msToDisplayTime(time.currentMs)}</div>
			</div>

			<TimeList times={lapTimes} />
		</div>
	);
}

Stopwatch.propTypes = {
	// Delay, in milliseconds, between each timer update.
	frequency: PropTypes.number,
};

Stopwatch.defaultProps = {
	frequency: 10,
};
