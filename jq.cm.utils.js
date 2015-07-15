;
(function ($) {
    /**
     * 只验证非空，其余正则校验待加
     * @param method
     * @returns {*}
     */
    $.fn.cmSimpleFormValidate = function (method) {
        var setting = {
            box: ".info_list",
            errorClass: "error02",
            emptyMsg: "不能为空",
            elements: null//key:message
        };
        var methods = {
            init: function (option) {
                return this.each(function () {
                    var tagName = this.nodeName;
                    var $cont = $(this), opt = $cont.data("cmSimpleFormValidate");
                    if (typeof opt === 'undefined') {
                        opt = $.extend(true, {}, setting, option);
                    } else {
                        $.extend(true, opt, option);
                    }
                    $cont.data("cmSimpleFormValidate", opt);
                    var pass = false, wrongNum = 0;
                    if (tagName.toUpperCase() === 'FORM') {
                        if (opt) {
                            //$cont.find("." + opt.errorClass).remove();
                            var inputs = [];
                            if (opt.elements) {
                                var inarrs = [];
                                $.each(opt.elements, function (k, v) {
                                    inarrs.push(k);
                                    $(k).data('promptMsg', v);
                                });
                                inputs = $cont.find(inarrs.join(','));
                            } else {
                                inputs = $cont.find(':text,:password');
                            }
                            $.each(inputs, function (i, v) {
                                var box = $(v).closest(opt.box);
                                if ($.trim($(v).val())) {
                                    if (box.next('.' + opt.errorClass).length > 0) {
                                        box.next('.' + opt.errorClass).remove();
                                    }
                                } else {
                                    var msg = opt.emptyMsg;
                                    if (opt.elements) {
                                        msg = $(v).data('promptMsg');
                                    }
                                    if (box.next('.' + opt.errorClass).length > 0) {
                                    } else {
                                        box.after('<div class="' + opt.errorClass + '">' + msg + '</div>');
                                    }
                                    wrongNum++;
                                }
                            });
                            if (wrongNum === 0) {
                                pass = true;
                            }
                            $cont.data('isvalid', pass);
                        }
                    }
                });

            },
            valid: function (option) {
                var rest = false;
                this.each(function () {
                    var $cont = $(this), opt = $cont.data("cmSimpleFormValidate");
                    if (typeof opt !== 'undefined') {
                        rest = $cont.data('isvalid');
                    }
                });
                return rest;
            }
        };
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods["init"].apply(this, arguments);
        } else {
            $.error("Method:" + method + "doesn't exisit!");
            return this;
        }

    };
    /**
     * 计时器util
     * @param method
     * @returns {*}
     */
    $.fn.cmtimerUtil = function (method) {
        var setting = {
            beginTime: null,//自己写的开始计时日期
            serverTime: null,//后台穿来的当前参照日期值d_now
            totalTime: 1500, //206150;20小时61个分钟50秒的时间计时
            passby: 1000, //每1000毫秒定时一次
            delay: 0,//延迟
            onInit: null,
            onTimeFlies: null,//计时过程
            onEnd: null//计时结束
        };
        var methods = {
            init: function (option) {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("cmtimerUtil");
                    if (typeof opt === 'undefined') {
                        opt = $.extend({}, setting, option);
                    } else {
                        $.extend(opt, option);
                    }
                    $cont.data("cmtimerUtil", opt);
                    var d_begin, d_now, _dateNow = new Date();
                    d_begin = opt.beginTime ? new moment(opt.beginTime) : moment(_dateNow);
                    d_now = opt.serverTime ? new moment(opt.serverTime) : moment(_dateNow);

                    if (!d_begin.isValid() || !d_now.isValid()) {
                        console.error('beginTime or serverTime is not valid.');
                        return;
                    }
                    if (!d_begin.isAfter(d_now)) {
                        if (opt.delay > 0) {
                            var pt = convertStr2seconds(Math.abs(opt.delay));
                            //开始时间推迟
                            d_begin.add(pt, 's');
                        }
                        var n_b_diff = d_now.diff(d_begin);
                        var total_secs = convertStr2seconds(opt.totalTime);
                        if (n_b_diff >= 0) {
                            var n_b_diff_seconds = n_b_diff / 1000;
                            //begin到now的时间差减去需要从begin开始计时的时间差,不小于0的话，说明计时已经过了，小于0，表示还需要计时。
                            var _diff = n_b_diff_seconds - total_secs;

                            if (_diff >= 0) {
                                if (opt.onEnd && $.isFunction(opt.onEnd)) {
                                    opt.onEnd.call($cont);//计时已结束
                                }
                            } else {
                                beginTimer.call($cont, -_diff);//计时剩余的时间
                            }

                        } else {
                            //开始计时时间还没到(与当前时间比)
                            delayToStart.call($cont, Math.abs(n_b_diff), total_secs);
                        }
                    } else {
                        if (opt.onEnd && $.isFunction(opt.onEnd)) {
                            opt.onEnd.call($cont);//计时已结束
                        }
                    }


                });

            },

            getIsTiming: function () {
                //TODO 'P','T','N'.passed,timing,has not begin
            },
            pause: function () {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("cmtimerUtil"), _timer = $cont.data("cmtimerutil_timer");
                    if (typeof opt !== 'undefined') {
                        clearInterval(_timer);
                    }
                });
            }
        };

        function convertStr2seconds(totalTime) {
            var _t = String(totalTime), len = _t.length, total_secs = 0;
            if (len > 8) {
                console.error('too long,timer walks off the job,大于8位数我不计时(最大到两位数天) ');
            } else {
                _t = String(100000000 + totalTime);
                var mins = parseInt(_t.substr(-4, 2));
                var seconds = parseInt(_t.substr(-2, 2));
                var hours = parseInt(_t.substr(-6, 2));
                var days = parseInt(_t.substr(-8, 2));
                total_secs = countTotalSeconds(seconds, mins, hours, days);
            }
            return total_secs;
        }

        function countTotalSeconds(sec, min, hour, days) {
            return sec + min * 60 + hour * 60 * 60 + days * 24 * 60 * 60;
        }

        function delayToStart(delay, total_secs) {
            var $cont = $(this), opt = $cont.data("cmtimerUtil");
            var timer_delay = setTimeout(function () {
                beginTimer.call($cont, total_secs);
            }, delay);
        }

        /**
         * 计时器打开
         * @param total_secs
         */
        function beginTimer(total_secs) {
            console.log("总计时开始(seconds)：" + total_secs);
            var $cont = $(this), opt = $cont.data("cmtimerUtil"), _timer = $cont.data("cmtimerutil_timer");
            if (_timer) {
                clearInterval(_timer);
            }
            _timer = setInterval(function () {
                total_secs--;
                if (total_secs < 0) {
                    clearInterval(_timer);

                    if (opt.onEnd && $.isFunction(opt.onEnd)) {
                        opt.onEnd.call($cont);
                    }
                } else {
                    if (opt.onTimeFlies && $.isFunction(opt.onTimeFlies)) {
                        //回调函数当中有个参数，是当前剩余的时间
                        opt.onTimeFlies.call($cont, formatTime(total_secs));
                    }

                }
            }, opt.passby);
            $cont.data("cmtimerutil_timer", _timer);
        }

        /**
         * 将时间转为小时分和秒
         * @param c
         * @returns {{}}
         */
        function formatTime(c) {
            var obj = {};
            obj.days = parseInt(c / (3600 * 24));
            obj.hours = parseInt((c % (3600 * 24)) / 3600);
            // 小时数
            obj.mins = parseInt(c / 60);
            // 分钟数
            if (obj.mins >= 60) {
                obj.mins = obj.mins % 60;
            }
            obj.sencs = c % 60;
            console.debug(JSON.stringify(obj));
            return obj;
        }

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods["init"].apply(this, arguments);
        } else {
            $.error("Method:" + method + "doesn't exisit!");
            return this;
        }

    };
    /**
     * 影院座位初始化util
     * @param method
     * @returns {*}
     */
    $.fn.initCinema = function (method) {
        var setting = {
            store: null,
            price: 20.512,
            maxSelected: 5,
            seatEl: "span",
            seat: "seat",
            seatContainer: null,
            canSelected: "active",
            disable: "disabled",
            selected: "selected",
            lover: "love",
            //选择座位之后
            afterSelectSeat: null,
            afterDeselectSeat: null,
            afterPanelInited: null,
            reachMaxCount: null,
            afterClickDisableItem: null
        };

        var methods = {
            getSelectedCount: function () {
                var $cont = $(this), opt = $cont.data("initCinema");
                if (typeof opt === 'undefined') {
                    return parseInt(0);
                } else {
                    var hasSel = parseInt($cont.data("hasSelCount"));
                    return hasSel;
                }
            },
            getTotalPay: function (tofixed) {
                var $cont = $(this), opt = $cont.data("initCinema");
                if (typeof opt === 'undefined') {
                    return parseFloat(0);
                } else {
                    var hasSel = parseInt($cont.data("hasSelCount"));
                    var totalP = hasSel * opt.price;
                    return Number(tofixed) ? parseFloat(totalP).toFixed(tofixed) : parseFloat(totalP);
                }
            },
            getRemainedSeatsCount: function () {
                var $cont = $(this), opt = $cont.data("initCinema");
                if (typeof opt === 'undefined') {
                    return 0;
                } else {
                    var rn = $cont.data("totalCanSelCount");
                    return parseInt(rn, 10);
                }
            },
            init: function (option) {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("initCinema");
                    if (typeof opt === 'undefined') {
                        opt = $.extend(true, {}, setting, option);
                    } else {
                        $.extend(true, opt, option);
                    }
                    $cont.data("initCinema", opt);
                    var data = opt.store, hasSelCount = 0, totalCanSelCount = 0;
                    $cont.data("hasSelCount", hasSelCount);
                    $cont.data("totalCanSelCount", totalCanSelCount);
                    if (data && typeof data == 'object') {
                        _init(opt.store);
                    } else if (typeof data == 'string') {
                        $.ajax({
                            type: "post",
                            url: data,
                            dataType: "json"
                        }).done(function (jsondata) {
                            _init(jsondata);
                        });
                    }
                    function _init(jsondata) {
                        $cont.empty();
                        var cols = jsondata.cols, rows = jsondata.rows, seats = jsondata.seats;
                        var panelCon = "";
                        for (var r = 1; r <= rows; r++) {
                            var seatData = getSeatData(r, seats);
                            panelCon += createSeats(seatData);
                        }
                        $cont.append(panelCon);

                        $cont.data("totalCanSelCount", totalCanSelCount);
                        if (opt.afterPanelInited && $.isFunction(opt.afterPanelInited)) {
                            opt.afterPanelInited.call($cont);
                        }

                    }

                    function getSeatData(rowNum, seats) {
                        var seatArr = $.grep(seats, function (v, i) {
                            return v.rowNum === rowNum;
                        });
                        if (seatArr.length <= 0) {
                            return null;
                        }
                        return seatArr[0];
                    }

                    function createSeats(seatData) {
                        var rowId = seatData.rowId;
                        var chtml = "<p>";
                        chtml += '<span class="num">' + rowId + '</span>';
                        var columns = seatData.columns, len = columns.length;
                        for (var i = 0; i < len; i++) {
                            var v = columns[i];
                            var columnId = v.columnId, seatNo = v.seatNo, seatType = v.st;
                            var titleInfo = rowId + "排" + columnId + "座";
                            switch (seatType) {
                                case 'E':
                                    chtml += '<span class="seat"></span>';
                                    break;
                                case 'N':
                                    totalCanSelCount++;
                                    chtml += '<' + opt.seatEl + ' title="' + titleInfo + '" class="' + opt.seat + ' ' + opt.canSelected + '" hidefocus="true" data-no="' + seatNo + '" href="javascript:;" data-row=' + rowId + ' data-column=' + columnId + ' data-type="N"></' + opt.seatEl + '>';
                                    break;
                                case 'LK':
                                    chtml += '<' + opt.seatEl + ' title="' + titleInfo + '" class="' + opt.seat + ' ' + opt.disable + '" hidefocus="true"    data-no="' + seatNo + '" href="javascript:;"  data-row=' + rowId + ' data-column=' + columnId + ' data-type="LK"></' + opt.seatEl + '>';
                                    break;
                                case 'LO':
                                    totalCanSelCount++;
                                    chtml += '<' + opt.seatEl + ' title="' + titleInfo + '" class="' + opt.seat + ' ' + opt.canSelected + ' ' + opt.lover + '" hidefocus="true" data-no="' + seatNo + '" href="javascript:;" data-row=' + rowId + ' data-column=' + columnId + ' data-type="LO"></' + opt.seatEl + '>';
                                    break;
                                default:
                                    break;

                            }
                        }
                        chtml += "</p>";
                        return chtml;
                    }


                    _registEvent();
                    function _registEvent() {
                        $cont.on("click.initCinema", opt.seatEl + "." + opt.seat, function (ev) {
                            var stype = $(this).data("type"), selectedItems = [];
                            selectedItems.push($(this));
                            switch (stype) {
                                case 'N':
                                    if ($(this).hasClass(opt.selected)) {
                                        hasSelCount--;
                                        $cont.data("totalCanSelCount", totalCanSelCount - hasSelCount);
                                        $cont.data("hasSelCount", hasSelCount);
                                        $(this).removeClass(opt.selected);

                                        if (opt.afterDeselectSeat && $.isFunction(opt.afterDeselectSeat)) {
                                            opt.afterDeselectSeat.call(selectedItems);
                                        }
                                    } else {
                                        hasSelCount++;
                                        if (hasSelCount > opt.maxSelected) {
                                            if (opt.reachMaxCount && $.isFunction(opt.reachMaxCount)) {
                                                opt.reachMaxCount.call($(this));
                                            }
                                            hasSelCount--;
                                            return false;
                                        }
                                        $cont.data("totalCanSelCount", totalCanSelCount - hasSelCount);
                                        $cont.data("hasSelCount", hasSelCount);
                                        $(this).addClass(opt.selected);

                                        if (opt.afterSelectSeat && $.isFunction(opt.afterSelectSeat)) {
                                            opt.afterSelectSeat.call(selectedItems);
                                        }
                                    }
                                    break;
                                case 'LO':
                                    var halfLoverEl = $(this).next("[data-type='LO']").length > 0 ? $(this).next("[data-type='LO']") : $(this).prev("[data-type='LO']");
                                    selectedItems.push(halfLoverEl);
                                    if ($(this).hasClass(opt.selected)) {
                                        hasSelCount -= 2;
                                        $cont.data("totalCanSelCount", totalCanSelCount - hasSelCount);
                                        $cont.data("hasSelCount", hasSelCount);
                                        $(this).removeClass(opt.selected).addClass(opt.lover);
                                        halfLoverEl.removeClass(opt.selected).addClass(opt.lover);

                                        if (opt.afterDeselectSeat && $.isFunction(opt.afterDeselectSeat)) {
                                            opt.afterDeselectSeat.call(selectedItems);
                                        }
                                    } else {
                                        hasSelCount += 2;
                                        if (hasSelCount > opt.maxSelected) {
                                            if (opt.reachMaxCount && $.isFunction(opt.reachMaxCount)) {
                                                opt.reachMaxCount.call($(this));
                                            }
                                            hasSelCount -= 2;
                                            return false;
                                        }
                                        $cont.data("totalCanSelCount", totalCanSelCount - hasSelCount);
                                        $cont.data("hasSelCount", hasSelCount);

                                        $(this).removeClass(opt.lover).addClass(opt.selected);
                                        halfLoverEl.removeClass(opt.lover).addClass(opt.selected);

                                        if (opt.afterSelectSeat && $.isFunction(opt.afterSelectSeat)) {
                                            opt.afterSelectSeat.call(selectedItems);
                                        }
                                    }

                                    break;
                                case 'LK':
                                    if (opt.afterClickDisableItem && $.isFunction(opt.afterClickDisableItem)) {
                                        opt.afterClickDisableItem.call($(this));
                                    }

                                    break;
                                default:
                                    break;
                            }

                        });
                    }

                });
            },

            clear: function (option) {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("initCinema");
                    if (typeof opt !== 'undefined') {
                        //清除手选的，还原初始状态

                    }
                });
            }
        };
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods["init"].apply(this, arguments);
        } else {
            $.error("Method:" + method + "doesn't exisit!");
            return this;
        }

    };
    /**
     * longlunbo插件注意:
     * 1.可视个数*tagName的长度决定外层box的长度
     * 2.stop(true,true)没有生效因为当前使用了动画玩才能单击的机制,不推荐使用stop(true,true)来停止动画继续单击的机制。
     * 3.左右按钮在盒子dom外面
     */
    $.fn.longlunbo = function (method) {
        var setting = {
            box: null,//for:when mouse over,stop interval
            scrollbox: null,//hide scroll elements ul
            tagName: '',
            auto: true,
            // 可自动轮播
            duration: 500,
            timeInterval: 3000,
            direction: 'left',
            // 滚动方向
            visual: 4,
            // 可视数
            prev: '',
            next: '',
            alwaysShowButton: false,
            amount: 1,
            // 滚动数 默认是1
            loop: true,
            // 可开启新的循环
            onLeftEnd: null,
            onRightEnd: null,
            onItemsSelected: null,
            onItemsDeselected: null,
            onItemsClicked: null
        };
        var methods = {
            stop: function () {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("longlunbo"), _timer = null;
                    if (typeof opt !== 'undefined') {
                        _timer = $cont.data("_llb_timer");
                        clearInterval(_timer);
                    }
                });
            },
            restart: function (option) {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("longlunbo"), _timer = null;
                    if (typeof opt === 'undefined') {
                        opt = $.extend({}, setting, option);
                    } else {
                        $.extend(opt, option);
                        _timer = $cont.data("_llb_timer");
                        clearInterval(_timer);
                        methods["init"].apply($cont, opt);
                    }
                });
            },
            init: function (option) {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("longlunbo"), _timer = null;
                    if (typeof opt === 'undefined') {
                        opt = $.extend({}, setting, option);
                    } else {
                        $.extend(opt, option);
                        _timer = $cont.data("_llb_timer");
                        clearInterval(_timer);
                    }
                    $cont.data("longlunbo", opt);

                    var _H = false, _V = false, _L = false, _R = false, _T = false, _B = false;

                    function getLRTBHV_value(direc) {
                        switch (direc) {
                            case 'left':
                                _L = true, _H = true, _R = false;
                                break;
                            case 'right':
                                _R = true, _H = true, _L = false;
                                break;
                            case 'top':
                                _T = true, _V = true, _B = false;
                                break;
                            case 'bottom':
                                _B = true, _V = true, _T = false;
                                break;
                            default:
                                break;
                        }

                    }

                    getLRTBHV_value(opt.direction);

                    var lrBtns = null;
                    // 每个target的outerWidth+margin的距离
                    var elW = $(opt.tagName).outerWidth(true), elH = $(opt.tagName).outerHeight(true);
                    var elNums = $(opt.tagName).length;
                    var totalImgWidth = elW * elNums, viewW = elW * opt.visual, lbtnWidth = 0, rbtnWidth = 0;
                    var totalImgHeight = elH * elNums, viewH = elH * opt.visual, lbtnHeight = 0, rbtnHeight = 0;

                    if (opt.prev && opt.next) {
                        lrBtns = $(opt.prev + "," + opt.next);
                        lbtnWidth = $(opt.prev).outerWidth(true);
                        rbtnWidth = $(opt.next).outerWidth(true);
                        lbtnHeight = $(opt.prev).outerHeight(true);
                        rbtnHeight = $(opt.next).outerHeight(true);
                    }

                    if (!opt.box && !$.trim(opt.box)) {
                        // 如果没有加dom上原有的box，则创建一个，并将this包裹起来
                        opt.box = "._cmlonglbbox";
                        var box_div = "<div class='_cmlonglbbox' style=''></div>";

                        $cont.wrap($(box_div));

                        if (lrBtns) {
                            lrBtns.insertAfter(opt.box);
                        }
                    }
                    if (elNums <= opt.visual) {
                        //如果可视数大于总数，目前的解决方法是复制当前一组加到当前的前面
                        $(opt.tagName).clone(true).prependTo($cont);
                        elNums = $(opt.tagName).length;
                        totalImgWidth = elW * elNums;
                        totalImgHeight = elH * elNums;
                    }
                    var $box = $(opt.box), _posofbox = $box.css("position"), $srcElBox = $(opt.scrollbox ? opt.scrollbox : opt.box);
                    //盒子必须定位
                    if (_H) {
                        $box.width(viewW).css({
                            position: (_posofbox == ("" || "static")) ? 'relative' : _posofbox
                        });
                        $srcElBox.css({"overflow": 'hidden'});
                        // 算出图片container的长度
                        $cont.width(totalImgWidth).css({
                            position: 'relative'
                        });

                        //console.debug("box.width:" + viewW + ";$cont.width:" + totalImgWidth);
                    } else if (_V) {
                        $box.height(viewH).css({
                            position: (_posofbox == ("" || "static")) ? 'relative' : _posofbox
                        });
                        $srcElBox.css({"overflow": 'hidden'});
                        // 算出图片container的长度
                        $cont.height(totalImgHeight).css({
                            position: 'relative'
                        });

                        //console.debug("box.height:" + viewH + ";$cont.height:" + totalImgHeight);

                    }

                    // 是子元素的话，强制隐藏左右按钮
                    if (lrBtns && !opt.alwaysShowButton) {
                        lrBtns.hide();
                    }

                    $(window.document).on("mouseenter", opt.box + "," + opt.prev + "," + opt.next, function () {
                        if (lrBtns && !opt.alwaysShowButton) {
                            lrBtns.show();
                        }
                        if (_timer) {
                            clearInterval(_timer);
                        }

                    });
                    $(window.document).on("mouseleave", opt.box + "," + opt.prev + "," + opt.next, function () {
                        if (lrBtns && !opt.alwaysShowButton) {
                            lrBtns.hide();
                        }
                        if (opt.auto) {
                            scroll(opt.direction);
                        }

                    });
                    $(window.document).on("click.items", opt.tagName, function () {
                        var _items = $(this);
                        if (opt.onItemsClicked && $.isFunction(opt.onItemsClicked)) {
                            opt.onItemsClicked.call(_items);
                        }
                    });

                    $(window.document).on("mouseenter.items", opt.tagName, function () {
                        var _items = $(this);
                        if (opt.onItemsSelected && $.isFunction(opt.onItemsSelected)) {
                            opt.onItemsSelected.call(_items);
                        }
                    });
                    $(window.document).on("mouseleave.items", opt.tagName, function () {
                        var _items = $(this);
                        if (opt.onItemsDeselected && $.isFunction(opt.onItemsDeselected)) {
                            opt.onItemsDeselected.call(_items);
                        }
                    });

                    if (_H) {
                        var lscrolledNums = 0, rscrolledNums = 0;

                        if (opt.direction === "left") {
                            // 往左移动，强制容器相对box的left=0,使用relative定位的时候可以不设置
                            $cont.css({
                                "left": 0
                            });
                            lscrolledNums = 0;
                            rscrolledNums = elNums - opt.visual;
                        } else if (opt.direction === "right") {
                            $cont.css({
                                "left": viewW - totalImgWidth
                            });
                            rscrolledNums = 0;
                            lscrolledNums = elNums - opt.visual;
                        }

                    } else if (_V) {
                        var lscrolledNums = 0, rscrolledNums = 0;

                        if (opt.direction === "top") {
                            // 往左移动，强制容器相对box的left=0,使用relative定位的时候可以不设置
                            $cont.css({
                                "top": 0
                            });
                            lscrolledNums = 0;
                            rscrolledNums = elNums - opt.visual;
                        } else if (opt.direction === "bottom") {
                            $cont.css({
                                "top": viewH - totalImgHeight
                            });
                            rscrolledNums = 0;
                            lscrolledNums = elNums - opt.visual;
                        }

                    }
                    $cont.data("lcanclickNextTime", true);
                    $cont.data("rcanclickNextTime", true);

                    if (lrBtns) {
                        var lbtn = $(opt.prev), rbtn = $(opt.next), tags = $(opt.tagName);
                        lbtn.on("click", function () {
                            if ($cont.data("lcanclickNextTime")) {
                                $cont.data("lcanclickNextTime", false);
                                if (_H) {
                                    getLRTBHV_value("left");
                                    _scrollHandler(false, "left");

                                } else if (_V) {
                                    getLRTBHV_value("top");
                                    _scrollHandler(false, "top");

                                }
                                getLRTBHV_value(opt.direction);

                            }

                        });
                        rbtn.on("click", function () {
                            if ($cont.data("rcanclickNextTime")) {
                                $cont.data("rcanclickNextTime", false);
                                if (_H) {
                                    getLRTBHV_value("right");
                                    _scrollHandler(false, "right");

                                } else if (_V) {
                                    getLRTBHV_value("bottom");
                                    _scrollHandler(false, "bottom");

                                }
                                getLRTBHV_value(opt.direction);
                            }

                        });
                    }

                    if (opt.auto) {
                        scroll(opt.direction);
                    }

                    /**
                     *处理滚动方法
                     */
                    function _scrollHandler(autoPlay, direc) {
                        if (calculateIsEnd(direc)) {
                            handleScrollEndFunc(autoPlay, direc);

                        } else {
                            var each_scroll_num = opt.amount;

                            switch (direc) {
                                case 'left':
                                case 'top':
                                    if (rscrolledNums - opt.amount < 0) {
                                        each_scroll_num = rscrolledNums;
                                    }
                                    if (rscrolledNums > 0) {
                                        //console.debug("elW:" + elW + "each_scroll_num：" + each_scroll_num + "；($cont.position().left" + $cont.position().left + ";左移了:" + ($cont.position().left -= elW * each_scroll_num));
                                        var _tmp = {};
                                        if (_H && _L) {
                                            _tmp = {
                                                left: $cont.position().left -= elW * each_scroll_num
                                            };
                                        }
                                        if (_V && _T) {
                                            _tmp = {
                                                top: $cont.position().top -= elH * each_scroll_num
                                            };
                                        }

                                        $cont.stop(true, true).animate(_tmp, opt.duration, function () {
                                            // 移动了几次
                                            lscrolledNums += opt.amount;
                                            rscrolledNums = elNums - opt.visual - lscrolledNums;
                                            // 说明倒第二次的剩余的小于opt.visual
                                            //console.debug("left:lscrolledNums:" + lscrolledNums + ";rscrolledNums:" + rscrolledNums);
                                            $cont.data("lcanclickNextTime", true);

                                            if (calculateIsEnd(direc)) {
                                                if (opt.onLeftEnd && $.isFunction(opt.onLeftEnd)) {
                                                    opt.onLeftEnd.call($cont);
                                                }
                                            }

                                            if (lscrolledNums > 0) {
                                                $cont.data("rcanclickNextTime", true);
                                            }

                                        });
                                    }
                                    break;
                                case 'right':
                                case 'bottom':
                                    if (lscrolledNums - opt.amount < 0) {
                                        each_scroll_num = lscrolledNums;
                                    }
                                    if (lscrolledNums > 0) {
                                        //console.debug("elW:" + elW + "将要移动个数：" + each_scroll_num + "准备移:" + ($cont.position().left += elW * each_scroll_num));
                                        var _tmp = {};
                                        if (_H && _R) {
                                            _tmp = {
                                                left: $cont.position().left += elW * each_scroll_num
                                            };
                                        }
                                        if (_V && _B) {
                                            _tmp = {
                                                top: $cont.position().top += elH * each_scroll_num
                                            };
                                        }

                                        $cont.stop().animate(_tmp, opt.duration, function () {
                                            // 移动了几次
                                            rscrolledNums += opt.amount;
                                            lscrolledNums = elNums - opt.visual - rscrolledNums;

                                            //console.debug("right:rscrolledNums:" + rscrolledNums + ";lscrolledNums:" + lscrolledNums);
                                            $cont.data("rcanclickNextTime", true);
                                            if (calculateIsEnd(direc)) {
                                                if (opt.onRightEnd && $.isFunction(opt.onRightEnd)) {
                                                    opt.onRightEnd.call($cont);
                                                }
                                            }

                                            if (rscrolledNums > 0) {
                                                $cont.data("lcanclickNextTime", true);
                                            }

                                        });
                                    }
                                    break;
                                default:
                                    break;
                            }

                        }

                    }

                    // 判断是否已轮播到最后一个
                    function calculateIsEnd(direc) {

                        switch (direc) {
                            case 'left':
                            case 'top':
                                if (rscrolledNums <= 0) {
                                    if (rscrolledNums < 0) {
                                        rscrolledNums = 0;
                                        lscrolledNums = elNums - opt.visual - rscrolledNums;

                                    }
                                    if (!opt.loop) {
                                        $cont.data("rcanclickNextTime", true);
                                    }
                                    return true;
                                }
                                return false;
                            case 'right':
                            case 'bottom':
                                if (lscrolledNums <= 0) {
                                    if (lscrolledNums < 0) {
                                        lscrolledNums = 0;
                                        rscrolledNums = elNums - opt.visual - lscrolledNums;

                                    }
                                    if (!opt.loop) {
                                        $cont.data("lcanclickNextTime", true);
                                    }
                                    return true;
                                }
                                return false;
                            default:
                                break;
                        }

                    }

                    function scroll(direc) {
                        var isauto = arguments[1] ? arguments[1] : opt.auto;
                        if (_timer)
                            clearInterval(_timer);
                        switch (direc) {
                            case 'left':
                            case'top':
                                _timer = setInterval(function () {
                                    _scrollHandler(isauto, direc);
                                }, opt.timeInterval + opt.duration);
                                break;
                            case 'right':
                            case'bottom':
                                _timer = setInterval(function () {
                                    _scrollHandler(isauto, direc);
                                }, opt.timeInterval + opt.duration);
                                break;
                            default:
                                break;
                        }
                        $cont.data("_llb_timer", _timer);

                    }

                    // 滚到头之后的处理函数
                    function handleScrollEndFunc(autoPlay, direc) {
                        clearInterval(_timer);
                        // 可循环轮播
                        if (opt.loop) {
                            reset(direc);
                            if (autoPlay) {
                                scroll(direc);
                            }
                        } else {
                            if (autoPlay) {
                                if (_H) {
                                    direc = (direc === "left" ? "right" : "left");
                                } else {
                                    direc = (direc === "top" ? "bottom" : "top");
                                }

                                scroll(direc);
                            }

                        }
                    }

                    function reset(direc) {
                        if (direc === "left" || direc === 'top') {
                            var _tmp = {};
                            if (_H && _L) {
                                _tmp = {
                                    "left": 0
                                };
                            }
                            if (_V && _T) {
                                _tmp = {
                                    "top": 0
                                };
                            }
                            $cont.animate(_tmp, opt.duration, function () {
                                lscrolledNums = 0;
                                rscrolledNums = elNums - opt.visual - lscrolledNums;

                                $cont.data("lcanclickNextTime", true);
                                $cont.data("rcanclickNextTime", true);
                                // 新的循环，回调的话在这里
                            });
                        } else if (direc === "right" || direc === "bottom") {
                            var _tmp = {};
                            if (_H && _R) {
                                _tmp = {
                                    "left": viewW - totalImgWidth
                                };
                            }
                            if (_V && _B) {
                                _tmp = {
                                    "top": viewH - totalImgHeight
                                };
                            }

                            $cont.animate(_tmp, opt.duration, function () {
                                rscrolledNums = 0;
                                lscrolledNums = elNums - opt.visual - rscrolledNums;
                                $cont.data("lcanclickNextTime", true);
                                $cont.data("rcanclickNextTime", true);
                                // 新的循环，回调的话在这里
                            });

                        }

                    }

                });
            }
        };
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods["init"].apply(this, arguments);
        } else {
            $.error("Method:" + method + "doesn't exisit!");
            return this;
        }
    };
    /**
     * tab标签页 [tabs],[contents]
     */
    $.fn.cmtabPanel = function (method) {
        var setting = {
            initShow: 1,
            triggerEvent: "click",
            tabSelectedClass: null,
            contentSelectedClass: null,
            tabs: [],
            contents: [],
            afterTabed: null
        };
        var methods = {
            init: function (option) {
                var $cont = $(this), opt = $cont.data("cmtabPanel");
                if (typeof opt === 'undefined') {
                    opt = $.extend({}, setting, option);
                } else {
                    $.extend(opt, option);
                }
                $cont.data("cmtabPanel", opt);
                var tbegin = opt.initShow - 1;

                var $tabs = $(opt.tabs), $contents = $(opt.contents), clen = $contents.length;
                if (clen > 1) {
                    //大于1个就隐藏重新initShow,小于等于1个就不操作了
                    $contents.hide();
                }
                if ($tabs.length > 0) {
                    initShow(tbegin);

                    $(document).on(opt.triggerEvent, opt.tabs, function () {
                        var idx = $tabs.index($(this));
                        initShow(idx);
                    });

                }
                function initShow(idx) {
                    $(opt.tabs).filter("." + opt.tabSelectedClass).removeClass(opt.tabSelectedClass);
                    $(opt.tabs).eq(idx).addClass(opt.tabSelectedClass);
                    if (opt.contentSelectedClass) {
                        if (typeof opt.contentSelectedClass === 'string') {
                            var _will_hide_c = $cont.find("." + opt.contentSelectedClass);
                            if (_will_hide_c.length) {
                                _will_hide_c.removeClass(opt.contentSelectedClass);
                            }
                            $contents.eq(idx).addClass(opt.contentSelectedClass);
                        }

                    } else {
                        if ($contents.length > 0) {
                            //如果索引大于个数，则显示最后一个
                            if (idx >= clen) {
                                idx = clen;
                            }
                            $contents.eq(idx).show();
                            $contents.eq(idx).siblings(opt.contents).hide();
                        } else {
                            //do nothing.
                        }

                    }
                    //标签切换之后执行的回调
                    if (opt.afterTabed && $.isFunction(opt.afterTabed)) {
                        opt.afterTabed.call($tabs.eq(idx));
                    }

                }

            }
        };
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods["init"].apply(this, arguments);
        } else {
            $.error("Method:" + method + "doesn't exisit!");
            return this;
        }
    };
    /**
     * <li>遍历li轮换显示</li>
     */
    $.fn.hoverShowSiblingsHide = function (method) {
        var setting = {
            initShow: 1,
            showEl: "li",
            elTitle: '.fig_tt',
            elContent: ".fig_wd",
            showElSelectClass: null,
            // 正常的是，当前显示，其余兄弟元素全部隐藏
            onInit: null,
            // 当前上下文是li
            afterShow: null,
            afterHide: null
        };
        var methods = {
            init: function (option) {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("hoverShowSiblingsHide");
                    if (typeof opt === 'undefined') {
                        opt = $.extend({}, setting, option);
                    } else {
                        $.extend(opt, option);
                    }
                    $cont.data("hoverShowSiblingsHide", opt);
                    var $showEls = $cont.find(opt.showEl), _initEl = $showEls.eq(opt.initShow - 1);
                    if (!opt.showElSelectClass && $.trim(opt.showElSelectClass) === "") {
                        _initEl.show().siblings(opt.showEl).hide();
                    } else {
                        if ($.isPlainObject(opt.showElSelectClass)) {
                            _initEl.css(opt.showElSelectClass).siblings(opt.showEl).hide();
                        } else {
                            _initEl.addClass(opt.showElSelectClass).siblings(opt.showEl).removeClass(opt.showElSelectClass);
                        }
                    }

                    $(opt.showEl + ":not(:nth-child(" + opt.initShow + "))", $cont).show().find(opt.elTitle).show().end().find(opt.elContent).hide();
                    _initEl.data('selected');
                    // 初始化完成之后需要做的
                    if (opt.onInit && $.isFunction(opt.onInit)) {
                        opt.onInit.call(_initEl);
                    }
                    // 防止新加元素没有注册
                    $cont.on("mouseenter.hb", opt.showEl, hoverHandle);
                    function hoverHandle(ev) {
                        var culi = $(this);
                        culi.find(opt.elContent).show();
                        if (opt.afterShow && $.isFunction(opt.afterShow)) {
                            opt.afterShow.call(culi);
                        }
                        var hideel = culi.siblings().find(opt.elContent + ":visible").hide();
                        if (opt.afterHide && $.isFunction(opt.afterHide)) {
                            opt.afterHide.call(hideel.closest(opt.showEl));
                        }
                    }

                });
            }
        };
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods["init"].apply(this, arguments);
        } else {
            $.error("Method:" + method + "doesn't exisit!");
            return this;
        }
    };
    /**
     * 确认投资用到的二选一 $.onlyOneChoose(target);
     * $.onlyOneChoose(target,[s1,s2,s3,...]);
     *
     * @param {Object} target
     * @param {Object} removes
     */
    $.onlyOneChoose = function (target, removes) {
        var le = arguments.length, $target = $(target);
        if (le) {
            if ($target.has(":checked")) {
                if (le === 1 || !removes) {
                    $(":checkbox,:radio").not(target).prop("checked", false);
                } else if (removes) {
                    $.each(removes, function (i, v) {
                        $(v).prop("checked", false);
                    });
                }

            }
        }

    };
    /**
     * 确认投资用到的二选一
     *
     * @param {Object} target
     * @param {Object} type
     */
    $.onlyOneChoose.getValue = function (target, type) {
        var val = [], str = "", tot = 0;
        $(target).each(function (i, v) {
            if ($(v).prop("checked")) {
                var _v = $(this).val();
                switch (type) {
                    case 'number':
                        // must be a number
                        if ($.isNumeric(_v)) {
                            tot += parseFloat(_v);
                        }
                        ;
                        break;
                    case 'string':
                        ;
                    default:
                        val.push(_v);
                }
            }
        });
        if (type === "number")
            return tot;

        return val;
    };

})(jQuery);

