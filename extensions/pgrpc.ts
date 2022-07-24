/**
 * pgrpc 中间件
 * @param config 
 */
export default function (config) {

  const clients = {};

  for (const name in config) {
    clients[name] = name;
  }

  return function (typeq) {

    typeq.insert(ctx => {

      const { db } = ctx.config;

      if (clients[db]) {
        console.log(ctx.sql)
      }

    })

    typeq.find(ctx => {

    })

    typeq.update(ctx => {

    })

    typeq.delete(ctx => {


    })

  }
}
