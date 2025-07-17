const Notification = require("../models/Notification");

const sendNotification = async ({ userId, message, link = "" }) => {
  const notification = new Notification({
    user: userId,
    message,
    link,
  });

  await notification.save();
};

module.exports = sendNotification;
  