/**
 * Created by guowei.dong on 2015/8/14.
 * 模块化实现，支持直接调用和模块化调用（非node环境）
 */
;
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        //模块化调用
        define(['jquery'], factory);
    } else {
        //直接调用
        factory(jQuery);
    }
}(this, function ($) {
    $.fn.watchScroll = function (method) {
        var setting = {
            scrollEl: null, //默认window
            onShowing: null,
            onHiding: null
        };
        var methods = {
            init: function (option) {
                return this.each(function () {
                    var $cont = $(this),
                        opt = $cont.data("opt.watchScroll");
                    var stateVar = {};
                    if (typeof opt === 'undefined') {
                        opt = $.extend(true, {}, setting, option);
                        console.debug(opt);
                        var scrollEl = opt.scrollEl ? opt.scrollEl : window;
                        stateVar["elHeight"] = $cont.height(); //元素的高度
                        stateVar["elTop"] = $cont.offset().top; //当前元素的top距离
                        stateVar['w_height'] = $(scrollEl).height(); //window当前的高度
                        stateVar['currentScroll'] = $(scrollEl).scrollTop(); //window已滚动的距离
                        //窗口resize，重新计算window的高度
                        $(scrollEl).on('resize.watchScroll', function (ev) {
                            stateVar['w_height'] = $(this).height();
                        });
                        $(scrollEl).on('scroll.watchScroll', function (ev) {
                            stateVar['currentScroll'] = $(this).scrollTop();
                            init();
                        })
                    } else {
                        $.extend(true, opt, option);
                        console.debug(opt);
                    }
                    $cont.data("opt.watchScroll", opt);
                    var init = function () {
                        if (stateVar['currentScroll'] >= (stateVar["elTop"] - stateVar['w_height']) && stateVar['currentScroll'] <= (stateVar["elTop"] + stateVar["elHeight"])) {
                            if (opt.onShowing && $.isFunction(opt.onShowing)) {
                                opt.onShowing.call($cont, stateVar['currentScroll']);
                            }
                        }
                        if (stateVar['currentScroll'] > stateVar["elTop"] + stateVar["elHeight"] || stateVar['currentScroll'] < stateVar["elTop"] - stateVar['w_height']) {
                            if (opt.onHiding && $.isFunction(opt.onHiding)) {
                                opt.onHiding.call($cont, stateVar['currentScroll']);
                            }
                        }
                    }
                    init();

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
    }
    var MK = function (selector, method, option) {
        $(selector).watchScroll(method, option);
    };
    return MK;
}));