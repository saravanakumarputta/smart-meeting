import React from 'react';
import './SelectBox.css';

import Label from '../Label/Label';

export default function SelectBox(props) {
	let { options, label, changeHandler } = props;

	let [selectedValue, setSelectedValue] = React.useState(options[0]);
	let [isOpen, setIsOpen] = React.useState(false);

	return (
		<div className='form-element'>
			<Label text={label} />
			<div className='dflex flexcolumn selectContainer' style={isOpen ? { borderColor: '#3b4796' } : {}}>
				<div
					className='selectBox dflex alignVertical'
					onClick={() => {
						setIsOpen(true);
					}}>
					{selectedValue.name}
				</div>
				<div className={`selectOptions ${isOpen ? 'show' : 'hide'}`}>
					<div
						className='dflex flexcolumn'
						style={{ overflow: 'hidden', overflowY: 'auto', maxHeight: '200px' }}>
						{options.map((item, index) => {
							return (
								<span
									key={index}
									className={` dflex alignVertical selectBoxOption plr20 ${
										selectedValue === item ? 'selectedOption' : ''
									}`}
									onClick={(e) => {
										changeHandler(item);
										setSelectedValue(item);
										setIsOpen(false);
									}}>
									{item.name}
								</span>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
