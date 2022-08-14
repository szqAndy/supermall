export function debounce(func, delay) {
  let timer = null

  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 防抖函数封装; 必须传入两个值： func需处理的函数；delay延迟时间。
/**
 * 防抖动的作用的过程：
 *  如果我们直接执行refresh，那么refresh函数会执行30次
 *  可以将refresh函数传入debounce函数中，生成一个新的函数
 *  之后再调用非常繁琐的时候，就使用新生成的函数
 *  而新生成的函数，并不会非常繁琐的调用，如果下一次执行来的非常快，那么会将上一次取消掉。
 * */


// 封装时间戳转换为实质时间，传入参数1：Date对象的时间戳， 参数2：时间的格式化格式：'yyyy-MM-dd'
export function formatDate(date, fmt) {
  // 获取年份
  // y+  ->  1个或者多个y
  // replace替换

  /**
   * 1.将'yyyy-MMM-dd'传入到fmt当中。
   * 2. replace替换(RegExp.$1(结果), (获取年份并转换为字符串).截取从(4 - 结果的长度))开始
   * 3.重新赋值到fmt当中。
   * */

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  // 获取月日时分秒
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }

  for (let k in o) {
    // console.log(o[k]);
    // new RegExp(`(${k})`) => /(遍历键k+)/
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''; // 将遍历出来的值转换为字符串
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
      /**
       *  1.遍历o对象
       *  2.判断o对象的键是否和传入的fmt匹配
       *  3.将o对象的值转换字符串并且赋值到str变量
       *  4.创建补0函数：传入str，然后加上00，最后再截取最后2位
       *  5.replace替换(RegExp.$1(结果), (结果的长度是否为1)是：返回原来，不是返回补0后的)
       *
       *
       *  比如：
       *  fmt 匹配到了MM
       *  if (RegExp((M+)).test(fmt)) { // RegExp((M+) => /(M+)/和test(fmt) => test(MM)匹配得到结果为MM
       *    let str = 9 + ''; // o[k] => 9 => date.getMonth() + 1
       *
       *    // RegExp.$1 => MM 和RegExp.$1.length => 2；
       *    // 2 === 1为false触发 padLeftZero(str))  => padLeftZero(9))
       *    fmt = fmt.replace(MM, (2 === 1) ? str : 09) // padLeftZero(str) => 09
       *
       *  }
       *
       *  function padLeftZero(9) { padLeftZero(str) =>  padLeftZero(9)
       *  // ('00' + str) => '00' + 9 = '009'; str => 9
       *  // .substr(str.length) => 截取(1)开始 => str.length => 1
       *  // '009' 截取从1开始 = '09
       *  // return 09
       *    return ('00' + 9).substr(str.length)
       *  }
       * */
    }
  }
  return fmt;
}

// 补0
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
