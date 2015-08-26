/**
 * 字符数组等操作 ajax(complete,beforeSend) loading dialog 时间操作 正则验证
 * date array Math list map(immutable),loadsh&underscore,es5 API,reduce,string
 * 图片的lazyload
 * window.location
 * window.open
 *
 * Created by guowei.dong on 2015/8/19.
 */
define(['jquery-1.11.1.min', 'underscore'], function ($, _) {
    //function browser() {
    //    alert('browser');
    //}
    var greeting = function () {
        var testStr = "    hello  wrld";
        alert(testStr);
    }
    var methods = {};
    methods.greeting = greeting;

    function log() {
        console.debug();
    }

    function dateAbt() {
        var d = new Date;
        var d2 = new Date('2011-11-11 23:59:59');
        console.debug(d2.toTimeString(), d2.toDateString(), d2.toLocaleString());//本时区
        console.debug(d2.toGMTString(), d2.toISOString(), d2.toUTCString());//格林威治，，协调世界时
        log(d.getFullYear(), 1);
        log(d.getMonth() + 1);
        log(d.getDate());
        log(d.getHours());
        log(d.getMinutes());
        log(d.getMilliseconds());
        log(d.getTime());
        log(d.toLocaleDateString());
        log(d.toLocaleString());
        document.write(d.toLocaleString());
        log(d.toLocaleTimeString());
    }

    var imgLoad = function () {
    };

    return methods;
});