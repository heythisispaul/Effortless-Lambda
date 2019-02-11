const archiver   = require('archiver');
const fs         = require('fs');
const zipDirPath = '../zipUploads';

const checkForFolder = (path) => {
  return new Promise((resolve) => {
    try {
      fs.statSync(path);
      resolve();
    } catch {
      fs.mkdirSync(zipDirPath);
      resolve();
    }
  });
};

const getFileName = () => {
  let projectName = 'integration';
  const input = process.argv;
  try {
    const packageJSON = fs.readFileSync('../package.json');
    projectName = JSON.parse(packageJSON).name;
  } catch (err) {
    console.log(err);
    console.log('The name of your project in your package.json could not be used, if you did not enter one the generic name will be used');
  }
  if (input.length > 2) {
    /^([A-Za-z\-\_\d])+$/.test(input[2]) ? 
    projectName = input[2] :
    console.log('WARN: The name you passed in does not appear to be a valid file pathname, using project name in package.json');
  }
  return projectName;
};

const zip = (source, output) => {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(output);

  if (!checkForFolder(zipDirPath)) {
    fs.mkdirSync(zipDirPath);
  }

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve())
    archive.finalize()
  });
};

checkForFolder(zipDirPath)
  .then(() => zip('../dist/', `${zipDirPath}/${getFileName()}.zip`))
  .catch((err) => {
    console.log(err);
    process.exit(1);
});

module.exports = { checkForFolder, zip, getFileName };