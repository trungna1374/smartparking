export const parkData = (res) => ({
	type: "INITIAL_PARK_DATA",
	parks: res
})

export const loadParkDataSocket = (socket) => {
	return (dispatch) => {
		// dispatch(clearAllItems())
		socket.on('getPark',(res)=>{
		   dispatch(parkData(res))
	   })
	}	
}