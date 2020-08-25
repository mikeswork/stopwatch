import React, { useState, useCallback, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import TimeList from "./TimeList";

export default function Stopwatch(props) {
	// console.log("[Stopwatch]");

	const { tickFrequency } = props;
	const startTime = useRef();

	const [interval, intervalSet] = useState(null);
	const [time, setTime] = useState({ msSoFar: 0, currentMs: 0 });
	const [lapTimes, setLapTimes] = useState([]);

	const startStop = () => {
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
	};

	const reset = () => {
		// Stop timer if running
		if (interval) startStop();

		// Reset all timer data
		intervalSet(null);
		setTime({ msSoFar: 0, currentMs: 0 });
		setLapTimes([]);
	};

	// Not really necessary to memoize this function definition but good for demo purposes.
	const grabLapTime = useCallback(() => {
		var currLapTimes = [...lapTimes];

		var newTime = getDisplayTime();
		// Only capture lap time if it's not 0 and hasn't already been captured
		if (currLapTimes[currLapTimes.length - 1] !== newTime && time.currentMs !== 0) {
			currLapTimes.push(newTime);
			setLapTimes(currLapTimes);
		}

		console.log("[grabLapTime], lap times:", currLapTimes);
	}, [lapTimes, time]);

    function getSeconds() {
		return Math.floor((time.currentMs % 60000) / 1000);
	}

    // Get time of timer formatted MM:SS.T (T = Tenth of a second).
    function getDisplayTime() {
		// console.log("[getDisplayTime], current ms:", ms);

		var minutes = Math.floor(time.currentMs / 60000);
		var seconds = Math.floor((time.currentMs % 60000) / 1000);

		// i.e. the number of milliseconds transpired after the current second
		var msBetweenSecs = time.currentMs - seconds * 1000 - minutes * 60 * 1000;
		var secTenth = Math.floor(msBetweenSecs / 100);

		var displayTime =
			(minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds + "." + secTenth;

		// console.log("[getDisplayTime], displayTime:", displayTime)

		return displayTime;
	}

	//console.log("[render]")
	var clipPathY = 100 - (getSeconds() / 60).toFixed(4) * 100;
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

				<div className="time">{getDisplayTime()}</div>
			</div>

			{useMemo(() => {
				return <TimeList times={lapTimes} />;
			}, [lapTimes])}
		</div>
	);
}

Stopwatch.propTypes = {
	// Delay, in milliseconds, between each timer update.
	tickFrequency: PropTypes.number,
};

Stopwatch.defaultProps = {
	tickFrequency: 10,
};
