"use strict";

app.controller("NavCtrl", function($scope, $q, DataFactory, AuthFactory, $location, $window, $routeParams){


    $scope.user = AuthFactory.getUser();
    $scope.newSuitcase = {title: ""};
    $scope.menuItems = [
        {url: `tops/${$routeParams.suitcaseKey}/${$routeParams.suitTitle}`, name: "Tops"},
        {url: `bottoms/${$routeParams.suitcaseKey}/${$routeParams.suitTitle}`, name: "Bottoms"},
        {url: `shoes/${$routeParams.suitcaseKey}/${$routeParams.suitTitle}`, name: "Shoes"},
        {url: `packlist/${$routeParams.suitcaseKey}/${$routeParams.suitTitle}`, name: "Pack List"}
    ];


    $scope.logout = function () {
        AuthFactory.logout();
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
            $window.location.href = "#!tops/" + response.key + "/"  + response.title;
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
        $window.location.href = "#!tops/" + suitKey + "/"  + tittle;
    };


    getUserName();
    allSuitcases();

});
