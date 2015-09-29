使用shim一定要指定返回的全局变量是哪个。
不适用shim就无法使用amd
简单来说就是对requirejs要引用的第三方非AMD规范的插件、类库的特殊处理。通常有两种方法：
A: AMD化.通过define封装一下
B: config shim.