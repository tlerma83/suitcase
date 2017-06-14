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
        let newPhotoObject = {};
        return $q( (resolve, reject) => {
            storageReference.child(`"images/${date}${user}.png"`).put(imageBlob)
            .then((response) => {
                return storageReference.child(`"images/${date}${user}.png"`).getDownloadURL();
            })
            .then( (picObj) => {
                newPhotoObject.url = picObj;
                newPhotoObject.uid = user;
                return $http.post(`${FBCreds.databaseURL}/tops.json`, newPhotoObject);
            })
            .then( (key) => {
                newPhotoObject.key = key.data.name;
                console.log("checkig topsKey", newPhotoObject);
                resolve(newPhotoObject);
            })
            .catch( (error) => {
                reject(error);
            });

        });
    };


    let retrievePhotos = function (userUid) {
        let topsImages = [];
        return $q( (resolve, reject) => {
        $http.get(`${FBCreds.databaseURL}/tops.json?orderBy="uid"&equalTo="${userUid}"`)
            .then( (response) => {

//                console.log("What image came back line 72", response);

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


    return{addNewUser, saveTopsImage, retrievePhotos};
});
