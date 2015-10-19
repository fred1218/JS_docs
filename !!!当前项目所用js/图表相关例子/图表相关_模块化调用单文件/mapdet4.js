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
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: function(params) {
				var tar = params[0];
				return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
			}
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
			splitLine: {
				show: false
			},
			data: ['总收入', '金鹿', '菜苗网', '翰典', '东虹桥']
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
			name: '辅助',
			type: 'bar',
			stack: '总量',
			itemStyle: {
				normal: {
					barBorderColor: 'rgba(0,0,0,0)',
					color: 'rgba(0,0,0,0)'
				},
				emphasis: {
					barBorderColor: 'rgba(0,0,0,0)',
					color: 'rgba(0,0,0,0)'
				}
			},
			data: [0, 1700, 1400, 1200, 300, 0]
		}, {
			name: '总收入',
			type: 'bar',
			stack: '总量',
			itemStyle: {
				normal: {
					label: {
						show: true,
						position: 'inside'
					}
				}
			},
			data: [2600, 1200, 300, 200, 900]
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
	'echarts/chart/line', 'jquery', 'scroll'
], function(ec) {
	var opt2 = {
		backgroundColor: "#fff",
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			show: true,
			data: ['预期', '实际']
		},
		toolbox: {
			show: false,
			feature: {
				mark: {
					show: true
				},
				dataZoom: {
					show: true
				},
				dataView: {
					show: true
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
		calculable: true,
		dataZoom: {
			show: true,
			realtime: true,
			start: 20,
			end: 80
		},
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: function() {
				var list = [];
				for (var i = 1; i <= 30; i++) {
					list.push('2015-08-' + i);
				}
				return list;
			}()
		}],
		yAxis: [{
			name: '交易量(千万)',
			type: 'value',
			//			 axisLabel : {
			//              formatter: '{value} 千万'
			//          }
		}],
		series: [{
			name: '预期',
			type: 'line',
			smooth: true,
			data: function() {
				var list = [];
				for (var i = 1; i <= 30; i++) {
					list.push(Math.round(Math.random() * 30));
				}
				return list;
			}()
		}, {
			name: '实际',
			smooth: true,
			type: 'line',
			data: function() {
				var list = [];
				for (var i = 1; i <= 30; i++) {
					list.push(Math.round(Math.random() * 10));
				}
				return list;
			}()
		}]
	};
	var myChart2 = ec.init(document.getElementById('dchart2'));
	$('#dchart2').watchScroll({
		onShowing: function() {
			myChart2.setOption(opt2);
		}

	});

});

require(['echarts',
	'echarts/chart/pie', 'jquery', 'scroll'
], function(ec) {
	var option = {
		backgroundColor: "#fff",
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		legend: {
			orient: 'vertical',
			x: 'left',
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
					type: ['pie', 'funnel']
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
		series: [{
			name: '访问来源',
			type: 'pie',
			selectedMode: 'single',
			radius: [0, 70],

			// for funnel
			x: '20%',
			width: '40%',
			funnelAlign: 'right',
			max: 1548,

			itemStyle: {
				normal: {
					label: {
						position: 'inner'
					},
					labelLine: {
						show: false
					}
				}
			},
			data: [{
				value: 335,
				name: 'app'
			}, {
				value: 679,
				name: 'pos'
			}]
		}, {
			name: '访问来源',
			type: 'pie',
			radius: [100, 140],

			// for funnel
			x: '60%',
			width: '35%',
			funnelAlign: 'left',
			max: 1048,
			data: [{
				value: 335,
				name: 'app'
			}, {
				value: 310,
				name: 'pos'
			}, {
				value: 234,
				name: '银行代扣'
			}, {
				value: 135,
				name: 'pc'
			}]
		}]
	};
	var myChart = ec.init(document.getElementById('dchart3'));
	$('#dchart3').watchScroll({
		onShowing: function() {
			myChart.setOption(option);
		}

	});

});