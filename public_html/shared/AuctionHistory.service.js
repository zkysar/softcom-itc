myApp.service("AuctionHistoryService", function(mySocket, MeService){
	var service = this;
	this.auctionHistory = {};

	this.loadAuctionHistory = function(){
		var uid = MeService.getUId();
		if(uid == null || uid == ""){
			console.log("Blank uid, cannot load Auction History");
			return;
		}
		var callback = function(data){
			console.log(data);
			service.auctionHistory = data;
			mySocket.removeListener("getAuctionHistory", callback);
		}
		mySocket.emit("getAuctionHistory",uid);
		mySocket.on("getAuctionHistory",callback);
	}
	this.getAuctionHistory = function(){
		return service.auctionHistory;
	}
})