const lintFixes = (file, contents, linting) => {
  const fileExtention = file.substr(file.length -3);
  // Standard Js
  if (linting === 1 && fileExtention === '.js') {
    if (file === 'index.spec.js' || file === 'testParameters.js') {
      contents = '/* eslint-disable no-undef */\n' + contents;
    }
    contents = contents.replace(/;/g, '');
  }
  // Google
  if (linting === 2 && fileExtention === '.js') {
    if (file === 'index.spec.js') {
      contents = '/* eslint-disable no-undef */\n' + contents;
    }
    contents = contents.replace('{ handler }', '{handler}');
    contents = contents.replace('{ event, context, callback }', '{event, context, callback}');
    contents = contents.replace('123456', '123456,');
  }
  return contents;
};

module.exports = lintFixes;