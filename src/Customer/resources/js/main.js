import jQuery from 'jquery';

(function ($) {
    'use strict';

    $(document).ready(function () {
        // Spinner
        var spinner = function () {
            setTimeout(function () {
                if ($('#spinner').length > 0) {
                    $('#spinner').removeClass('show');
                }
            }, 1);
        };
        spinner(0);

        // Fixed Navbar
        $(window).scroll(function () {
            if ($(window).width() < 992) {
                if ($(this).scrollTop() > 55) {
                    $('.fixed-top').addClass('shadow');
                } else {
                    $('.fixed-top').removeClass('shadow');
                }
            } else {
                if ($(this).scrollTop() > 55) {
                    $('.fixed-top').addClass('shadow').css('top', -55);
                } else {
                    $('.fixed-top').removeClass('shadow').css('top', 0);
                }
            }
        });
    });
})(jQuery);
