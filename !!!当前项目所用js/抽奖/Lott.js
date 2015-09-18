var Lott = function (btn, unit, container) {
    this.unit = unit;
    this.btn = btn;
    this.container = container;
    this.times = 0; //转了几圈
    this.totalTimes = 0;
    this.clickable = true;
    this.defSettings = {
        from: 0, //从第几个位置开始转
        speed: 300, //初始转动速度
        round: 2,//首先旋转几圈
        closedClass: "", //灰色的状态，关闭
        openedClass: "active", //高亮
        onEndding: null,//结束之后的回调函数
        prizeInfo: null//奖品信息,不写的话就随机
    };
    //加载的时候就注册事件
    this.events = [];

    //var btnEvs = {
    //    el: this.btn,
    //    ev: 'click.begin',
    //    sel: null,
    //    data: this,
    //    fn: function (ev) {
    //    }
    //
    //};
    //this.events.push(btnEvs);
    $(this.btn).on('click.begin', null, this, function (ev) {
        var t = ev.data;
        if (t.clickable) {
            t.roll();
        } else {
            //console.log('开始按钮不能点击');
        }

    })
}
Lott.prototype.setOption = function (option) {
    console.log('==========setOption==========');
    if (!this.opt) {
        this.opt = $.extend(true, {}, this.defSettings, option);
    } else {
        this.opt = $.extend(true, this.opt, option);
    }
}
//初始化数据和状态
Lott.prototype.init = function (option) {
    this.clickable = true;//初始化首先放开抽奖按钮
    var $lottery = $(this.container);
    var $units = $lottery.find(this.unit);
    if ($units.length > 0) {
        this.$lottery = $lottery; //抽奖盒子
        this.$units = $units; //所有奖品
        this.counts = $units.length; //奖品个数
        this.totalTimes = this.counts * this.defSettings.round;
        if (!this.opt) {
            this.opt = $.extend(true, {}, this.defSettings, option);
        } else {
            this.opt = $.extend(true, this.opt, option);
        }

        var $fromEl = this.$units.eq(this.opt.from), fromEl = $fromEl[0], $otherEls = this.$units.not(fromEl);
        $fromEl.addClass(this.opt.openedClass);//起点回到首位
        $otherEls.removeClass(this.opt.openedClass);
    }
    return this;
};
//奖品轮转
Lott.prototype.roll = function () {
    var that = this;
    var opt = that.opt;

    function _roll() {
        that.clickable = false;
        var index = opt.from;
        var count = that.counts;
        var $lottery = that.$lottery;
        that.$units.eq(index).addClass(opt.openedClass);
        index++;
        if (index > count - 1) {
            index = 0;
        }
        that.$units.eq(index).addClass(opt.openedClass);
        that.$units.eq(index - 1).removeClass(opt.openedClass);
        opt.from = index;
        that.times += 1;

        var jiansuScope = that.totalTimes + count; //减速范围是
        var randomTimes = (opt.prizeInfo ? (opt.prizeInfo - 1) : Math.floor(Math.random() * count + 1));
        console.log('randomTimes,也就是奖品：', randomTimes);

        if (that.times >= jiansuScope + randomTimes) {
            clearTimeout(that.timer);
            if (opt.onEndding && $.isFunction(opt.onEndding)) {
                $.when(function () {
                    opt.onEndding.call(that);
                    return "hello"
                }()).done(function (param) {
                    alert(param);
                    setTimeout(function () {
                        that.restore();
                    }, 1000);
                })
            }
        } else {
            that.timer = setTimeout(function () {
                _roll();
            }, opt.speed);
            if (that.times < that.totalTimes) {
                opt.speed -= 40;
            } else {
                if (that.times > jiansuScope) {
                    opt.speed += 80;
                } else {
                    opt.speed += 20;
                }
            }
            if (opt.speed < 100) {
                opt.speed = 100;
            }
        }
    }

    _roll();
};
/**
 * 暂停或者暂停多少ms之后继续
 * @param {Object} time
 */
Lott.prototype.pause = function (time) {
    var that = this;
    clearTimeout(that.timer);
    if (time) {
        setTimeout(function () {
            that.roll();
        }, time)
    }
    return this;
};
/**
 *初始化还原
 */
Lott.prototype.restore = function () {
    console.log('==========restore==========');
    var that = this;
    that.times = 0;
    var _tmpOpt = {
        from: 0, //从第几个位置开始转
        speed: 300, //初始转动速度
    };
    that.init(_tmpOpt);
    clearTimeout(that.timer);
    that.timer = null;
};
/**
 *重启
 */
Lott.prototype.restart = function () {
    var that = this;
    if (!!that.times) {
        that.restore();
        that.roll();
    }
};