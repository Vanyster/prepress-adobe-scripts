﻿#target Illustrator
#include "../.lib/commons.js"

checkHasSelection()

var SIZE_INPUT = [110, 21]
var SIZE_CHECK = [15, 15] // usually 14, but use 15 to stretch the size equalling left panel

var dialog = new Dialog(R.string.add_trim_marks, "add-trim-marks/")
var offsetEdit, lengthEdit, weightEdit, colorList
var topLeftCheck, topRightCheck, leftTopCheck, rightTopCheck, leftBottomCheck, rightBottomCheck, bottomLeftCheck, bottomRightCheck // single checks
var topCheck, rightCheck, bottomCheck, leftCheck // multiple checks
var multipleMultiRadioGroup
var config = configs.resolve("objects/add_trim_marks")

dialog.vgroup(function(main) {
  main.alignChildren = "right"
  main.hgroup(function(topGroup) {
    topGroup.alignChildren = "fill"
    topGroup.vpanel(R.string.trim_marks, function(panel) {
      panel.alignChildren = "right"
      panel.hgroup(function(group) {
        group.helpTips = R.string.tip_addtrimmarks_offset
        group.leftStaticText(undefined, R.string.offset)
        offsetEdit = group.editText(SIZE_INPUT, config.getString("offset", "2.5 mm")).also(function(it) {
          it.validateUnits()
          it.activate()
        })
      })
      panel.hgroup(function(group) {
        group.helpTips = R.string.tip_addtrimmarks_length
        group.leftStaticText(undefined, R.string.length)
        lengthEdit = group.editText(SIZE_INPUT, config.getString("length", "2.5 mm")).also(VALIDATE_UNITS)
      })
      panel.hgroup(function(group) {
        group.helpTips = R.string.tip_addtrimmarks_weight
        group.leftStaticText(undefined, R.string.weight)
        weightEdit = group.editText(SIZE_INPUT, config.getString("weight", "0.3 pt")).also(VALIDATE_UNITS) // the same value used in `Object > Create Trim Marks`
      })
      panel.hgroup(function(group) {
        group.helpTips = R.string.tip_addtrimmarks_color
        group.leftStaticText(undefined, R.string.color)
        colorList = group.dropDownList(SIZE_INPUT, Color2.list()).also(function(it) {
          it.selection = config.getInt("color")
        })
      })
    })
    topGroup.vpanel(R.string.locations, function(panel) {
      panel.hgroup(function(group) {
        group.staticText(SIZE_CHECK)
        topLeftCheck = group.checkBox(SIZE_CHECK).also(function(it) {
          it.select()
          it.helpTip = R.string.top
        })
        topCheck = group.checkBox(SIZE_CHECK).also(function(it) {
          it.select()
          it.helpTip = R.string.top
          it.visible = false
        })
        topRightCheck = group.checkBox(SIZE_CHECK).also(function(it) {
          it.select()
          it.helpTip = R.string.top
        })
        group.staticText(SIZE_CHECK)
      })
      panel.hgroup(function(group) {
        leftTopCheck = group.checkBox(SIZE_CHECK).also(function(it) {
          it.select()
          it.helpTip = R.string.left
        })
        group.image(SIZE_CHECK, "ic_arrow_topleft")
        group.image(SIZE_CHECK, "ic_arrow_top")
        group.image(SIZE_CHECK, "ic_arrow_topright")
        rightTopCheck = group.checkBox(SIZE_CHECK).also(function(it) {
          it.select()
          it.helpTip = R.string.right
        })
      })
      panel.hgroup(function(group) {
        leftCheck = group.checkBox(SIZE_CHECK).also(function(it) {
          it.select()
          it.helpTip = R.string.left
          it.visible = false
        })
        group.image(SIZE_CHECK, "ic_arrow_left")
        group.image(SIZE_CHECK, "ic_arrow_center")
        group.image(SIZE_CHECK, "ic_arrow_right")
        rightCheck = group.checkBox(SIZE_CHECK).also(function(it) {
          it.select()
          it.helpTip = R.string.right
          it.visible = false
        })
      })
      panel.hgroup(function(group) {
        leftBottomCheck = group.checkBox(SIZE_CHECK).also(function(it) {
          it.select()
          it.helpTip = R.string.left
        })
        group.image(SIZE_CHECK, "ic_arrow_bottomleft")
        group.image(SIZE_CHECK, "ic_arrow_bottom")
        group.image(SIZE_CHECK, "ic_arrow_bottomright")
        rightBottomCheck = group.checkBox(SIZE_CHECK).also(function(it) {
          it.select()
          it.helpTip = R.string.right
        })
      })
      panel.hgroup(function(group) {
        group.staticText(SIZE_CHECK)
        bottomLeftCheck = group.checkBox(SIZE_CHECK).also(function(it) {
          it.select()
          it.helpTip = R.string.bottom
        })
        bottomCheck = group.checkBox(SIZE_CHECK).also(function(it) {
          it.select()
          it.helpTip = R.string.bottom
          it.visible = false
        })
        bottomRightCheck = group.checkBox(SIZE_CHECK).also(function(it) {
          it.select()
          it.helpTip = R.string.bottom
        })
        group.staticText(SIZE_CHECK)
      })
    })
  })
  multipleMultiRadioGroup = new MultiRadioGroup(main, R.string.multiple_target,
    [R.string.default, R.string.recursive]).also(function(it) {
    it.setHelpTips(R.string.tip_addtrimmarks_multipletarget)
    it.check.addClickListener(function() {
      topLeftCheck.visible = !it.isSelected()
      topRightCheck.visible = !it.isSelected()
      leftTopCheck.visible = !it.isSelected()
      rightTopCheck.visible = !it.isSelected()
      leftBottomCheck.visible = !it.isSelected()
      rightBottomCheck.visible = !it.isSelected()
      bottomLeftCheck.visible = !it.isSelected()
      bottomRightCheck.visible = !it.isSelected()
      leftCheck.visible = it.isSelected()
      topCheck.visible = it.isSelected()
      rightCheck.visible = it.isSelected()
      bottomCheck.visible = it.isSelected()
    })
  })
})
dialog.setCancelButton()
dialog.setDefaultButton(undefined, function() {
  var offset = parseUnits(offsetEdit.text)
  var length = parseUnits(lengthEdit.text)
  var weight = parseUnits(weightEdit.text)
  var color = Color2.valueOf(colorList.selection)
  var maxBounds = Items.getMaxBounds(selection)
  selection = multipleMultiRadioGroup.isSelected()
    ? processMultiple(offset, length, weight, color, maxBounds)
    : processSingle(offset, length, weight, color, maxBounds)

  config.setString("offset", offsetEdit.text)
  config.setString("length", lengthEdit.text)
  config.setString("weight", weightEdit.text)
  config.setInt("color", colorList.selection.index)
})
dialog.show()

