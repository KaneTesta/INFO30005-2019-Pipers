$(document).on("transition", function () {
    $(".button-recipe").on("click", function (e) {
        e.preventDefault();

        let $element = $(this);
        let params = {
            "id": $element.attr("data-id"),
            "q": window.location.href
        }

        let url = "/result/" + $element.attr("data-step") + "/?" + jQuery.param(params);
        // Check smoothState
        let $main = $('#Main');
        let smoothState = $main.data("smoothState");
        if (smoothState !== undefined) {
            $main.attr('data-transition', 'page-right');
            $main.attr('data-progress-extra', "true");
            smoothState.load(url);
        } else {
            window.location.assign(url);
        }
    });
});