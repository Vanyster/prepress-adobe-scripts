/*
<javascriptresource>
<menu>hide</menu>
</javascriptresource>
*/

var ABOUT_THEMES = ['Dark', 'Light']

var BOUNDS_ABOUT_TAB = [400, 75]
var MARGINS_ABOUT_TAB = [10, 0, 10, 0]

function AboutTabbedPanel(parent, clientDate) {
  var self = this
  this.statusText, this.downloadButton

  this.main = parent.tabbedPanel(function(tabbedPanel) {
    tabbedPanel.vtab('Preferences', function(tab) {
      tab.preferredSize = BOUNDS_ABOUT_TAB
      tab.margins = MARGINS_ABOUT_TAB
      tab.alignChildren = 'left'
      tab.hgroup(function(group) {
        group.tips("Defines what icon color to be used.\nThe script is dumb and can't yet know UI brightness setting across apps")
        group.staticText(undefined, 'Theme:', 'right')
        group.dropDownList(undefined, ABOUT_THEMES).also(function(it) {
          var theme = preferences.getString('scripts_theme')
          if (theme !== undefined && theme !== '') {
            it.selectText(theme)
          }
          it.onChange = function() {
            preferences.setString('scripts_theme', it.selection.text)
          }
        })
      })
    })
    tabbedPanel.vtab('Updates', function(tab) {
      tab.preferredSize = BOUNDS_ABOUT_TAB
      tab.margins = MARGINS_ABOUT_TAB
      tab.alignChildren = 'left'
      self.statusText = tab.staticText([400, 21], 'Click Check Updates to fetch data.')
      tab.hgroup(function(group) {
        group.button(undefined, 'Check Updates').also(function(it) {
          it.maximumSize.height = 21
          it.onClick = function() {
            executeScript('check_updates')
            $.sleep(3000)
            var result = new File('~/prepress-adobe-scripts')
            if (!result.exists) {
              self.statusText.text = 'Unable to fetch data.'
            } else {
              var serverDate = parseDate(result.readText().substringAfter('"date": "').substringBefore('"').substring(0, 10))
              result.remove()
              if (serverDate > clientDate.getDate()) {
                self.statusText.text = 'Latest version {0} is available.'.format(serverDate.toISOString())
                self.downloadButton.enabled = true
              } else {
                self.statusText.text = 'You have the latest version.'
              }
            }
          }
        })
        self.downloadButton = group.button(undefined, 'Download').also(function(it) {
          it.maximumSize.height = 21
          it.enabled = false
          it.onClick = function() {
            openURL(URL_GITHUB + '/archive/refs/heads/main.zip')
          }
        })
      })
    })
    tabbedPanel.vtab('Licensing', function(tab) {
      tab.editText(BOUNDS_ABOUT_TAB, getResource('LICENSE').readText(), { multiline: true, readonly: true, scrollable: true })
    })
  })
}