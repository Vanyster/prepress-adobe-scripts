#target Illustrator
#include '../.lib/commons.js'

var dialog = new Dialog('Group by Artboards')
var groupRadio, clipGroupRadio

dialog.vgroup(function(main) {
  main.hgroup(function(group) {
    group.tips('Should the objects within artboards be clipped?')
    group.staticText(undefined, 'Type:').also(JUSTIFY_RIGHT)
    groupRadio = group.radioButton(undefined, 'Group').also(SELECTED)
    clipGroupRadio = group.radioButton(undefined, 'Clip Group')
  })
})
dialog.setCancelButton()
dialog.setDefaultButton(undefined, function() {
})
dialog.show()