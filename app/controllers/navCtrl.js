"use strict";

app.controller("NavCtrl", function($scope, $q, DataFactory, AuthFactory, $location, $window, KeyFactory){

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
            console.log("getUserInfo", response);
        });

    };



    $scope.addNewSuitcase = function () {
        $("#createNew").modal('close');
        console.log("ng model info", $scope.newSuitcase);
        $scope.newSuitcase.uid = $scope.user;
        DataFactory.addSuitCase($scope.newSuitcase)
        .then((response) => {
            KeyFactory.key = response;
            $scope.keyStuff = KeyFactory;


            console.log("check KeyFactory", KeyFactory);

            return $scope.keyStuff;

        })
        .then((response) => {
            $window.location.href = "#!tops";
        });
    };

    let allSuitcases = function () {
        DataFactory.getAllSuitcases($scope.user)
        .then((response) => {
            console.log("This is all suitcases", response);
            $scope.select = response;
        });
    };

    $scope.openSuitcase = function(suitKey, tittle) {
        console.log("opensuitcase", suitKey);
        KeyFactory.existingKey = suitKey;
        KeyFactory.title = tittle;

        //$scope.selectedSuitcase = KeyFactory;
        $window.location.href = "#!tops";
    };



    getUserName();
    allSuitcases();







});
