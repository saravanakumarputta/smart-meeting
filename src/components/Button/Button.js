import React from 'react';
import './Button.css';

const Button = (props) => {
	let { text, clickHandler } = props;
	return (
		<span
			className='button'
			onClick={() => {
				clickHandler();
			}}>
			{text}
		</span>
	);
};

export default Button;
