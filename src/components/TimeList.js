import React from "react";

export default function TimeList(props) {
	var uniqueId = 0;

	return (
		<div className="lap-times">
			{props.times.map((lapTime, indx) => {
				return <div key={uniqueId++}>{`${indx + 1}. ${lapTime}`}</div>;
			})}
		</div>
	);
}