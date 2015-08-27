/**
 * combin grid and charts function
 * Created by guowei.dong on 2015/6/18.
 */
;
(function ($, _w, _d) {
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
                    //TODO
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
                        if(opt.afterSelect&& $.isFunction(opt.afterSelect)){
                            opt.afterSelect.call($cont,selectItems);
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

})(window.jQuery, window, document);