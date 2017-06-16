"use strict";
app.factory("BottomFactory", function($q, $http, FBCreds, AuthFactory, KeyFactory){

    let saveBottomsImage = function (imageBlob, user, date) {
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
                return $http.post(`${FBCreds.databaseURL}/bottoms.json`, newPhotoObject);
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

    let retrieveBottomsPhotos = function (userUid) {
        let bottomsImages = [];
        return $q( (resolve, reject) => {
        $http.get(`${FBCreds.databaseURL}/bottoms.json?orderBy="uid"&equalTo="${userUid}"`)
            .then( (response) => {
                let imageObj = response.data;
                Object.keys(imageObj).forEach( (key) => {
                    imageObj[key].key_id = key;
                    bottomsImages.push(imageObj[key]);
                });
                console.log("do we have an image object?", bottomsImages);
                resolve(bottomsImages);
            })
            .catch( (error) => {
                reject(error);
            });
        });
    };

    let deleteBottomsImage = function (photoKey) {
        return $q( (resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/bottoms/${photoKey}.json`)
            .then((response) => {
                console.log("Delete success");
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    return{
        saveBottomsImage,
        retrieveBottomsPhotos,
        deleteBottomsImage
    };
});
