"use strict";

app.controller("AuthCtrl", function ($scope, $location, AuthFactory, DataFactory, $window) {

    $scope.auth = {
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    };

    $scope.hideRegister = true;

    $scope.login = function () {
        if($scope.auth.email !== "" && $scope.auth.password !== "") {
           AuthFactory.loginUser($scope.auth)
            .then(() =>{
            console.log("user is logged in");
            $window.location.href = "#!/navigation";
            });
        }

    };

    $scope.register = function () {
        if($scope.auth.email !== "" && $scope.auth.password !== "" && $scope.auth.firstName !== "" && $scope.auth.lastName !== "") {
            AuthFactory.createUser({
                email: $scope.auth.email,
                password: $scope.auth.password
            })
            .then(function(newUser){
                DataFactory.addNewUser({
                    uid: newUser.uid,
                    firtsName: $scope.auth.firstName,
                    lastName: $scope.auth.lastName
                });
            })
            .then((userData) => {
                $scope.login();
                $window.location.href = "#!/navigation";
            });
        }
    };

    $scope.registerClick = function () {
        $scope.hideLogin = true;
        $scope.hideRegister = false;
    };


});
