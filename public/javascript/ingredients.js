$(document).on("transition", function () {
    let $search = $("#IngredientsSearch");
    if (!$search.length) {
        return;
    }

    const EJS_INGREDIENT = `
    <div class="ingredient-element" data-ingredient="<%= ingredient %>" data-ingredient-id="<%= ingredientId %>">
        <p><%= ingredient %></p>
        <div class="flex-fill"></div>
        <input type="checkbox" id="CheckboxPriority<%= ingredientId %>" class="checkbox-pill button-priority button-icon">
        <label for="CheckboxPriority<%= ingredientId %>">
            <ion-icon class="checkbox-icon checkbox-add" name="star-outline"></ion-icon>
            <ion-icon class="checkbox-icon checkbox-checkmark" name="star"></ion-icon>
            <span>Priority</span>
        </label>
        <button id="IngredientRemove<%= ingredientId %>" class="button-error button-icon">
            <ion-icon name="remove"></ion-icon>
        </button>
    </div>
    `;

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
    function addIngredientFromSearch(ingredientList) {
        // Hide errors
        hideIngredientMessages(3);
        // Check ingredients
        let $search = $("#IngredientsSearch");
        let searchValue = $search.val();
        let ingredient = ingredientList.find(function (element) {
            return searchValue !== undefined && element !== undefined &&
                element.toLowerCase() === searchValue.toLowerCase();
        });

        addIngredient(ingredient, ingredientList, true);
    }

    function addIngredient(ingredient, ingredientList, fromUserInput) {
        if (ingredient !== undefined) {
            // Capitalize first letter
            ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1).toLowerCase();
            // Get id-friendly ingredient
            let ingredientId = ingredient.split(' ').join('_');

            // Check ingredient list
            let findResult = ingredientList.find(function (element) {
                return element !== undefined && element.toLowerCase() === ingredient.toLowerCase();
            });

            if (!findResult) {
                return;
            }

            // Check if the ingredient already exists
            if (!hasIngredient(ingredient)) {
                // Create ingredient element
                let $ingredientsList = $("#IngredientsList");

                let $ingredientElement = $(ejs.render(EJS_INGREDIENT, { ingredient: ingredient, ingredientId: ingredientId }));
                // Setup remove button
                let $ingredientRemoveButton = $ingredientElement.children("#IngredientRemove" + ingredientId);
                $ingredientRemoveButton.on('click', function () {
                    // Animate the element out
                    $ingredientElement.css("opacity", 0);
                    $ingredientElement.slideUp(250, function () {
                        $ingredientElement.remove();
                    });
                });

                // Hide element
                if (fromUserInput) {
                    $ingredientElement.hide();
                    $ingredientElement.css("opacity", 0);
                }

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
                if (fromUserInput) {
                    $ingredientElement.slideDown(250);
                    window.setTimeout(function () {
                        $ingredientElement.css("opacity", 1);
                    }, 100);
                }

                // Show success message
                if (fromUserInput) {
                    showIngredientMessage("'" + ingredient + "'" + " added to ingredients.");
                }
            } else {
                // Ingredient already added
                if (fromUserInput) {
                    showIngredientMessage("'" + ingredient + "'" + " is already added.", "message-error");
                }
            }
        } else if (fromUserInput) {
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
    function getIngredients(priority = false) {
        let ingredients = [];
        let $ingredientsList = $("#IngredientsList");
        $ingredientsList.children().each(function () {
            let $element = $(this);
            // Get ingredient name
            let ingredientName = $element.attr("data-ingredient");
            let ingredientId = $element.attr("data-ingredient-id");
            // Check priority
            if (priority) {
                let $priorityCheckbox = $element.children("#CheckboxPriority" + ingredientId);
                if ($priorityCheckbox.is(":checked")) {
                    ingredients.push(ingredientName.toLowerCase());
                }
            } else {
                ingredients.push(ingredientName.toLowerCase());
            }
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
            return ingredientName.toLowerCase() === element.toLowerCase();
        });

        return ingredientElement !== undefined;
    }

    /**
     * Save the current ingredients for the user
     */
    function saveIngredients($button) {
        $button.addClass("loading");

        let params = {
            ingredients: getIngredients()
        };

        let url = "/api/user/saveingredients";
        $.post(url, params, function (data) {
            $button.removeClass("loading");

            if (data.error) {
                showIngredientMessage("Error saving ingredients: " + data.error, "message-error");
            } else {
                showIngredientMessage("Ingredients saved")
            }
        }).fail(function (data) {
            $button.removeClass("loading");
            showIngredientMessage("Error saving ingredients", "message-error");
        });
    }

    /**
     * Get an array of the cookware that the user has marked as 'unavailable'
     * @returns {string[]}
     */
    function getUnavailableCookware() {
        let unavailableCookware = [];
        let $ingredientsCookware = $("#IngredientsCookware");
        $ingredientsCookware.children().each(function () {
            let $element = $(this);
            let $checkbox = $element.children("input");
            if (!$checkbox.is(":checked")) {
                unavailableCookware.push($checkbox.attr("value"));
            }
        });

        return unavailableCookware;
    }

    /**
     * Get the maximum minutes for a recipe that the user has entered
     * @returns {int}
     */
    function getMaximumTime() {
        let $timeMinutes = $("#SliderMinutes");
        return $timeMinutes.attr("data-value");
    }

    let $ingredientsSection = $("#IngredientsSection");
    let $ingredientsLoading = $("#IngredientsLoading");
    // Get ingredients from server
    $.getJSON("/api/ingredients", function (data) {
        /** @type {string[]} */
        let ingredientList = data.sort();
        // Setup autocomplete
        $search.autocomplete({
            html: true,
            autoFocus: true,
            /** @param {{term: string}} request @param {function(string[])} response */
            source: function (request, response) {
                const SEARCH_LENGTH = 5;

                let searchRequest = request.term.toLowerCase();
                // Add ingredients that start with request
                let searchResult = ingredientList.filter(
                    /** @param {string} ingredient */
                    function (ingredient) {
                        let searchIngredient = ingredient.toLowerCase();
                        return searchIngredient.startsWith(searchRequest);
                    }
                );

                // Add matches for request
                if (searchResult.length < SEARCH_LENGTH) {
                    ingredientList.filter(
                        /** @param {string} ingredient */
                        function (ingredient) {
                            let searchIngredient = ingredient.toLowerCase();
                            return !searchIngredient.startsWith(searchRequest) && searchIngredient.search(searchRequest) >= 0;
                        }
                    ).forEach(function (element) {
                        searchResult.push(element);
                    });
                }

                // Send response
                response(searchResult.slice(0, SEARCH_LENGTH));
            },
            select: function (event, ui) {
                // Set value
                $search.val(ui.item.label);
                // Add ingredient
                addIngredientFromSearch(ingredientList);
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

        /**
         * @param {{label: string}} item
         */
        $.ui.autocomplete.prototype._renderItem = function (ul, item) {
            let search = this.term.toLowerCase();
            let text = item.label.toLowerCase().replace(search, "<span class=\"ui-menu-item-accent\">" + search + "</span>");
            // Set first character to upper case
            let textSplit = text.split("");
            if (textSplit[0] !== '<') {
                textSplit[0] = text.charAt(0).toUpperCase();
            } else {
                let index = text.search(">");
                if (index > 0 && index < textSplit.length - 1) {
                    textSplit[index + 1] = text.charAt(index + 1).toUpperCase();
                }
            }

            text = textSplit.join("");

            return $("<li></li>")
                .data("item.autocomplete", item)
                .append("<div>" + text + "</div>")
                .appendTo(ul);
        };

        // Setup add button
        $("#IngredientsButtonAdd").on('click', function () {
            addIngredientFromSearch(ingredientList);
        });

        // Setup save ingredients button
        let $saveIngredientsButton = $("#IngredientsButtonSaveIngredients");
        $saveIngredientsButton.on('click', function () {
            saveIngredients($saveIngredientsButton);
        });

        // Setup find recipes button
        $("#IngredientsButtonFindRecipes").on('click', function () {
            // Save ingredients
            saveIngredients($saveIngredientsButton);
            // Get url
            params = {
                "ingredients": getIngredients(),
                "priority_ingredients": getIngredients(true),
                "unavailable_cookware": getUnavailableCookware(),
                "maximum_time": getMaximumTime()
            }

            let url = "/recipe?" + jQuery.param(params);
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

        let $ingredientsList = $("#IngredientsList");
        if ($ingredientsList) {
            let userIngredientsData = $ingredientsList.attr("data-ingredients");
            if (userIngredientsData) {
                let userIngredients = userIngredientsData.split("+");
                userIngredients.forEach(function (el) {
                    addIngredient(el, ingredientList, false);
                });
            }
        }

        // Show the ingredients section
        $ingredientsLoading.slideUp(250, function () {
            $ingredientsLoading.remove();
        });

        window.setTimeout(function () {
            $ingredientsSection.slideDown(250);
        }, 250);
    });
});