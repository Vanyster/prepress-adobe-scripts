// Select all items with multiple allowed types.
// When there are active selection, will only select items within those selection.

#target Illustrator
#include '../.lib/commons.js'

var BOUNDS_TYPE = [115, 15]

var dialog = new Dialog('Select by Types')
var placedCheck, nonNativeCheck, rasterCheck, pluginCheck
var pathCheck, compoundPathCheck
var textFrameCheck, legacyTextCheck
var symbolCheck, meshCheck, graphCheck

dialog.vpanel('Imports', function(panel) {
    panel.alignChildren = 'fill'
    panel.hgroup(function(group) {
        placedCheck = group.checkBox(BOUNDS_TYPE, 'Linked File')
        nonNativeCheck = group.checkBox(BOUNDS_TYPE, 'Non-Native Art')
    })
    panel.hgroup(function(group) {
        rasterCheck = group.checkBox(BOUNDS_TYPE, 'Image')
        pluginCheck = group.checkBox(BOUNDS_TYPE, 'Plugin')
    })
})

dialog.vpanel('Paths', function(panel) {
    panel.alignChildren = 'fill'
    panel.hgroup(function(group) {
        pathCheck = group.checkBox(BOUNDS_TYPE, 'Path')
        compoundPathCheck = group.checkBox(BOUNDS_TYPE, 'Compound Path')
    })
})

dialog.vpanel('Types', function(panel) {
    panel.alignChildren = 'fill'
    panel.hgroup(function(group) {
        textFrameCheck = group.checkBox(BOUNDS_TYPE, 'Text Frame')
        legacyTextCheck = group.checkBox(BOUNDS_TYPE, 'Legacy Text')
    })
})

dialog.vpanel('Others', function(panel) {
    panel.alignChildren = 'fill'
    panel.hgroup(function(group) {
        symbolCheck = group.checkBox(BOUNDS_TYPE, 'Symbol')
        meshCheck = group.checkBox(BOUNDS_TYPE, 'Mesh')
    })
    panel.hgroup(function(group) {
        graphCheck = group.checkBox(BOUNDS_TYPE, 'Graph')
    })
})

dialog.setNegativeButton('Cancel')
dialog.setPositiveButton(function() {
    var types = []
    if (compoundPathCheck.value) types.push('CompoundPathItem')
    if (graphCheck.value) types.push('GraphItem')
    if (legacyTextCheck.value) types.push('LegacyTextItem')
    if (meshCheck.value) types.push('MeshItem')
    if (nonNativeCheck.value) types.push('NonNativeItem')
    if (pathCheck.value) types.push('PathItem')
    if (placedCheck.value) types.push('PlacedItem')
    if (pluginCheck.value) types.push('PluginItem')
    if (rasterCheck.value) types.push('RasterItem')
    if (symbolCheck.value) types.push('SymbolItem')
    if (textFrameCheck.value) types.push('TextFrame')
    selectAll(types)
})
dialog.show()