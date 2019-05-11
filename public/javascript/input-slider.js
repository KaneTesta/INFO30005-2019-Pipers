$(document).on("transition", function () {
    $(".slider").each(function () {
        // Get values
        let $slider = $(this);
        let $sliderValue = $("#" + $slider.attr("data-labelid"));
        let sliderMin = parseInt($slider.attr("data-min"));
        let sliderMax = parseInt($slider.attr("data-max"));
        let sliderStep = parseInt($slider.attr("data-step"));
        let sliderValue = parseInt($slider.attr("data-value"));

        let sliderMapRaw = $slider.attr("data-map");
        let sliderMap = undefined;
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
            $slider.attr("data-value", mappedValue);
        }

        // Setup slider
        $slider.slider({
            range: "min",
            min: sliderMin,
            max: sliderMax,
            step: sliderStep,
            value: sliderValue,
            slide: function (event, ui) {
                setValue(ui.value);
            }
        });

        // Set default value
        setValue($slider.slider("value"));
        // Finish setup
        $slider.removeClass("slider");
    });
});
