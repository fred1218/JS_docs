/**
 * *****票务管理的片区管理需用*****
 *在seats中,和 "rowId": "1",
 "rowNum": 1一样并列加上seatsCount:0来显示有多少个座位，方便自定义座位号
 * Created by guowei.dong on 2015/6/30.
 */
;
(function (_win, _doc, $, dragPlugin, undefined) {
    $.fn.initSeartMgrBg = function (method) {
        var chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var totalCodes = [];
        var defSettings = {
            store: null,//从数据库取数据[json/url]
            useLocalCache: false, //决定是否在初始化的时候可以从缓存加载数据，虽然默认操作和状态都是保存在缓存当中
            autoSaveToLocal: true, //自动保存到本地缓存的,只保存在插件设置的属性，回调设置的攒没执行saveToLocal
            showType: {
                type: 'manage', userDefinedSeats: null
            }, //view|manage//决定是不是带片区用来编辑
            layout: [20, 10],//影院初始布局
            rowsNameRule: "number", //row:char/number,
            columnsRule: {order: 'LR', useEmpty: false, rule: "series"},//rule:odd(奇数)/even(偶数)/series(连续)
            size: [22, 18],
            margin: 1, //1*5px pre
            padding: [40, 10, 40, 10],
            //scale: 1,
            rowCtrl: {show: true, addEl: 'rctl_addRow', reduceEl: 'rctl_reduceRow'},//className
            columnCtrl: {show: true, addEl: 'colctrl_addColumn', reduceEl: 'colctrl_reduceColumn'},
            screen: {
                draggable: true,
                width: 100,
                height: 40,
                bgColor: '#000',
                text: 'screen center'
                //position:
            },//屏幕中央
            areas: {
                openDrawAreaFunc: {
                    switch: true,
                    areaName: "片区",
                    fillColor: "#ccc",
                    afterInsertNewCallbak: null,
                    codeTmpt: "CODEXXXX"
                },
                afterResizing: null, onResizing: null,
                afterDraging: null, onDraging: null, onSelected: null,
                draggable: true, resizable: true, deleteFunc: {switch: true, onDeleteArea: null, text: 'X'},
                contains: []
                // example:contains: [{
                //    areaNameRule: {type: null, rule: null},//type: 'odd\even\series(default)', rule: 'RL'\LR(default)
                //    name: 'area',
                //    begin: '1-2',
                //    end: '5-5', bgColor: 'blue',
                //memo: "备注",
                //opacity: 0.8
                //}]
            }
        };

        var methods = {
            destroy: function () {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("cmInitSeartMgr"), generateSeatJson = {};
                    //TODO 移除数据data=null，移除事件event[]
                });
            },
            init: function (option, onInitCallback, setOption) {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("cmInitSeartMgr"), generateSeatJson = {};
                    if (setOption) {
                        $.extend(true, opt, setOption);
                        $cont.data("firstInited", false).data('setOption', true);
                        generateSeatJson = {
                            areas: option.areas.contains,
                            cols: option.layout[0],
                            rows: option.layout[1],
                            screen: option.screen,
                            seats: []
                        };
                        $cont.data("cmInitSeartMgr", opt);
                        _init(opt);
                    } else {
                        $cont.data('setOption', false);
                        if (typeof opt === 'undefined') {
                            opt = $.extend(true, {}, defSettings, option);
                            $cont.data("firstInited", true);
                        } else {
                            $.extend(true, opt, option);
                            $cont.data("firstInited", false);
                        }

                        var localDataStr = _win.sessionStorage['_seat_data'];
                        if (localDataStr && opt.useLocalCache) {
                            console.log('=================from local cache=================');
                            generateSeatJson = JSON.parse(localDataStr);
                            var _obj = {
                                layout: [generateSeatJson.cols, generateSeatJson.rows],
                                screen: {
                                    text: generateSeatJson.screen.text,
                                    position: generateSeatJson.screen.position
                                },
                                areas: {contains: generateSeatJson.areas}
                            };
                            $.extend(true, opt, _obj);
                            $cont.data("cmInitSeartMgr", opt);
                            _init(opt);
                        } else {
                            if (opt.store && $.trim(opt.store)) {
                                console.log('=================from ajax,url is:', opt.store, "=================");
                                $.ajax({
                                    url: opt.store, type: "post", dataType: "json", async: true, cache: false
                                }).done(function (data) {
                                    generateSeatJson = data;
                                    var _obj = {
                                        layout: [data.cols, data.rows],
                                        screen: {text: data.screen.text, position: data.screen.position},
                                        areas: {contains: data.areas}
                                    };
                                    $.extend(true, opt, _obj);
                                    $cont.data("cmInitSeartMgr", opt);
                                    _init(opt);
                                }).fail(function () {
                                    console.error('fetch data error');
                                });
                            } else {
                                console.log('====================不想ajax获取数据就null store属性===================');
                                generateSeatJson = {
                                    areas: opt.areas.contains,
                                    cols: opt.layout[0],
                                    rows: opt.layout[1],
                                    screen: opt.screen,
                                    seats: []
                                };
                                $cont.data("cmInitSeartMgr", opt);
                                _init(opt);
                            }
                        }
                    }

                    function _init(opt) {
                        $cont.data('generateSeatJson', generateSeatJson);
                        var firstInited = $cont.data("firstInited"), isSetOption = $cont.data('setOption');
                        var sizeW = opt.size[0], sizeH = opt.size[1], _margin = opt.margin * 5, xcount = opt.layout[0], ycount = opt.layout[1], paddingl, paddingt, paddingb, paddingr;
                        var _width = sizeW + _margin * 2, _height = sizeH + _margin * 2;
                        $cont.data("seat_height", _height).data("seat_width", _width);
                        if (typeof opt.padding !== 'object') {
                            paddingl = paddingt = paddingb = paddingr = opt.padding;
                        } else {
                            paddingt = opt.padding[0];
                            paddingr = opt.padding[1];
                            paddingb = opt.padding[2];
                            paddingl = opt.padding[3];
                        }
                        var namingRules = {
                            rowsNameRule: opt.rowsNameRule,
                            columnsRule: {
                                order: opt.columnsRule.order,
                                useEmpty: opt.columnsRule.useEmpty,
                                rule: opt.columnsRule.rule
                            }
                        }, optionData = $.extend({}, namingRules, {
                            areas: generateSeatJson.areas,
                            screen: generateSeatJson.screen
                        });
                        $.each(generateSeatJson.areas, function (i, v) {
                            totalCodes.push(v.code);
                        });
                        if (opt.showType.type == 'manage') {
                            if ((firstInited) || (!firstInited && isSetOption)) {
                                registEvent();
                                $cont.on('click.addArea', function (ev) {
                                    var _height = $cont.data("seat_height"), _width = $cont.data("seat_width"), xcount = $cont.data("seat_xcount"), ycount = $cont.data("seat_ycount");
                                    if (opt.areas.openDrawAreaFunc.switch) {
                                        //drawing = false;//可以设置开启一次功能可以画多少个片区，为false则一次只能画一个
                                        var _t = ev.target, $_t = $cont.find(_t);
                                        if ($_t.hasClass('seat')) {
                                            var newOpt = [{
                                                newInsert: true,
                                                name: opt.areas.openDrawAreaFunc.areaName ? opt.areas.openDrawAreaFunc.areaName : 'area',
                                                begin: $_t.attr('data-row') + '-' + $_t.attr('data-column'),
                                                end: $_t.attr('data-row') + '-' + $_t.attr('data-column'),
                                                bgColor: opt.areas.openDrawAreaFunc.fillColor ? opt.areas.openDrawAreaFunc.fillColor : '#ccc',
                                            }];
                                            initAreas($cont, newOpt, _width, _height, xcount, ycount, true, true, opt.areas.openDrawAreaFunc.afterInsertNewCallbak);
                                        }
                                    }
                                });
                            }
                            _finishShowSeats(xcount, ycount, firstInited);
                            //onInitCallback的回调,根据配置初始化操作dom项目
                            if ($.isFunction(onInitCallback)) {
                                onInitCallback.call($cont, optionData);
                            }
                        } else if (opt.showType.type == 'view') {
                            if (!firstInited) {
                                detachEvent();
                            }
                            $cont.css({
                                position: 'relative',
                                boxSizing: 'content-box',
                                width: _width * xcount,
                                height: _height * ycount,
                                padding: paddingt + 'px ' + paddingr + 'px ' + paddingb + 'px ' + paddingl + "px"
                            });
                            var seatsHtml = drawSeats4view(generateSeatJson, xcount, ycount, _margin, _width, _height, opt.showType.userDefinedSeats, namingRules);
                            $cont.empty().append(seatsHtml);
                            if (opt.screen) {
                                var draggable = false;
                                var _pos = xcount / 2;
                                _pos = opt.screen.position ? opt.screen.position : _pos;
                                addScreenBlocker(draggable, xcount, ycount, _pos);
                            }
                        }

                        function _finishShowSeats(xcount, ycount, firstInited) {
                            $cont.data("seat_xcount", xcount);
                            $cont.data("seat_ycount", ycount);
                            //将新的行列保存在generateSeatJson中
                            generateSeatJson.cols = xcount;
                            generateSeatJson.rows = ycount;
                            if (!firstInited) {
                                console.log('=================from cache,by seatsControl=================');
                                var gjson = $cont.data('generateSeatJson');
                                var _obj = {
                                    layout: [generateSeatJson.cols, generateSeatJson.rows],
                                    screen: {
                                        text: gjson.screen.text,
                                        position: gjson.screen.position
                                    },
                                    areas: {contains: gjson.areas}
                                };
                                $.extend(true, opt, _obj);
                            }

                            $cont.css({
                                position: 'relative',
                                boxSizing: 'content-box',
                                width: _width * xcount,
                                height: _height * ycount,
                                padding: paddingt + 'px ' + paddingr + 'px ' + paddingb + 'px ' + paddingl + "px"
                            });
                            drawSeats(xcount, ycount, generateSeatJson);
                            addControlForSeat(xcount, ycount);
                            if (opt.areas) {
                                opt.areas.contains = generateSeatJson.areas;
                                initAreas($cont, opt.areas.contains, _width, _height, xcount, ycount);
                            }
                            if (opt.screen) {
                                var draggable = opt.screen.draggable;
                                if (dragPlugin && opt.screen.draggable) {
                                } else {
                                    draggable = false;
                                }
                                var _pos = xcount / 2;
                                if (firstInited) {
                                    _pos = opt.screen.position ? opt.screen.position : _pos;
                                }
                                addScreenBlocker(draggable, xcount, ycount, _pos);
                            }
                            recordDataToLocal();
                        }


                        //增加屏幕控制
                        function addScreenBlocker(draggable, xcount, ycount, _pos) {
                            var html = '', $dragEl, startPos = _pos, tmp_start = 0, endPos = _pos, tmp_end = 0;
                            generateSeatJson.screen.position = endPos;
                            html += ' <div  class="screen_blocker" data-label-for="screen" style="position:absolute;left:' + ((_pos * _width) + paddingl - opt.screen.width / 2 + 1) + 'px;top:-45px;width:' + opt.screen.width + 'px;height:' + opt.screen.height + 'px;line-height:' + opt.screen.height + 'px;background-color:' + opt.screen.bgColor + '">' + opt.screen.text;
                            html += ' <div  class="screen_blocker_line" style="width:' + opt.screen.width / 2 + 'px;height:' + (_height * ycount + paddingt + paddingb) + 'px;top:' + opt.screen.height + 'px;clip: rect(0, ' + opt.screen.width / 2 + 'px, ' + (_height * ycount + paddingt + paddingb) + 'px, ' + (opt.screen.width / 2 - 2) + 'px);"></div>';
                            html += '</div>';
                            $cont.append(html);
                            if (draggable) {
                                $dragEl = $cont.find('[data-label-for="screen"]').draggabilly({
                                    axis: 'x',
                                    grid: [_width / 2],
                                    containment: $cont
                                });
                                var $d2 = $dragEl.data('draggabilly');
                                $dragEl.on('dragStart', function (event, pointer) {
                                    startPos = endPos;
                                    tmp_start = $d2.position.x;
                                });
                                $dragEl.on('dragMove', function (event, pointer, moveVector) {
                                });
                                $dragEl.on('dragEnd', function (event, pointer) {
                                    tmp_end = $d2.position.x;
                                    endPos = startPos + (tmp_end - tmp_start) / (_width);
                                    generateSeatJson.screen.position = endPos;
                                    recordDataToLocal();
                                });
                            }
                        }

                        function recordDataToLocal(intoLocal) {
                            if (opt.autoSaveToLocal || intoLocal) {
                                _win.sessionStorage['_seat_data'] = JSON.stringify(generateSeatJson);
                            }
                            $cont.data('generateSeatJson', generateSeatJson);
                        }

                        /**
                         * 编辑状态下，会在加载的时候初始化座位数据，除了基本配置外，还有seats属性[seatsCount属性]
                         * @param xcount
                         * @param ycount
                         */
                        function drawSeats(xcount, ycount, generateSeatJson) {
                            var scopes = getScopeOfArea(generateSeatJson);
                            //画座位之前先清空
                            //generateSeatJson['seats'] = [];
                            var inUseRow = null;
                            var html = '<div class="rowsContainer">';
                            for (var y = 0; y < ycount; y++) {
                                var returnData = _addSeat(y + 1, xcount, _margin, scopes);
                                html += '<div class="row" style="height:' + _height + 'px;width:' + _width * xcount + 'px">';
                                html += returnData["html"];
                                html += '</div>';
                                ////初始化的时候init座位布局数据
                                //var rowSeats = {
                                //    seatsCount: returnData['columnInUse'],
                                //    rowNum: y + 1,
                                //    rowId: (returnData['columnInUse'] > 0 ? ++inUseRow : ""),
                                //    columns: returnData['data']
                                //};
                                ////保存至jsonData
                                //generateSeatJson['seats'].push(rowSeats);
                            }
                            html += '</div>';
                            $cont.empty().append(html);
                        }

                        function _addSeat(row, xcount, _margin, scopes) {
                            var html = '', inUseColumn = 0;
                            var columns = [], columnsObj = {};
                            for (var x = 0; x < xcount; x++) {
                                var col_tmp = x + 1;
                                html += '<span class="seat" data-row=' + row + ' data-column=' + col_tmp + ' style="margin:' + _margin + 'px" title="' + _getRowName(row - 1, opt.rowNameRules) + '-' + col_tmp + '"></span>';
                                //初始化的时候init座位布局数据
                                var isInArea = checkSeatInArea([row, col_tmp], scopes);
                                //console.log(row, col_tmp, isInArea);
                                if (isInArea) {
                                    inUseColumn++;
                                    columnsObj = {
                                        columnId: inUseColumn,
                                        seatNo: "",
                                        st: "N"
                                    };
                                } else {
                                    columnsObj = {
                                        columnId: "",
                                        seatNo: "",
                                        st: "E"
                                    };
                                }
                                columns.push(columnsObj);
                            }
                            return {html: html, data: columns, columnInUse: inUseColumn};
                        }


                        /**
                         * 增加座位控制,没有考虑不显示的情况
                         */
                        function addControlForSeat(xcount, ycount) {
                            var ctrl_v = '', ctrl_h = '';
                            if (opt.rowCtrl.show) {
                                ctrl_v += '<div class="controlBar controlBar_v"  style="width: 50px;position: absolute;top: ' + (-_height + paddingt) + 'px;left:-50px;box-sizing: border-box;">';
                                ctrl_v += '<div data-btn="' + opt.rowCtrl.addEl + '" style="height: ' + _height + 'px;line-height:' + _height + 'px">+</div>';
                                for (var y = 0; y < ycount; y++) {
                                    ctrl_v += '<div style="height: ' + _height + 'px;line-height:' + _height + 'px">' + _getRowName(y, opt.rowsNameRule) + '</div>';
                                }
                                ctrl_v += '<div data-btn="' + opt.rowCtrl.reduceEl + '" style="height: ' + _height + 'px;line-height:' + _height + 'px">-</div>';
                                ctrl_v += '</div>';
                                $cont.append(ctrl_v);
                            }

                            if (opt.columnCtrl.show) {
                                ctrl_h += '<div class="controlBar controlBar_h"  style="width:' + _width * (xcount + 2) + 'px;box-sizing: content-box;position: absolute;left: ' + (paddingl - _width) + 'px;top: ' + (_height * ycount + paddingt + paddingb) + 'px">';
                                ctrl_h += '<span style="height: 30px;line-height: 30px;box-sizing: border-box;width: ' + _width + 'px" data-btn="' + opt.columnCtrl.addEl + '">+</span>';
                                for (var x = 0; x < xcount; x++) {
                                    ctrl_h += '<span style="height: 30px;line-height: 30px;box-sizing: border-box;width: ' + _width + 'px">' + (x + 1) + '</span>';
                                }
                                ctrl_h += '<span style="height: 30px;line-height: 30px;box-sizing: border-box;width: ' + _width + 'px" data-btn="' + opt.columnCtrl.reduceEl + '">-</span>';
                                ctrl_h += '</div>';

                                $cont.append(ctrl_h);
                            }
                        }

                        function detachEvent() {
                            $(_doc).off('click.addRow').off('click.reduceRow').off('click.addColumn').off('click.reduceColumn');
                            $cont.off('click.delete_area').off('mouseenter.cinema_area').off('mouseleave.cinema_area').off('click.cinema_area').off('click.addArea');
                        }

                        //增加事件函数
                        function registEvent() {
                            //座位行列控制
                            $(_doc).on('click.addRow', '[data-btn="rctl_addRow"]', function () {
                                var _lay = opt.layout, _r = _lay[0], _c = _lay[1];
                                opt.layout[1] = _c + 1;

                                _finishShowSeats(_r, opt.layout[1]);
                            })
                            $(_doc).on('click.reduceRow', '[data-btn="rctl_reduceRow"]', function () {
                                var _lay = opt.layout, _r = _lay[0], _c = _lay[1];
                                opt.layout[1] = _c - 1;
                                _finishShowSeats(_r, opt.layout[1]);
                            })
                            $(_doc).on('click.addColumn', '[data-btn="colctrl_addColumn"]', function () {
                                var _lay = opt.layout, _r = _lay[0], _c = _lay[1];
                                opt.layout[0] = _r + 1;
                                _finishShowSeats(opt.layout[0], _c);
                            })
                            $(_doc).on('click.reduceColumn', '[data-btn="colctrl_reduceColumn"]', function () {
                                var _lay = opt.layout, _r = _lay[0], _c = _lay[1];
                                opt.layout[0] = _r - 1;
                                _finishShowSeats(opt.layout[0], _c);
                            })
                            if (opt.areas.openDrawAreaFunc.switch && opt.areas.deleteFunc.switch) {
                                $cont.on('click.delete_area', '.delete_area', function (ev) {
                                    ev.stopPropagation();
                                    var $container = $(this).closest('[data-type="cinema_area"]');
                                    var areaIdx = $container.attr('data-area-index');
                                    var removedAreaData = generateSeatJson.areas[areaIdx];
                                    //TODO 删除片区的回调
                                    //generateSeatJson.areas.splice(areaIdx, 1);
                                    delete generateSeatJson.areas[areaIdx];//使用这种方法是为了防止已缓存的area的index不变。
                                    recordDataToLocal();
                                    $container.remove();
                                    if (opt.areas.deleteFunc.onDeleteArea && $.isFunction(opt.areas.deleteFunc.onDeleteArea)) {
                                        opt.areas.deleteFunc.onDeleteArea.call($cont, $container, removedAreaData, generateSeatJson.areas);
                                    }

                                });
                                $cont.on('mouseenter.cinema_area', '[data-type="cinema_area"]', function () {
                                    $(this).find('.delete_area').show();
                                })
                                $cont.on('mouseleave.cinema_area', '[data-type="cinema_area"]', function () {
                                    $(this).find('.delete_area').hide();
                                })
                            }

                            //点击片区执行片区的拖拽和resize
                            $cont.on('click.cinema_area', '[data-type="cinema_area"]', function () {
                                var $that = $(this), $that_dragEl = $that.find('[data-type="cinema_area_helper"]'), $others = $that.siblings('[data-type="cinema_area"]');
                                $that.addClass('selected');
                                $others.removeClass('selected');
                                if (opt.areas.onSelected && $.isFunction(opt.areas.onSelected)) {
                                    var index = $that.attr('data-area-index'), thisAreaData = generateSeatJson.areas[index];
                                    opt.areas.onSelected.call($that, index, thisAreaData);
                                }
                                var before_begin, before_end, tmp_startX = 0, tmp_startY = 0, tmp_endY = 0, tmp_endX = 0, after_begin, after_end, _which = 0;
                                if (opt.areas.draggable || $that_dragEl.attr('data-draggable') == "true") {
                                    $that.css({cursor: 'move'});
                                    var $dragEl = $that.draggabilly({
                                            handle: '[data-type="cinema_area_helper"]',
                                            grid: [_width, _height],
                                            containment: $cont
                                        }),
                                        $d2 = $dragEl.data('draggabilly');

                                    $dragEl.on('dragStart', function (event, pointer, moveVector) {
                                        _which = $that.attr('data-area-index');
                                        tmp_startX = $d2.position.x, tmp_startY = $d2.position.y;
                                        before_begin = generateSeatJson.areas[_which].begin;
                                        before_end = generateSeatJson.areas[_which].end;
                                    });
                                    $dragEl.on('dragMove', function (event, pointer, moveVector) {
                                        if (opt.areas.onDraging && $.isFunction(opt.areas.onDraging)) {
                                            opt.areas.onDraging.call($that, $that.find('[data-type="cinema_area_helper"]'));
                                        }
                                    });
                                    $dragEl.on('dragEnd', function (event, pointer) {
                                        if (opt.areas.afterDraging && $.isFunction(opt.areas.afterDraging)) {
                                            opt.areas.afterDraging.call($that, $that.find('[data-type="cinema_area_helper"]'));
                                        }
                                        tmp_endX = $d2.position.x, tmp_endY = $d2.position.y;
                                        var y_len = (tmp_endX - tmp_startX) / _width, x_len = (tmp_endY - tmp_startY) / _height;
                                        var beforeArr = before_begin.split('-'), endArr = before_end.split('-');
                                        after_begin = (parseInt(beforeArr[0], 10) + x_len) + '-' + (parseInt(beforeArr[1], 10) + y_len);
                                        after_end = (parseInt(endArr[0], 10) + x_len) + '-' + (parseInt(endArr[1], 10) + y_len);
                                        generateSeatJson.areas[_which].begin = after_begin;
                                        generateSeatJson.areas[_which].end = after_end;
                                        recordDataToLocal();
                                    });
                                }
                                if (opt.areas.resizable || $that.attr('data-resizable') == "true") {
                                    var _index = $that.attr('data-area-index');
                                    $cont.find(this).resizable({
                                        grid: [_width, _height],
                                        helper: null, containment: $cont,
                                        //handles: "se,sw,ne,nw",
                                        handles: "s,e,se",
                                        resize: function (a, o) {
                                            if (opt.areas.onResizing && $.isFunction(opt.areas.onResizing)) {
                                                opt.areas.onResizing.call($cont, $that);
                                            }
                                            $that.css({
                                                lineHeight: $that.height() + 'px'
                                            });
                                        },
                                        stop: function (a, o) {
                                            if (opt.areas.afterResizing && $.isFunction(opt.areas.afterResizing)) {
                                                opt.areas.afterResizing.call($cont, $that);
                                            }
                                            //console.debug('o.size.height / _height:', o.size.height, _height, o.size.height / _height);
                                            var sStr = generateSeatJson.areas[_index].begin, sarr = sStr.split('-');
                                            generateSeatJson.areas[_index].end = parseInt(sarr[0], 10) - 1 + o.size.height / _height + "-" + (parseInt(sarr[1], 10) - 1 + o.size.width / _width);
                                            recordDataToLocal();
                                        }
                                    });
                                }
                            })
                        }
                    }

                    //==================================以上都是init==================================


                });
            },
            /**
             *
             * @param option
             * @param combin 是否合并覆盖到原配置
             * @returns {*}
             */
            update: function (option, repaint) {
                return this.each(function () {
                        var $cont = $(this), opt = $cont.data("cmInitSeartMgr"), generateSeatJson = {};
                        var newOpt = {};
                        if (option.areas instanceof Array) {
                            newOpt = {
                                areas: {contains: option.areas},
                                columnsRule: option.columnsRule,
                                rowsNameRule: option.rowNumType,
                                screen: option.screen,
                                showType: option.showType
                            };
                        }
                        else {
                            newOpt = option;
                        }
                        if (typeof opt === 'undefined') {
                            opt = $.extend(true, {}, defSettings, newOpt);
                        } else {
                            $.extend(true, opt, newOpt);
                        }
                        $cont.data("cmInitSeartMgr", opt);
                        if (repaint) {
                            methods.init.call($cont, opt, null, true);
                        }

                    }
                );
            },
            getAllSeatsData: function (onlyGetSeatsInfo, userDefinedSeats, callback) {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("cmInitSeartMgr");
                    var jsonData = $cont.data('generateSeatJson');
                    var seats = renderSeatsData(jsonData);
                    var namingRules = {
                        rowsNameRule: opt.rowsNameRule,
                        columnsRule: {
                            order: opt.columnsRule.order,
                            useEmpty: opt.columnsRule.useEmpty,
                            rule: opt.columnsRule.rule
                        }
                    };
                    var xcount = opt.layout[0], ycount = opt.layout[1];
                    for (var y = 0; y < ycount; y++) {
                        dealWithEachRow(y, xcount, seats, userDefinedSeats, namingRules);
                    }
                    jsonData.seats = seats;
                    var onlySeatsInfo = {
                        "cols": jsonData.cols,
                        "rows": jsonData.rows,
                        "seats": seats
                    };
                    if (callback && $.isFunction(callback)) {
                        callback.call($cont, onlyGetSeatsInfo ? onlySeatsInfo : $.extend({}, namingRules, jsonData));
                    }
                });
            }
        };
        var dealWithEachRow = function (row, xcount, seatsArr, userDefinedSeats, namingRules) {
            var rowSeats = seatsArr[row];
            var seatCounts = rowSeats.seatsCount, rowId = rowSeats.rowId, rowNum = rowSeats.rowNum, columns = rowSeats.columns;
            var newRowSeats = {};
            var rowsNameRule = namingRules.rowsNameRule, columnsRule = namingRules.columnsRule;
            //应该使用部分属性，防止被用户错改
            var _newSeatsData = $.extend({}, seatsArr);
            Object.defineProperties(_newSeatsData, {
                rowId: {
                    writable: true,
                    enumerable: true,
                    configurable: false
                },
                rowNum: {
                    writable: true,
                    enumerable: true,
                    configurable: false
                },
                seatsCount: {
                    writable: false,
                    enumerable: false,
                    configurable: false
                },
                columns: {
                    writable: true,
                    enumerable: true,
                    configurable: false
                }
            });
            if (userDefinedSeats && $.isFunction(userDefinedSeats)) {
                newRowSeats = userDefinedSeats(_newSeatsData);
                if (!newRowSeats) {
                    newRowSeats = rowSeats;
                }
                //根据newRowSeats新数据，重新显示座位，重新命名了setNo,根据seatNo来显示自定义的座位信息，否则seatNo没赋值，就用默认的原来的
                rowId = newRowSeats.rowId, rowNum = newRowSeats.rowNum, columns = newRowSeats.columns;
            } else {
                rowId = _getRowName(rowId - 1, rowsNameRule);
                var newcolumns = [];
                for (var x = 0; x < xcount; x++) {
                    if (rowId && $.trim(rowId)) {
                        var eachColumn = columns[x];
                        //如果seatNo不为空，那么座位显示信息就用seatNo。不用拼接座位排座字符串
                        var colId = $.trim(eachColumn.columnId), seatNo = $.trim(eachColumn.seatNo);
                        if (eachColumn.st == 'E' || !colId) {
                            newcolumns.push(eachColumn);
                        } else {
                            if (columnsRule.order == 'LR') {
                                if (columnsRule.useEmpty) {
                                    colId = x + 1;
                                }
                            } else if (columnsRule.order == 'RL') {
                                if (columnsRule.useEmpty) {
                                    colId = xcount - x;
                                } else {
                                    colId = seatCounts - parseInt(colId, 10) + 1;
                                }
                            }
                            colId = _getColumnName(colId, columnsRule);
                            eachColumn.columnId = colId;
                            eachColumn.seatNo = rowId + "排" + colId + "座";
                            newcolumns.push(eachColumn);
                        }

                    }
                }
                newRowSeats.rowId = rowId;
                newRowSeats.columns = newcolumns;
                newRowSeats.seatsCount = seatCounts;
                newRowSeats.rowNum = rowNum;
            }
            seatsArr[row] = newRowSeats;
        };
        var getScopeOfArea = function (generateSeatJson) {
            //获得所有scope。
            var maxR = generateSeatJson.rows, maxCol = generateSeatJson.cols;
            var scopes = [];
            $.each(generateSeatJson.areas, function (i, v) {
                if (v) {
                    var begin = v.begin, end = v.end;
                    var begin_row = begin.split('-')[0], begin_colum = begin.split('-')[1];
                    var end_row = end.split('-')[0], end_colum = end.split('-')[1];
                    if (begin_row <= maxR && begin_colum <= maxCol) {
                        var _s = [];
                        if (end_row >= maxR) {
                            end_row = maxR;
                        }
                        if (end_colum >= maxCol) {
                            end_colum = maxCol;
                        }
                        _s.push(begin_row); //r1
                        _s.push(end_row); //r2
                        _s.push(begin_colum); //c1
                        _s.push(end_colum); //c2
                        scopes.push(_s);
                    }
                }

            });
            return scopes;
        };

        /**
         * TODO 根据片区数据渲染座位数据，seatTemplete,如何将seatCode传入
         */
        var renderSeatsData = function (dataStore) {
            var scopes = getScopeOfArea(dataStore);
            //重新计算座位
            var allSeats = [];
            var rowInUse = 0;
            for (var r = 0; r < dataStore.rows; r++) {
                var rowSeats = {}, inUseColumn = 0, columns = [];
                for (var c = 0; c < dataStore.cols; c++) {
                    var ele = [r + 1, c + 1];
                    if (checkSeatInArea(ele, scopes)) {
                        inUseColumn++;
                        columns.push({
                            columnId: inUseColumn, seatNo: "", st: "N"
                        });
                    } else {
                        columns.push({
                            columnId: "", seatNo: "", st: "E"
                        });
                    }
                }

                rowSeats.rowId = (inUseColumn > 0 ? ++rowInUse : "");
                rowSeats.rowNum = (r + 1);
                rowSeats.seatsCount = inUseColumn;
                rowSeats.columns = columns;
                allSeats[r] = rowSeats;
            }
            return allSeats;
        };
        /**
         *
         * @param ele [元素坐标[1,2]]
         * @param scopes [片区范围]
         * @returns {boolean}
         */
        var checkSeatInArea = function (ele, scopes) {
            var r = null, col = null, rst = false;
            if (ele instanceof Array) {
                r = ele[0];
                col = ele[1];
                (function (row, col) {
                    for (var i = 0; i < scopes.length; i++) {
                        var v = scopes[i];
                        if (row >= v[0] && row <= v[1] && col >= v[2] && col <= v[3]) {
                            rst = true;
                            break;//直接跳出循环
                        }
                    }
                })(r, col);
            }
            return rst;
        };
        /**
         * 根据命名规则初始化行
         * @param index
         * @returns {*}
         * @private
         */
        var _getRowName = function (index, rowsNameRule) {
            var method = rowsNameRule, returnStr = null;
            switch (method) {
                case 'char':
                    returnStr = chars[index];
                    break;
                case 'number':
                    returnStr = index + 1;
                    break;
                default:
                    returnStr = index;
                    break;
            }
            return returnStr;
        }

        /**
         * 根据命名规则初始化列
         * @param index
         * @param type
         * @param rule
         * @returns {*}
         * @private
         */
        var _getColumnName = function (index, columnsRule) {
            var method = columnsRule.rule, returnStr = null;
            switch (method) {
                case 'odd':
                    returnStr = 2 * (index - 1) + 1;
                    break;
                case 'even':
                    returnStr = 2 * index; //大于0，从2开始
                    break;
                default:
                    returnStr = index;
                    break;
            }
            return returnStr;
        }
        /**
         *画座位，有根据自定义规则重命名座位
         * @param row
         * @param xcount
         * @param _margin
         * @param seatsArr
         * @returns {string}
         * @private
         */
        var _addSeat4view = function (row, xcount, _margin, seatsArr, userDefinedRulesCallBacks, namingRules) {
            var html = '';
            var rowSeats = seatsArr[row], rowId = rowSeats.rowId, rowNum = rowSeats.rowNum, columns = rowSeats.columns;
            var seatCounts = rowSeats.seatsCount;
            var newRowSeats = {};
            var rowsNameRule = namingRules.rowsNameRule, columnsRule = namingRules.columnsRule;
            if (userDefinedRulesCallBacks && $.isFunction(userDefinedRulesCallBacks)) {
                //应该使用部分属性，防止被用户错改
                var _newSeatsData = $.extend({}, rowSeats);
                Object.defineProperties(_newSeatsData, {
                    rowId: {
                        writable: true,
                        enumerable: true,
                        configurable: false
                    },
                    rowNum: {
                        writable: true,
                        enumerable: true,
                        configurable: false
                    },
                    seatsCount: {
                        writable: false,
                        enumerable: false,
                        configurable: false
                    },
                    columns: {
                        writable: true,
                        enumerable: true,
                        configurable: false
                    }
                });
                newRowSeats = userDefinedRulesCallBacks(_newSeatsData);
                if (!newRowSeats) {
                    newRowSeats = rowSeats;
                }
                //根据newRowSeats新数据，重新显示座位，重新命名了setNo,根据seatNo来显示自定义的座位信息，否则seatNo没赋值，就用默认的原来的
                rowId = newRowSeats.rowId, rowNum = newRowSeats.rowNum, columns = newRowSeats.columns;
            } else {
                //TODO 非自定义的呢？这里没处理好，getData的处理好了
            }
            for (var x = 0; x < xcount; x++) {
                if (rowId && $.trim(rowId)) {
                    //如果seatNo不为空，那么座位显示信息就用seatNo。不用拼接座位排座字符串
                    var colId = $.trim(columns[x].columnId), seatNo = $.trim(columns[x].seatNo);
                    if (columns[x].st == 'E' || !colId) {
                        html += '<span class="seat empty"  style="margin:' + _margin + 'px" ></span>';
                    } else {
                        //TODO 考虑seatNo是存整个座位信息还是column的新信息
                        if (columnsRule.order == 'LR') {
                            if (columnsRule.useEmpty) {
                                colId = x + 1;
                            }
                            //opt.columnsRule.order == 'LR'是默认排序
                        } else if (columnsRule.order == 'RL') {
                            if (columnsRule.useEmpty) {
                                colId = xcount - x;
                            } else {
                                colId = seatCounts - parseInt(colId, 10) + 1;
                            }
                        }
                        colId = _getColumnName(colId, columnsRule);
                        html += '<span class="seat" data-row=' + rowId + ' data-column=' + colId + ' style="margin:' + _margin + 'px" title="' + (seatNo ? seatNo : (_getRowName(rowId - 1, rowsNameRule) + '排' + colId + '座')) + '"></span>';
                    }

                } else {
                    html += '<span class="seat empty"  style="margin:' + _margin + 'px" ></span>';
                }
            }
            return html;
        }

        var drawSeats4view = function (generateSeatJson, xcount, ycount, _margin, _width, _height, userDefinedRulesCallBacks, namingRules) {
            var seatsArr = renderSeatsData(generateSeatJson);
            var seatsHtml = '<div class="rowsContainer">';
            for (var y = 0; y < ycount; y++) {
                var returnData = _addSeat4view(y, xcount, _margin, seatsArr, userDefinedRulesCallBacks, namingRules);
                seatsHtml += '<div class="row" style="height:' + _height + 'px;width:' + _width * xcount + 'px">';
                seatsHtml += returnData;
                seatsHtml += '</div>';
            }
            seatsHtml += '</div>';
            return seatsHtml;
        }

        function initAreas($cont, opts, _width, _height, xcount, ycount, resiable, draggable, afterInsertNewCallbak) {
            var _r = resiable ? true : false, _d = draggable ? true : false;
            var gjson = $cont.data('generateSeatJson'), json_area_index = gjson.areas.length;
            var opt = $cont.data("cmInitSeartMgr");
            $.each(opts, function (i, v) {
                if (!v)  return;
                var start = v.begin, end = v.end, bgColor = v.bgColor, name = v.name;
                var sarr = start.split('-'), earr = end.split('-');
                var _areaHtml = '', _areaDom = null;
                if (sarr[1] > xcount || sarr[0] > ycount) {
                    // 初始节点大于坐标个数，就不显示此area
                } else {
                    if (earr[1] > xcount) {
                        earr[1] = xcount;
                    }
                    if (earr[0] > ycount) {
                        earr[0] = ycount;
                    }
                    var left = (sarr[1] - 1) * _width, top = (sarr[0] - 1) * _height;
                    var width = ((earr[1] - sarr[1]) + 1) * _width, height = ((earr[0] - sarr[0]) + 1) * _height;
                    var _len = $cont.find('[data-type="cinema_area"]').length, _index = _len + 1;
                    var newname = name + "(" + _index + ")";

                    _areaHtml += '<div data-type="cinema_area" data-area-isNew=' + Boolean(v.newInsert) + ' data-area-index=' + (v.newInsert ? json_area_index : i) + ' data-resizable=' + _r + ' style="border:' + ('0px solid ' + (bgColor ? bgColor : "#000")) + ';position: absolute;left: ' + left + 'px;top:' + top + 'px;width:' + width + 'px;height:' + height + 'px;text-align:center;line-height:' + height + 'px;z-index:' + _index + '">' + newname;
                    _areaHtml += '<div data-type="cinema_area_helper" data-draggable=' + _d + ' style="background-color:' + bgColor + ';opacity:' + (v.opacity || 0.6) + ';height:100%;position: absolute;left:0;top:0;width:100%"></div>';
                    if (opt.areas.deleteFunc.switch) {
                        _areaHtml += '<span style="" class="delete_area">' + opt.areas.deleteFunc.text + '</span>';
                    }
                    _areaHtml += '</div>';
                    //这里用的rowsContainer来装载片区
                    $cont.find('.rowsContainer').append(_areaHtml);
                    _areaDom = $(_areaHtml)[0];
                }
                if (v.newInsert) {
                    gjson.areas[json_area_index] = {
                        name: name,
                        begin: start,
                        end: end,
                        bgColor: bgColor,
                        code: null,
                        notPersistent: true//尚未持久化的判断
                    };
                    //获取外来设置的code
                    var _area_code = null;

                    function _getAreaCodeFunc() {
                        (function () {
                            _area_code = opt.areas.openDrawAreaFunc.codeTmpt + Math.floor(Math.random() * 1000);
                            if (totalCodes.indexOf(_area_code) > -1) {
                                return arguments.callee();
                            }
                        })()
                    }

                    //若没输入或者自定义的code为空，则根据模板生成随机的
                    if (opt.areas.openDrawAreaFunc.tellMeCode && $.isFunction(opt.areas.openDrawAreaFunc.tellMeCode)) {
                        _area_code = opt.areas.openDrawAreaFunc.tellMeCode(totalCodes,json_area_index);
                        if (!_area_code) {
                            _getAreaCodeFunc();
                        }
                    } else {
                        _getAreaCodeFunc();
                    }
                    totalCodes.push(_area_code);
                    gjson.areas[json_area_index]['code'] = _area_code;

                    _win.sessionStorage['_seat_data'] = JSON.stringify(gjson);
                    if ($.isFunction(afterInsertNewCallbak)) {
                        afterInsertNewCallbak.call($cont, $cont.find('[data-area-index="' + json_area_index + '"]'), json_area_index, gjson.areas[json_area_index]);
                    }
                }
            });
            var _len = $cont.find('[data-type="cinema_area"]').length;
            $cont.data("seat_seatareas_length", _len);

        }

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods["init"].apply(this, arguments);
        } else {
            $.error("Method:" + method + "doesn't exisit!");
            return this;
        }
    }

})(window, window.document, window.jQuery, Draggabilly);

