require.config({
	paths: {
		'echarts': './js/dist',
		'jquery': 'jquery.min',
		'scroll': './jq.util.watchScroll'
	}
});
require(['echarts',
	'echarts/chart/line', 'jquery', 'scroll'
], function(ec) {
	var opt1 = {
		backgroundColor:"#fff",
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: ['交易额', '最低']
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
					type: ['line', 'bar']
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
		xAxis: [{
			splitLine: {
				show: false
			},
			type: 'category',
			boundaryGap: false,
			data: ['金鹿', '菜苗', '东虹桥', '翰典']
		}],
		yAxis: [{
			splitLine: {
				show: false
			},
			name:'(千万)',
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			}
		}],
		series: [{
			name: '交易额',
			type: 'line',
			data: [11, 11, 15, 13],
			markPoint: {
				data: [{
					type: 'max',
					name: '最大值'
				}, {
					type: 'min',
					name: '最小值'
				}]
			},
			markLine: {
				data: [{
					type: 'average',
					name: '平均值'
				}]
			}
		}, {
			name: '最低',
			type: 'line',
			data: [1, 2, 2, 5],
			markPoint: {
				data: [{
					name: '最低',
					value: 1,
					xAxis: 1,
					yAxis: 1.5
				}]
			},
			markLine: {
				data: [{
					type: 'average',
					name: '平均值'
				}]
			}
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
		backgroundColor:"#fff",
		tooltip: {
			trigger: 'axis'
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
					type: ['line', 'bar']
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
		legend: {
			data: ['各公司销售第一产品名称',  '交易额占比']
		},
		xAxis: [{
			splitLine: {
				show: false
			},
			type: 'category',
			data: ['金鹿财行(新手上鹿)', '菜苗网络(大轰炸)', '东虹桥资管(影视悦享001)', '翰典金融(礼映宝)']
		}],
		yAxis: [{
			splitLine: {
				show: true
			},
			type: 'value',
			name: '金额(万)',
			axisLabel: {
				formatter: '{value}'
			}
		}, {
			splitLine: {
				show: false
			},
			type: 'value',
			name: '百分比(%)',
			axisLabel: {
				formatter: '{value}'
			}
		}],
		series: [

			{
				name: '各公司销售第一产品名称',
				type: 'bar',
				data: [2.0, 4.9, 7.0, 23.2]
			}, {
				name: '交易额占比',
				type: 'line',
				yAxisIndex: 1,
				data: [2.0, 2.2, 3.3, 4.5]
			}
		]
	};
	var myChart2 = ec.init(document.getElementById('dchart2'));
	myChart2.showLoading({
		text: '正在努力的读取数据中...', //loading话术
	});
	$('#dchart2').watchScroll({
		onShowing: function() {
			myChart2.setOption(opt2);
			myChart2.hideLoading();
		}
	});
});

require(['echarts',
	'echarts/chart/pie', 'jquery', 'scroll'
], function(ec) {
	var idx = 1;
	var opt3 = {
		timeline: {
			data: [
				'2013-01-01', '2013-02-01', '2013-03-01', '2013-04-01', '2013-05-01', {
					name: '2013-06-01',
					symbol: 'emptyStar6',
					symbolSize: 8
				},
				'2013-07-01', '2013-08-01', '2013-09-01', '2013-10-01', '2013-11-01', {
					name: '2013-12-01',
					symbol: 'star6',
					symbolSize: 8
				}
			],
			label: {
				formatter: function(s) {
					return s.slice(0, 7);
				}
			}
		},
		options: [{
			backgroundColor:"#fff",
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				data: ['app', 'pos', '银行代扣', 'pc']
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
								max: 1700
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
				name: '销售渠道占比',
				type: 'pie',
				center: ['50%', '45%'],
				radius: '50%',
				data: [{
					value: idx * 128 + 80,
					name: 'app'
				}, {
					value: idx * 64 + 160,
					name: 'pos'
				}, {
					value: idx * 32 + 320,
					name: '银行代扣'
				}, {
					value: idx * 16 + 640,
					name: 'pc'
				}]
			}]
		}, {
			series: [{
				name: '销售渠道占比',
				type: 'pie',
				data: [{
					value: idx * 128 + 80,
					name: 'app'
				}, {
					value: idx * 64 + 160,
					name: 'pos'
				}, {
					value: idx * 32 + 320,
					name: '银行代扣'
				}, {
					value: idx * 16 + 640,
					name: 'pc'
				}]
			}]
		}, {
			series: [{
				name: '销售渠道占比',
				type: 'pie',
				data: [{
					value: idx * 128 + 80,
					name: 'app'
				}, {
					value: idx * 64 + 160,
					name: 'pos'
				}, {
					value: idx * 32 + 320,
					name: '银行代扣'
				}, {
					value: idx * 16 + 640,
					name: 'pc'
				}]
			}]
		}, {
			series: [{
				name: '销售渠道占比',
				type: 'pie',
				data: [{
					value: idx * 128 + 80,
					name: 'app'
				}, {
					value: idx * 64 + 160,
					name: 'pos'
				}, {
					value: idx * 32 + 320,
					name: '银行代扣'
				}, {
					value: idx * 16 + 640,
					name: 'pc'
				}]
			}]
		}, {
			series: [{
				name: '销售渠道占比',
				type: 'pie',
				data: [{
					value: idx * 128 + 80,
					name: 'app'
				}, {
					value: idx * 64 + 160,
					name: 'pos'
				}, {
					value: idx * 32 + 320,
					name: '银行代扣'
				}, {
					value: idx * 16 + 640,
					name: 'pc'
				}]
			}]
		}, {
			series: [{
				name: '销售渠道占比',
				type: 'pie',
				data: [{
					value: idx * 128 + 80,
					name: 'app'
				}, {
					value: idx * 64 + 160,
					name: 'pos'
				}, {
					value: idx * 32 + 320,
					name: '银行代扣'
				}, {
					value: idx * 16 + 640,
					name: 'pc'
				}]
			}]
		}, {
			series: [{
				name: '销售渠道占比',
				type: 'pie',
				data: [{
					value: idx * 128 + 80,
					name: 'app'
				}, {
					value: idx * 64 + 160,
					name: 'pos'
				}, {
					value: idx * 32 + 320,
					name: '银行代扣'
				}, {
					value: idx * 16 + 640,
					name: 'pc'
				}]
			}]
		}, {
			series: [{
				name: '销售渠道占比',
				type: 'pie',
				data: [{
					value: idx * 128 + 80,
					name: 'app'
				}, {
					value: idx * 64 + 160,
					name: 'pos'
				}, {
					value: idx * 32 + 320,
					name: '银行代扣'
				}, {
					value: idx * 16 + 640,
					name: 'pc'
				}]
			}]
		}, {
			series: [{
				name: '销售渠道占比',
				type: 'pie',
				data: [{
					value: idx * 128 + 80,
					name: 'app'
				}, {
					value: idx * 64 + 160,
					name: 'pos'
				}, {
					value: idx * 32 + 320,
					name: '银行代扣'
				}, {
					value: idx * 16 + 640,
					name: 'pc'
				}]
			}]
		}, {
			series: [{
				name: '销售渠道占比',
				type: 'pie',
				data: [{
					value: idx * 128 + 80,
					name: 'app'
				}, {
					value: idx * 64 + 160,
					name: 'pos'
				}, {
					value: idx * 32 + 320,
					name: '银行代扣'
				}, {
					value: idx * 16 + 640,
					name: 'pc'
				}]
			}]
		}, {
			series: [{
				name: '销售渠道占比',
				type: 'pie',
				data: [{
					value: idx * 128 + 80,
					name: 'app'
				}, {
					value: idx * 64 + 160,
					name: 'pos'
				}, {
					value: idx * 32 + 320,
					name: '银行代扣'
				}, {
					value: idx * 16 + 640,
					name: 'pc'
				}]
			}]
		}, {
			series: [{
				name: '销售渠道占比',
				type: 'pie',
				data: [{
					value: idx * 128 + 80,
					name: 'app'
				}, {
					value: idx * 64 + 160,
					name: 'pos'
				}, {
					value: idx * 32 + 320,
					name: '银行代扣'
				}, {
					value: idx * 16 + 640,
					name: 'pc'
				}]
			}]
		}]
	};

	var myChart3 = ec.init(document.getElementById('dchart3'));
	myChart3.showLoading({
		text: '正在努力的读取数据中...', //loading话术
	});
	$('#dchart3').watchScroll({
		onShowing: function() {
			myChart3.setOption(opt3);
			myChart3.hideLoading();
		}
	});

});