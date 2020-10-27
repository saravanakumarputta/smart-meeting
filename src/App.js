import React from 'react';
import './App.css';

import HomeContainer from './containers/home/HomeContainer';
import AddMeeting from './containers/addMeeting/AddMeeting';

import { formatTime } from './helpers';

import { gql, GraphQLClient } from 'graphql-request';

const buildings1 = gql`
	{
		Buildings {
			id
			name
			meetingRooms {
				id
				name
				floor
				meetings {
					id
					title
					startTime
					endTime
					date
				}
			}
		}
	}
`;

const client = new GraphQLClient('http://smart-meeting.herokuapp.com', {
	headers: { token: 'a123gjhgjsdf6576' }
});

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			buildingsInfo: {},
			currentPage: 'home'
		};
		this.getNormalizedData = this.getNormalizedData.bind(this);
	}

	componentDidMount() {
		let _this = this;
		client
			.request(buildings1)
			.then((res) => {
				_this.setState({ buildings: res.Buildings });
				let data = this.getNormalizedData(res.Buildings);
				_this.setState({ buildingsInfo: data });
			})
			.catch((err) => {
				debugger;
				alert('Error occured while fetching the Buildings information!!!');
			});
	}

	getNormalizedData(Buildings) {
		let result = {};
		Buildings.forEach((building) => {
			let resultRooms = {};
			result[building.id] = {
				id: building.id,
				name: building.name
			};
			let { meetingRooms = [] } = building;
			meetingRooms.forEach((room) => {
				let { id, name, meetings = [], floor } = room;
				resultRooms[id] = resultRooms[id] || {
					id,
					name,
					floor
				};
				resultRooms[id].dates = resultRooms[id].dates || {};
				meetings.forEach((meeting) => {
					let { id: meetingId, title, startTime, endTime, date } = meeting;
					resultRooms[id].dates[date] = resultRooms[id].dates[date] || {};
					resultRooms[id].dates[date].blockedTime = resultRooms[id].dates[date].blockedTime || [];
					let startKey = formatTime(startTime),
						endKey = formatTime(endTime);
					resultRooms[id].dates[date].blockedTime.push(startKey, endKey);
					resultRooms[id].dates[date][`${startKey}${endKey}`] = {
						id: meetingId,
						title
					};
				});
				result[building.id].meetingRooms = resultRooms;
			});
		});
		return result;
	}

	render() {
		let { currentPage, buildingsInfo } = this.state;
		return (
			<div className='dflex flexcolumn container h100 sectionContainer'>
				<div className='heading'>
					<div className='dflex alignVertical alignBetween nav'>
						<h3
							onClick={() => {
								this.setState({ currentPage: 'home' });
							}}>
							Smart Meeting
						</h3>
						<h5
							onClick={() => {
								this.setState({ currentPage: 'addMeeting' });
							}}>
							Add Meeting
						</h5>
					</div>
				</div>
				<div className='flexgrow'>
					{currentPage === 'home' ? (
						<HomeContainer info={buildingsInfo} />
					) : (
						<AddMeeting info={buildingsInfo} />
					)}
				</div>
			</div>
		);
	}
}
