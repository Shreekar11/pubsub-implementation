import { createClient, RedisClientType } from "redis";

export class PubSubManager {
  private static instance: PubSubManager;
  private redisClient: RedisClientType;
  private subscription: Map<string, string[]>;

  private constructor() {
    this.redisClient = createClient();
    this.redisClient.connect();
    this.subscription = new Map();
  }

  public static getInstance(): PubSubManager {
    if (!PubSubManager.instance) {
      PubSubManager.instance = new PubSubManager();
    }

    return PubSubManager.instance;
  }

  public userSubscribe(userId: string, stock: string) {
    if (!this.subscription.has(stock)) {
      this.subscription.set(stock, []);
    }

    this.subscription.get(stock)?.push(userId);

    console.log(this.subscription.get(stock));

    if (this.subscription.get(stock)?.length === 1) {
      this.redisClient.subscribe(stock, (message) => {
        console.log("stock", stock);
        this.handleMessage(stock, message);
      });

      console.log(`Subscribed to Redis Channel : ${stock}`);
    }
  }

  public userUnSubscribe(userId: string, stock: string) {
    this.subscription.set(
      stock,
      this.subscription.get(stock)?.filter((sub) => sub !== userId) || []
    );

    if (this.subscription.get(stock)?.length === 0) {
      this.redisClient.unsubscribe(stock);
      console.log(`UnSubscribed to Redis channel: ${stock}`);
    }
  }

  private handleMessage(stock: string, message: string) {
    console.log(`Message received on channel ${stock}: ${message}`);
    this.subscription.get(stock)?.forEach((sub) => {
      console.log(`Sending message to user: ${sub}`);
    });
  }

  public async disconnect() {
    await this.redisClient.quit();
  }
}
