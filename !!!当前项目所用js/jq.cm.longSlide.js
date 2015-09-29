/**
 * longlunbo插件注意:
 * 1.可视个数*tagName的长度决定外层box的长度
 * 2.stop(true,true)没有生效因为当前使用了动画玩才能单击的机制,不推荐使用stop(true,true)来停止动画继续单击的机制。
 * 3.左右按钮在盒子dom外面
 */
;
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {

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
            mouseInEvent: "mouseover",
            mouseOutEvent: "mouseout",
            navBar: {selector: null, trigger: "click"},
            // 可开启新的循环
            onLeftEnd: null,
            onRightEnd: null,
            onItemsSelected: null,
            onItemsDeselected: null,
            onItemsClicked: null,
            afterEachShow: null//function(direct,which){ }
        };
        var methods = {
            destroy: function () {
                return this.each(function () {
                    var $cont = $(this), data = $cont.data('exchangeData'), opt = $cont.data("longlunbo");
                    //TODO情况插件配置和状态变量
                    $cont.removeData('exchangeData');
                    $cont.removeData('longlunbo');
                });
            },
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
                            //强制隐藏
                            lrBtns.css({"display": "none"});
                            return;
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
                        if (lrBtns && !opt.alwaysShowButton) {
                            hidelrBtns();
                        }

                        $(window.document).on(opt.mouseInEvent, opt.box + "," + opt.prev + "," + opt.next, function () {
                            if (lrBtns && !opt.alwaysShowButton) {
                                showlrBtns();
                            }
                            if (_timer) {
                                clearInterval(_timer);
                            }

                        });
                        $(window.document).on(opt.mouseOutEvent, opt.box + "," + opt.prev + "," + opt.next, function () {
                            if (lrBtns && !opt.alwaysShowButton) {
                                hidelrBtns();
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
                        function showlrBtns() {
                            lrBtns.show();
                        }

                        function hidelrBtns() {
                            lrBtns.hide();
                        }


                        //初始化数值
                        function initLandR_Nums(direc) {
                            var lscrolledNums = 0, rscrolledNums = 0;
                            if (_H) {
                                if (direc === "left") {
                                    // 往左移动，强制容器相对box的left=0,使用relative定位的时候可以不设置
                                    $cont.css({
                                        "left": 0
                                    });
                                    lscrolledNums = 0;
                                    rscrolledNums = elNums - opt.visual;
                                } else if (direc === "right") {
                                    $cont.css({
                                        "left": viewW - totalImgWidth
                                    });
                                    rscrolledNums = 0;
                                    lscrolledNums = elNums - opt.visual;
                                }

                            } else if (_V) {
                                if (direc === "top") {
                                    // 往左移动，强制容器相对box的left=0,使用relative定位的时候可以不设置
                                    $cont.css({
                                        "top": 0
                                    });
                                    lscrolledNums = 0;
                                    rscrolledNums = elNums - opt.visual;
                                } else if (direc === "bottom") {
                                    $cont.css({
                                        "top": viewH - totalImgHeight
                                    });
                                    rscrolledNums = 0;
                                    lscrolledNums = elNums - opt.visual;
                                }

                            }
                            storeStateVals(lscrolledNums, rscrolledNums);
                        }


                        function storeStateVals(ls, rs) {
                            var exchangeData = {};
                            exchangeData['lscrolledNums'] = ls;
                            exchangeData['rscrolledNums'] = rs;
                            $cont.data('exchangeData', exchangeData);
                        }

                        //TODO 数据已被清空???
                        function getStateVals(which) {
                            var exchangeData = $cont.data('exchangeData');
                            return exchangeData[which];
                        }

                        $(opt.navBar.selector).on(opt.navBar.trigger, function (ev) {
                            $cont.stop(true, true);
                            console.debug('导航前', $cont.data('exchangeData'));
                            var lscrolledNums = getStateVals("lscrolledNums"), rscrolledNums = getStateVals("rscrolledNums");
                            var idx = $(this).index(), oldPos = lscrolledNums;
                            var _tmp = null;
                            if (_H && _L) {
                                _tmp = {
                                    left: $cont.position().left -= elW * (idx - oldPos)
                                };
                            } else if (_V && _T) {
                                _tmp = {
                                    top: $cont.position().top -= elW * (idx - oldPos)
                                };
                            }

                            lscrolledNums = idx;
                            rscrolledNums = elNums - lscrolledNums - opt.visual;
                            console.debug("导航scrollToWhich后", lscrolledNums, rscrolledNums);
                            scrollToWhich(_tmp, opt.direction, lscrolledNums, rscrolledNums, true);
                        });

                        //初始化的时候也有数值。
                        initLandR_Nums(opt.direction);
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
                        //移动到那张图
                        function scrollToWhich(_tmp, direc, lscrolledNums, rscrolledNums, manual) {
                            console.debug('before scrollToWhich', lscrolledNums, rscrolledNums);
                            if (direc == 'left' || direc == 'top') {

                                $cont.stop(true, true).animate(_tmp, opt.duration, function () {
                                    if (!manual) {
                                        lscrolledNums = getStateVals("lscrolledNums");
                                        // 移动了几次
                                        lscrolledNums += opt.amount;
                                        rscrolledNums = elNums - opt.visual - lscrolledNums;
                                        console.debug('after scrollToWhich', lscrolledNums, rscrolledNums);
                                        storeStateVals(lscrolledNums, rscrolledNums);
                                    } else {
                                        console.debug('after scrollToWhich manual=true', lscrolledNums, rscrolledNums);
                                        storeStateVals(lscrolledNums, rscrolledNums);
                                    }


                                    runAfterEachShowCallBack(lscrolledNums, rscrolledNums);
                                    // 说明倒第二次的剩余的小于opt.visual
                                    //console.debug("left:lscrolledNums:" + lscrolledNums + ";rscrolledNums:" + rscrolledNums);
                                    $cont.data("lcanclickNextTime", true);

                                    if (calculateIsEnd(direc, lscrolledNums, rscrolledNums)) {
                                        if (opt.onLeftEnd && $.isFunction(opt.onLeftEnd)) {
                                            opt.onLeftEnd.call($cont);
                                        }
                                    }

                                    if (lscrolledNums > 0) {
                                        $cont.data("rcanclickNextTime", true);
                                    }

                                });
                            } else if (direc == 'right' || direc == 'bottom') {

                                $cont.stop().animate(_tmp, opt.duration, function () {
                                    // 移动了几次
                                    if (!manual) {
                                        rscrolledNums = getStateVals("rscrolledNums");
                                        rscrolledNums += opt.amount;
                                        lscrolledNums = elNums - opt.visual - rscrolledNums;
                                        console.debug('after scrollToWhich', lscrolledNums, rscrolledNums);
                                        storeStateVals(lscrolledNums, rscrolledNums);

                                    } else {
                                        console.debug('after scrollToWhich manual=true', lscrolledNums, rscrolledNums);
                                        storeStateVals(lscrolledNums, rscrolledNums);
                                    }

                                    runAfterEachShowCallBack(lscrolledNums, rscrolledNums);
                                    $cont.data("rcanclickNextTime", true);
                                    if (calculateIsEnd(direc, lscrolledNums, rscrolledNums)) {
                                        if (opt.onRightEnd && $.isFunction(opt.onRightEnd)) {
                                            opt.onRightEnd.call($cont);
                                        }
                                    }

                                    if (rscrolledNums > 0) {
                                        $cont.data("lcanclickNextTime", true);
                                    }

                                });
                            }
                        }

                        /**
                         *处理滚动方法
                         */
                        function _scrollHandler(autoPlay, direc) {
                            var lscrolledNums = getStateVals('lscrolledNums'), rscrolledNums = getStateVals('rscrolledNums');
                            console.debug('before _scrollHandler,', $cont.data('exchangeData'));
                            console.debug('计算是不是end', lscrolledNums, rscrolledNums, calculateIsEnd(direc, lscrolledNums, rscrolledNums));
                            if (calculateIsEnd(direc, lscrolledNums, rscrolledNums)) {
                                handleScrollEndFunc(autoPlay, direc);
                            } else {
                                var each_scroll_num = opt.amount;
                                switch (direc) {
                                    case 'left':
                                    case 'top':
                                        //console.debug('单击', lscrolledNums, rscrolledNums);
                                        if (rscrolledNums - opt.amount < 0) {
                                            each_scroll_num = rscrolledNums;
                                        }
                                        if (rscrolledNums > 0) {
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
                                            scrollToWhich(_tmp, direc, lscrolledNums, rscrolledNums);
                                        }
                                        break;
                                    case 'right':
                                    case 'bottom':
                                        //console.debug('单击', lscrolledNums, rscrolledNums);
                                        if (lscrolledNums - opt.amount < 0) {
                                            each_scroll_num = lscrolledNums;
                                        }
                                        if (lscrolledNums > 0) {
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
                                            scrollToWhich(_tmp, direc, lscrolledNums, rscrolledNums);
                                        }
                                        break;
                                    default:
                                        break;
                                }

                            }
                        }

                        // 判断是否已轮播到最后一个
                        function calculateIsEnd(direc, lscrolledNums, rscrolledNums) {
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
                            var lscrolledNums = getStateVals('lscrolledNums'), rscrolledNums = getStateVals('rscrolledNums');
                            var isauto = arguments[1] ? arguments[1] : opt.auto;
                            if (_timer)
                                clearInterval(_timer);
                            switch (direc) {
                                case 'left':
                                case'top':
                                    _timer = setInterval(function () {
                                        _scrollHandler(isauto, direc, lscrolledNums, rscrolledNums);
                                    }, opt.timeInterval + opt.duration);
                                    break;
                                case 'right':
                                case'bottom':
                                    _timer = setInterval(function () {
                                        _scrollHandler(isauto, direc, lscrolledNums, rscrolledNums);
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

                        function runAfterEachShowCallBack(lscrolledNums, rscrolledNums) {
                            if (opt.afterEachShow && $.isFunction(opt.afterEachShow)) {
                                opt.afterEachShow.call($cont, lscrolledNums, rscrolledNums);
                            }
                        }

                        //到头之后如何重置
                        function reset(direc) {
                            var lscrolledNums, rscrolledNums;
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
                                    runAfterEachShowCallBack(lscrolledNums, rscrolledNums);
                                    $cont.data("lcanclickNextTime", true);
                                    $cont.data("rcanclickNextTime", true);
                                    // 新的循环，回调的话在这里
                                    storeStateVals(lscrolledNums, rscrolledNums);
                                    console.debug('reset,', $cont.data('exchangeData'));
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

                                    runAfterEachShowCallBack(lscrolledNums, rscrolledNums);

                                    $cont.data("lcanclickNextTime", true);
                                    $cont.data("rcanclickNextTime", true);
                                    // 新的循环，回调的话在这里
                                    storeStateVals(lscrolledNums, rscrolledNums);
                                    console.debug('reset,', $cont.data('exchangeData'));
                                });

                            }

                        }

                        $cont.data("longlunbo", opt);
                    }
                    else {
                        $.extend(opt, option);
                    //    _timer = $cont.data("_llb_timer");
                    //    clearInterval(_timer);
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
}));