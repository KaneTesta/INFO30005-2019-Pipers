$(document).on('transition', () => {
  $('.slider').each(() => {
    // Get values
    const $slider = $(this);
    const $sliderValue = $(`#${$slider.attr('data-labelid')}`);
    const sliderMin = parseInt($slider.attr('data-min'));
    const sliderMax = parseInt($slider.attr('data-max'));
    const sliderStep = parseInt($slider.attr('data-step'));
    const sliderValue = parseInt($slider.attr('data-value'));

    const sliderMapRaw = $slider.attr('data-map');
    let sliderMap;
    if (sliderMapRaw) {
      sliderMap = JSON.parse(sliderMapRaw);
    }

    function setValue(value) {
      let mappedValue = null;
      if (sliderMap) {
        mappedValue = sliderMap[value];
      } else {
        mappedValue = value;
      }

      $sliderValue.html(mappedValue);
      $slider.attr('data-value', mappedValue);
    }

    // Setup slider
    $slider.slider({
      range: 'min',
      min: sliderMin,
      max: sliderMax,
      step: sliderStep,
      value: sliderValue,
      slide(event, ui) {
        setValue(ui.value);
      },
    });

    // Set default value
    setValue($slider.slider('value'));
    // Finish setup
    $slider.removeClass('slider');
  });
});
