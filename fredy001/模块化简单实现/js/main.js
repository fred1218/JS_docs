/**
 * Created by guowei.dong on 2015/7/22.
 */
require.config({
    baseUrl: "js/",
    paths: {
        m1: "lib/m1",
        m21: "lib2/m1"
    }
});
require(['m1', 'm21'], function (m1, m2) {
    m1.getName();
    m2.getName();
});