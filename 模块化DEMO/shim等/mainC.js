require.config({
	shim: {
		ModualC: {
			deps: ['common'],
			exports: 'CA'
		},
	}
});

require(['ModualC'], function(MA) {
	com('in mainC');
	var m1 = new MA('zhangsan', 20);
	var m2 = new MA('lisi', 20, 'shanghai'); //依然是CA
	console.debug(m1.name, m1.age);
});
require(['ModualC'], function(MA) {
	var m2 = new MA('zhangsan2', 22);
	console.debug(m2.name, m2.age);
});