;
(function ($) {

    $.fn.lunbo = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods["init"].apply(this, arguments);
        } else {
            $.error("Method:" + method + "doesn't exisit!");
            return this;
        }

    };
    $.fn.lunbo.defaults = {
        //从第几个开始
        begin: 1,
        //轮播速度
        speed: 1000,
        //当前选中样式class
        selectedClass: "",
        //切换按钮
        btns: "",
        //轮播图片div
        pics: "",
        //随图播放的文本
        txts: "",
        //显示隋图播放的文本的css或者className
        txtShow: "",
        txtHide: "",
        //左按钮
        lbtn: "",
        //右按钮
        rbtn: "",
        //轮转动画
        effect: "fadeIn",
        imgSelectedClass: "_tmp_selected",
        afterEachShow: null
    };
    var methods = {
        init: function (option) {

            return this.each(function () {
                //避免重複註冊事件
                var $cont = $(this), opt = $cont.data("opt");
                if (typeof opt === 'undefined') {
                    opt = $.extend({}, $.fn.lunbo.defaults, option);
                } else {
                    $.extend(opt, option);
                    var t = $cont.data("_timer");
                    clearInterval(t);
                }
                _regist($cont, opt);
            });
        },
        /**
         *
         * @param {Object} num leftGo num page.
         * @param {Object} stop 是否停止轮播
         */
        leftGo: function (num, stopFlag) {
            stopFlag = arguments[1];
            var $this = this;
            return this.each(function () {
                var $that = $(this);

                var opt = $that.data("opt"), t = $that.data("_timer");
                if (opt) {
                    var now = _getNow(opt), total = _getTotal(opt);
                    _leftGo(now, total, opt, num);
                    clearInterval(t);
                    if (!stopFlag) {
                        opt.begin = _getNow(opt);
                        methods['init'].apply($this, opt);
                    }
                }
            });

        },
        rightGo: function (num, stopFlag) {
            stopFlag = arguments[1];
            var $this = this;
            return this.each(function () {
                var $that = $(this);

                var opt = $that.data("opt"), t = $that.data("_timer");
                if (opt) {
                    var now = _getNow(opt), total = _getTotal(opt);
                    _rightGo(now, total, opt, num);
                    clearInterval(t);
                    if (!stopFlag) {
                        opt.begin = _getNow(opt);
                        methods['init'].apply($this, opt);
                    }
                }

            });

        },
        stop: function () {
            return this.each(function () {
                var $that = $(this);
                var opt = $that.data("opt"), t = $that.data("_timer");
                if (opt) {
                    clearInterval(t);
                }
            });
        },
        restart: function () {
            var $this = this;
            return this.each(function () {
                var $that = $(this);
                var opt = $that.data("opt");
                if (opt) {
                    var a = _getNow(opt), len = _getTotal(opt);
                    // opt.begin = _getNow(opt);
                    // methods['init'].apply($this, opt);
                    runLunbo(a, len, opt, $that);
                }
            });
        },
        destroy: function () {
            //TODO
        }
    };

    function _getTotal(opt) {
        var $pics = $(opt.pics);
        var els = $pics.get(), len = els.length;
        //console.debug("_getTotal:" + len);
        return len;
    }

    function _getNow(opt) {
        var returnNum, _$pics = $(opt.pics), _tmp = _$pics.filter("." + opt.imgSelectedClass);
        returnNum = _$pics.index(_tmp);

        // console.debug("_getNow:" + returnNum);
        return returnNum;

    }

    function _leftGo(s, t, opt, num) {
        var n = num ? num : 1;
        s = s - n;
        if (s < 0) {
            s = t - 1;
        }
        //console.debug("_leftGo当前:" + s);
        initShow(s, opt);
    }

    function _rightGo(s, t, opt, num) {
        var n = num ? num : 1;
        s = s + n;
        if (s >= t) {
            s = 0;
        }
        //console.debug("_rightGo:" + s);
        initShow(s, opt);
    }

    function _regist(c, opt) {
        var $cont = c;
        $cont.data("opt", opt);
        var $btns = $(opt.btns);
        var pics = $(opt.pics), len = pics.length;
        var els = $btns.get();
        var tBegin = opt.begin - 1;
        //防止有人没加定位absolute
        pics.css({
            position: "absolute"
        });
        $(opt.pics).eq(tBegin).addClass(opt.imgSelectedClass);
        initShow(tBegin, opt);
        runLunbo(tBegin, len, opt, $cont);
        var rb = opt.rbtn, lb = opt.lbtn;
        if (rb && lb) {
            var haslfbtn = true;
            $(rb + "," + lb).hide();
        }
        if (opt.btns) {
            $cont.on("click.lunbo", opt.btns, function (ev) {
                var index = $btns.index($(this));

                initShow(index, opt);
            });
        }

        $cont.on("mouseenter.lunbo", function (ev) {
            if (haslfbtn) {
                $(rb).show();
                $(lb).show();
            }
            var t = $(this).data("_timer");
            pics.stop(true, true);
            clearInterval(t);
        });
        $cont.on("mouseleave.lunbo", function (ev) {
            if (haslfbtn) {
                $(rb).hide();
                $(lb).hide();
            }
            runLunbo(_getNow(opt), len, opt, $cont);
        });

        if (haslfbtn) {

            $cont.on("click.lunbo", lb, function (ev) {
                _leftGo(_getNow(opt), len, opt);

            });
            $cont.on("click.lunbo", rb, function (ev) {
                _rightGo(_getNow(opt), len, opt);
            });
        }
    }

    function runLunbo(a, len, opt, cont) {
        var _t = cont.data("_timer");
        if (_t) {
            clearInterval(_t);
        }
        _t = setInterval(function () {
            a++;
            if (a >= len) {
                a = 0;
            }
            initShow(a, opt);
        }, opt.speed);
        cont.data("_timer", _t);
    }

    function initShow(which, opt) {
        //console.debug("当前显示第" + which + "个");
        showPics(which, opt);
        showTxt(which, opt);
        showBtn(which, opt);
    }

    function showPics(which, opt) {
        $(opt.pics).filter("." + opt.imgSelectedClass).removeClass(opt.imgSelectedClass);

        $(opt.pics).eq(which).addClass(opt.imgSelectedClass).fadeIn(function () {
            if (opt.afterEachShow && $.isFunction(opt.afterEachShow)) {
                opt.afterEachShow.call($(opt.pics).eq(which));
            }

        }).siblings(":visible").fadeOut();
    }

    function showTxt(which, opt) {
        if ($.trim(opt.txtShow) === "") {
            $(opt.txts).eq(which).show().siblings(opt.txts + ":visible").hide();
        } else {
            if ($.isPlainObject(opt.txtShow) && $.isPlainObject(opt.txtHide)) {
                $(opt.txts).eq(which).css(opt.txtShow).siblings(opt.txts + ":visible").css(opt.txtHide);
            } else {
                $(opt.txts).eq(which).addClass(opt.txtShow).siblings(opt.txts).removeClass(opt.txtShow);
            }
        }

    }

    function showBtn(which, opt) {
        if ($(opt.btns).get().length > 0) {
            $(opt.btns).eq(which).addClass(opt.selectedClass).siblings(opt.btns).removeClass(opt.selectedClass);
        }

    }

})(jQuery);

