// Rotate all items to target size regardless of their XY positions.

#target Illustrator
#include '../../.lib/commons.js'
#include '../../.lib/ui/item-transform.js'

var BOUNDS_EDIT = [150, 21]

checkHasSelection()

var dialog = new Dialog('Rotate')
var angleEdit, changePanel, anchorPanel

dialog.vpanel(dialog.title, function(panel) {
    panel.hgroup(function(group) {
        group.staticText(undefined, 'Angle:', JUSTIFY_RIGHT)
        angleEdit = group.editText(BOUNDS_EDIT, '0', function(it) {
            it.validateDigits()
            it.activate()
        })
    })
})

dialog.hgroup(function(group) {
    group.alignChildren = 'fill'    
    changePanel = new ItemChangePanel(group)
    anchorPanel = new ItemAnchorPanel(group)
})

dialog.setNegativeButton('Cancel')
dialog.setPositiveButton(function() {
    var angle = parseInt(angleEdit.text)
    if (angle != 0) {
        selection.forEachItem(function(it) {
            it.rotate(angle,
                changePanel.isPositions(),
                changePanel.isFillPatterns(),
                changePanel.isFillGradients(),
                changePanel.isStrokePatterns(),
                anchorPanel.getTransformation())
        })
    }
})
dialog.show()