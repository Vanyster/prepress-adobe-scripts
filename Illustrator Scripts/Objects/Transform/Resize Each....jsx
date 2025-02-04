#target Illustrator
#include "../../.lib/commons.js"

var SIZE_INPUT = [170, 21]
var SIZE_INPUT_CHECK = [14, 14]

checkHasSelection()

var dialog = new Dialog(R.string.resize_each, "resizing-rasterizing-each/#resize-each")
var prefill = Collections.first(selection)
var widthEdit, widthCheck, heightEdit, heightCheck
var changePositionsCheck, changeFillPatternsCheck, changeFillGradientsCheck, changeStrokePatternsCheck
var documentOriginCheck, anchorGroup
var recursiveCheck
var config = configs.resolve("objects/resize_each")

dialog.vgroup(function(main) {
  main.vgroup(function(topGroup) {
    topGroup.alignChildren = "right"
    topGroup.hgroup(function(group) {
      group.leftStaticText(undefined, R.string.width)
      widthEdit = group.editText(SIZE_INPUT, formatUnits(prefill.width, unitName, 2)).also(function(it) {
        it.validateUnits()
        it.activate()
      })
      widthCheck = group.checkBox(SIZE_INPUT_CHECK).also(function(it) {
        it.select()
        it.addClickListener(function() { widthEdit.enabled = it.value })
      })
    })
    topGroup.hgroup(function(group) {
      group.leftStaticText(undefined, R.string.height)
      heightEdit = group.editText(SIZE_INPUT, formatUnits(prefill.height, unitName, 2)).also(VALIDATE_UNITS)
      heightCheck = group.checkBox(SIZE_INPUT_CHECK).also(function(it) {
        it.select()
        it.addClickListener(function() { heightEdit.enabled = it.value })
      })
    })
  })
  main.hgroup(function(group) {
    group.alignChildren = "fill"
    group.vpanel(R.string.change, function(panel) {
      panel.alignChildren = "fill"
      changePositionsCheck = panel.checkBox(undefined, R.string.positions).also(function(it) {
        it.helpTip = R.string.tip_resizeeach_option1
        it.value = config.getBoolean("option1")
      })
      changeFillPatternsCheck = panel.checkBox(undefined, R.string.fill_patterns).also(function(it) {
        it.helpTip = R.string.tip_resizeeach_option2
        it.value = config.getBoolean("option2")
      })
      changeFillGradientsCheck = panel.checkBox(undefined, R.string.fill_gradients).also(function(it) {
        it.helpTip = R.string.tip_resizeeach_option3
        it.value = config.getBoolean("option3")
      })
      changeStrokePatternsCheck = panel.checkBox(undefined, R.string.stroke_patterns).also(function(it) {
        it.helpTip = R.string.tip_resizeeach_option4
        it.value = config.getBoolean("option4")
      })
    })
    group.vpanel(R.string.anchor, function(panel) {
      panel.alignChildren = "fill"
      documentOriginCheck = new DocumentOriginCheck(panel).also(function(it) {
        it.addClickListener(function() { anchorGroup.enabled = !it.value })
      })
      anchorGroup = new AnchorGroup(panel)
    })
  })
  main.hgroup(function(group) {
    group.alignment = "right"
    recursiveCheck = new RecursiveCheck(group).also(function(it) {
      it.value = config.getBoolean("recursive")
    })
  })
})
dialog.setCancelButton()
dialog.setDefaultButton(undefined, function() {
  var width = parseUnits(widthEdit.text)
  var height = parseUnits(heightEdit.text)
  var transformation = documentOriginCheck.value ? Transformation.DOCUMENTORIGIN : anchorGroup.getTransformation()

  var action = function(item, i) {
    print(i + ". ")
    var scaleX = !widthCheck.value ? 100 : 100 * width / item.width
    var scaleY = !heightCheck.value ? 100 : 100 * height / item.height
    if (!isFinite(scaleX)) {
      scaleX = 100
    }
    if (!isFinite(scaleY)) {
      scaleY = 100
    }
    println("Scale X=%d Y=%d.", scaleX, scaleY)
    item.resize(scaleX, scaleY,
      changePositionsCheck.value,
      changeFillPatternsCheck.value,
      changeFillGradientsCheck.value,
      changeStrokePatternsCheck.value,
      100,
      transformation)
  }
  if (recursiveCheck.value) {
    Collections.forEachItem(selection, action)
  } else {
    Collections.forEach(selection, action)
  }

  config.setBoolean("option1", changePositionsCheck.value)
  config.setBoolean("option2", changeFillPatternsCheck.value)
  config.setBoolean("option3", changeFillGradientsCheck.value)
  config.setBoolean("option4", changeStrokePatternsCheck.value)
  config.setBoolean("recursive", recursiveCheck.value)
})
dialog.show()
