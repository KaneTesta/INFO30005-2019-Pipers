(function ($) {

    'use strict';

    $(document).ready(function () {
        // Init here.
        let $main = $('#Main');
        let $site = $('html, body');
        let transition = 'page-fade';

        let smoothState = $main.smoothState({
            prefetch: true,
            cacheLength: 2,
            onBefore: function ($anchor, $container) {
                var current = $('[data-viewport]').first().data('viewport'),
                    target = $anchor.data('target');
                current = current ? current : 0;
                target = target ? target : 0;
                if (current === target) {
                    transition = 'page-fade';
                } else if (current < target) {
                    transition = 'page-right';
                } else {
                    transition = 'page-left';
                }
            },
            onStart: {
                duration: 250,
                render: function (url, $container) {
                    $main.attr('data-transition', transition);
                    $main.addClass('is-exiting');
                    $site.animate({ scrollTop: 0 });
                    // Restart your animation
                    smoothState.restartCSSAnimations();
                }
            },
            onReady: {
                duration: 0,
                render: function ($container, $newContent) {
                    $container.html($newContent);
                    $container.removeClass('is-exiting');
                }
            },
        }).data('smoothState');
    });
}(jQuery));