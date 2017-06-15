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
    //// For Tops Controller
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

    //Retriesve Tops images only
    let retrieveTopsPhotos = function (userUid) {
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

    
    // create and add Bottoms Image
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


//    function to call one image down, return that image object, then call it in controller, and restart carousel function



    // retrieve Bottoms image only
    let retrieveBottomsPhotos = function (userUid) {
        let bottomsImages = [];
        return $q( (resolve, reject) => {
        $http.get(`${FBCreds.databaseURL}/bottoms.json?orderBy="uid"&equalTo="${userUid}"`)
            .then( (response) => {

//                console.log("What image came back line 72", response);

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

     // create and add Shoes Image
    let saveShoesImage = function (imageBlob, user, date) {
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
                return $http.post(`${FBCreds.databaseURL}/shoes.json`, newPhotoObject);
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

    // retrieve Shoes image only
    let retrieveShoesPhotos = function (userUid) {
        let shoesImages = [];
        return $q( (resolve, reject) => {
        $http.get(`${FBCreds.databaseURL}/shoes.json?orderBy="uid"&equalTo="${userUid}"`)
            .then( (response) => {

//                console.log("What image came back line 72", response);

                let imageObj = response.data;
                Object.keys(imageObj).forEach( (key) => {
                    imageObj[key].key_id = key;
                    shoesImages.push(imageObj[key]);
                });
                console.log("do we have an image object?", shoesImages);
                resolve(shoesImages);
            })
            .catch( (error) => {
                reject(error);
            });


        });
    };

    //delete bottoms
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

    //delete shoes
    let deleteShoeImage = function (photoKey) {
        return $q( (resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/shoes/${photoKey}.json`)
            .then((response) => {
                console.log("Delete success");
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };

    //delete top
    let deleteTopImage = function (photoKey) {
        return $q( (resolve, reject) => {
            $http.delete(`${FBCreds.databaseURL}/tops/${photoKey}.json`)
            .then((response) => {
                console.log("Delete success");
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    };



    return{addNewUser, saveTopsImage, retrieveTopsPhotos, saveBottomsImage, retrieveBottomsPhotos, saveShoesImage, retrieveShoesPhotos, deleteBottomsImage, deleteShoeImage, deleteTopImage};
});
