export function formatTime(time) {
	let [hour, minutes] = time.split(':');
	return Number(`${('0' + hour).slice(-2)}${('0' + minutes).slice(-2)}`);
}

export function formatDate(date) {
	let result = new Date(date);
	return `${result.getDate()}/${result.getMonth() + 1}/${result.getFullYear()}`;
}

export function calculateFreeRooms(rooms, date, st, et) {
	let freeRooms = {};
	Object.keys(rooms).forEach((roomKey) => {
		if (rooms[roomKey].dates[date]) {
			let { blockedTime } = rooms[roomKey].dates[date];
			let isRoomBlocked = false;
			for (let i = 0; i < blockedTime.length; i += 2) {
				if (
					checkIsScheduledMeetingOverlaps(formatTime(st), formatTime(et), blockedTime[i], blockedTime[i + 1])
				) {
				} else {
					isRoomBlocked = true;
					break;
				}
			}
			if (!isRoomBlocked) {
				freeRooms[rooms[roomKey].id] = {
					id: rooms[roomKey].id,
					name: rooms[roomKey].name,
					floor: rooms[roomKey].floor
				};
			}
		} else {
			freeRooms[rooms[roomKey].id] = {
				id: rooms[roomKey].id,
				name: rooms[roomKey].name,
				floor: rooms[roomKey].floor
			};
		}
	});
	return freeRooms;
}

function checkIsScheduledMeetingOverlaps(st, et, mst, met) {
	if ((st > mst && st < met) || (et > mst && et < met)) {
		return false;
	} else if (st < mst) {
		if (et > met) {
			return false;
		} else {
			return true;
		}
	} else {
		return true;
	}
}

export function calculateCurrentOccupiedRoomsAndTotalMeeting(rooms) {
	let occupiedRooms = 0,
		totalMeetings = 0;
	let date = formatDate(Date.now());
	let currentTime = formatTime(`${new Date().getHours()}:${new Date().getMinutes()}`);
	Object.keys(rooms).forEach((roomKey) => {
		if (rooms[roomKey].dates[date]) {
			let { blockedTime } = rooms[roomKey].dates[date];
			totalMeetings += blockedTime.length / 2;
			for (let i = 0; i < blockedTime.length; i += 2) {
				if (checkIsRoomCurrrentlyOccupied(currentTime, blockedTime[i], blockedTime[i + 1])) {
					occupiedRooms++;
					break;
				}
			}
		}
	});
	return { occupiedRooms, totalMeetings };
}

function checkIsRoomCurrrentlyOccupied(ct, mst, met) {
	if (ct === mst) {
		return true;
	}
	if (ct === met) {
		return true;
	}
	if (ct > mst && ct < met) {
		return true;
	}
}
