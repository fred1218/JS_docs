var CA = function(name, age) {
	console.debug('.......in CA.........');
	this.name = name;
	this.age = age;
}
var CB = function(name, age, addr) {
	console.debug('.......in CB.........');
	this.name = name;
	this.age = age;
	this.addr = addr;
}
com('in moduleC,shim');