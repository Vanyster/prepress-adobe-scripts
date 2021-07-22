/*
<javascriptresource>
<menu>hide</menu>
</javascriptresource>
*/

var ABOUT_THEMES = ['Dark', 'Light']

var BOUNDS_TAB = [400, 75]

function AboutTabbedPanel(parent) {
    var self = this

    this.main = parent.tabbedPanel(function(tabbedPanel) {
        tabbedPanel.vtab('Preferences', function(tab) {
            tab.alignChildren = 'left'
            tab.staticText(undefined, 'Scripts-exclusive preferences that are not used anywhere in app.')
            tab.hgroup(function(group) {
                group.tips("The script is dumb and can't yet know UI brightness setting across apps.")
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
            tab.staticText(BOUNDS_TAB,
                'Versions are not yet tracked.\n' +
                '\nCheck update function is not possible at this time due to no REST API in ExtendScript.',
                { multiline: true })
        })
        tabbedPanel.vtab('Licensing', function(tab) {
            tab.editText(BOUNDS_TAB,
                'Copyright 2021 Hendra Anggrian' +
                '\n' +
                '\nLicensed under the Apache License, Version 2.0 (the "License");' +
                '\nyou may not use this file except in compliance with the License.' +
                '\nYou may obtain a copy of the License at' +
                '\n' +
                '\n    http://www.apache.org/licenses/LICENSE-2.0' +
                '\n' +
                '\nUnless required by applicable law or agreed to in writing, software' +
                '\ndistributed under the License is distributed on an "AS IS" BASIS,' +
                '\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.' +
                '\nSee the License for the specific language governing permissions and'+
                '\nlimitations under the License.',
                { multiline: true, readonly: true, scrollable: true })
        })
    })
}