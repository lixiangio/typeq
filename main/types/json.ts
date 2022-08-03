import { jsonToSql } from '../safety.js';
import { methodKey } from '../common.js';
import { outputs, type TypeOptions } from './common.js';
import createStruct from './createStruct.js';


const jsonMethods = {
  type(value: object | any[]) {
    if (typeof value === 'object') {
      return { value };
    } else {
      return { error: `值必须为 json 类型，实际赋值为 '${value}'` };
    }
  }
}

/** JSON 类型 */
export function json(struct: object, options?: TypeOptions) {

  return createStruct('json', struct, options, jsonMethods, outputs);

}

const methodType = {
  value(value: any) {
    const { error } = jsonMethods.type(value);
    if (error) {
      return { error };
    } else {
      return { value: jsonToSql(value) };
    }
  }
}

Object.defineProperty(json, methodKey, methodType);



/** JSONB 类型 */
export function jsonb(struct: object, options?: TypeOptions) {

  return createStruct('jsonb', struct, options, jsonMethods, outputs);

}

Object.defineProperty(jsonb, methodKey, methodType);


const { toString } = Object.prototype;

const objectMethods = {
  type(value: object) {
    if (toString.call(value) === '[object Object]') {
      return { value };
    } else {
      return { error: `值必须为 object 类型，实际赋值为 '${value}'` };
    }
  }
}

/** JSON 严格对象类型 */
export function object(struct: object, options?: TypeOptions) {

  return createStruct('jsonb', struct, options, objectMethods, outputs);

}

Object.defineProperty(object, 'name', { value: 'jsonb' });
Object.defineProperty(object, methodKey, {
  value(value: object) {
    const { error } = objectMethods.type(value);
    if (error) {
      return { error };
    } else {
      return { value: jsonToSql(value) };
    }
  }
});


const arrayMethods = {
  type(value: any[]) {
    if (Array.isArray(value)) {
      return { value };
    } else {
      return { error: `值必须为 array 类型，实际赋值为 '${value}'` };
    }
  }
}

/** JSON 数组类型 */
export function array(struct: any[], options?: TypeOptions) {

  return createStruct('jsonb', struct, options, arrayMethods, outputs);

}

Object.defineProperty(array, 'name', { value: 'jsonb' });
Object.defineProperty(array, methodKey, {
  value(value: any[]) {
    const { error } = arrayMethods.type(value);
    if (error) {
      return { error };
    } else {
      return { value: jsonToSql(value) };
    }
  }
});
