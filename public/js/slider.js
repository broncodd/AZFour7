const $element = $('input[type="range"]');
const $tooltip = $('#range-tooltip');
const sliderStates = [
    {name: "red", tooltip: "Red will win! You are %_____ confident that the opponent (red chips) will win.", range: _.range(-100, -5) },
    {name: "tie", tooltip: "You believe that the game will end in a tie (neither yellow nor red will win).", range: _.range(-5, 5)},
    {name: "yellow", tooltip: "Yellow will win! You are %____ confident that you (yellow chips) will win.", range: _.range(5, 100) },
];
var currentState;
var $handle;
var confValue = document.getElementById("winConfValue");
var output = document.getElementById("demo");


$element
    .rangeslider({
        polyfill: false,
        onInit: function() {
            $handle = $('.rangeslider__handle', this.$range);
            updateHandle($handle[0], Math.abs(this.value));
            updateState($handle[0], this.value);
        }
    })
    .on('input', function() {
        updateHandle($handle[0], Math.abs(this.value)+'%');
        checkState($handle[0], this.value);
    });

// Update the value inside the slider handle
function updateHandle(el, val) {
    el.textContent = val;
}

// Check if the slider state has changed
function checkState(el, val) {
    // if the value does not fall in the range of the current state, update it.
    if (!_.contains(currentState.range, parseInt(val))) {
        updateState(el, val);
    }
}

// Change the state of the slider
function updateState(el, val) {
    for (var j = 0; j < sliderStates.length; j++){
        if (_.contains(sliderStates[j].range, parseInt(val))) {
            currentState = sliderStates[j];
            // updateSlider();
        }
    }
    // If the state is tie, update the handle to read Tie
    if (currentState.name == "tie") {
        updateHandle($handle[0], "Tie");
    }
    // Update handle color
    $handle
        .removeClass (function (index, css) {
            return (css.match (/(^|\s)js-\S+/g) ||   []).join(' ');
        })
        .addClass("js-" + currentState.name);
    // Update tooltip
    $tooltip.html(currentState.tooltip);
}