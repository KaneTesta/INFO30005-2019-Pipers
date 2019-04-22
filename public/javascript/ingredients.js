$(document).on("transition", function () {
    function hideIngredientErrors() {
        let $ingredientErrorList = $("#IngredientsErrorList");
        // Hide all existing errors
        $ingredientErrorList.children().each(function () {
            let $element = $(this);
            if (!$element.hasClass("message-hiding")) {
                $element.addClass("message-hiding");
                $element.css("opacity", 0);
                $element.slideUp(250, function () {
                    $element.remove();
                });
            }
        });
    }

    function showIngredientError(errorText) {
        let $ingredientErrorList = $("#IngredientsErrorList");
        // Create error element
        let $ingredientError = $("<div class=\"message message-error\"></div>");
        $ingredientError.html(errorText);
        // Add to list
        $ingredientError.hide();
        $ingredientError.css("opacity", 0);
        $ingredientError.prependTo($ingredientErrorList);
        // Animate in
        window.setTimeout(function () {
            $ingredientError.slideDown({ duration: 250, queue: false });
            window.setTimeout(function () {
                $ingredientError.css("opacity", 1);
            }, 100);
        }, 250);
    }

    /**
     * Add an ingredient to the list of ingredients
     * @param {string[]} ingredientList The full list of ingredients to check against
     */
    function addIngredient(ingredientList) {
        // Hide errors
        hideIngredientErrors();
        // Check ingredients
        let $search = $("#IngredientsSearch");
        let searchValue = $search.val();
        let ingredient = ingredientList.find(function (element) {
            return searchValue !== undefined && element !== undefined &&
                element.toLowerCase() === searchValue.toLowerCase();
        });

        if (ingredient !== undefined) {
            if (!hasIngredient(ingredient)) {
                // Create ingredient element
                let $ingredientsList = $("#IngredientsList");
                let $ingredientElement = $("<div class=\"ingredient-element\"></div>");
                $ingredientElement.attr("data-ingredient", ingredient);
                $ingredientElement.html(ingredient);
                // Create remove button
                let $flexFill = $("<div class=\"flex-fill\"></div>");
                $flexFill.appendTo($ingredientElement);
                let $ingredientRemoveButton = $("<button class=\"button-error button-icon\"></button>");
                $ingredientRemoveButton.appendTo($ingredientElement);
                $ingredientRemoveButton.on('click', function () {
                    // Hide errors
                    hideIngredientErrors();
                    // Animate the element out
                    $ingredientElement.css("opacity", 0);
                    $ingredientElement.slideUp(250, function () {
                        $ingredientElement.remove();
                    });
                });

                // Add icon for remove button
                let $ingredientRemoveIcon = $("<ion-icon name=\"remove\"></ion-icon>");
                $ingredientRemoveIcon.appendTo($ingredientRemoveButton);

                // Hide element
                $ingredientElement.hide();
                $ingredientElement.css("opacity", 0);

                // Add at index
                let addedIngredient = false;
                $ingredientsList.children().each(function () {
                    if (addedIngredient) {
                        return;
                    }

                    let $element = $(this);
                    // Check alphabetically
                    if ($element.attr("data-ingredient") > ingredient) {
                        $element.before($ingredientElement);
                        addedIngredient = true;
                    }
                });

                // Add at end if not yet added
                if (!addedIngredient) {
                    $ingredientElement.appendTo($ingredientsList);
                }

                // Animate in
                $ingredientElement.slideDown(250);
                window.setTimeout(function () {
                    $ingredientElement.css("opacity", 1);
                }, 100);
            } else {
                // Ingredient already added
                showIngredientError("'" + ingredient + "'" + " is already added.");
            }
        } else {
            // Ingredient not found
            if (searchValue === undefined || searchValue === "") {
                showIngredientError("Please enter an ingredient into the search box.");
            } else {
                showIngredientError("'" + searchValue + "'" + " is not a valid ingredient.");
            }
        }
    }

    /**
     * Get an array of the ingredients that have been added
     * @returns {string[]}
     */
    function getIngredients() {
        let ingredients = [];
        let $ingredientsList = $("#IngredientsList");
        $ingredientsList.children().each(function () {
            let $element = $(this);
            ingredients.push($element.attr("data-ingredient"));
        });

        return ingredients;
    }

    /**
     * Check if an ingredient has been added to the list yet
     * @param {string} ingredientName The name of the ingredient to check
     * @returns {boolean}
     */
    function hasIngredient(ingredientName) {
        let ingredientElement = getIngredients().find(function (element) {
            return ingredientName === element;
        });

        return ingredientElement !== undefined;
    }

    let $ingredientsSection = $("#IngredientsSection");
    let $ingredientsLoading = $("#IngredientsLoading");
    // Get ingredients from server
    $.getJSON("./api/ingredients", function (data) {
        let ingredientList = data.sort();
        // Setup autocomplete
        let $search = $("#IngredientsSearch");
        $search.autocomplete({
            autoFocus: true,
            source: ingredientList,
            select: function (event, ui) {
                // Set value
                $search.val(ui.item.label);
                // Add ingredient
                addIngredient(ingredientList);
                // Clear value
                $search.val("");
                return false;
            },
            open: function () {
                let $searchDropdown = $('ul.ui-autocomplete');
                if (!$searchDropdown.hasClass("ui-autocomplete-show")) {
                    $searchDropdown.hide().slideDown(250);

                    window.setTimeout(function () {
                        $searchDropdown.addClass("ui-autocomplete-show");
                    }, 100);
                }
            },
            close: function () {
                let $searchDropdown = $('ul.ui-autocomplete');
                $searchDropdown.removeClass("ui-autocomplete-show");
                $searchDropdown.show().slideUp(250);
            }
        });

        // Setup add button
        $("#IngredientsButtonAdd").on('click', function () {
            addIngredient(ingredientList);
        });

        // Setup find recipes button
        $("#IngredientsButtonFindRecipes").on('click', function () {
            // Get url
            let ingredientsParam = getIngredients().join("+");
            let url = "./recipe?ingredients=" + ingredientsParam;
            // Check smoothState
            let $main = $('#Main');
            let smoothState = $main.data("smoothState");
            if (smoothState !== undefined) {
                $main.attr('data-transition', 'page-right');
                smoothState.load(url);
            } else {
                window.location.assign(url);
            }
        });

        // Show the ingredients section
        $ingredientsSection.slideDown(500);
        $ingredientsLoading.slideUp(250, function () {
            $ingredientsLoading.remove();
        });
    });
});