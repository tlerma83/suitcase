"use strict";

app.factory("DataFactory", function($q, $http, FBCreds, AuthFactory){

    let addNewUser = function (newUser) {
       return $q((resolve, reject) => {
            $http.post(`${FBCreds.databaseURL}/user.json`, newUser)
           .then((response) => {
                console.log("new user added");
                resolve(response);
            })
           .catch((error) => {
                console.log("Error adding new user");
                reject(error);
            });
        });
    };

    let saveWebCamImage = function (imageBlob) {
//        return $q((resolve, reject) => {
//
//        })

        var date = new Date();
//        var userUid = uid;

        let storageReference = firebase.storage().ref();
        console.log("What did storageRef do?", storageReference);

        storageReference.child(`"/images/${date}.jpg"`).put(imageBlob)
        .then((response) => {
            return storageReference.child("/images/photo.jpg").getDownloadURL();
//            console.log("Webcam image was sotred", response);


        })
        .then( (url) => {
            console.log("FB url : ", url);
        })
        .catch((error) => {
            console.log("Webcam image was not saved", error);
        });
    };



    return{addNewUser, saveWebCamImage};
});
