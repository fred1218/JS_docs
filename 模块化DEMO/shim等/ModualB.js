define(['common'], function() {
	com('in moduleB');
	var A = function(name, age) {
		this.name = name;
		this.age = age;
	}
	return A;
})