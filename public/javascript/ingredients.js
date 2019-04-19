/**
 * Add an ingredient to the list of ingredients
 */
function addIngredient(ingredientList) {
    let search = $("#IngredientsSearch");
    let ingredient = ingredientList.find(function (element) {
        return search.val() !== undefined && element !== undefined &&
            element.toLowerCase() === search.val().toLowerCase();
    });

    if (ingredient !== undefined) {
        if (!hasIngredient(ingredient)) {
            // Create ingredient element
            let ingredientsList = $("#IngredientsList");
            let ingredientElement = $("<div class=\"ingredient-element\"></div>");
            ingredientElement.attr("data-ingredient", ingredient);
            ingredientElement.html(ingredient);
            // Add to list
            ingredientElement.appendTo(ingredientsList);
        } else {
            // Ingredient already added
        }
    } else {
        // Ingredient not found
    }
}

/**
 * Get an array of the ingredients that have been added
 * @returns {string[]}
 */
function getIngredients() {
    let ingredients = [];
    let ingredientsList = $("#IngredientsList");
    ingredientsList.children().each(function () {
        let element = $(this);
        ingredients.push(element.attr("data-ingredient"));
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

/**
 * Get the ingredients that can be added
 * @returns {string[]}
 */
function getAvailableIngredients() {
    return [
        "Tomato",
        "Big Tomato",
        "Chicken",
        "Potato",
        "Rice",
        "Cactus"
    ]
}

$(document).on("transition", function () {
    // Find ingredients
    let ingredientList = getAvailableIngredients();
    // Setup autocomplete
    let search = $("#IngredientsSearch");
    search.autocomplete({
        source: ingredientList,
        select: function (event, ui) {
            // Set value
            search.val(ui.item.label);
            // Add ingredient
            addIngredient(ingredientList);
            // Clear value
            search.val("");
            return false;
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
});