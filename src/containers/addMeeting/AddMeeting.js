import React from 'react';
import './AddMeeting.css';

import DatePick from '../../components/Date/Date';
import TimePick from '../../components/Time/Time';
import TextBox from '../../components/TextBox/TextBox';
import SelectBox from '../../components/SelectBox/SelectBox';
import Button from '../../components/Button/Button';

import Card from '../../components/Card/Card';
import { gql, GraphQLClient } from 'graphql-request';

import { calculateFreeRooms } from '../../helpers';

export default class AddMeeting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			meetingRooms: {},
			buildings: [],
			selectMeetingRoomId: null,
			meetingTitle: null,
			startTime: new Date(),
			endTime: new Date(),
			meetingDate: new Date(),
			normalizedData: {},
			meetingRoomErr: '',
			titleErr: ''
		};
		this.handleMeetingDateChange = this.handleMeetingDateChange.bind(this);
		this.handleMeetingTitleChange = this.handleMeetingTitleChange.bind(this);
		this.handleBuildingChange = this.handleBuildingChange.bind(this);
		this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
		this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	componentDidMount() {
		let { info } = this.props;
		let buildings = Object.keys(info).reduce((arr, building) => {
			arr.push({ name: info[building].name, id: info[building].id });
			return arr;
		}, []);

		this.setState({ buildings: buildings });
		this.setState({ normalizedData: info });
	}

	handleMeetingDateChange(value) {
		this.setState({ meetingDate: value });
	}

	handleMeetingTitleChange(value) {
		if (value) {
			this.setState({ meetingTitle: value });
			this.setState({ titleErr: '' });
		} else {
			this.setState({ titleErr: 'Please provide the Title of the meeting' });
		}
	}

	handleStartTimeChange(value) {
		console.log(value);
		this.setState({ startTime: value });
	}

	handleEndTimeChange(value) {
		this.setState({ endTime: value });
	}

	handleBuildingChange(value) {
		let { normalizedData, meetingDate, startTime, endTime } = this.state;
		meetingDate = `${meetingDate.getDate()}/${meetingDate.getMonth() + 1}/${meetingDate.getFullYear()}`;
		let meetingRooms = normalizedData[value.id].meetingRooms;
		if (typeof startTime === 'object') {
			startTime = `${startTime.getHours()}:${startTime.getMinutes()}`;
		}
		if (typeof endTime === 'object') {
			endTime = `${endTime.getHours()}:${endTime.getMinutes()}`;
		}
		let freeRooms = calculateFreeRooms(meetingRooms, meetingDate, startTime, endTime);
		this.setState({ meetingRooms: freeRooms });
	}

	handleSave() {
		let { selectMeetingRoomId, meetingTitle, startTime, endTime, meetingDate, titleErr } = this.state;
		meetingDate = `${meetingDate.getDate()}/${meetingDate.getMonth() + 1}/${meetingDate.getFullYear()}`;

		if (typeof startTime === 'object') {
			startTime = `${startTime.getHours()}:${startTime.getMinutes()}`;
		}
		if (typeof endTime === 'object') {
			endTime = `${endTime.getHours()}:${endTime.getMinutes()}`;
		}
		let _this = this;

		if (meetingTitle && titleErr === '') {
			if (selectMeetingRoomId) {
				const client = new GraphQLClient('http://smart-meeting.herokuapp.com', {
					headers: { token: 'a123gjhgjsdf6576' }
				});

				const addMeeting = gql`
					mutation AddMeeting(
						$id: Int!
						$title: String!
						$meetingDate: String!
						$startTime: String!
						$endTime: String!
						$meetingRoomId: Int!
					) {
						Meeting(
							id: $id
							title: $title
							date: $meetingDate
							startTime: $startTime
							endTime: $endTime
							meetingRoomId: $meetingRoomId
						) {
							id
							title
							date
							startTime
							endTime
						}
					}
				`;

				const variables = {
					id: 13,
					title: meetingTitle,
					meetingDate,
					startTime,
					endTime,
					meetingRoomId: parseInt(selectMeetingRoomId)
				};
				client
					.request(addMeeting, variables)
					.then((res) => {
						console.log(res);
						alert('Meeting Added Successfully!!!');
						_this.setState({
							meetingRooms: {},
							selectMeetingRoomId: null,
							meetingTitle: null,
							startTime: new Date(),
							endTime: new Date(),
							meetingDate: new Date()
						});
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				alert('Please select the meeting room to book');
			}
		} else {
			_this.setState({ titleErr: 'Please provide the Title of the meeting' });
		}
	}

	render() {
		let { meetingRooms, buildings, titleErr } = this.state;
		return (
			<div className='formContainer dflex flexcolumn h100'>
				<div className='formControls flexshrink prl3' style={{ paddingTop: '15px' }}>
					<TextBox label='Meeting Title' changeHandler={this.handleMeetingTitleChange} errMsg={titleErr} />
					<div className='dflex alignBetween dateInputCont'>
						<DatePick
							text='Select Date'
							changeHandler={this.handleMeetingDateChange}
							value={this.state.meetingDate}
						/>
						<TimePick
							text='Select Start Time'
							changeHandler={this.handleStartTimeChange}
							value={this.state.startTime}
						/>
						<TimePick
							text='Select End Time'
							changeHandler={this.handleEndTimeChange}
							value={this.state.endTime}
						/>
					</div>
					{buildings.length > 0 ? (
						<SelectBox
							label='Select building'
							options={buildings}
							changeHandler={this.handleBuildingChange}
						/>
					) : null}
				</div>
				<div className='flexgrow prl3'>
					<div className='dflex flexcolumn h100'>
						<h3 className='flexshrink'>Choose the Available Meeting Rooms</h3>
						{Object.keys(meetingRooms).length > 0 ? (
							<div className='flexgrow meetingRooms'>
								{Object.keys(meetingRooms).map((meetingRoom) => {
									return (
										<Card
											isSelected={this.state.selectMeetingRoomId === meetingRoom}
											key={meetingRooms[meetingRoom].id}
											id={meetingRoom}
											name={meetingRooms[meetingRoom].name}
											floor={meetingRooms[meetingRoom].floor}
											clickHandler={(id) => {
												this.setState({ selectMeetingRoomId: id });
											}}
										/>
									);
								})}
							</div>
						) : null}
					</div>
				</div>
				<div className='flexshrink footer prl3' style={{ marginTop: '5px' }}>
					<Button text='Add Meeting' clickHandler={this.handleSave} />
				</div>
			</div>
		);
	}
}
