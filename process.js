const path = require('path');
const fs = require('fs');

const FitFileParser = require('fit-file-parser').default;

const parseFitContents = async (content) => {

  // options here: https://github.com/jimmykane/fit-parser
  const fitParser = new FitFileParser({
    force: true,
    speedUnit: 'mph',
    lengthUnit: 'mi',
    temperatureUnit: 'fahrenheit',
    elapsedRecordField: true,
    mode: 'list',
  });

  return new Promise((resolve, reject) => {
    fitParser.parse(content, (error, data) => {
      if (error) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

(async () => {
  const directoryPath = path.join(__dirname, 'fit_files');

  const files = fs.readdirSync(directoryPath).filter(f => f.match(/\.fit$/)).map(f => path.basename(f, '.fit'));
  for (const f of files) {
    console.log(`Starting ${f}`);
    const content = fs.readFileSync(path.join(__dirname, 'fit_files', f + '.fit'));
    const json = await parseFitContents(content);

    fs.writeFileSync(path.join(__dirname, 'json_files', f + '.json'), JSON.stringify(json, null, 2));

  };
})();