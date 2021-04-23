#target Illustrator
#include '../.lib/commons.js'
#include '../.lib/ui/checks.js'
#include '../.lib/ui/open-options.js'

checkHasSelection()

var items = selection.filterItem(function(it) { return it.typename === 'PlacedItem' })
check(items.isNotEmpty(), 'No links found in selection')

var dialog = new Dialog('Relink Multipage', 'fill')
var pdfPanel, maintainGroup, reverseGroup
var startPageEdit, endPageEdit

var files = openFile(dialog.title, [
    ['Adobe Illustrator', 'AI'],
    ['Adobe PDF', 'PDF'],
    ['BMP', 'BMP'],
    ['GIF89a', 'GIF'],
    ['JPEG', 'JPG', 'JPE', 'JPEG'],
    ['JPEG2000', 'JPF', 'JPX', 'JP2', 'J2K', 'J2C', 'JPC'],
    ['PNG', 'PNG', 'PNS'],
    ['Photoshop', 'PSD', 'PSB', 'PDD'],
    ['TIFF', 'TIF', 'TIFF']
], true)

if (files !== null && files.isNotEmpty()) {
    if (files.filter(function(it) { return it.isPDF() }).isNotEmpty()) {
        check(files.length === 1, 'Only supports single PDF file')
    } else {
        check(files.length > 1, 'Only single image file selected, use Relink Same File instead')
    }

    var textBounds = [70, 21]
    var editBounds = [100, 21]

    if (files.first().isPDF()) {
        pdfPanel = new OpenPDFOptionsPanel(dialog.main, textBounds, editBounds)
        pdfPanel.main.hgroup(function(group) {
            group.setHelpTips('Beginning page of PDF file.')
            group.staticText(textBounds, 'Start page:', JUSTIFY_RIGHT)
            startPageEdit = group.editText(editBounds, '1', VALIDATE_DIGITS)
        })
        pdfPanel.main.hgroup(function(group) {
            group.setHelpTips('Final page of PDF file.')
            group.staticText(textBounds, 'End page:', JUSTIFY_RIGHT)
            endPageEdit = group.editText(editBounds, undefined, function(it) {
                it.validateDigits()
                it.activate()  
            })
        })
    }
    maintainGroup = new MaintainDimensionGroup(dialog.main)
    reverseGroup = new ReverseOrderGroup(dialog.main)

    dialog.setNegativeButton('Cancel')
    dialog.setPositiveButton(function() {
        var resetPage, currentPage, endPage
        if (files.first().isPDF()) {
            resetPage = function() { currentPage = parseInt(startPageEdit.text) || 1 }
            endPage = parseInt(endPageEdit.text) || 1
        } else { 
            resetPage = function() { currentPage = 0 }
            endPage = files.lastIndex()
        }
        resetPage()
        reverseGroup.forEachAware(items, function(item) {
            var width = item.width
            var height = item.height
            var position = item.position
            if (files.first().isPDF()) {
                try {
                    // code below will throw error if PlacedItem file is missing, ignore for now
                    if (item.file !== undefined && item.file.equalTo(files.first())) {
                        item.file = getResource(R.png.blank)
                    }
                } catch (e) {
                    $.writeln(e.message)
                }
                setPDFPage(currentPage++, pdfPanel.getBoxType())
                item.relink(files.first())
            } else {
                item.relink(files[currentPage++])
            }
            if (dimensionPanel.isMaintain()) {
                item.width = width
                item.height = height
                item.position = position
            }
            if (currentPage > endPage) {
                resetPage()
            }
        })
    })
    dialog.show()
}