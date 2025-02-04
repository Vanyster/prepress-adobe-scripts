/*
<javascriptresource>
<name>Add Bleed to Images...</name>
<category>2</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

#target Photoshop
#include "../.lib/commons.js"

var dialog = new Dialog(R.string.add_bleed_to_images, "add-bleed-to-images/")
var lengthEdit
var anchorGroup
var flattenImageCheck, guidesMultiRadioGroup, selectBleedCheck, correctionEdit
var config = configs.resolve("images/add_bleed")

dialog.vgroup(function(main) {
  main.alignChildren = "fill"
  main.hgroup(function(group) {
    group.helpTips = R.string.tip_addbleedtoimages_bleed
    group.leftStaticText([120, 21], R.string.length)
    lengthEdit = group.editText([200, 21], config.getString("length", "2.5 mm")).also(function(it) {
      it.validateUnits()
      it.activate()
    })
  })
  main.hgroup(function(topGroup) {
    topGroup.alignChildren = "fill"
    topGroup.vpanel(R.string.anchor, function(panel) {
      anchorGroup = new AnchorGroup(panel)
    })
    topGroup.vpanel(R.string.options, function(group) {
      group.alignChildren = "fill"
      flattenImageCheck = group.checkBox(undefined, R.string.flatten_image).also(function(it) {
        it.helpTip = R.string.tip_addbleedtoimages_flatten
        it.select()
      })
      guidesMultiRadioGroup = new MultiRadioGroup(group, R.string.use_guides,
        [R.string.append, R.string.replace]).also(function(it) {
        it.setHelpTips(R.string.tip_addbleedtoimages_guides)
        it.check.select()
        it.check.onClick()
      })
      group.hgroup(function(innerGroup) {
        innerGroup.helpTips = R.string.tip_addbleedtoimages_select
        selectBleedCheck = innerGroup.checkBox(undefined, R.string.message_addbleedtoimages_select).also(function(it) {
          it.addClickListener(function() {
            correctionEdit.enabled = it.value
            if (it.value) {
              correctionEdit.activate()
            } else {
              lengthEdit.activate()
            }
          })
        })
        correctionEdit = innerGroup.editText([50, 21], "0 px").also(function(it) {
          it.validateUnits()
          it.enabled = false
        })
        innerGroup.staticText(undefined, R.string.correction)
      })
    })
  })
})
dialog.setCancelButton()
dialog.setDefaultButton(undefined, function() {
  var bleed = new UnitValue(lengthEdit.text)
  var anchor = anchorGroup.getAnchorPosition()
  var correction = parseUnits(correctionEdit.text)

  process(document, bleed, anchor, correction)
})
dialog.setYesButton("All", function() {
  var bleed = new UnitValue(lengthEdit.text)
  var anchor = anchorGroup.getAnchorPosition()
  var correction = parseUnits(correctionEdit.text)
  var progress = new ProgressPalette(app.documents.length, R.string.adding_bleed)

  Collections.forEach(app.documents, function(document) {
    progress.increment()
    process(document, bleed, anchor, correction)
  })
})
dialog.show()

function process(document, bleed, anchor, correction) {
  app.activeDocument = document
  var pushLeft = false, pushTop = false, pushRight = false, pushBottom = false
  var guideLeft = false, guideTop = false, guideRight = false, guideBottom = false
  var targetWidth = document.width, targetHeight = document.height

  if (anchorGroup.isCenter()) {
    pushTop = true
    pushBottom = true
    pushLeft = true
    pushRight = true
    targetWidth += bleed * 2
    targetHeight += bleed * 2
  } else {
    if (anchorGroup.isHorizontalTop()) {
      pushBottom = true
      targetHeight += bleed
    } else if (anchorGroup.isHorizontalBottom()) {
      pushTop = true
      targetHeight += bleed
    }
    if (anchorGroup.isVerticalLeft()) {
      pushRight = true
      targetWidth += bleed
    } else if (anchorGroup.isVerticalRight()) {
      pushLeft = true
      targetWidth += bleed
    }
  }

  if (guidesMultiRadioGroup.isSelected()) {
    if (guidesMultiRadioGroup.getSelectedRadioIndex() === 1) {
      while (document.guides.length > 0) { // TODO: find out why forEach only clearing parts
        document.guides[0].remove()
      }
    }
    guideLeft = document.guides.add(Direction.VERTICAL, 0)
    guideTop = document.guides.add(Direction.HORIZONTAL, 0)
    guideRight = document.guides.add(Direction.VERTICAL, document.width)
    guideBottom = document.guides.add(Direction.HORIZONTAL, document.height)
  }
  if (flattenImageCheck.value) {
    document.flatten()
  }
  document.resizeCanvas(targetWidth, targetHeight, anchor)
  if (selectBleedCheck.value) {
    var left = guideLeft.coordinate.as("px") + (pushLeft ? correction : 0)
    var top = guideTop.coordinate.as("px") + (pushTop ? correction : 0)
    var right = guideRight.coordinate.as("px") - (pushRight ? correction : 0)
    var bottom = guideBottom.coordinate.as("px") - (pushBottom ? correction : 0)
    document.selection.select([
      [left, top],
      [left, bottom],
      [right, bottom],
      [right, top]
    ])
    document.selection.invert()
  }

  config.edit(function(it) {
    it.setString("length", lengthEdit.text)
  })
}
