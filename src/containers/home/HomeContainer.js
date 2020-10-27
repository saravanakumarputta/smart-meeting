import React from 'react';
import './HomeContainer.css';

import { calculateCurrentOccupiedRoomsAndTotalMeeting } from '../../helpers';

export default class HomeContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			buildingCount: 0,
			meetingsCount: 0,
			currentMeetingCount: 0,
			meetingRoomsCount: 0,
			freeMeetingRoomCount: 0
		};
	}

	static getDerivedStateFromProps(props, state) {
		let { info } = props;
		if (Object.keys(info).length > 0) {
			let meetingRoomsCount = 0,
				meetingsToday = 0,
				occupiedMeetingRoom = 0;

			Object.keys(info).forEach((buildingId) => {
				let meetingRoomIds =
					(info[buildingId].meetingRooms && Object.keys(info[buildingId].meetingRooms)) || [];
				if (meetingRoomIds.length > 0) {
					meetingRoomsCount += meetingRoomIds.length;
					let { occupiedRooms, totalMeetings } = calculateCurrentOccupiedRoomsAndTotalMeeting(
						info[buildingId].meetingRooms
					);
					occupiedMeetingRoom += occupiedRooms;
					meetingsToday += totalMeetings;
				}
			});

			state.buildingCount = Object.keys(info).length;
			state.meetingRoomsCount = meetingRoomsCount;
			state.meetingsCount = meetingsToday;
			state.freeMeetingRoomCount = meetingRoomsCount - occupiedMeetingRoom;
			state.currentMeetingCount = occupiedMeetingRoom;
		}
		return state;
	}
	render() {
		let { buildingCount, meetingRoomsCount, meetingsCount, currentMeetingCount, freeMeetingRoomCount } = this.state;
		return (
			<div className='dflex flexcolumn homeContainer h100'>
				<div className='flexgrow dashboard'>
					<div className='dflex flexcolumn alignVertical'>
						<div className='card'>
							<h4>Buildings</h4>
							<h5>{buildingCount}</h5>
						</div>
						<div className='card'>
							<h4>Rooms</h4>
							<h5>Total : {meetingRoomsCount}</h5>
							<h5>Free : {freeMeetingRoomCount}</h5>
						</div>
						<div className='card'>
							<h4>Meetings</h4>
							<h5>Today : {meetingsCount}</h5>
							<h5>Now Happening : {currentMeetingCount}</h5>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
