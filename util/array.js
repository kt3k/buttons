exports.uniq = array =>
  array.filter((val, index, self) => self.indexOf(val) === index)
