/**
 * 火票务*影院选座
 * v20151210
 * @param method
 * @returns {*}
 */
;
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    $.fn.initCinema = function (method) {
        var setting = {
            store: null,
            price: 20.512,
            maxSelected: 5,
            seatEl: "span",
            seat: "seat",
            rowNo_seat_padding: 2,
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
                        _registEvent();
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
                        var _each_width = $("." + opt.seat).outerWidth(true);
                        var cols = jsondata.cols, rows = jsondata.rows, seats = jsondata.seats;
                        var len = seats[0]['columns'].length;
                        var panelCon = "";
                        panelCon = "<div data-type='cenima_container' style='width: " + _each_width * (len + opt.rowNo_seat_padding) + "px;background-color: #fff;margin:0 auto;'>";
                        for (var r = 1; r <= rows; r++) {
                            var seatData = getSeatData(r, seats);
                            panelCon += createSeats(seatData);
                        }
                        panelCon += "</div>"
                        $cont.append(panelCon);
                        //var _each_height = $("." + opt.seat).closest('p').outerHeight(true);
                        //$cont.height(_each_height*rows);
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
                        var columns = seatData.columns, len = columns.length;
                        //len + 2,加2是为了让显示的数字离座位间距大点
                        var chtml = "<p>";
                        chtml += '<span class="num">' + rowId + '</span>';
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
}));