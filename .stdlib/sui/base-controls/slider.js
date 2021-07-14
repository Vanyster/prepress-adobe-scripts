/*
<javascriptresource>
<menu>hide</menu>
</javascriptresource>
*/

/**
 * Add slider to group.
 * @returns {Slider}
 */
Group.prototype.slider = function(bounds, current, start, end) {
    return _slider(this, bounds, current, start, end)
}

/**
 * Add slider to panel.
 * @returns {Slider}
 */
Panel.prototype.slider = function(bounds, current, start, end) {
    return _slider(this, bounds, current, start, end)
}

function _slider(parent, bounds, current, start, end) {
    var slider = parent.add('slider', _expandBounds(bounds), current, start, end)
    if (parent.tooltips !== undefined) {
        _setTooltip(slider, parent.tooltips)
    }
    return slider
}