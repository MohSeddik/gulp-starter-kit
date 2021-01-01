/**
 * Closer plugin example
 */
// (function ($window, $document, bs) {

//     var socket = bs.socket;
//     socket.on("disconnect", function (client) {
//         window.close();
//     });

// })(window, document, ___browserSync___);



(function (window, bs) {
    bs.socket.on('disconnect', function () {
        window.close();
    });
})(window, ___browserSync___);