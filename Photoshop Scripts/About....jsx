/*
<javascriptresource>
<category>1</category>
</javascriptresource>
*/

#target Photoshop
#include ".lib/core.js"

var dialog = new Dialog(R.string.about_scripts)
var aboutPanel

var clientDate = parseDate(Scripts.getResource("VERSION").readText())

dialog.vgroup(function(main) {
  main.hgroup(function(group) {
    group.alignChildren = "center"
    group.image(undefined, "logo")
    group.staticText([300, 32], getString(R.string.message_aboutscripts, "Photoshop", clientDate.toISOString()),
      { multiline: true })
  })
  aboutPanel = new AboutPanel(main, clientDate).also(function(panel) {
    panel.preferencesThemeList.addChangeListener(function() {
      configs.edit(function(editor) {
        editor.setBoolean("theme_dark", panel.preferencesThemeList.selection.index === 0)
      })
    })
    panel.preferencesLanguageList.addChangeListener(function() {
      configs.edit(function(editor) {
        var language = Language.valueOf(panel.preferencesLanguageList.selection)
        editor.setString("language_code", language.code)
      })
      Language.set(language)
    })
    panel.preferencesClearButton.addClickListener(function() {
      configs.edit(function(editor) {
        editor.remove("theme_dark")
        editor.remove("language_code")
      })
      configs.resolve("images/add_bleed").edit(function(editor) { editor.remove("length") })
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
