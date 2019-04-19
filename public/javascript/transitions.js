/**
 * Transitions work by looking at the data-target value of links, as well as
 * the data-viewport value of the #Main element that surrounds the page, to
 * apply an animation to elements with the .animation-element class
 */

(function ($) {
    'use strict';

    $(document).ready(function () {
        $(document).trigger("transition");
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
                    // Restart your animation
                    smoothState.restartCSSAnimations();
                }
            },
            onReady: {
                duration: 0,
                render: function ($container, $newContent) {
                    $container.html($newContent);
                    $container.removeClass('is-exiting');
                    $(document).trigger("transition");
                }
            },
        }).data('smoothState');
    });
}(jQuery));