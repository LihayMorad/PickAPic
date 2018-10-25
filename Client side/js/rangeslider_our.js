var $element = $('input[type="range"]');
var $document = $(document);
var selector = '[data-rangeslider]';
var $inputRange;
const cssClasses = [
    'rangeslider--is-lowest-value',
    'rangeslider--is-highest-value'
  ];
  
$element
    .rangeslider({
        polyfill: false,
        onInit: function () {
            var $handle = $('.rangeslider__handle', this.$range);
            updateHandle($handle[0], this.value);
        },
        onSlideEnd: function (position, value) {
            console.log("radiusSlider ended with value of: " + value);
            google.maps.event.trigger(map, 'idle');
        }
    })
    .on('input', function (e) {
        var $handle = $('.rangeslider__handle', e.target.nextSibling);
        const fraction = (this.value - this.min) / (this.max - this.min);
        if (fraction === 0) {
            this.nextSibling.classList.add(cssClasses[0]);
        } else if (fraction === 1) {
            this.nextSibling.classList.add(cssClasses[1]);
        } else {
            this.nextSibling.classList.remove(...cssClasses)
        }
        updateHandle($handle[0], this.value);
    });

function updateHandle(el, val) {
    el.textContent = val;
}

$document.on('click', '#radiusSlider button[data-behaviour="toggle"]', function (e) {
    $inputRange = $(selector, e.target.parentNode);
    if (!$("#radiusSlider").hasClass("disabled")) {
        $('#radiusSliderInput').val(0).change();
        if ($inputRange[0].disabled) {
            $inputRange.prop("disabled", false);
        }
        else {
            $inputRange.prop("disabled", true);
        }
        $inputRange.rangeslider('update');
    }
    else {
        $inputRange.prop("disabled", true);
    }
    google.maps.event.trigger(map, 'idle');
});