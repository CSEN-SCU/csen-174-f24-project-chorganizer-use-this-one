const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Import functions
const auth = require('./auth/auth');
const houses = require('./houses/houses');
const chores = require('./chores/chores');
const notifications = require('./notifications/notifications');
const storage = require('./storage/storage');

// Export functions
exports.createUser = auth.createUser;
exports.createHouse = houses.createHouse;
exports.addChore = chores.addChore;
exports.rotateChores = chores.rotateChores;
exports.sendNotification = notifications.sendNotification;
exports.uploadProof = storage.uploadProof;