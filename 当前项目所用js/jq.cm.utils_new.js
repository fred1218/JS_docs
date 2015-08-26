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

