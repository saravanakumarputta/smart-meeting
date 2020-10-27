import React from 'react';
import './Card.css';

const Card = (props) => {
	let { name, floor, isSelected, clickHandler, id } = props;
	return (
		<div
			className={`${isSelected ? 'selected' : ''} cardContainer`}
			onClick={() => {
				clickHandler(id);
			}}>
			<div>
				<h3>{name}</h3>
			</div>
			<div>
				<h5>Floor : {floor}</h5>
			</div>
		</div>
	);
};

export default Card;
