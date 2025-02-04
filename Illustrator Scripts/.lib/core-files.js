/**
 * A file collection can be an array of files or just single PDF file.
 * @param {Array} files array of files.
 */
function FileCollection(files) {
  var self = this

  self.isSinglePDF = files.length === 1 && Collections.first(files).isPdf()

  self.hasPDF = Collections.any(files, function(it) { return it.isPdf() })

  self.length = files.length

  /**
   * Returns image file or PDF file with specific page.
   * @param {Number} index index at which to retrieve file or PDF page.
   * @return {File}
   */
  self.get = function(index) {
    var file = self.isSinglePDF ? Collections.first(files) : files[index]
    if (self.isSinglePDF) {
      preferences.setPDFPage(index)
    } else if (file.isPdf()) {
      preferences.setPDFPage(0)
    }
    return file
  }
}
