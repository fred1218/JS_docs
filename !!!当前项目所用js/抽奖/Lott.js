var Lott = function(btn, unit, container) {
		this.unit = unit;
		this.btn = btn;
		this.container = container;
		this.times = 0; //转了几圈
		this.from = 0, //从第几个位置开始转
			this.defSettings = {
				speed: 300, //初始转动速度
				cycle: 2, //转几圈
				closedClass: "", //灰色的状态，关闭
				openedClass: "active", //高亮
				onEndding: null,
				prizeInfo: null
			};
	}
	//初始化
Lott.prototype.init = function(option) {

	var $lottery = $(this.container);
	var $units = $lottery.find(this.unit);
	if ($units.length > 0) {
		this.$lottery = $lottery; //抽奖盒子
		this.$units = $units; //所有奖品
		this.counts = $units.length; //奖品个数
		this.defSettings.cycle = this.counts * this.defSettings.cycle;
		this.opt = $.extend(true, {}, this.defSettings, option);
		this.$units.eq(0).addClass(this.opt.openedClass);
		//注册事件
		var that = this;
		$(this.btn).on('click', function(ev) {
			that.roll();
		})
	};
	return this;

};
//奖品轮转
Lott.prototype.roll = function() {
	var that = this;
	var opt = that.opt;
	var prize = null;

	function _roll() {
		var index = that.from;
		var count = that.counts;
		var $lottery = that.$lottery;
		that.$units.eq(index).addClass(opt.openedClass);
		index++;
		if (index > count - 1) {
			index = 0;
		};
		that.$units.eq(index).addClass(opt.openedClass);
		that.$units.eq(index - 1).removeClass(opt.openedClass);
		that.from = index;
		that.times += 1;

		var jiansuScope = opt.cycle + count; //减速范围是2*cycle

		var randomTimes = (opt.prizeInfo ? (opt.prizeInfo - 1) : Math.floor(Math.random() * count + 1));
		console.error(randomTimes)

		if (that.times >= jiansuScope + randomTimes) {
			clearTimeout(that.timer);
			if (opt.onEndding && $.isFunction(opt.onEndding)) {
				that.destroy();
				opt.onEndding.call(that);
			}
		} else {
			that.timer = setTimeout(function() {
				_roll();
			}, opt.speed);
			if (that.times < opt.cycle) {
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
			};
		}
	}

	_roll();

};
/**
 * 暂停或者暂停多少ms之后继续
 * @param {Object} time
 */
Lott.prototype.pause = function(time) {
	var that = this;
	clearTimeout(that.timer);
	if (time) {
		setTimeout(function() {
			that.roll();
		}, time)
	}
	return this;
};
/**
 *初始化还原
 */
Lott.prototype.destroy = function() {
	var that = this;
	that.times = 0;
	that.from = 0;
	that.opt.speed = that.defSettings.speed;
	clearTimeout(that.timer);
	that.timer = null;
};
/**
 *重启
 */
Lott.prototype.restart = function() {
	var that = this;
	if (!!that.times) {
		that.destroy();
		that.roll();
	}
};