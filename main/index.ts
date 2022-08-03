import { type Body, $Client } from './common.js';
import { Client, clients } from './client.js';

export { Client, clients };
export { createType } from './types/createType.js';
export { default as operator } from './operator/index.js';
export { Schema } from './schema.js';
export { Model } from './model.js';
export { VModel, VSchema } from './vmodel.js';
export { methodKey } from './common.js';
export * from './safety.js';

/**
 * 通过 name 获取客户端实例
 * @param name 客户端名称
 */
export function client(name: string = 'default') {
  return clients[name];
}

/**
 * 创建事务客户端实例
 */
export class Transaction {
  client: string
  instance: $Client & { release: () => void }
  constructor(client: string = 'default') {

    this.client = client;

  }
  async connect() {

    const instance = await clients[this.client].connect();

    await instance.query('BEGIN');

    this.instance = instance;

  }
  /** 回滚操作 */
  async rollback() {

    await this.instance.query('ROLLBACK');

  }
  /** 提交事务 */
  async commit() {

    await this.instance.query('COMMIT');

  }
  /** 释放连接 */
  release() {

    this.instance.release();

  }
}


/** 将多个函数链合成的 SQL 合并到一个 SQL 中 */
export class Collection {
  client: string
  instance: $Client
  sqls: string[] = []
  constructor(client: string = 'default') {

    this.client = client;
    const instance = clients[client];

    const { insertQueue, findQueue, updateQueue, deleteQueue } = instance;
    const { sqls } = this;

    this.instance = {
      insertQueue,
      findQueue,
      updateQueue,
      deleteQueue,
      async query(sql: string) {
        sqls.push(sql);
        return { rows: [] };
      }
    }

  }
  /**
   * 聚合查询
   */
  async query(): Promise<Body[]> {

    return Promise.resolve().then(async () => {
      return clients[this.client].query(this.sqls.join('; '))
        .then(body => {
          if (Array.isArray(body)) {
            return body;
          } else {
            return [body];
          }
        });
    })

  }
  /**
   * 等待所有绑定 SQL 完成合成
   */
  async sql() {
    return Promise.resolve().then(() => this.sqls.join('; '));
  }
}
