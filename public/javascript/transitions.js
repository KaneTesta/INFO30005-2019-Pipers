/**
 * Transitions work by looking at the data-target value of links, as well as
 * the data-viewport value of the #Main element that surrounds the page, to
 * apply an animation to elements with the .animation-element class
 */

(function ($) {
    'use strict';

    $(document).ready(function () {
        // Init here.
        let $main = $('#Main');

        $(document).on("transition", function () {
            let current = $('[data-viewport]').first().data('viewport');

            let $progressExtra = $('.progress-dots-extra');
            if (current >= 3) {
                $progressExtra.addClass("visible");
                $progressExtra.addClass("progress-extra-layout");
            } else {
                $progressExtra.removeClass("visible");
                $progressExtra.removeClass("progress-extra-layout");
            }
        });

        let smoothState = $main.smoothState({
            prefetch: true,
            cacheLength: 2,
            onBefore: function ($anchor, $container) {
                let current = $('[data-viewport]').first().data('viewport');
                let target = $anchor.data('target');
                current = current ? current : 0;
                target = target ? target : 0;
                // Find transition
                let transition = 'page-fade';
                if (current === target) {
                    transition = 'page-fade';
                } else if (current < target) {
                    transition = 'page-right';
                } else {
                    transition = 'page-left';
                }

                $main.attr('data-transition', transition);
                $main.attr('data-progress-extra', "false");
            },
            onStart: {
                duration: 250,
                render: function (url, $container) {
                    $main.addClass('is-exiting');
                    // Animate extra progress dots
                    let $progressExtra = $('.progress-dots-extra');
                    if ($main.attr('data-progress-extra') === "true") {
                        $progressExtra.addClass("visible");
                    } else {
                        $progressExtra.removeClass("visible");
                    }

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

        $(document).trigger("transition");
    });
}(jQuery));
