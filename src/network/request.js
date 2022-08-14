// 导入axios
import axios from 'axios'

export function request(config) { // success->成功； failure->失败
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/hy66',
    timeout: 5000
  })

  // 2.axios的拦截器
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    // 请求失败
    console.log(err);

  })

  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })


  // 3.发送真正的网络请求
  return instance(config)
}
