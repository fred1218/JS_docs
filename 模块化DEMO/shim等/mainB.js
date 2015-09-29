require.config({
	paths: {
		ma: 'ModualB'
	}
});

require(['ma'], function(MA) {
	com('in mainB');
	console.debug('这里输出证明moduleB的依赖也可以被引用进来');
	var m1 = new MA('zhangsan', 20);
	console.debug(m1.name, m1.age);
});
require(['ma'], function(MA) {
	var m2 = new MA('zhangsan2', 22);
	console.debug(m2.name, m2.age);
});