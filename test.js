/**
 * Created by guowei.dong on 2015/8/26.
 */
require.config({
    paths: {
        common: "commonUtils"
    }
});

require(['common'], function (common) {
    greeting();

});
