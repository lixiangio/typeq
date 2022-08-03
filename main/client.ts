import pgsql from "./pgsql.js";
import type { Body, Middleware } from './common.js';

/** 客户端集合 */
export const clients: { [name: string]: Client } = {};

/** 数据库交互统一接口 */
interface Connector {
  connect(): Promise<Client & { release: () => void }>
  query(sql: string): Promise<Body>
}

export class Client {
  name: string
  beforeQueue: Middleware[] = [] // 前置队列
  afterQueue: Middleware[] = [] // 后置队列
  insertQueue: Middleware[] = []
  findQueue: Middleware[] = []
  updateQueue: Middleware[] = []
  deleteQueue: Middleware[] = []
  connector: Connector
  constructor(name: string, connector: Connector) {

    this.name = name;
    this.connector = connector;

    clients[name] = this;

    pgsql(this);

  }
  /** 添加前置中间件 */
  before(func: Middleware) {

    this.beforeQueue.push(func);

  }
  /** 添加后置中间件 */
  after(func: Middleware) {

    this.afterQueue.push(func);

  }
  /** 添加插件 */
  use(func: Function) { func(this); }
  /**
   * SQL 查询
   */
  async query(sql: string): Promise<Body> {

    return this.connector.query(sql);

  }
  /**
   * 创建新的数据库连接实例
   */
  async connect() {

    const client = await this.connector.connect();

    client.insertQueue = this.insertQueue;
    client.findQueue = this.findQueue;
    client.updateQueue = this.updateQueue;
    client.deleteQueue = this.deleteQueue;

    return client;

  }
}

/** 初始化时插入前、后置队列 */
Promise.resolve().then(() => {

  for (const name in clients) {

    const { beforeQueue, insertQueue, findQueue, updateQueue, deleteQueue, afterQueue } = clients[name];

    for (const queue of [insertQueue, findQueue, updateQueue, deleteQueue]) {
      queue.unshift(...beforeQueue);
      queue.push(...afterQueue);
    }

  }

});
