/* eslint-disable */
const ACTIONS = require("./actions");

const mapping = {
    [ACTIONS.CREATE_ROOM]: require("./actions/createRoom"),
    [ACTIONS.DRAW]: require("./actions/draw"),
    [ACTIONS.JOIN_ROOM]: require("./actions/joinRoom"),
    [ACTIONS.PLAY]: require("./actions/play"),
};

module.exports = function actionMapper(socket) {
    Object.keys(mapping).forEach((key) => {
        socket.on(key, (data) => {
            mapping[key](socket, data);
        });
    });
};
