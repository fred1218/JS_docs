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
                    //else {
                    //    $.extend(opt, option);
                    //    _timer = $cont.data("_llb_timer");
                    //    clearInterval(_timer);
                    //}

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

