#target Illustrator
#include '../.lib/commons.js'

var IMPOSITIONS = ['2-Up', '4-Up', '8-Up', 'Saddle Stitch']

var BOUNDS_TEXT = [40, 21]
var BOUNDS_EDIT = [120, 21]

var dialog = new Dialog('Rename as Imposition')
var startEdit, impositionList, nupGroup

dialog.vgroup(function(main) {
    main.hgroup(function(group) {
        group.tips('Imposition range')
        group.staticText(BOUNDS_TEXT, 'Start:').also(JUSTIFY_RIGHT)
        startEdit = group.editText(BOUNDS_EDIT, '1').also(function(it) {
            it.validateDigits()
            it.activate()
        })
    })
    main.hgroup(function(group) {
        group.tips('Imposition type')
        group.staticText(BOUNDS_TEXT, 'Mode:').also(JUSTIFY_RIGHT)
        impositionList = group.dropDownList(BOUNDS_EDIT, IMPOSITIONS).also(function(it) {
            it.selectText('2-Up')
            it.onChange = function() {
                var checksEnabled = it.selection.text !== 'Saddle Stitch'
                nupGroup.duplexCheck.enabled = checksEnabled
                nupGroup.perfectBoundCheck.enabled = checksEnabled
            }
        })
    })
    nupGroup = new NUpOptionsGroup(main, false, true, true).also(function(it) {
        it.main.alignChildren = 'right'
        it.main.orientation = 'column'
    })
})
dialog.setCancelButton()
dialog.setDefaultButton(undefined, function() {
    var start = parseInt(startEdit.text) - 1

    if (impositionList.selection.text === '2-Up') {
        if (!nupGroup.isPerfectBound()) {
            if (!nupGroup.isDuplex()) {
                new TwoUpSimplexPager(document, start).forEachArtboard(function() { })
            } else {
                new TwoUpDuplexPager(document, start).forEachArtboard(function() { })
            }
        } else {
            if (!nupGroup.isDuplex()) {
                new TwoUpSimplexPerfectBoundPager(document, start).forEachArtboard(function() { })
            } else {
                new TwoUpDuplexPerfectBoundPager(document, start).forEachArtboard(function() { })
            }
        }
    } else if (impositionList.selection.text === '4-Up') {
        if (!nupGroup.isPerfectBound()) {
            if (!nupGroup.isDuplex()) {
                new FourUpSimplexPager(document, start).forEachArtboard(function() { })
            } else {
                new FourUpDuplexPager(document, start).forEachArtboard(function() { })
            }
        } else {
            if (!nupGroup.isDuplex()) {
                new FourUpSimplexPerfectBoundPager(document, start).forEachArtboard(function() { })
            } else {
                new FourUpDuplexPerfectBoundPager(document, start).forEachArtboard(function() { })
            }
        }
    } else if (impositionList.selection.text === '8-Up') {
        if (!nupGroup.isPerfectBound()) {
            if (!nupGroup.isDuplex()) {
                new EightUpSimplexPager(document, start).forEachArtboard(function() { })
            } else {
                new EightUpDuplexPager(document, start).forEachArtboard(function() { })
            }
        } else {
            if (!nupGroup.isDuplex()) {
                new EightUpSimplexPerfectBoundPager(document, start).forEachArtboard(function() { })
            } else {
                new EightUpDuplexPerfectBoundPager(document, start).forEachArtboard(function() { })
            }
        }
    } else if (impositionList.selection.text === 'Saddle Stitch') {
        new SaddleStitchPager(document, start).forEachArtboard(function() { })
    }
})
dialog.show()