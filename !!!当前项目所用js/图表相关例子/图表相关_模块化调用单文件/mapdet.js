require.config({
	paths: {
		'echarts': './js/dist',
		'jquery': 'jquery.min',
		'scroll': './jq.util.watchScroll'
	}
});

require(['echarts',
	'echarts/chart/line',
	'echarts/chart/bar', 'jquery', 'scroll'
], function(ec) {
	var opt1 = {
		backgroundColor: "#fff",
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			x: 'center',
			y: 'bottom',
			data: ['金鹿财行', '翰典金融', '东虹桥资管', '菜苗网络']
		},
		toolbox: {
			show: false,
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar', 'stack', 'tiled']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: false,
		xAxis: [{
			splitLine: {
				show: false
			},
			type: 'category',
			boundaryGap: false,
			data: ['9月15日', '9月16日', '9月17日', '9月18日', '9月19日', '9月20日', '9月21日']
		}],
		yAxis: [{
			splitLine: {
				show: true
			},
			type: 'value'
		}],
		series: [{
			name: '金鹿财行',
			type: 'line',
			stack: '总量',
			data: [120, 132, 101, 134, 90, 230, 210]
		}, {
			name: '翰典金融',
			type: 'line',
			stack: '总量',
			data: [220, 182, 191, 234, 290, 330, 310]
		}, {
			name: '东虹桥资管',
			type: 'line',
			stack: '总量',
			data: [150, 232, 201, 154, 190, 330, 410]
		}, {
			name: '菜苗网络',
			type: 'line',
			stack: '总量',
			data: [320, 332, 301, 334, 390, 330, 320]
		}]
	};
	var myChart1 = ec.init(document.getElementById('dchart1'));
	$('#dchart1').watchScroll({
		onShowing: function() {
			myChart1.setOption(opt1);
		}

	});


});
require(['echarts',
	'echarts/chart/line',
	'echarts/chart/bar', 'jquery', 'scroll'
], function(ec) {
	var opt2 = {
		backgroundColor: "#fff",
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: ['金鹿财行', '翰典金融', '东虹桥资管', '菜苗网络']
		},
		toolbox: {
			show: false,
			feature: {
				mark: {
					show: false
				},
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar', 'stack', 'tiled']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		xAxis: [{
			type: 'category',
			boundaryGap: true,
			data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
		}],
		yAxis: [{
			splitLine: {
				show: false
			},
			type: 'value'
		}],
		series: [{
			smooth: true,
			name: '金鹿财行',
			type: 'bar',
			stack: '总量',
			data: [120, 132, 101, 134, 90, 230, 210]
		}, {
			smooth: true,
			name: '翰典金融',
			type: 'bar',
			stack: '总量',
			data: [220, 182, 191, 234, 290, 330, 310]
		}, {
			smooth: true,
			name: '东虹桥资管',
			type: 'bar',
			stack: '总量',
			data: [150, 232, 201, 154, 190, 330, 410]
		}, {
			smooth: true,
			name: '菜苗网络',
			type: 'bar',
			stack: '总量',
			data: [320, 332, 301, 334, 390, 330, 320]
		}]
	};
	var myChart2 = ec.init(document.getElementById('dchart2'));
	$('#dchart2').watchScroll({
		onShowing: function() {
			myChart2.setOption(opt2);
		}

	});


});

