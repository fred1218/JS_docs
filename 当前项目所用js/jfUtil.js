/**
 * combin grid and charts function
 * Created by guowei.dong on 2015/6/18.
 */
;
(function ($, _w, _d, iCheck, moment) {
    $.fn.createGrid = function (method) {
        var setting = {
            url: "",
            dataStore: null,
            columns: []
        };
        var methods = {
            init: function (option) {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("cmjfcreateGrid");
                    if (typeof opt === 'undefined') {
                        opt = $.extend(true, {}, setting, option);
                    } else {
                        $.extend(true, opt, option);
                    }
                    $cont.data("cmjfcreateGrid", opt);
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
    $.fn.yearMonthCombo = function (method) {
        var setting = {
            years: 10,//往前查看几年
            currentDate: null,
            yearLabel: '年',
            monthLabel: '月',
            separator: ' ',
            disable: false,
            linkTo: {
                which: null,
                max: '15', //最大差别是12个月
                min: '0'
            },
            onInitSuccess: null,
            onSelect: null
        };
        var methods = {
            init: function (option) {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("cmjfyearMonthCombo");
                    if (typeof opt === 'undefined') {
                        opt = $.extend(true, {}, setting, option);
                    } else {
                        $.extend(true, opt, option);
                    }
                    $cont.data("cmjfyearMonthCombo", opt);
                    var _year_combo, _month_combo;
                    _init(opt);
                    function _init(opt) {
                        if (!moment) {
                            $.error("import moment.js");
                            return;
                        }
                        var cur_date = null;
                        if (opt.currentDate) {
                            cur_date = moment(opt.currentDate);
                        } else {
                            cur_date = moment();
                        }
                        var _year = cur_date.year(), _month = cur_date.month() + 1, begin_year = _year - opt.years;
                        var yearSelect = '', monthSelect = '';
                        var dataStore_year = [], dataStore_month = [];

                        yearSelect += '<select data-type="year">';
                        for (var i = begin_year; i <= _year; i++) {
                            dataStore_year.push({
                                disabled: false, selected: i == _year, text: i, value: i
                            });
                        }
                        yearSelect += '</select>';
                        monthSelect += '<select data-type="month">';
                        for (var i = 1; i <= 12; i++) {
                            dataStore_month.push({
                                disabled: i > _month,
                                selected: i == _month,
                                text: i,
                                value: i
                            });
                        }
                        monthSelect += '</select>';
                        var _html = yearSelect + opt.yearLabel + opt.separator + monthSelect + opt.monthLabel;
                        $cont.empty().html(_html);
                        //调用插件初始化
                        _year_combo = initComboBox($cont.find('[data-type="year"]'), {
                            data: dataStore_year, onSelect: function (rec) {
                                triggerLineTo(cur_date);
                                var y = rec.value, dataStore_month = [];
                                for (var i = 1; i <= 12; i++) {
                                    var obj = {};
                                    if (y == _year) {
                                        obj = {
                                            disabled: i > _month,
                                            selected: i == _month,
                                            text: i,
                                            value: i
                                        };
                                    } else {
                                        obj = {
                                            disabled: false,
                                            selected: i == 1,
                                            text: i,
                                            value: i
                                        };
                                    }

                                    dataStore_month.push(obj);
                                }
                                _month_combo.combobox('loadData', dataStore_month);
                            }
                        }, opt.disable);
                        _month_combo = initComboBox($cont.find('[data-type="month"]'), {
                            data: dataStore_month, panelHeight: "auto", onSelect: function (rec) {
                                if (opt.linkTo.which) {
                                    triggerLineTo(cur_date);
                                }

                            }
                        }, opt.disable);
                        if (opt.onInitSuccess && $.isFunction(opt.onInitSuccess)) {
                            if (opt.linkTo.which) {
                                triggerLineTo(cur_date);
                            }
                            opt.onInitSuccess.call($cont, $cont.find('[data-type="year"]'), $cont.find('[data-type="month"]'));
                        }
                    }

                    function triggerLineTo(cur_date) {
                        var beginDate = methods.getValue.call($cont);
                        var end_max = moment([beginDate[0], beginDate[1] - 1]).add(opt.linkTo.max, 'month');
                        end_max = end_max.isAfter(cur_date) ? cur_date : end_max;
                        var end_min = moment([beginDate[0], beginDate[1] - 1]).add(opt.linkTo.min, 'month');
                        end_min = end_min.isAfter(cur_date) ? cur_date : end_min;
                        var $compareTo = $(opt.linkTo.which), _$com_opt = $compareTo.data("cmjfyearMonthCombo");
                        if (!_$com_opt) {
                            //console.error("compareTo:" + opt.linkTo.which + '尚未初始化');
                            $compareTo.yearMonthCombo({
                                years: 10, yearLabel: opt.yearLabel, monthLabel:  opt.monthLabel, disable: opt.disable, separator: opt.separator,
                            });
                        }
                        var ymax = end_max.year(), ymin = end_min.year(), mmax = end_max.month() + 1;
                        var dataStore_year2 = [], dataStore_month2 = [];
                        for (var i = cur_date.year() - opt.years; i <= cur_date.year(); i++) {
                            if (i >= ymin && i <= ymax) {
                                var obj = {
                                    disabled: false, selected: i == ymax, text: i, value: i
                                };
                            } else {
                                var obj = {
                                    disabled: true, selected: false, text: i, value: i
                                };
                            }
                            dataStore_year2.push(obj);
                        }
                        for (var i = 1; i <= 12; i++) {
                            dataStore_month2.push({
                                disabled: i > mmax,
                                selected: i == mmax,
                                text: i,
                                value: i
                            });
                        }

                        initComboBox($compareTo.find('[data-type="month"]'), {data: dataStore_month2}, false);
                        initComboBox($compareTo.find('[data-type="year"]'), {
                            panelHeight: "auto",
                            data: dataStore_year2, onSelect: function (rec) {
                                dataStore_month2 = [];
                                var cy = rec.value;
                                var mmax = end_max.month() + 1, mmin = end_min.month() + 1;
                                for (var i = 1; i <= 12; i++) {
                                    var obj = {};
                                    if (cy == ymin) {
                                        obj = {
                                            disabled: i < mmin,
                                            selected: i == mmin,
                                            text: i,
                                            value: i
                                        };
                                    } else if (cy == ymax) {
                                        obj = {
                                            disabled: i > mmax,
                                            selected: i == mmax,
                                            text: i,
                                            value: i
                                        };
                                    } else {
                                        obj = {
                                            disabled: false,
                                            selected: false,
                                            text: i,
                                            value: i
                                        };
                                    }
                                    dataStore_month2.push(obj);
                                }
                                console.debug(end_min.format('YYYY-MM-DD'), end_max.format('YYYY-MM-DD'), dataStore_year2);
                                initComboBox($compareTo.find('[data-type="month"]'), {data: dataStore_month2}, false);
                            }
                        }, false);
                    }

                    function initComboBox($el, option, disable) {
                        var def = {
                            data: null, valueField: 'value',
                            textField: 'text', editable: false,
                            formatter: function (row) {
                                var str = '';
                                if (row.disabled) {
                                    str = '<i style="color: red">' + row.value + '';
                                } else {
                                    str = '<i style="color: green">' + row.value + '';
                                }
                                return str;
                            },
                        };
                        $.extend(true, def, option);
                        var $o = $el.combobox(def).combobox(disable ? 'disable' : 'enable');
                        $(".combo-panel").mCustomScrollbar({
                            axis: "y",
                            theme: "dark-3"
                        });
                        return $o;
                    }
                });
            },
            getValue: function (callback) {
                if (callback && $.isFunction(callback)) {
                    return this.each(function () {
                        var $cont = $(this), opt = $cont.data("cmjfyearMonthCombo");
                        if (typeof opt === 'undefined') {
                            console.error('尚未初始化');
                            return;
                        }
                        var year = $cont.find('[data-type="year"]').combobox('getValue'), month = $cont.find('[data-type="month"]').combobox('getValue');
                        callback.call($cont, [year, month]);
                    });
                } else {
                    var $cont = this, opt = $cont.data("cmjfyearMonthCombo");
                    if (typeof opt === 'undefined') {
                        console.error('尚未初始化');
                        return;
                    }
                    var year = $cont.find('[data-type="year"]').combobox('getValue'), month = $cont.find('[data-type="month"]').combobox('getValue');
                    return [year, month];
                }
            },
            setOption: function (option) {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("cmjfyearMonthCombo");
                    if (typeof opt === 'undefined') {
                        console.error('尚未初始化');
                        return;
                    } else {
                        $.extend(true, opt, option);
                    }
                    $cont.data("cmjfyearMonthCombo", opt);
                    methods.init.call($cont, opt);
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
    $.fn.selectCombo = function (method) {
        var setting = {
            trigger: ".combo-arrow",
            effect: "slideDown",
            comboPanel: "#cob_zhibiaoPanel",
            selectAll: "#checkbox-1",
            afterSelect: null
        };
        var methods = {
            init: function (option) {
                return this.each(function () {
                    var $cont = $(this), opt = $cont.data("cmjfselectCombo");
                    if (typeof opt === 'undefined') {
                        opt = $.extend(true, {}, setting, option);
                    } else {
                        $.extend(true, opt, option);
                    }
                    $cont.data("cmjfselectCombo", opt);
                    $(opt.comboPanel).hide();
                    $cont.on('click', opt.trigger, function () {
                        if ($cont.data('opened')) {
                            $(opt.comboPanel).slideUp(100, function () {
                                $cont.data('opened', false);
                            });
                        } else {
                            $(opt.comboPanel).slideDown(100, function () {
                                $cont.data('opened', true);
                            });
                        }

                    });
                    var $allSelects = $(opt.comboPanel + " :checkbox"), $selectsWithoutAll = $(opt.comboPanel + " :checkbox:not(" + opt.selectAll + ")");
                    if (iCheck) {
                        $(opt.selectAll).on('ifClicked', function () {
                            $(opt.selectAll).data('notBySelf', false);
                            $(this).on('ifChecked', function () {
                                $selectsWithoutAll.iCheck('check');
                                _checkHowMuch_icheck();
                            })
                            $(this).on('ifUnchecked', function () {
                                $selectsWithoutAll.off('ifChecked');
                                if (!$(opt.selectAll).data('notBySelf')) {
                                    $selectsWithoutAll.iCheck('uncheck');
                                }
                                _checkHowMuch_icheck();
                            })

                        })
                        $selectsWithoutAll.on('ifClicked', function () {
                            var selected = methods['getSelectItems'].call($cont, false);
                            $(this).on('ifChecked', function () {
                                $(opt.selectAll).iCheck('uncheck');
                                if (selected < $selectsWithoutAll.length) {
                                    $(opt.selectAll).prop('checked', false);
                                } else {
                                    $(opt.selectAll).prop('checked', true);
                                }
                                _checkHowMuch_icheck();
                            })

                            $(this).on('ifUnchecked', function () {
                                $(opt.selectAll).data('notBySelf', true).iCheck('uncheck');
                                _checkHowMuch_icheck();
                            })
                        })
                        function _checkHowMuch_icheck() {
                            var selectItems = methods['getSelectItems'].call($cont, true);
                            if (opt.afterSelect && $.isFunction(opt.afterSelect)) {
                                opt.afterSelect.call($cont, selectItems);
                            }
                        }
                    } else {

                        $(opt.selectAll).on('click', function () {
                            $selectsWithoutAll.prop('checked', $(this).prop('checked'));
                            _checkHowMuch();
                        })
                        $selectsWithoutAll.on('click', function () {
                            var selected = methods['getSelectItems'].call($cont, false);
                            if (selected < $selectsWithoutAll.length) {
                                $(opt.selectAll).prop('checked', false);
                            } else {
                                $(opt.selectAll).prop('checked', true);
                            }
                            _checkHowMuch();
                        })
                        function _checkHowMuch() {
                            var selectItems = methods['getSelectItems'].call($cont, true);
                            if (opt.afterSelect && $.isFunction(opt.afterSelect)) {
                                opt.afterSelect.call($cont, selectItems);
                            }
                        }
                    }


                });

            },
            getSelectItems: function (notOnlyCount) {
                var returnObj = null;
                var $cont = $(this), opt = $cont.data("cmjfselectCombo"), $selectsWithoutAll = null;
                if (opt.selectAll) {
                    $selectsWithoutAll = $(opt.comboPanel + " :checkbox:not(" + opt.selectAll + ")")
                } else {
                    $selectsWithoutAll = $(opt.comboPanel + " :checkbox");
                }
                if (notOnlyCount) {
                    returnObj = $selectsWithoutAll.filter(':checked');
                } else {
                    returnObj = $selectsWithoutAll.filter(':checked').length;
                }
                //return items selected
                return returnObj;
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

})(window.jQuery, window, document, jQuery.fn['iCheck'], moment);