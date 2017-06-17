"use strict";

app.controller("NavCtrl", function($scope, $q, DataFactory, AuthFactory, $location, $window, KeyFactory, $routeParams){

    // angular-materialize example
    /*$scope.select = {
        value: "Option1",
        choices: ["Option1", "Option 2", "Option3", "Option4"]
    };*/


    $scope.user = AuthFactory.getUser();
    console.log("user on nav ctrl", $scope.user);

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
            console.log("checking line 54", response);
            $window.location.href = "#!tops/" + response.key + "/"  + response.title;
        });
    };

    let allSuitcases = function () {
        DataFactory.getAllSuitcases($scope.user)
        .then((response) => {
            $scope.select = response;
            console.log("what is current suitcase", response);
        });
    };

    $scope.openSuitcase = function(suitKey, tittle) {
        $scope.hideTitle = false;

        KeyFactory.existingKey = suitKey;
        KeyFactory.title = tittle;
        $window.location.href = "#!tops/" + suitKey + "/"  + tittle;
    };

//    $scope.navToTops = function () {
//        $window.location.href = "#!/tops";
//    };

    getUserName();
    allSuitcases();

});
