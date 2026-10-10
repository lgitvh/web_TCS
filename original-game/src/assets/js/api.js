/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';
import router from '../../router';
import vue from '../../main'

export async function getAxiosInstance() {
  var baseURL, instance

  baseURL = 'http://couy.xyz:3001/';

  /** 
   * 请求失败后的错误统一处理 
   * @param {Number} status 请求失败的状态码
   */
  const errorHandle = (status, response) => {
    // 状态码判断
    switch (status) {
      // 401: 未登录状态，跳转登录页
      case 401:
        vue.$store.commit("set_sys_info", {
          msg: `
          😭${response.data.msg|| 'Server problem, please try again later'}
          `,
          type: 'warning'
        });
        break;
      case 403:
        vue.$store.commit("set_sys_info", {
          msg: `
          😭${response.data.msg|| 'Server problem, please try again later'}
          `,
          type: 'warning'
        });
        break;
      case 404:
        vue.$store.commit("set_sys_info", {
          msg: `
          😭${response.data.msg|| 'Server problem, please try again later'}
          `,
          type: 'warning'
        });
        break;
      default:
        vue.$store.commit("set_sys_info", {
          msg: `
          😭${response.data.msg|| 'Server problem, please try again later'}
          `,
          type: 'warning'
        });
    }
  }

  // 创建axios实例 
  instance = axios.create({
    timeout: 1000 * 12 // 设置十二秒钟的请求超时限制
    // transformRequest: data => qs.stringify(data)
  });
  if (process.env.NODE_ENV == 'development') {
    //开发环境
    instance.defaults.baseURL = baseURL;
  } else if (process.env.NODE_ENV == 'debug') {
    //debug
    instance.defaults.baseURL = baseURL;
  } else if (process.env.NODE_ENV == 'production') {
    //生产环境
    instance.defaults.baseURL = baseURL;
  }
  // 设置post请求头
  instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

  // 响应拦截器
  instance.interceptors.response.use(
    // 请求成功
    res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
    // 请求失败
    error => {
      const {
        response
      } = error;
      if (response) {
        // 请求已发出，但是不在2xx的范围 
        errorHandle(response.status, response);

        return Promise.reject(response);
      } else {
        vue.$store.commit("set_sys_info", {
          msg: `
          😭${response.data.msg|| 'Server problem, please try again later'}
          `,
          type: 'warning'
        });
      }
    });

  return instance
}