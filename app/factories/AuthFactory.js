"use strict";

app.factory("AuthFactory", function($q, $http){
    let currentUser = null;
    let getUser = () => {
        return currentUser;
    };


    // register new user
    let createUser = function(userObj){
        return firebase.auth().createUserWithEmailAndPassword(userObj.email, userObj.password)
        .catch(function(error){
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log("This is an error: ", errorCode, errorMessage);
        });
    };

    // let current user login
    let loginUser = (userObj) => {
        return firebase.auth().signInWithEmailAndPassword(userObj.email, userObj.password)
        .catch(function(error){
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log("This is a login error", errorCode, errorMessage);
        });
    };

    // let user logout
    let logout = () => {
        return firebase.auth().signout()
        .then(function(data){
            console.log("User logged out");
        });
    };


    // is user authorized? if so keep user looged in when navigatin page
    let isAuthorized = function () {
        return $q((resolve, reject) => {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    currentUser = user.uid;
                    console.log("Current user uid: ", currentUser);
                    resolve(true);
                }else {
                    resolve(false);
                }

            });
        });
    };


return{createUser, loginUser, logout, isAuthorized, currentUser, getUser};

});
