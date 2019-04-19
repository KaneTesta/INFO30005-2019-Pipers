function add_ingredient(ingredient_name) {
    console.log("Ingredient added: " + ingredient_name);
}

$(function () {
    // Find ingredients
    let ingredient_list = [
        "Tomato",
        "Chicken",
        "Potato"
    ]

    // Setup autocomplete
    let search = $("#IngredientsSearch");
    search.autocomplete({
        source: ingredient_list
    });

    // Setup add button
    $("#IngredientsButtonAdd").on('click', function () {
        console.log(search.value);
        let ingredient = ingredient_list.find(function (element) {
            return search.value !== undefined && element !== undefined &&
                element.toLowerCase() === search.value.toLowerCase();
        });

        if (ingredient !== undefined) {
            add_ingredient(ingredient);
        }
    });
});