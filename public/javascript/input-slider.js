$(document).on("transition", function () {
    $(".slider").each(function () {
        // Get values
        let $slider = $(this);
        let $sliderValue = $("#" + $slider.attr("data-labelid"));
        let sliderMin = parseInt($slider.attr("data-min"));
        let sliderMax = parseInt($slider.attr("data-max"));
        let sliderStep = parseInt($slider.attr("data-step"));
        let sliderValue = parseInt($slider.attr("data-value"));
        // Setup slider
        $slider.slider({
            range: "min",
            min: sliderMin,
            max: sliderMax,
            step: sliderStep,
            value: sliderValue,
            slide: function (event, ui) {
                $sliderValue.html(ui.value);
            }
        });

        // Set default value
        $sliderValue.html($slider.slider("value"));
        // Finish setup
        $slider.removeClass("slider");
    });
});
