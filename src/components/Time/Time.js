import React from 'react';
import './Time.css';

import Label from '../Label/Label';

import TimePicker from 'react-time-picker';

// import SelectBox from '../SelectBox/SelectBox';

const Time = (props) => {
	const { text, changeHandler, value } = props;
	// let options = [];

	// for (let i = startValue; i <= maxValue; i++) {
	// 	options.push({ prompt: i, name: i });
	// }

	return (
		<div className='form-element'>
			<Label text={text} />
			<TimePicker
				onChange={(value) => {
					changeHandler(value);
				}}
				value={value}
				minTime={new Date()}
				className='b3px'
				disableClock={true}
			/>
		</div>
		// <SelectBox options={options} label={text} changeHandler={changeHandler} />
	);
};

export default Time;
