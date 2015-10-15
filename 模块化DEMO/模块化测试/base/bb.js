define(['../cc','jquery'], function($) {
	alert($);
	console.debug('调用bb',$);
	c();
	return {
		a: function() {
			console.debug('b');
			setTimeout(function() {
				console.debug('in settimeout');
			}, 1000);
			console.debug('after alert');
		},
		a1: function() {
			console.debug('b1');
		}
	}
});