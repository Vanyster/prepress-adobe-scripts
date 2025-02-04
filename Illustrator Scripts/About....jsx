#target Illustrator
#include ".lib/core.js"

var dialog = new Dialog(R.string.about_scripts)
var aboutPanel

var clientDate = parseDate(Scripts.getResource("VERSION").readText())

dialog.vgroup(function(main) {
  main.hgroup(function(group) {
    group.alignChildren = "center"
    group.image(undefined, "logo")
    group.staticText([300, 32], getString(R.string.message_aboutscripts, "Illustrator", clientDate.toISOString()),
      { multiline: true })
  })
  aboutPanel = new AboutPanel(main, clientDate).also(function(panel) {
    panel.preferencesThemeList.addChangeListener(function() {
      configs.setBoolean("theme_dark", panel.preferencesThemeList.selection.index === 0)
    })
    panel.preferencesLanguageList.addChangeListener(function() {
      var language = Language.valueOf(panel.preferencesLanguageList.selection)
      configs.setString("language_code", language.code)
      Language.set(language)
    })
    panel.preferencesClearButton.addClickListener(function() {
      configs.remove("theme_dark")
      configs.remove("language_code")
      configs.resolve("artboards/reorder").run(function(it) { it.remove("order") })
      configs.resolve("dielines").run(function(subconfigs) {
        subconfigs.resolve("add_flap").run(function(it) {
          it.remove("length")
          it.remove("weight")
          it.remove("color")
          it.remove("direction")
        })
        subconfigs.resolve("add_paperbag").run(function(it) {
          it.remove("width")
          it.remove("height")
          it.remove("depth")
          it.remove("upper")
          it.remove("lower")
          it.remove("glue_length")
          it.remove("glue_shear")
          it.remove("stroke_weight")
          it.remove("stroke_color")
        })
      })
      configs.resolve("links").run(function(subconfigs) {
        subconfigs.resolve("change_page").run(function(it) {
          it.remove("order")
          it.remove("recursive")
          it.remove("keep_size")
        })
        subconfigs.resolve("change_multipage").run(function(it) {
          it.remove("order")
          it.remove("recursive")
          it.remove("keep_size")
        })
        subconfigs.resolve("relink_same").run(function(it) { it.remove("keep_size") })
      })
      configs.resolve("objects").run(function(subconfigs) {
        subconfigs.resolve("add_trim_marks").run(function(it) {
          it.remove("offset")
          it.remove("length")
          it.remove("weight")
          it.remove("color")
        })
        subconfigs.resolve("copy_to_artboards").run(function(it) { it.remove("anchor") })
        subconfigs.resolve("step_and_repeat").run(function(it) {
          it.remove("horizontal")
          it.remove("vertical")
        })
        subconfigs.resolve("rearrange").run(function(it) { it.remove("order") })
        subconfigs.resolve("rasterize_each").run(function(it) {
          it.remove("background")
          it.remove("anti_aliasing")
          it.remove("option1")
          it.remove("option2")
          it.remove("option3")
          it.remove("option4")
          it.remove("option5")
          it.remove("recursive")
          it.remove("keep_size")
        })
        subconfigs.resolve("resize_each").run(function(it) {
          it.remove("option1")
          it.remove("option2")
          it.remove("option3")
          it.remove("option4")
          it.remove("recursive")
        })
      })
      configs.resolve("select").run(function(subconfigs) {
        subconfigs.resolve("all").run(function(it) {
          it.remove("compound_path")
          it.remove("graph")
          it.remove("group")
          it.remove("group2")
          it.remove("legacy_text")
          it.remove("mesh")
          it.remove("nonnative")
          it.remove("path")
          it.remove("placed")
          it.remove("plugin")
          it.remove("raster")
          it.remove("symbol")
          it.remove("text_frame")
          it.remove("recursive")
        })
        subconfigs.resolve("images").run(function(it) { it.remove("recursive") })
        subconfigs.resolve("links").run(function(it) { it.remove("recursive") })
        subconfigs.resolve("paths").run(function(it) { it.remove("recursive") })
        subconfigs.resolve("types").run(function(it) { it.remove("recursive") })
      })
      configs.resolve("types/numerize").run(function(it) {
        it.remove("start")
        it.remove("digit")
        it.remove("stop_enabled")
        it.remove("stop_alphabet")
        it.remove("prefix")
        it.remove("suffix")
        it.remove("order")
      })
      Windows.alert(R.string.done, R.string.about_scripts)
    })
  })
})
dialog.setCancelButton(R.string.close) // because there is no default button
dialog.setHelpButton(R.string.visit_github, function() {
  Scripts.openUrl(Scripts.URL_GITHUB)
  return true
})
dialog.show()
