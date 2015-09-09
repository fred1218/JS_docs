/**
 * 计时器util,依赖于moment.js
 * @param method
 * @returns {*}
 */
;
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery', 'moment'], factory);
    } else {
        factory(jQuery, moment);
    }
}(function ($, moment) {
    $.fn.cmtimerUtil = function (method) {
        var setting = {
            convert: true,//如果不转化，将以秒计时，totalTime都当成秒
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
                        var total_secs = opt.convert ? convertStr2seconds(opt.totalTime) : opt.totalTime;
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
}));

