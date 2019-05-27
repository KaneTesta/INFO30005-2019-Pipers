$(document).on("transition", function () {
    // Setup recipe buttons
    $(".button-recipe").on("click", function (e) {
        e.preventDefault();

        let $element = $(this);
        let params = {
            "id": $element.attr("data-id"),
            "serving_size": $element.attr("data-serving"),
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

    const EJS_INGREDIENT_TIPS = `
    <% if (data.ingredient && data.ingredient.name) { %>
        <h5><%= data.ingredient.name %></h5>

        <% if (data.ingredient.tip) { %>
            <h6>Tip</h6>
            <p><%= data.ingredient.tip %></p>
        <% }; %>

        <% if (data.ingredient.fridge) { %>
            <h6>Fridge</h6>
            <p><%= data.ingredient.fridge %></p>
        <% }; %>

        <% if (data.ingredient.pantry) { %>
            <h6>Pantry</h6>
            <p><%= data.ingredient.pantry %></p>
        <% }; %>
    <% }; %>
    `

    // Handle ingredient lists
    let recipeCleanup = $("#RecipeCleanup");
    if (recipeCleanup) {
        let totalTips = recipeCleanup.children().length;
        let foundTips = 0;
        // Set ingredients
        recipeCleanup.children().each(function () {
            let $el = $(this);
            $el.hide();

            $.getJSON("/api/ingredient/" + $el.attr("data-ingredient"),
                /**
                 * Get ingredients from server
                 * @param {[string]} data
                 */
                function (data) {
                    // Update tips message
                    ++foundTips;
                    if (foundTips >= totalTips) {
                        let tipsLoading = $("#RecipeCleanupLoadingTips");
                        tipsLoading.slideUp(400, function () {
                            tipsLoading.remove();
                        });
                    }

                    if (data) {
                        if (!data.tip && !data.fridge && !data.pantry) {
                            $el.remove();
                        } else {
                            $el.html(ejs.render(EJS_INGREDIENT_TIPS, {
                                data: {
                                    ingredient: data
                                }
                            }));

                            $el.slideDown(400);
                        }
                    } else {
                        $el.remove();
                    }
                }
            );
        });
    }

    $("#RecipeButtonServingSize").on("click", function (e) {
        let $peopleSlider = $("#SliderPeople");
        let search_params = new URLSearchParams(window.location.search);
        let serving_size = parseInt($peopleSlider.attr("data-value"));
        search_params.set('serving_size', serving_size);

        let search_string = search_params.toString();
        if (!search_string.startsWith("?")) {
            search_string = "?" + search_string;
        }

        let url = window.location.origin + window.location.pathname + search_string;
        // Check smoothState
        let $main = $('#Main');
        let smoothState = $main.data("smoothState");
        if (smoothState !== undefined) {
            $main.attr('data-transition', 'page-fade');
            smoothState.load(url);
        } else {
            window.location.assign(url);
        }
    });

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