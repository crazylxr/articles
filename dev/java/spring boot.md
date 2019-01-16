1. 安装jdk
2. 安装maven 将maven放到/usr/local里面去
3. 更改maven镜像

## 属性配置
- application.properties
- 推荐：application.yml（冒号后面必须有空格）
两个都可以

生产环境与开发环境

## 注解
- @Value
- @Component
- @ConfigrationProperties

## Controller的使用
- @Controller ：处理http请求
- @RestController： Spring4之后新加的注解，原来返回json需要@ResponseBody配合@Controller
- @RequestMapping： 配置url映射
- @PathVariable: 获取url中的数据  /say/{id}
- @Request： 获取请求参数的值  /say?id=2
- @GetMapping： 组合注解(RequestMapping 的get方法，同时又postmapping)

## 数据库操作
Spring-Data-Jpa

定义了一系列对象持久化的标准，目前实现这一规范的产品有Hibernate、TopLink等

## 文件静态资源配置

http://www.zslin.com/web/article/detail/23