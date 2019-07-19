import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true });

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
//export const helloWorld = functions.https.onRequest((request, response) => {
// response.send("Hello from Firebase!");
//});

export const getData = functions.https.onRequest((request,response)=>{
  console.log('function started');

  ///users/rathnaweeraatheesh72@gmail.com/likedposts/liked
  
  const recUserEmail = request.params.useremail
  const postId = request.params.postId

  console.log("received Data : "+recUserEmail+"  "+postId)

  const check = admin.firestore().collection('users').doc(recUserEmail).collection("likedposts").doc("liked").get();
  check.then(testValue => {

    let matchFound = false

    let recData = testValue.get("postlist")

    console.log(recData)
    console.log(recData.length+" matchFound: "+matchFound)

   /* for(var index=0;index<recData.length;index++){
      var id = recData[index]

      if(id == postId){
        matchFound = true
        break
      }

    }*/

   // console.log("matchFound : "+matchFound)

   /* if(matchFound){
      response.send('post found in liked list');
    }else{
      response.send('post not found in liked list');
    } */

   
}).catch(err => {
    console.log('Error getting document', err);
    throw new functions.https.HttpsError(err,'Error getting document');
});

})


