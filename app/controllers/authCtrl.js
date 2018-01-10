"use strict";

app.controller("AuthCtrl", function ($scope, $location, AuthFactory, DataFactory, $window) {

    $scope.auth = {
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    };

    let getUser = () => {
        return AuthFactory.currentUser;
    };

    $scope.hideRegister = true;

    $scope.login = function () {

        if($scope.auth.email !== "" && $scope.auth.password !== "") {
            var user = firebase.auth().currentUser;
            //console.log("scope.auth ", $scope.auth);
            //console.log("user ", user);
           AuthFactory.loginUser($scope.auth)
            .then(() =>{
               if(user){
                    console.log("user is logged in");
                    $window.location.href = "#!/navigation";
                }else{
                    $window.location.href = "#!/";
                }
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
