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
	var placeHoledStyle = {
		normal: {
			barBorderColor: 'rgba(0,0,0,0)',
			color: 'rgba(0,0,0,0)'
		},
		emphasis: {
			barBorderColor: 'rgba(0,0,0,0)',
			color: 'rgba(0,0,0,0)'
		}
	};
	var dataStyle = {
		normal: {
			label: {
				show: true,
				position: 'insideLeft',
				formatter: '{c}%'
			}
		}
	};
	var opt2 = {
		backgroundColor: "#fff",
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: '{b}<br/>{a0}:{c0}%<br/>{a2}:{c2}%<br/>{a4}:{c4}%<br/>{a6}:{c6}%'
		},
		legend: {
			y: 55,
			itemGap: document.getElementById('dchart2').offsetWidth / 8,
			data: ['今日交易额', '当月交易额', '累计交易额']
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
		grid: {
			y: 80,
			y2: 30
		},
		xAxis: [{
			type: 'value',
			position: 'top',
			splitLine: {
				show: false
			},
			axisLabel: {
				show: false
			}
		}],
		yAxis: [{
			type: 'category',
			splitLine: {
				show: false
			},
			data: [ '菜苗', '翰典','东虹桥','金鹿']
		}],
		series: [{
			name: '今日交易额',
			type: 'bar',
			stack: '总量',
			itemStyle: dataStyle,
			data: [38, 50, 33, 72]
		}, {
			name: '今日交易额',
			type: 'bar',
			stack: '总量',
			itemStyle: placeHoledStyle,
			data: [62, 50, 67, 28]
		}, {
			name: '当月交易额',
			type: 'bar',
			stack: '总量',
			itemStyle: dataStyle,
			data: [61, 41, 42, 30]
		}, {
			name: '当月交易额',
			type: 'bar',
			stack: '总量',
			itemStyle: placeHoledStyle,
			data: [39, 59, 58, 70]
		}, {
			name: '累计交易额',
			type: 'bar',
			stack: '总量',
			itemStyle: dataStyle,
			data: [37, 35, 44, 60]
		}, {
			name: '累计交易额',
			type: 'bar',
			stack: '总量',
			itemStyle: placeHoledStyle,
			data: [63, 65, 56, 40]
		}]
	};
	var myChart1 = ec.init(document.getElementById('dchart2'));
	$('#dchart2').watchScroll({
		onShowing: function() {
			myChart1.setOption(opt2);
		}

	});
});

require(
	[
		'echarts',
		//		'echarts/chart/line',
		//		'echarts/chart/bar',
		'echarts/chart/map',
		'echarts/chart/pie', 'jquery', 'scroll'
		//		'echarts/chart/scatter',
		//		'echarts/chart/k',
		//		'echarts/chart/radar',
		//		'echarts/chart/force',
		//		'echarts/chart/chord',
		//		'echarts/chart/gauge',
		//		'echarts/chart/funnel',
		//		'echarts/chart/eventRiver',
		//		'echarts/chart/venn',
		//		'echarts/chart/treemap',
		//		'echarts/chart/tree',
		//		'echarts/chart/wordCloud',
		//		'echarts/chart/heatmap'
	], function(ec) {
		var myChart = ec.init(document.getElementById('dchart3'));
		var option = {
			backgroundColor: "#fff",
			//			backgroundColor:'#0b59a4',
			tooltip: {
				trigger: 'item'
			},
			legend: {
				x: 'right',
				selectedMode: false,
				data: ['北京', '上海', '广东']
			},
			dataRange: {
				orient: 'horizontal',
				min: 0,
				max: 55000,
				text: ['高', '低'], // 文本，默认为数值文本
				splitNumber: 0
			},
			toolbox: {
				show: false,
				orient: 'vertical',
				x: 'right',
				y: 'center',
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					}
				}
			},
			series: [{
				name: '2011全国GDP分布',
				type: 'map',
				mapType: 'china',
				mapLocation: {
					x: 'left'
				},
				selectedMode: 'multiple',
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					},
					emphasis: {
						label: {
							show: true
						}
					}
				},
				data: [{
					name: '西藏',
					value: 605.83
				}, {
					name: '青海',
					value: 1670.44
				}, {
					name: '宁夏',
					value: 2102.21
				}, {
					name: '海南',
					value: 2522.66
				}, {
					name: '甘肃',
					value: 5020.37
				}, {
					name: '贵州',
					value: 5701.84
				}, {
					name: '新疆',
					value: 6610.05
				}, {
					name: '云南',
					value: 8893.12
				}, {
					name: '重庆',
					value: 10011.37
				}, {
					name: '吉林',
					value: 10568.83
				}, {
					name: '山西',
					value: 11237.55
				}, {
					name: '天津',
					value: 11307.28
				}, {
					name: '江西',
					value: 11702.82
				}, {
					name: '广西',
					value: 11720.87
				}, {
					name: '陕西',
					value: 12512.3
				}, {
					name: '黑龙江',
					value: 12582
				}, {
					name: '内蒙古',
					value: 14359.88
				}, {
					name: '安徽',
					value: 15300.65
				}, {
					name: '北京',
					value: 16251.93,
					selected: true
				}, {
					name: '福建',
					value: 17560.18
				}, {
					name: '上海',
					value: 19195.69,
					selected: true
				}, {
					name: '湖北',
					value: 19632.26
				}, {
					name: '湖南',
					value: 19669.56
				}, {
					name: '四川',
					value: 21026.68
				}, {
					name: '辽宁',
					value: 22226.7
				}, {
					name: '河北',
					value: 24515.76
				}, {
					name: '河南',
					value: 26931.03
				}, {
					name: '浙江',
					value: 32318.85
				}, {
					name: '山东',
					value: 45361.85
				}, {
					name: '江苏',
					value: 49110.27
				}, {
					name: '广东',
					value: 53210.28,
					selected: true
				}]
			}, {
				name: '2011全国GDP对比',
				type: 'pie',
				roseType: 'area',
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				center: [document.getElementById('dchart3').offsetWidth - 250, 225],
				radius: [30, 120],
				data: [{
					name: '北京',
					value: 16251.93
				}, {
					name: '上海',
					value: 19195.69
				}, {
					name: '广东',
					value: 53210.28
				}]
			}],
			animation: false
		};
		var ecConfig = require('echarts/config');
		myChart.on(ecConfig.EVENT.MAP_SELECTED, function(param) {
			var selected = param.selected;
			var mapSeries = option.series[0];
			var data = [];
			var legendData = [];
			var name;
			for (var p = 0, len = mapSeries.data.length; p < len; p++) {
				name = mapSeries.data[p].name;
				//mapSeries.data[p].selected = selected[name];
				if (selected[name]) {
					data.push({
						name: name,
						value: mapSeries.data[p].value
					});
					legendData.push(name);
				}
			}
			option.legend.data = legendData;
			option.series[1].data = data;
			myChart.setOption(option, true);
		})
		$('#dchart3').watchScroll({
			onShowing: function() {
				myChart.setOption(option);
			}

		});


	});