function processSingle(offset, length, weight, color, maxBounds) {
  var paths = []
  if (topLeftCheck.value) {
    paths.push(createTrimMark(
      weight, color, "TOP",
      maxBounds.getLeft(),
      maxBounds.getTop() + offset,
      maxBounds.getLeft(),
      maxBounds.getTop() + offset + length
    ))
  }
  if (topRightCheck.value) {
    paths.push(createTrimMark(
      weight, color, "TOP",
      maxBounds.getRight(),
      maxBounds.getTop() + offset,
      maxBounds.getRight(),
      maxBounds.getTop() + offset + length
    ))
  }
  if (rightTopCheck.value) {
    paths.push(createTrimMark(
      weight, color, "RIGHT",
      maxBounds.getRight() + offset,
      maxBounds.getTop(),
      maxBounds.getRight() + offset + length,
      maxBounds.getTop()
    ))
  }
  if (rightBottomCheck.value) {
    paths.push(createTrimMark(
      weight, color, "RIGHT",
      maxBounds.getRight() + offset,
      maxBounds.getBottom(),
      maxBounds.getRight() + offset + length,
      maxBounds.getBottom()
    ))
  }
  if (bottomRightCheck.value) {
    paths.push(createTrimMark(
      weight, color, "BOTTOM",
      maxBounds.getRight(),
      maxBounds.getBottom() - offset,
      maxBounds.getRight(),
      maxBounds.getBottom() - offset - length
    ))
  }
  if (bottomLeftCheck.value) {
    paths.push(createTrimMark(
      weight, color, "BOTTOM",
      maxBounds.getLeft(),
      maxBounds.getBottom() - offset,
      maxBounds.getLeft(),
      maxBounds.getBottom() - offset - length
    ))
  }
  if (leftBottomCheck.value) {
    paths.push(createTrimMark(
      weight, color, "LEFT",
      maxBounds.getLeft() - offset,
      maxBounds.getBottom(),
      maxBounds.getLeft() - offset - length,
      maxBounds.getBottom()
    ))
  }
  if (leftTopCheck.value) {
    paths.push(createTrimMark(
      weight, color, "LEFT",
      maxBounds.getLeft() - offset,
      maxBounds.getTop(),
      maxBounds.getLeft() - offset - length,
      maxBounds.getTop()
    ))
  }
  return paths
}

