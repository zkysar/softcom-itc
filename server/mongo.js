var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

var uri = 'mongodb://nodeserver:wewillwin@ds011860.mlab.com:11860/itcsoftcomlab';
var db;
var users_collection;
var bids_collection;
var auctions_collection;
var bid_history__collection;


var exports = module.exports = {}

exports.foo = function(){
  console.log("MONGO FOO");
}


exports.getUserInfo = function(userID, username, callback){
    //users_collection.findOne({ _id: new ObjectId(userID)},
    users_collection.findOne({ _id: userID},
        function(err,result){
            if (err) throw err;
            console.log("===RETRIEVED USER===");
            if (!result){
                //first time user, create account
                console.log("===NEW USER===")
                exports.createNewUser(userID, username, function(result){
                    callback(result);
                });
            }
            else{
                console.log("===RETURNING USER===")
                callback(result);
            }
        }
    );
}

exports.createNewUser = function(userID, username, callback){
    var aUser = {
        _id: userID,
        username: username,
        bids: [],
        auctions: [],
        comments: {
        }
    };

    users_collection.insert(aUser, function(err, result){
        if(err) throw err;
        console.log("+++USER CREATED+++");
        var userDocument = result.ops[0];
        callback(userDocument);
    });

    var emptyBidHistory = {
        _id: userID,
        history: []
    };
    bid_history__collection.insert(emptyBidHistory, function(err, result){
        console.log("+++Initialized New User's Bid History in bid_history_collection");
    })

};

exports.createNewAuction = function(userID, title, description, startingAmount, callback){
    var auction = {
        title: title,
        description: description,
        userID: userID,
        startingAmount : startingAmount,
        bids: []
    };

    auctions_collection.insert(auction, function(err, result){
        if(err) throw err;
        console.log("+++AUCTION CREATED+++");
        var auctionDocument = result.ops[0];
        callback(auctionDocument);

        users_collection.update({_id: userID},{$push: {auctions: auctionDocument._id}}, function(err, added){
            if(err) throw err;
            console.log("Updated user.auctions[] with users new auction");
        });
    })
};


exports.createNewBid = function(userID, bidAmount, auctionID, callback){
    var bid = {
        userID: userID,
        amount : bidAmount,
        auctionID: auctionID
    };

    bids_collection.insert(bid, function(err, result){
        if(err) throw err;
        console.log("+++BID CREATED+++");

        var bidDocument = result.ops[0];
        callback(bidDocument);

        //Update users_collections.bids[]
        users_collection.update({_id: userID},{$push: {bids: bidDocument._id}}, function(err, added){
            if(err) throw err;
            console.log("Updated user.bids[] with users new bid.");
        });

        //Update auctions_collections.bids[]
        auctions_collection.update({_id: auctionID},{$push: {bids: bidDocument._id}}, function(err, added){
            if(err) throw err;
            console.log("Updated auction.bids[] with users new bid.");
        });

        //update user's bid_history_collection.history[]
        auctions_collection.findOne({_id: auctionID},function(err, result){
            console.log("AUCTION: ", result)
            var newBidHistoryBid = {
                bid: bidDocument,
                auction: result
            };
            console.log("newBidHistoryBid",newBidHistoryBid)
            bid_history__collection.update({_id: userID},{$push: {history: newBidHistoryBid}}, function(err, added){
                if(err) throw err;
                console.log("Updated bid_history_collection.history[] with users new bid.");
            });
        });
    })
};

exports.getBidHistory = function(userID, callback){
    var user = {_id: userID};
    bid_history__collection.find(user,{history: true}).toArray( function(err, result){

        console.log("====Got Bid History for user: "+userID +"====");
        callback(result);

    });
};



//Connect to mLab
mongodb.MongoClient.connect(uri, function(err, dbRef) {
    if(err) throw err;
    db = dbRef;
    setupCollections();
});


function setupCollections(){
    users_collection = db.collection('users');
    bids_collection = db.collection('bids');
    auctions_collection = db.collection('auctions');
    bid_history__collection = db.collection("bid_history");
}
