exports.smartTrim = (string, length, delimeter, appendix) => {
  if (string.lenth <= length) return string;

  var trimmedStr = string.substr(0, length + delimeter.length);
  var lastDelimIndex = trimmedStr.lastIndexOf(delimeter);

  if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);

  if (trimmedStr) trimmedStr += appendix;
  return trimmedStr;
};
