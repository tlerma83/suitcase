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

//    let saveWebCamImage = function (imageBlob, user, date) {
//
//        let storageReference = firebase.storage().ref();
//        storageReference.child(`"images/${date}${user}.png"`).put(imageBlob)
//        .then((response) => {
//            return storageReference.child(`"images/${date}${user}.png"`).getDownloadURL();
//        })
//        .then((picObj) => {
//            console.log("Picture Object", picObj);
//           let picUrl = {
//               url: picObj,
//               uid: user
//           };
//           return $http.post(`${FBCreds.databaseURL}/img.json`, picUrl);
//        })
//        .then( (url) => {
//            console.log("FB url : ", url);
//        })
//        .catch( (error) => {
//            console.log("Webcam image was not saved", error);
//        });
//    };

    let saveTopsImage = function (imageBlob, user, date) {
        let storageReference = firebase.storage().ref();
        storageReference.child(`"images/${date}${user}.png"`).put(imageBlob)
        .then((response) => {
            return storageReference.child(`"images/${date}${user}.png"`).getDownloadURL();
        })
        .then( (picObj) => {
            let picUrl = {
                url: picObj,
                uid: user
            };
            return $http.post(`${FBCreds.databaseURL}/tops.json`, picUrl);
        })
        .then( (url) => {
            console.log("FB  tops url : ", url.data.name);
            let topsKey = url.data.name;
            return retrievePhoto(user);
        })
        .catch( (error) => {
            console.log("Tops Image not saved", error);
        });
    };


    let retrievePhoto = function (user) {
        let topsImages = [];
        return $q( (resolve, reject) => {
        $http.get(`${FBCreds.databaseURL}/tops.json?orderBy="uid"&equalTo="${user}"`)
            .then( (response) => {

                let imageObj = response.data;
                Object.keys(imageObj).forEach( (key) => {
                    imageObj[key].key_id = key;
                    topsImages.push(imageObj[key]);
                });
                console.log("do we have an image object?", topsImages);
                resolve(topsImages);
            })
            .catch( (error) => {
                reject(error);
            });


        });
    };


    return{addNewUser, saveTopsImage, retrievePhoto};
});
