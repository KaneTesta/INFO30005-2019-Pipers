$(document).on('transition', () => {
  // Setup recipe buttons
  $('.button-recipe').on('click', function (e) {
    e.preventDefault();

    const $element = $(this);
    const params = {
      id: $element.attr('data-id'),
      q: window.location.href,
    };

    const url = `/result/${$element.attr('data-step')}/?${jQuery.param(params)}`;
    // Check smoothState
    const $main = $('#Main');
    const smoothState = $main.data('smoothState');
    if (smoothState !== undefined) {
      $main.attr('data-transition', 'page-right');
      $main.attr('data-progress-extra', 'true');
      smoothState.load(url);
    } else {
      window.location.assign(url);
    }
  });

  // Handle ingredient lists
  const recipeCleanup = $('#RecipeCleanup');
  if (recipeCleanup) {
    $.getJSON('/api/ingredients',
      /**
             * Get ingredients from server
             * @param {[string]} data
             */
      (data) => {
        function findIngredient(ingredient) {
          return data.find(el => el.name.toLowerCase() === ingredient);
        }

        // Set ingredients
        recipeCleanup.children().each(function () {
          const $el = $(this);
          const ingredient = $el.attr('data-ingredient');
          $el.html(ingredient);
        });
      });
  }
});
