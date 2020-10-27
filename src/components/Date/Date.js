import React from 'react';
import './Date.css';

import Label from '../Label/Label';

import DatePicker from 'react-date-picker';

const DatePick = (props) => {
	const { text, changeHandler, value } = props;

	return (
		<div className='form-element'>
			<Label text={text} />
			<DatePicker
				onChange={(date) => {
					changeHandler(date);
				}}
				value={value}
				minDate={new Date()}
				className='b3px'
			/>
		</div>
	);
};

export default DatePick;
