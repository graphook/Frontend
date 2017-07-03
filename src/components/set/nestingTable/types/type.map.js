
const types = {
  'array': require('./NtArray.jsx'),
  'long': require('./NtNumber.jsx'),
  'integer': require('./NtNumber.jsx'),
  'short': require('./NtNumber.jsx'),
  'byte': require('./NtNumber.jsx'),
  'double': require('./NtNumber.jsx'),
  'float': require('./NtNumber.jsx'),
  'object': require('./NtObject.jsx'),
  'keyword': require('./NtString.jsx'),
  'text': require('./NtString.jsx'),
  'boolean': require('./NtBoolean.jsx')
};

export default types;
