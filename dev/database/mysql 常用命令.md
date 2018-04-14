### mysql 服务的启动和停止 

```
net stop mysql 

net start mysql
```
### 登陆mysql
 mysql -u用户名 -p用户密码
 
 键入命令mysql -uroot -p， 回车后提示你输入密码，输入12345，然后回车即可进入到mysql中了，mysql的提示符是：

mysql>

### 数据库操作
#### 显示数据库库列表

```
use mysql;
show tables;
```
