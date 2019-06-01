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
    let $recipeCleanup = $("#RecipeCleanup");
    if ($recipeCleanup) {
        let totalTips = $recipeCleanup.children().length;
        let foundTips = 0;
        let storageTips = 0;
        // Set ingredients
        $recipeCleanup.children().each(function () {
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
                            // Create no storage tips message
                            let $noTipsMessage = $("<div class=\"message\">No storage tips for this recipe</div>");
                            $noTipsMessage.hide();
                            // Add message to cleanup
                            $noTipsMessage.appendTo($recipeCleanup);
                            $noTipsMessage.slideDown(250);
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

                        ++storageTips;
                    } else {
                        $el.remove();
                    }
                }
            );
        });
    }

    // Setup serving size adjustment button for recipes
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


    // Setup next and previous page buttons
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

    function saveIngredients(ingredients) {
        console.log(ingredients);
        let params = {
            ingredients: ingredients
        };

        let url = "/api/user/saveingredients";
        $.post(url, params, function (data) {
            console.log(data);
        }).fail(function (data) {
            console.log(data);
        });
    }

    // Ingredient removal from cleanup screen
    let $cleanupIngredientsList = $("#CleanupIngredientsList");
    if ($cleanupIngredientsList && $cleanupIngredientsList.attr("data-ingredients")) {
        let ingredients = $cleanupIngredientsList.attr("data-ingredients").split("+");
        let ingredientsCommon = $cleanupIngredientsList.attr("data-ingredients-common").split("+");
        function saveRemovedIngredients() {
            // Save the ingredients data
            let newIngredients = ingredients.slice();
            let $currentIngredients = $cleanupIngredientsList.children();
            ingredientsCommon.forEach(function (ingredient, index) {
                let foundIngredient = false;
                $currentIngredients.each(function () {
                    let dataIngredient = $(this).attr("data-ingredient").toLowerCase();
                    if (dataIngredient === ingredient.toLowerCase()) {
                        foundIngredient = true;
                    }
                });

                if (!foundIngredient) {
                    // Remove the ingredient from the list
                    let ingredientIndex = newIngredients.findIndex((newIngredient) => {
                        return ingredient.toLowerCase() === newIngredient.toLowerCase();
                    });

                    console.log(ingredientIndex);
                    if (ingredientIndex >= 0) {
                        newIngredients.splice(ingredientIndex, 1);
                    }
                }
            });

            saveIngredients(newIngredients);
        }

        ingredientsCommon.forEach((ingredient) => {
            let ingredientId = ingredient.split(" ").join("");
            let $ingredientElement = $("#Ingredient" + ingredientId);
            let $removeButton = $("#ButtonRemove" + ingredientId);
            $removeButton.on('click', function () {
                // Animate the element out
                $ingredientElement.css("opacity", 0);
                $ingredientElement.slideUp(200, function () {
                    $ingredientElement.remove();
                    saveRemovedIngredients();
                });
            });
        });
    }
});