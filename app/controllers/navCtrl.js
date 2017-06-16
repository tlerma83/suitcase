"use strict";

app.controller("NavCtrl", function($scope, $q, DataFactory, AuthFactory, TopFactory, $location, $window, KeyFactory){

    // angular-materialize example
    /*$scope.select = {
        value: "Option1",
        choices: ["Option1", "Option 2", "Option3", "Option4"]
    };*/


    $scope.user = AuthFactory.getUser();

    $scope.newSuitcase = {
        title: ""
    };


    let getUserName = function () {
        DataFactory.getUserInfo($scope.user)
        .then((response) => {
            $scope.firstName = response[0];
        });

    };


    $scope.addNewSuitcase = function () {
        $("#createNew").modal('close');
        $scope.hideTitle = false;

        $scope.newSuitcase.uid = $scope.user;
        DataFactory.addSuitCase($scope.newSuitcase)
        .then((response) => {
            KeyFactory.key = response;
            $scope.keyStuff = KeyFactory;
            return $scope.keyStuff;
        })
        .then((response) => {
            $window.location.href = "#!tops";
        });
    };

    let allSuitcases = function () {
        DataFactory.getAllSuitcases($scope.user)
        .then((response) => {
            $scope.select = response;
        });
    };

    $scope.openSuitcase = function(suitKey, tittle) {
        $scope.hideTitle = false;

        KeyFactory.existingKey = suitKey;
        KeyFactory.title = tittle;
        $window.location.href = "#!tops";
    };

    $scope.navToTops = function () {
        $window.location.href = "#!/tops";
    };

    getUserName();
    allSuitcases();

});
