/**
 * Created by guowei.dong on 2015/6/19.
 */
var cmutils = cmutils || {};
(function (w, d, $, ec, cmutils) {

    cmutils.CMCharts = function (selector, option) {
        var that = this;
        var defaultSettings = {
            timeline: {
                backgroundColor: "",
                lineStyle: {},
                data: [], //string|obj. { name:'2013-06-01', symbol:'emptyStar6', symbolSize:8 },name是显示的名称，symbol是样式
                label: {
                    lineStyle: {
                        type: 'solid'
                    },
                    textStyle: {
                        color: '#333'
                    },
                    rotate: 0,
                    //formatter: function (s) {
                    //    return s.slice(0, 7);
                    //}
                } //格式化需要显示的数值
            }, //时间轴，针对不同的时间段
            options: {
                backgroundColor: "#ebeaef", //图标背景，默认是无色透明
                //color: ['#000', 'orange'],//item所采用的颜色组
                renderAsImage: false, //已图片的方式渲染
                calculable: false, //支持拖拽item和拖拽后重新计算
                animation: true, //是否启用动画渲染，其他配置：animationEasing:"";时间函数
                title: {
                    'text': '',
                    'subtext': ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        show: true,
                        type: 'line', //shadow|line
                        lineStyle: {
                            type: 'dashed',
                            width: 1
                        }
                    }, //鼠标所在辅助xy标线
                    //formatter: function (params, ticket, callback) {
                    //},
                    textStyle: {
                        color: '#fff'
                    }
                },
                legend: {
                    orient: "vertical", //'horizontal' | 'vertical'
                    x: 'right', //图标的标题位置，在x轴和y轴
                    data: []
                    //selected: {}//图标标题的选中情况，依赖于数据层
                    ,
                    textStyle: {
                        fontSize: 12
                    }
                },

                //dataZoom: {
                //    //backgroundColor:"blue",
                //    //dataBackgroundColor:"red",
                //    //fillerColor:"yellow",
                //    handleColor: "#000",
                //    //zoomLock:true,
                //    start: 0, end: 100,
                //    //orient:"vertical",
                //    show: false,
                //    realtime: true,
                //    handleSize: 10
                //},

                //dataRange: {
                //    min: 0,
                //    max: 4000,
                //    text: ['高', '低'],// 文本，默认为数值文本
                //    calculable: true,//拖拽重新计算，改为false固定筛选
                //    x: 'left',//位置
                //    color: ['orangered', 'yellow', 'lightskyblue']//颜色渐变
                //},//筛选数据用的配置
                //series: [{
                //    name: '浏览器（数据纯属虚构）',//此处value也是tooltip的显示值
                //    type: 'bar',//可选为： 'line'| 'bar'| 'scatter'（散点图） | 'k'（K线图）'pie'（饼图） | 'radar'（雷达图） | 'chord'（和弦图） | 'force'（力导向布局图） | 'map'（地图）
                //    data: [],//数据{value:[]}
                //    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                //    markPoint: {
                //        data: [
                //            {type: 'max', name: '最大值'},
                //            {type: 'min', name: '最小值'}
                //        ]
                //    },//在图上标注
                //    markLine: {
                //        data: [
                //            {type: 'average', name: '平均值'}
                //        ]
                //    }
                //    //在图上新生成一条
                //},//这是标准的数据层结构
                //    {
                //        title: {'text': '2003全国宏观经济指标'},
                //        series: [
                //            {'data': []}
                //        ]
                //    },//但是有的时间轴不一样，图标title不一样，此处是使用了$.extend{true,,,}方式来合并了option，并重新使用了新的option来渲染
                //    {
                //        //地图
                //        data: [
                //            {
                //                name: '北京',
                //                value: 1234,
                //                selected: true
                //            },
                //            {
                //                name: '天津',
                //                value: 321
                //            }
                //        ]
                //    }
                //
                //],//数据,是个数组对象，依据时间轴决定，一段时间是一个，如果没时间轴，则数组只有一个对象 每个数组的对象是一个形状，一份图表,因为chart实例中可以存在多份图表展示
            }
        };
        (function () {
            if (option.timeline && (typeof option.timeline == 'object') && (option.timeline.data instanceof Array)) {
                that.hasTimeLine = option.timeline;
            } else {
                that.hasTimeLine = false;
            }

            that.useropt = combinOptions(option);
            if (document.querySelector(selector)) {
                that.mychart = ec.init(document.querySelector(selector));
            } else {
                that.mychart = null;
            }
            that.option = defaultSettings;
        }());
        that.ajaxFetch = function (param) {
            that.mychart.showLoading({
                text: '正在努力的读取数据中...',
                //effect: effect[effectIndex],
                textStyle: {
                    fontSize: 12
                }
            });
            return $.ajax({
                url: param.url,
                dataType: "json",
                type: "get",
                cache: false,
                timeout: 5000,
                data: param.params ? param.params : null
            });
        };
        that.getChart = function () {
            return that.mychart;
        }
    }

    function drawAxis(setting, data, returnCall) {
        var _arr = [],
            returnObj = null,
            newopt = {},
            _mc = this.mychart,
            opt = this.option;
        var axisSetting = {
            options: {
                backgroundColor: "#fff", //图标背景，默认是无色透明
                //color: ['#000', 'orange'],//item所采用的颜色组
                renderAsImage: false, //已图片的方式渲染
                calculable: false, //支持拖拽item和拖拽后重新计算
                animation: true, //是否启用动画渲染，其他配置：animationEasing:"";时间函数
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        show: true,
                        type: 'line', //shadow|line
                        lineStyle: {
                            type: 'dashed',
                            width: 1
                        }
                    }, //鼠标所在辅助xy标线
                    //formatter: function (params, ticket, callback) {
                    //},
                    textStyle: {
                        color: '#fff'
                    }
                },
                legend: {
                    orient: "horizontal", //'horizontal' | 'vertical'
                    x: 'center', //图标的标题位置，在x轴和y轴
                    data: []
                    //selected: {}//图标标题的选中情况，依赖于数据层
                },
                toolbox: {
                    show: true, //是否显示
                    orient: 'vertical', //横竖，默认是横，y默认top
                    x: 'right',
                    y: 'center',
                    feature: {
                        //dataZoom : {show: true},
                        'mark': {
                            'show': false
                        }, //辅助标线
                        //'dataView': {'show': true, 'readOnly': true},
                        'magicType': {
                            'show': true,
                            'type': ['line', 'bar']
                        }, //整体转换成不同的显示方式,相关联的可以转,直角系，图
                        //'restore': {'show': true},
                        'saveAsImage': {
                            'show': true
                        }
                    } //功能配置
                },
                grid: {
                    'y': 50,
                    'y2': 50, x2: 15, x: 50
                }, //直角坐标系内绘图网格,决定图标占多大空间
                dataZoom: {
                    //backgroundColor:"blue",
                    //dataBackgroundColor:"red",
                    //fillerColor:"yellow",
                    handleColor: "#000",
                    //zoomLock:true,
                    start: 0,
                    end: 100,
                    //orient:"vertical",
                    show: false,
                    realtime: true,
                    handleSize: 10
                },
                xAxis: {
                    'type': 'category', //'category'会带data组合 | 'value' | 'time' | 'log'
                    //'max': 500,//x轴最大值
                    //axisTick:true,
                    boundaryGap: true, //类目起始和结束两端空白策略，见下图，默认为true留空，false则顶头
                    'axisLabel': {
                        'interval': 'auto'
                    }, //0是全部显示，auto是自动隐藏看不到的
                    //axisLine: {onZero: false},
                    splitLine: {
                        show: true
                    }, //显示图标网格
                }, //x,图类没有轴显示
                yAxis: [{
                    'type': 'value',
                    //'name': 'GDP（亿元）',//轴名称
                    //'max': 5000,//y轴最大值
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    }
                }
                    //    , {
                    //    'type': 'value',
                    //    //'name': 'GDP（亿元）',//轴名称
                    //    //'max': 5000,//y轴最大值
                    //    axisLine: {
                    //        lineStyle: {color: 'green'}
                    //    },
                    //    axisLabel : {
                    //        formatter: function(v){
                    //            return - v;
                    //        }
                    //    }
                    //}
                ], //y,图类没有轴显示
                //数据,是个数组对象，依据时间轴决定，一段时间是一个，如果没时间轴，则数组只有一个对象 每个数组的对象是一个形状，一份图表,因为chart实例中可以存在多份图表展示
            }
        };
        if (returnCall && $.isFunction(returnCall)) {
            returnCall(data, axisSetting.options);
        }
        returnObj = data;
        var useType = setting.type, usingArea = false;
        if (setting.type == "area") {
            useType = "line";
            usingArea = true;
        }
        $.each(returnObj.dataStore[0].itemData, function (i, v) {
            var _obj = {
                name: returnObj.dataStore[0].key[i],
                type: useType,
                data: v,
                yAxisIndex: 0,
                smooth: true,
                //itemStyle:{normal: {areaStyle: {type: 'default'}}},
                //itemStyle: {
                //    normal: {
                //        barBorderColor: 'rgba(0,0,0,0)',
                //        color: 'rgba(0,0,0,0)'
                //    },
                //    emphasis: {
                //        barBorderColor: 'green',
                //        color: 'green'
                //    }
                //},//柱形

                //markPoint: {
                //    data: [
                //        {type: 'max', name: '最大值'},
                //        {type: 'min', name: '最小值'}
                //    ]
                //},//在图上标注
                //markLine: {
                //    data: [
                //        {type: 'average', name: '平均值'}
                //    ]
                //}
            };
            if (usingArea) {
                $.extend(_obj, {itemStyle: {normal: {areaStyle: {type: 'default'}}}});
            }
            _arr.push(_obj);
        });
        var insOpt = {};
        if (this.hasTimeLine) {
            insOpt = $.extend(true, {}, opt, axisSetting);
            newopt = {
                options: {
                    toolbox: {
                        feature: {
                            magicType: {
                                type: ['line', 'bar', 'stack', 'tiled']
                            }
                        }
                    },
                    legend: {
                        data: returnObj.dataStore[0].key
                    },
                    xAxis: {
                        data: returnObj.dataStore[0].itemKey
                    },
                    series: _arr
                }
            };
            $.extend(true, insOpt, this.useropt);
        } else {
            insOpt = $.extend(true, {}, opt.options, axisSetting.options);
            newopt = {
                toolbox: {
                    feature: {
                        magicType: {
                            type: ['line', 'bar', 'stack', 'tiled']
                        }
                    }
                },
                legend: {
                    data: returnObj.dataStore[0].key
                },
                xAxis: {
                    data: returnObj.dataStore[0].itemKey
                },
                series: _arr
            };
            $.extend(true, insOpt, this.useropt.options);
        }
        $.extend(true, newopt, insOpt);
        //设置图标配置
        _mc.setOption(newopt);
    }

    function drawPie(setting, data, returnCall) {
        var _arr = [],
            returnObj = null,
            newopt = {},
            _mc = this.mychart,
            opt = this.option;
        var pieSetting = {
            options: {
                backgroundColor: "#fff", //图标背景，默认是无色透明
                //color: ['#000', 'orange'],//item所采用的颜色组
                renderAsImage: false, //已图片的方式渲染
                calculable: false, //!!!!!!!!!!!!!!!!!!支持拖拽item和拖拽后重新计算,若打开此功能，会有外圈边框
                animation: true, //是否启用动画渲染，其他配置：animationEasing:"";时间函数
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)",//默认
                    textStyle: {
                        fontSize: 12
                    }
                },
                legend: {
                    orient: "vertical", //'horizontal' | 'vertical'
                    x: 'left', //图标的标题位置，在x轴和y轴
                    data: []
                    //selected: {}//图标标题的选中情况，依赖于数据层
                },
                toolbox: {
                    show: true,
                    orient: 'vertical', //横竖，默认是横，y默认top
                    x: 'right',
                    y: 'center',
                    feature: {
                        dataView: {
                            show: true,
                            readOnly: true
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
                }
            }
        };
        if (returnCall && $.isFunction(returnCall)) {
            returnCall(data['dataStore'][0], pieSetting.options);
        }
        returnObj = data;
        _arr.push({
            name: '数据来源',
            type: 'pie',
            radius: setting.radius ? setting.radius : '50%', //可以直接写string，表示半径，也可以用数组，之差表示半径['50%', '70%']
            //selectedMode: 'single',//single,multiple
            center: setting.position ? setting.position : ['50%', '45%'], //圆心所在的位置,left,top
            itemStyle: {
                normal: {
                    label: {
                        //position: 'inner'
                        textStyle: {
                            fontSize: 12
                        },
                        formatter: "{b}\n{c}({d}%)"
                    },
                    labelLine: {
                        show: true
                    }
                },
//					emphasis: {
//						label: {
//							position: 'center',
//							show: true,
//							textStyle: {
//								fontSize: '24',
//								fontWeight: 'bold'
//							},
//							formatter: "{b}\n{d}%"
//						}
//					}
            },
            data: returnObj.dataStore[0]
        });
        var titleArr = [];
        $.each(returnObj.dataStore[0], function (i, v) {
            titleArr.push(v.name);
        });

        var insOpt = {};
        if (this.hasTimeLine) {
            insOpt = $.extend(true, {}, opt, pieSetting);
            newopt = {
                options: {
                    legend: {
                        data: titleArr
                    },
                    series: _arr
                    /**
                     * 正常情况下，饼图不是嵌套的，相当于柱状里面的一条，但柱状图大部分都是N个柱子对比，
                     *所以饼图里面同一半径相当于一个柱子，
                     *可能存在不同半径，表示不同柱子,这个时候series就不是只有一个元素的数组了，可能多元素
                     */
                }
            };
            $.extend(true, insOpt, this.useropt);

        } else {
            insOpt = $.extend(true, {}, opt.options, pieSetting.options);
            newopt = {
                legend: {
                    data: titleArr
                },
                series: _arr
            };
            $.extend(true, insOpt, this.useropt.options);
        }
        $.extend(true, newopt, insOpt);
        _mc.setOption(newopt);

    }

    function drawMap(setting, data, returnCall) {
        var _arr = [],
            returnObj = null,
            newopt = {},
            _mc = this.mychart,
            opt = this.option;
        var mapSetting = {
            options: {
                backgroundColor: "#fff", //图标背景，默认是无色透明
                //color: ['#000', 'orange'],//item所采用的颜色组
                renderAsImage: false, //已图片的方式渲染
                calculable: false, //支持拖拽item和拖拽后重新计算
                animation: true, //是否启用动画渲染，其他配置：animationEasing:"";时间函数
                tooltip: {
                    trigger: 'item',
                    //formatter: '{b}'
                },
                legend: {
                    orient: "vertical", //'horizontal' | 'vertical'
                    x: 'left', //图标的标题位置，在x轴和y轴
                    data: []
                    //selected: {}//图标标题的选中情况，依赖于数据层
                },
                dataRange: {
                    min: 0,
                    max: 100,
                    x: 'left',
                    y: 'bottom',
                    text: ['高', '低'], // 文本，默认为数值文本
                    calculable: true
                },
                roamController: {
                    show: true,
                    x: 'right',
                    mapTypeControl: {
                        'china': true
                    }
                },
                toolbox: {
                    show: true,
                    orient: 'vertical', //横竖，默认是横，y默认top
                    x: 'right',
                    y: 'center',
                    feature: {
                        dataView: {
                            show: true,
                            readOnly: true
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                }
            }
        };
        if (returnCall && $.isFunction(returnCall)) {
            returnCall(data, mapSetting.options);
        }

        returnObj = data;
        $.each(returnObj.dataStore[0].itemData, function (i, v) {
            var _obj = {
                name: returnObj.dataStore[0].itemKey[i],
                type: 'map',
                mapType: 'china',
                //selectedMode : 'multiple',
                roam: false,
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
                data: v
            };
            _arr.push(_obj);

        });

        var titleArr = returnObj.dataStore[0].itemKey;

        var insOpt = {};
        if (this.hasTimeLine) {
            insOpt = $.extend(true, {}, opt, mapSetting);
            newopt = {
                options: {
                    legend: {
                        data: titleArr
                    },
                    series: _arr
                }
            };
            $.extend(true, insOpt, this.useropt);

        } else {
            insOpt = $.extend(true, {}, opt.options, mapSetting.options);
            newopt = {
                legend: {
                    data: titleArr
                },
                series: _arr
            };
            $.extend(true, insOpt, this.useropt.options);
        }
        $.extend(true, newopt, insOpt);
        _mc.setOption(newopt);
    }

    cmutils.CMCharts.prototype.drawChart = function (setting, returnCall) {
        var that = this,
            opt = that.option,
            _mc = that.mychart,
            rt = null;
        if (_mc) {
            that.ajaxFetch(setting).done(function (data) {
                var rt = data.renderType;
                switch (rt) {
                    case 'axis':
                        drawAxis.call(that, setting, data, returnCall);
                        break;
                    case 'pie':
                        drawPie.call(that, setting, data, returnCall);
                        break;
                    case 'map':
                        drawMap.call(that, setting, data, returnCall);
                        break;
                    default:
                        break;
                }
                _mc.hideLoading();
            }).fail(function () {
                _mc.hideLoading();
            });
        }
        return this;
    }
    cmutils.CMCharts.prototype.redrawChart = function (setting) {
        this.ajaxFetch(setting).done(function (dataStore) {
            dataStore = convertDataByType(this.type);
            this.mychart.setSeries();
            this.mychart.hideLoading();
        }).fail(function () {
            this.mychart.hideLoading();
        });
        return this;
    };
    cmutils.CMCharts.prototype.clear = function (callback) {
        if (this.mychart) {
            this.myChart.clear();
        }
        return this;
    };
    cmutils.CMCharts.prototype.destroy = function (callback) {
        if (this.mychart) {
            this.myChart.dispose();
        }
    }

    function convertDataByType(type) {
    }

    function combinOptions(opt) {
        return opt;
    }
})
(window, document, window.jQuery, window.echarts, cmutils);