require.config({
    baseUrl:"base/",
    paths: {
        aavvw: 'aa',
        woshibb: 'bb',
        jquery: 'jquery',
        ud: "underscore",
        clz: "testClass"
    },
    urlArgs: "version=20150912"

});
/**
 * bb是define，就得返回一个对象，因为涉及到闭包,否则无法用到里面的方法
 */
require(['aavvw', 'woshibb', 'clz'], function (undefined, bb, clz) {
    a();
    a1();
    bb.a();
    bb.a1();
    var aaa = new clz();
    console.debug(aaa.name);
})