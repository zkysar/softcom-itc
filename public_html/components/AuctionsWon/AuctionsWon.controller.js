myApp.controller('AuctionsWonController', ['$scope',  'AuctionsWonService', "MeService",
    function($scope, AuctionsWonService, MeService) {
        $scope.title = "Auctions Won";
        MeService.addCallback(AuctionsWonService.loadAuctionsWon);
        $scope.auctionsWon = AuctionsWonService.getAuctionsWon;
    }]);