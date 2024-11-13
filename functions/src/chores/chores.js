// const admin = require('firebase-admin');
// const { getNextUser } = require('../utils/helper.js');

// exports.addChore = async (data, context) => {
//     const { houseId, description, assignedUserId, dueDate } = data;

//     const newChore = {
//         description: description,
//         assignedUserId: assignedUserId,
//         dueDate: admin.firestore.Timestamp.fromDate(new Date(dueDate)),
//         completed: false,
//         proof: null,
//     };

//     await admin.firestore().collection('Houses').doc(houseId)
//         .collection('Chores').add(newChore);

//     return { success: true };
// };

// exports.rotateChores = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
//     const housesSnapshot = await admin.firestore().collection('Houses').get();

//     housesSnapshot.forEach(async (houseDoc) => {
//         const houseId = houseDoc.id;
//         const choresSnapshot = await admin.firestore().collection('Houses')
//             .doc(houseId).collection('Chores').where('completed', '==', false).get();

//         choresSnapshot.forEach(async (choreDoc) => {
//             const chore = choreDoc.data();
//             const nextUser = getNextUser(houseDoc.data().members, chore.assignedUserId);
//             await admin.firestore().collection('Houses').doc(houseId)
//                 .collection('Chores').doc(choreDoc.id).update({
//                     assignedUserId: nextUser,
//                 });
//         });
//     });
// });
