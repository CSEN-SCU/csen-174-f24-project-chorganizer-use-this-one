const admin = require('firebase-admin');

exports.createHouse = async (data, context) => {
    const { houseName, userId } = data;

    const newHouse = {
        name: houseName,
        members: [userId],
    };

    const houseRef = await admin.firestore().collection('Houses').add(newHouse);
    const houseId = houseRef.id;

    // Update user to belong to this house
    await admin.firestore().collection('Users').doc(userId).update({
        houseId: houseId,
    });

    return { houseId };
};
