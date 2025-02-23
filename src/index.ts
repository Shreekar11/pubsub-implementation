import { PubSubManager } from "./pubsub-manager";

setInterval(() => {
  PubSubManager.getInstance().userSubscribe(Math.random().toString(), "APPL");
}, 5000);