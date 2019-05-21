$(document).on("transition", function () {
    // Setup recipe buttons
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

    // Handle ingredient lists
    let recipeCleanup = $("#RecipeCleanup");
    if (recipeCleanup) {
        $.getJSON("/api/ingredients",
            /**
             * Get ingredients from server
             * @param {[string]} data
             */
            function (data) {
                function findIngredient(ingredient) {
                    return data.find((el) => el.name.toLowerCase() === ingredient)
                }

                // Set ingredients
                recipeCleanup.children().each(function () {
                    let $el = $(this);
                    let ingredient = $el.attr("data-ingredient");
                    $el.html(ingredient);
                });
            }
        );
    }

    $(".recipe-button-page").on("click", function (e) {
        let $el = $(this);
        let search_params = new URLSearchParams(window.location.search);
        let targetPage = parseInt($el.attr("data-page"));
        search_params.set('page', targetPage);

        let search_string = search_params.toString();
        if (!search_string.startsWith("?")) {
            search_string = "?" + search_string;
        }

        let url = window.location.origin + window.location.pathname + search_string;
        // Check smoothState
        let $main = $('#Main');
        let smoothState = $main.data("smoothState");
        if (smoothState !== undefined) {
            if ($el.hasClass("button-next")) {
                $main.attr('data-transition', 'page-right');
            } else if ($el.hasClass("button-prev")) {
                $main.attr('data-transition', 'page-left');
            } else {
                $main.attr('data-transition', 'page-fade');
            }

            smoothState.load(url);
        } else {
            window.location.assign(url);
        }
    });
});