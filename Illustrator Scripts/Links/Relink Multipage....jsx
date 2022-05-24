#target Illustrator
#include '../.lib/commons.js'

var BOUNDS_TEXT = [50, 21]
var BOUNDS_EDIT = [120, 21]

checkHasSelection()

var items = selection.filterItem(function (it) { return it.typename === 'PlacedItem' })
check(items.isNotEmpty(), 'No links found in selection')

var dialog = new Dialog('Relink Multipage', 'relinking-files#relink-multipage--f7')
var pdfPanel, rangeGroup, orderByGroup, maintainSizeGroup

var files = openFile(dialog.getTitle(), [
  FILTERS_ADOBE_ILLUSTRATOR, FILTERS_ADOBE_PDF,
  FILTERS_BMP, FILTERS_GIF89a, FILTERS_JPEG, FILTERS_JPEG2000, FILTERS_PNG, FILTERS_PHOTOSHOP, FILTERS_TIFF
], true)

if (files !== null && files.isNotEmpty()) {
  var collection = new FileCollection(files)

  dialog.vgroup(function (main) {
    main.alignChildren = 'right'
    if (collection.hasPDF) {
      pdfPanel = new OpenPDFPanel(main, BOUNDS_TEXT, BOUNDS_EDIT)
    }
    main.vpanel('Pages', function (panel) {
      panel.hgroup(function (group) {
        group.tips('Which pages should be used when opening a multipage document')
        group.staticText(BOUNDS_TEXT, 'Pages:').also(JUSTIFY_RIGHT)
        rangeGroup = new RangeGroup(group, BOUNDS_EDIT).also(function (it) {
          it.startEdit.activate()
          it.endEdit.text = collection.length
        })
      })
    })
    orderByGroup = new OrderByGroup(main, [ORDER_LAYERS, ORDER_POSITIONS]).also(function (group) {
      group.list.selectText('Reversed')
    })
    maintainSizeGroup = new MaintainSizeGroup(main)
  })
  dialog.setCancelButton()
  dialog.setDefaultButton(undefined, function () {
    var current = rangeGroup.getStart()
    var end = rangeGroup.getEnd()

    var progress = new ProgressPalette(items.length, 'Linking files')
    orderByGroup.forEach(items, function (item, i) {
      print(i + '. ')
      var width = item.width
      var height = item.height
      var position = item.position
      var file = collection.get(current)
      if (file.isPDF() && item.isFileExists() && item.file.isPDF()) {
        progress.increment('Linking page {0}', current + 1)
        print('Appling PDF fix, ')
        item.file = getImage('relink_fix')
      } else {
        progress.increment('Linking file {0}', unescape(file.name))
      }
      item.file = file
      current++
      if (current > end) {
        current--
      }
      if (maintainSizeGroup.isSelected()) {
        print('Keep size, ')
        item.width = width
        item.height = height
        item.position = position
      }
      println('Done')
    })
    selection = items
  })
  dialog.show()
}