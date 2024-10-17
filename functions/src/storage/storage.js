const admin = require('firebase-admin');
const storage = require('@google-cloud/storage');

exports.uploadMess = async (data, context) => {
    const { filePath, houseId, choreId } = data;
    const bucket = storage().bucket('bucket-name');

    await bucket.upload(filePath, {
        destination: `mess_images/${houseId}/${choreId}.jpg`,
    });
};
