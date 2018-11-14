import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  template: `Status: {{status}}`
  //templateUrl: 'app.component.html'
})

export class AppComponent {
    status: string = "Loading";

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}


  // IndexedDB
  var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
      IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
      dbVersion = 1.0;

  // Create/open database
  var request = indexedDB.open("elephantFiles", dbVersion),
      db,
      createObjectStore = function (dataBase) {
          // Create an objectStore
          console.log("Creating objectStore")
          dataBase.createObjectStore("elephants");
      },

      getImageFile = function () {
          // Create XHR
          var xhr = new XMLHttpRequest(),
              blob;

          xhr.open("GET", "/src/assets/elephants.jpg", true);
          // Set the responseType to blob
          xhr.responseType = "blob";

          xhr.addEventListener("load", function () {
              if (xhr.status === 200) {
                  console.log("Image retrieved");
                  
                  // Blob as response
                  blob = xhr.response;
                  console.log("Blob:" + blob);

                  // Put the received blob into IndexedDB
                  putElephantInDb(blob);
              }
          }, false);
          // Send XHR
          xhr.send();
      },

      putElephantInDb = function (blob) {
          console.log("Putting elephants in IndexedDB");

          // Open a transaction to the database
          if (IDBTransaction.READ_WRITE === undefined) IDBTransaction.READ_WRITE = "readwrite";
          var transaction = db.transaction(["elephants"], IDBTransaction.READ_WRITE);

        //   // Put the blob into the dabase
        //   var put = transaction.objectStore("elephants").put(blob, "image");
        //   console.log("First elephant loaded");

        // for (var i = 0; i < 1000; i++) {
        //     //var transaction = db.transaction(["elephants"], IDBTransaction.READ_WRITE);
        //     var put = transaction.objectStore("elephants").put(blob, "image"+i);
        // }
        // console.log("First 1000 elephant loaded");


        // Store a large string
        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }
        for (var i = 0; i < 2; i++) {
            var rString = randomString(1048576, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            var put = transaction.objectStore("elephants").put(rString, "json" + i);
        }
          console.log("First 500 JSON loaded");
          status = "First 500 JSON loaded";

        // //  Retrieve the file that was just stored
        //   transaction.objectStore("elephants").get("image999").onsuccess = function (event) {
        //       var imgFile = event.target.result;
        //       console.log("Got the last elephant!" + imgFile);

        //       // Get window.URL object
        //       var URL = window.URL || window.webkitURL;

        //       // Create and revoke ObjectURL
        //       var imgURL = URL.createObjectURL(imgFile);

        //       // Set img src to ObjectURL
        //       console.log("imgURL " + imgURL);
        //       // var imgElephant = document.getElementById("elephant");
        //       // imgElephant.setAttribute("src", imgURL);

        //       // Revoking ObjectURL
        //       URL.revokeObjectURL(imgURL);
        //   };

          // Retrieve the JSON that was just stored
          transaction.objectStore("elephants").get("json1").onsuccess = function (event) {
              var imgFile = event.target.result;
              console.log("Got the json!" + imgFile.substring(0,10));
              status = "Got the json!" + imgFile.substring(0,10);
          };
      };

  request.onerror = function (event) {
      console.log("Error creating/accessing IndexedDB database");
  };

  request.onsuccess = function (event) {
      console.log("Success creating/accessing IndexedDB database");
      
      db = request.result;

      db.onerror = function (event) {
          console.log("Error creating/accessing IndexedDB database");
      };
      
      // Interim solution for Google Chrome to create an objectStore. Will be deprecated
      if (db.setVersion) {
          if (db.version != dbVersion) {
              var setVersion = db.setVersion(dbVersion);
              setVersion.onsuccess = function () {
                  createObjectStore(db);
                  getImageFile();
              };
          }
          else {
              getImageFile();
          }
      }
      else {
          getImageFile();
      }
  }
  
  // For future use. Currently only in latest Firefox versions
  request.onupgradeneeded = function (event) {
      createObjectStore(event.target.result);
  };