const functions = require('firebase-functions');


// exports.increment = functions.database.ref('frd/counter').onUpdate(event => {
//     const value = event.data.val();
//     if(event.data.previous.val()+1 == value){
//         return;
//     }
//     else{
//         console.log('Someone tried to turn '+event.data.previous.val()+' into '+value);
//         event.data.ref.set(event.data.previous.val());
//         return;
//     }
// });

// exports.cancelIncrementDelete = functions.database.ref('frd/counter').onDelete(event => {
//     event.data.ref.set(event.data.previous.val());
// });