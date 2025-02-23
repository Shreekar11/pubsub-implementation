"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub_manager_1 = require("./pubsub-manager");
setInterval(() => {
    pubsub_manager_1.PubSubManager.getInstance().userSubscribe(Math.random().toString(), "APPL");
}, 5000);
