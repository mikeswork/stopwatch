import React, { useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import TimeList from "./TimeList";

export default function Stopwatch(props) {
	// console.log("[Stopwatch]");

	const { tickFrequency } = props;

	const [interval, intervalSet] = useState(null);
	const [time, setTime] = useState(0);
	const [lapTimes, setLapTimes] = useState([]);

    const startTime = useRef();
    const timeBeforeStart = useRef(0);

	const startStop = () => {
		// Start timer
		if (!interval) {
			startTime.current = Date.now();

			// Increment timer every tickFrequency
			const newInterval = setInterval(() => {
                const transpiredTime = Date.now() - startTime.current;
                setTime(timeBeforeStart.current + transpiredTime);
			}, tickFrequency);

			intervalSet(newInterval);

        // Stop timer
		} else {
			clearInterval(interval);
            intervalSet(null);
            
            timeBeforeStart.current = time;
		}
	};

	const reset = () => {
		// Stop timer if running
		if (interval) startStop();

		// Reset all timer data
		intervalSet(null);
        timeBeforeStart.current = 0;
        setTime(0);
		setLapTimes([]);
	};

	const grabCurrentTime = () => {
		var currLapTimes = [...lapTimes];

		var newTime = getDisplayTime();
		// Only capture lap time if it's not 0 and hasn't already been captured
		if (currLapTimes[currLapTimes.length - 1] !== newTime && time !== 0) {
			currLapTimes.push(newTime);
			setLapTimes(currLapTimes);
		}

		console.log("[grabCurrentTime], lap times:", currLapTimes);
	};

    function getSeconds() {
		return Math.floor((time % 60000) / 1000);
	}

    // Get time of timer formatted MM:SS.T (T = Tenth of a second).
    function getDisplayTime() {
		// console.log("[getDisplayTime], current ms:", ms);

		var minutes = Math.floor(time / 60000);
		var seconds = Math.floor((time % 60000) / 1000);

		// i.e. the number of milliseconds transpired after the current second
		var msBetweenSecs = time - seconds * 1000 - minutes * 60 * 1000;
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
				<button onClick={grabCurrentTime}>Lap</button>
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
