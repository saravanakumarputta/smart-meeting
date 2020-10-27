import React from 'react';
import './TextBox.css';

import Label from '../Label/Label';

const TextBox = (props) => {
	let { label, changeHandler, errMsg } = props;
	return (
		<div className='formElement'>
			<Label text={label} />
			<input
				type='text'
				onChange={(e) => {
					changeHandler(e.target.value);
				}}
				className='text-control'
			/>
			{errMsg ? <div className='errColor'>{errMsg}</div> : null}
		</div>
	);
};

export default TextBox;
