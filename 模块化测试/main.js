require.config({
    paths: {
        aavvw: 'aa',
        woshibb: 'bb',
        jquery:'jquery',
        ud:"underscore"
    },
    urlArgs: "version=20150805"

});
/**
 * bb是define，就得返回一个对象，因为涉及到闭包,否则无法用到里面的方法
 */
require(['aavvw', 'woshibb'], function (undefined, bb) {
    a();
    a1();
    bb.a();
    bb.a1();

})