function processMultiple(offset, length, weight, color, maxBounds) {
  var paths = []
  var action = function(item) {
    var clippingItem = Items.getClippingItem(item)
    var width = clippingItem.width
    var height = clippingItem.height
    var itemStartX = clippingItem.position.getLeft()
    var itemStartY = clippingItem.position.getTop()
    var itemEndX = itemStartX + width
    var itemEndY = itemStartY - height
    if (topCheck.value) {
      paths.push([
        "TOP",
        itemStartX,
        maxBounds.getTop() + offset,
        itemStartX,
        maxBounds.getTop() + offset + length
      ])
      paths.push([
        "TOP",
        itemEndX,
        maxBounds.getTop() + offset,
        itemEndX,
        maxBounds.getTop() + offset + length
      ])
    }
    if (rightCheck.value) {
      paths.push([
        "RIGHT",
        maxBounds.getRight() + offset,
        itemStartY,
        maxBounds.getRight() + offset + length,
        itemStartY
      ])
      paths.push([
        "RIGHT",
        maxBounds.getRight() + offset,
        itemEndY,
        maxBounds.getRight() + offset + length,
        itemEndY
      ])
    }
    if (bottomCheck.value) {
      paths.push([
        "BOTTOM",
        itemEndX,
        maxBounds.getBottom() - offset,
        itemEndX,
        maxBounds.getBottom() - offset - length
      ])
      paths.push([
        "BOTTOM",
        itemStartX,
        maxBounds.getBottom() - offset,
        itemStartX,
        maxBounds.getBottom() - offset - length
      ])
    }
    if (leftCheck.value) {
      paths.push([
        "LEFT",
        maxBounds.getLeft() - offset,
        itemEndY,
        maxBounds.getLeft() - offset - length,
        itemEndY
      ])
      paths.push([
        "LEFT",
        maxBounds.getLeft() - offset,
        itemStartY,
        maxBounds.getLeft() - offset - length,
        itemStartY
      ])
    }
  }
  if (multipleMultiRadioGroup.getSelectedRadioIndex() === 1) {
    Collections.forEachItem(selection, action)
  } else {
    Collections.forEach(selection, action)
  }
  var distinctPaths = []
  Collections.forEach(paths, function(path) {
    if (!containsPathBounds(distinctPaths, path)) {
      distinctPaths.push(path)
    }
  })
  return Collections.map(distinctPaths, function(it) {
    return createTrimMark(weight, color, it[0], it[1], it[2], it[3], it[4])
  })
}

function containsPathBounds(collection, element) {
  var i = collection.length
  while (i--) {
    var _element = collection[i]
    if (isEqualRounded(_element[1], element[1]) &&
      isEqualRounded(_element[2], element[2]) &&
      isEqualRounded(_element[3], element[3]) &&
      isEqualRounded(_element[4], element[4])) {
      return true
    }
  }
  return false
}

function createTrimMark(weight, color, suffixName, fromX, fromY, toX, toY) {
  println("%d. From [%d, %d] to [%d, %d].", suffixName, fromX, fromY, toX, toY)
  var path = layer.pathItems.add()
  path.name = "Trim" + suffixName
  path.filled = false
  path.strokeDashes = []
  path.strokeColor = color.get()
  path.strokeWidth = weight
  path.setEntirePath([[fromX, fromY], [toX, toY]])
  return path
}
