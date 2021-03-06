myApp.controller('HomeController', ['$scope', 'mySocket', 'MeService','Auth', 'AuthData', 'SearchService', 
	function($scope, mySocket,MeService, Auth, AuthData, SearchService) {

        $scope.title = "Home";
        $scope.me = MeService;

        $scope.formInput;
        $scope.auctionSearchResults = function(){
            return SearchService.getResults()
        };
        $scope.search = function(){
            SearchService.search($scope.formInput.searchText);
        }
        SearchService.search("lawn");
    }
]);