require(
	['echarts',
		'echarts/chart/line',
		'echarts/chart/bar', 'jquery', 'scroll'
	],
	function(ec, zrColor) {
		var myChart = ec.init(document.getElementById('dchart3'));
		var zrColor = require('zrender/tool/color');
		var colorList = [
			'#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
			'#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0'
		];
		var itemStyle = {
			normal: {
				color: function(params) {
					if (params.dataIndex < 0) {
						// for legend
						return zrColor.lift(
							colorList[colorList.length - 1], params.seriesIndex * 0.1
						);
					} else {
						// for bar
						return zrColor.lift(
							colorList[params.dataIndex], params.seriesIndex * 0.1
						);
					}
				}
			}
		};
		option = {
			backgroundColor: "#fff",
			tooltip: {
				trigger: 'axis',
				backgroundColor: 'rgba(255,255,255,0.7)',
				axisPointer: {
					type: 'shadow'
				},
				formatter: function(params) {
					// for text color
					var color = colorList[params[0].dataIndex];
					var res = '<div style="color:' + color + '">';
					res += '<strong>' + params[0].name + '交易（万元）</strong>'
					for (var i = 0, l = params.length; i < l; i++) {
						res += '<br/>' + params[i].seriesName + ' : ' + params[i].value
					}
					res += '</div>';
					return res;
				}
			},
			legend: {
				x: 'right',
				data: ['2012', '2013', '2014', '2015']
			},
			toolbox: {
				show: false,
				orient: 'vertical',
				y: 'center',
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			calculable: true,
			grid: {
				y: 80,
				y2: 40,
				x2: 40
			},
			xAxis: [{
				type: 'category',
				data: ['金鹿', '东虹桥', '菜苗', '翰典']
			}],
			yAxis: [{
				type: 'value'
			}],
			series: [{
				name: '2012',
				type: 'bar',
				itemStyle: itemStyle,
				data: [4804.7, 1444.3, 1332.1, 908]
			}, {
				name: '2013',
				type: 'bar',
				itemStyle: itemStyle,
				data: [5506.3, 1674.7, 1405, 1023.2]
			}, {
				name: '2014',
				type: 'bar',
				itemStyle: itemStyle,
				data: [6040.9, 1823.4, 1484.3, 1116.1]
			}, {
				name: '2015',
				type: 'bar',
				itemStyle: itemStyle,
				data: [6311.9, 1902, 1745.1, 1215.1]
			}]
		};
		$('#dchart3').watchScroll({
			onShowing: function() {
				myChart.setOption(option);
			}

		});

	}
);
require(
	['echarts',
		'echarts/chart/pie', 'jquery', 'scroll'
	],
	function(ec) {
		var option = {
			title: {
				text: '整体交易产品统计',x:'center'
			},
			backgroundColor: "#fff",
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				show: false,
				orient: 'vertical',
				x: 'left',
				data: ['新手上鹿038', '新手上鹿036', '禄鹿通052', '新手上鹿037', '其他']
			},
			toolbox: {
				show: false,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['pie', 'funnel'],
						option: {
							funnel: {
								x: '25%',
								width: '50%',
								funnelAlign: 'left',
								max: 1548
							}
						}
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			series: [{
				name: '访问来源',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: [{
					value: 335,
					name: '新手上鹿036'
				}, {
					value: 310,
					name: '新手上鹿038'
				}, {
					value: 234,
					name: '禄鹿通052'
				}, {
					value: 135,
					name: '新手上鹿037'
				}, {
					value: 1548,
					name: '其他'
				}]
			}]
		};
		var myChart = ec.init(document.getElementById("dchart4t1"));
		$('[id=dchart4t1]').watchScroll({
			onShowing: function() {
				myChart.setOption(option);
			}

		});
	}
);
require(
	['echarts',
		'echarts/chart/pie', 'jquery', 'scroll'
	],
	function(ec) {
		var option = {
			title: {
				text: '金鹿财行',x:'center'
			},
			backgroundColor: "#fff",
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				show: false,
				orient: 'vertical',
				x: 'left',
				data: ['新手上鹿038', '新手上鹿036', '禄鹿通052', '新手上鹿037', '其他']
			},
			toolbox: {
				show: false,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['pie', 'funnel'],
						option: {
							funnel: {
								x: '25%',
								width: '50%',
								funnelAlign: 'left',
								max: 1548
							}
						}
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			series: [{
				name: '访问来源',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: [{
					value: 335,
					name: '新手上鹿036'
				}, {
					value: 310,
					name: '新手上鹿038'
				}, {
					value: 234,
					name: '禄鹿通052'
				}, {
					value: 135,
					name: '新手上鹿037'
				}, {
					value: 1548,
					name: '其他'
				}]
			}]
		};
		var myChart = ec.init(document.getElementById("dchart4t2"));
		$('[id=dchart4t2]').watchScroll({
			onShowing: function() {
				myChart.setOption(option);
			}

		});
	}
);
require(
	['echarts',
		'echarts/chart/pie', 'jquery', 'scroll'
	],
	function(ec) {
		var option = {
			title: {
				text: '翰典金融',x:'center'
			},
			backgroundColor: "#fff",
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				show: false,
				orient: 'vertical',
				x: 'left',
				data: ['月映宝', '亲友月映宝', '员工月映宝', '礼映宝', '其他']
			},
			toolbox: {
				show: false,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['pie', 'funnel'],
						option: {
							funnel: {
								x: '25%',
								width: '50%',
								funnelAlign: 'left',
								max: 1548
							}
						}
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			series: [{
				name: '访问来源',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: [{
					value: 335,
					name: '月映宝'
				}, {
					value: 310,
					name: '亲友月映宝'
				}, {
					value: 234,
					name: '员工月映宝'
				}, {
					value: 135,
					name: '礼映宝'
				}, {
					value: 1548,
					name: '其他'
				}]
			}]
		};
		var myChart = ec.init(document.getElementById("dchart4t3"));
		$('[id=dchart4t3]').watchScroll({
			onShowing: function() {
				myChart.setOption(option);
			}

		});
	}
);
require(
	['echarts',
		'echarts/chart/pie', 'jquery', 'scroll'
	],
	function(ec) {
		var option = {
			title: {
				text: '东虹桥资管',x:'center'
			},
			backgroundColor: "#fff",
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				show: false,
				orient: 'vertical',
				x: 'left',
				data: ['东虹桥影视悦享（001期）12月期', '东虹桥影视悦享（001期）03月期', '东虹桥影视悦享（001期）01月期']
			},
			toolbox: {
				show: false,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['pie', 'funnel'],
						option: {
							funnel: {
								x: '25%',
								width: '50%',
								funnelAlign: 'left',
								max: 1548
							}
						}
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			series: [{
				name: '访问来源',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: [{
					value: 335,
					name: '东虹桥影视悦享（001期）12月期'
				}, {
					value: 310,
					name: '东虹桥影视悦享（001期）03月期'
				}, {
					value: 234,
					name: '东虹桥影视悦享（001期）01月期'
				}]
			}]
		};
		var myChart = ec.init(document.getElementById("dchart4t4"));
		$('[id=dchart4t4]').watchScroll({
			onShowing: function() {
				myChart.setOption(option);
			}

		});
	}
);
require(
	['echarts',
		'echarts/chart/pie', 'jquery', 'scroll'
	],
	function(ec) {
		var option = {
			title: {
				text: '菜苗网络',x:'center'
			},
			backgroundColor: "#fff",
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				show: false,
				orient: 'vertical',
				x: 'left',
				data: ['大轰炸', '影视悦享计划01号042', '影视悦享计划01号037', '其他']
			},
			toolbox: {
				show: false,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['pie', 'funnel'],
						option: {
							funnel: {
								x: '25%',
								width: '50%',
								funnelAlign: 'left',
								max: 1548
							}
						}
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			series: [{
				name: '访问来源',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: [{
					value: 335,
					name: '大轰炸'
				}, {
					value: 310,
					name: '影视悦享计划01号042'
				}, {
					value: 234,
					name: '影视悦享计划01号037'
				}, {
					value: 1548,
					name: '其他'
				}]
			}]
		};
		var myChart = ec.init(document.getElementById("dchart4t5"));
		$('[id=dchart4t5]').watchScroll({
			onShowing: function() {
				myChart.setOption(option);
			}

		});
	}
);