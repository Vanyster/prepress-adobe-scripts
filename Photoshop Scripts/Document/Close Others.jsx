// Close other tabs without saving.

/*
<javascriptresource>
<category>1</category>
</javascriptresource>
*/

#target Photoshop
#include '../.lib/commons.js'

check(app.documents.length != 1, 'No other documents')

if (confirm('Close all other documents without saving?', undefined, 'Close Others')) {
    for (var i = 0; i < app.documents.length; i++) {
        if (app.documents[i] === document) {
            continue
        }
        app.documents[i].close(SaveOptions.DONOTSAVECHANGES)
        i--
    }
}