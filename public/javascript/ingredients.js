$(document).on("transition", function () {
    function hideIngredientMessages(maxMessages = 0) {
        let $ingredientErrorList = $("#IngredientsMessageList");
        // Hide all existing errors
        let ingredientMessages = 0;
        $ingredientErrorList.children().each(function () {
            ++ingredientMessages;
            if (ingredientMessages >= maxMessages) {
                hideIngredientMessage($(this));
            }
        });
    }

    function hideIngredientMessage(ingredientMessage) {
        let $ingredientMessage = $(ingredientMessage);
        if (!$ingredientMessage.hasClass("message-hiding")) {
            $ingredientMessage.addClass("message-hiding");
            $ingredientMessage.css("opacity", 0);
            $ingredientMessage.slideUp(250, function () {
                $ingredientMessage.remove();
            });
        }
    }

    function showIngredientMessage(messageText, messageClass) {
        let $ingredientMessageList = $("#IngredientsMessageList");
        // Create error element
        let $ingredientMessage = $("<div class=\"message\"></div>");
        $ingredientMessage.html(messageText);
        // Add message class
        if (messageClass !== undefined) {
            $ingredientMessage.addClass(messageClass);
        }

        // Add to list
        $ingredientMessage.hide();
        $ingredientMessage.css("opacity", 0);
        $ingredientMessage.prependTo($ingredientMessageList);
        // Animate in
        $ingredientMessage.slideDown({ duration: 250, queue: false });
        window.setTimeout(function () {
            $ingredientMessage.css("opacity", 1);
        }, 100);

        // Automatically hide after
        window.setTimeout(function () {
            hideIngredientMessage($ingredientMessage);
        }, 5000);
    }

    /**
     * Add an ingredient to the list of ingredients
     * @param {string[]} ingredientList The full list of ingredients to check against
     */
    function addIngredient(ingredientList) {
        // Hide errors
        hideIngredientMessages(3);
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

                // Show success message
                showIngredientMessage("'" + ingredient + "'" + " added to ingredients.");
            } else {
                // Ingredient already added
                showIngredientMessage("'" + ingredient + "'" + " is already added.", "message-error");
            }
        } else {
            // Ingredient not found
            if (searchValue === undefined || searchValue === "") {
                showIngredientMessage("Please enter an ingredient into the search box.", "message-warning");
            } else {
                showIngredientMessage("'" + searchValue + "'" + " is not a valid ingredient.", "message-error");
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
            source: function (request, response) {
                response($.ui.autocomplete.filter(ingredientList, request.term).slice(0, 5));
            },
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