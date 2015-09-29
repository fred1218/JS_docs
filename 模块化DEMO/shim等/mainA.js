require.config({
	paths: {
		ma: 'ModualA'
	}
});

//require(['ma'], function(MA) {
//	var m1 = new MA('zhangsan', 20);
//	console.debug(m1.name, m1.age);
//});
//require(['ma'], function(MA) {
//	var m2 = new MA('zhangsan2', 22);
//	console.debug(m2.name, m2.age);
//});
require(['ma'], function(MA) {
	var m1 = MA;
	m1.addr="shanghai";
	console.debug(m1.name, m1.age);
});
require(['ma'], function(MA) {
	var m2 = MA;
	console.debug(m2.name, m2.age,m2.addr);
});
console.debug(this);
