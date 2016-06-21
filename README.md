# fis3-postpackager-simplify

### 安装

```
   npm install fis3-postpackager-simplify -g
```

### 使用

```
	//注：如果没有输入环境变量，默认为defalut
	fis.match('::package', {
	    postpackager:{
	        fis.plugin('simplify',{
	            __domain:{
	                xjl:'xx.xxx.xx.com',
	                test:'111.222.com',
	                default: 'aaaa.bbbb.com'
	            },
	            __sign: {
	                xjl:'123',
	                test:'456',
	                default: function(){
	                    if(location.hostname.match('xx.xxx.xx.com')){
	                        return '789';
	                    }else{
	                        return '1234';
	                    }
	                }
	            },
	            '__XXX|__YYY':{	//使用正则
	                xjl:'develop',
	                test:'test',
	                default: 'real'
	            }
	        })
	    }
	});

	//开发环境
	fis.media('xjl').match('*.js', {
	   ......
	});
	
	/*测试环境配置*/
	fis.media('test').match('*.js', {
	    ......
	});

```

```
##aa.html
	<script src="aa.js"></script><!--delete-->//注，用于写代码测试，fis3编译后，自动删除后有<!--delete-->注释的代码
	<script type="javascript">
        console.log(__domain());
		console.log(__sign());
		console.log(__XXX());
		console.log(__YYY());
    </script>
```

##aa.js
```
	function __uri(src){
	  return src;
	}
	
	var __domain = function(){
		.....
	}

	var __sign = function(){
		.....
	}

	var __XXX = __YYY = function(){
		.....
	}
```
### 灵感来源于fis3中的__uri

(注：欢迎反馈BUG，方便提升插件的质量)