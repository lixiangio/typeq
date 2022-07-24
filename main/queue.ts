import type { Middleware } from './common.js';

/** 查询任务队列 */
export const beforeQueue = []; // 前置队列
export const insertQueue = [];
export const findQueue = [];
export const updateQueue = [];
export const deleteQueue = [];
export const afterQueue = [];  // 后置队列

/**注册队列 */
export default {
  /** 添加前置中间件 */
  before(func: Middleware) { beforeQueue.push(func); },
  /** 添加 insert 中间件 */
  insert(func: Middleware) { insertQueue.push(func); },
  /** 添加 select 中间件 */
  find(func: Middleware) { findQueue.push(func); },
  /** 添加 update 中间件 */
  update(func: Middleware) { updateQueue.push(func); },
  /** 添加 delete 中间件 */
  delete(func: Middleware) { deleteQueue.push(func); },
  /** 添加后置中间件 */
  after(func: Middleware) { afterQueue.push(func); },
  /** 添加插件 */
  use(func: Function) { func(this); }
}

/** 前置、后置队列预处理，合并操作 */
Promise.resolve().then(() => {

  for (const queue of [insertQueue, findQueue, updateQueue, deleteQueue]) {
    queue.unshift(...beforeQueue);
    queue.push(...afterQueue);
  }

});