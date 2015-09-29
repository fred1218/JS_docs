require.config({
	paths: {
		'jquery': "jquery-1.11.1.min",
	},
	shim: {
		'jq.util.watchScroll': {
			deps: ['jquery'],
			exports: 'MK'
		}
	}
});

require(['jq.util.watchScroll'], function(WS) {
	WS('#test', "init", {});
	WS('#test', {});
	WS('#test', "init_error", {});
});