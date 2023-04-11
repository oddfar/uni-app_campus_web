## 2.5.1（2023-01-16）
- 精简代码，体积更小，性能提升
- 废弃封装请求任务方法和 xhr 属性 [详情](https://uniajax.ponjs.com/guide/usage#requesttask)
- 新增 fetcher 属性获取请求任务 [详情](https://uniajax.ponjs.com/api/config#fetcher)
- 移除回调函数属性 success / fail / complete [详情](https://uniajax.ponjs.com/guide/usage#发起请求)
## 2.4.6（2022-12-01）
- 新增自定义响应内容类型 CustomResponse [详情](https://uniajax.ponjs.com/guide/typescript#定义类型)
- 修改自定义请求配置类型 CustomConfig [详情](https://uniajax.ponjs.com/guide/typescript#定义类型)
- 优化插件市场安装引入路径 [详情](https://uniajax.ponjs.com/guide/installation#插件市场)
- 优化创建请求类工厂函数

## 2.4.5（2022-07-08）
- 优化使用拦截器的 Typescript 类型 [详情](https://uniajax.ponjs.com/api#interceptors)

## 2.4.4（2022-04-01）
- 修复 params 参数被转成 JSON 字符串问题 [详情](https://uniajax.ponjs.com/api/config#params)

## 2.4.3（2022-02-24）
- 兼容支付宝小程序不支持 `class extends Promise` 错误
- 去除多余的 defaults 默认值 [详情](https://uniajax.ponjs.com/api#defaults)

## 2.4.2（2022-02-01）
- 修改 params 配置参数 [详情](https://uniajax.ponjs.com/api/config#params)
- 新增 query 配置参数 [详情](https://uniajax.ponjs.com/api/config#query)
- 优化 create 方法的 TypeScript 参数类型

## 2.4.1（2022-01-15）
- 全新的获取实例配置机制 [详情](https://uniajax.ponjs.com/guide/instance#实例配置)
- 新增全局默认配置 [详情](https://uniajax.ponjs.com/guide/instance#全局配置)
- 新增获取请求地址方法 [详情](https://uniajax.ponjs.com/api#geturl)
- 去除获取 baseURL 和 origin 属性

## 2.4.0（2022-01-15）
**全新版本发布**
注意 2.4.x 版本与 2.3.x 以下版本存在些许差异！
