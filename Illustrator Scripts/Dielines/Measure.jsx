// TODO: avoid duplicate paths in the same position and length.

#target Illustrator
#include "../.lib/commons.js"

checkHasSelection()

var items = Collections.filterItem(selection, function(it) {
  return it.typename === "PathItem" || it.typename === "CompoundPathItem"
})
check(Collections.isNotEmpty(items), getString(R.string.error_notypes_document, R.plurals.path.plural))

var count = 0
var distance = 0
var clippingCount = 0, filledCount = 0, registrationCount = 0

Collections.forEachItem(items, function(item) {
  switch (item.typename) {
    case "PathItem":
      increment(item)
      break;
    case "CompoundPathItem":
      Collections.forEach(item.pathItems, function(it) {
        increment(it)
      })
      break;
  }
})

var message = ""
if (count + distance === 0) {
  message += getString(R.string.message_measuredielines1)
} else {
  message += getString(R.string.message_measuredielines2, count, formatUnits(distance, unitName, 2))
}
if (clippingCount > 0) {
  message += getString(R.string.message_measuredielines3, clippingCount)
}
if (filledCount > 0) {
  message += getString(R.string.message_measuredielines4, filledCount)
}
if (registrationCount > 0) {
  message += getString(R.string.message_measuredielines5, registrationCount)
}
alert(message, getString(R.string.measure_dielines))

function increment(item) {
  // dielines usually aren't used as clipping
  if (item.clipping) {
    clippingCount++
    return
  }
  // dielines usually aren't filled
  if (item.filled) {
    filledCount++
    return
  }
  // dielines' stroke color usually aren't registration
  if (item.stroked && isColorEqual(item.strokeColor, Color2.REGISTRATION.get())) {
    registrationCount++
    return
  }
  count++
  distance += item.length
}
