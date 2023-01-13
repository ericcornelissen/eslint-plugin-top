const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const {
  getLanguageService,
  TextDocument
} = require('vscode-json-languageservice');

const exitCodes = {
  valid: 0,
  invalid: 1,
  unexpected: 2
};
const schemas = {
  file: 'file://'
};

async function readFile(file) {
  const filePath = path.resolve(file);
  const fileRaw = fs.readFileSync(filePath).toString();
  return fileRaw;
}

async function validate(fileContent) {
  const textDocument = TextDocument.create('x.json', 'json', 1, fileContent);
  const jsonLanguageService = getLanguageService({
    schemaRequestService: (uri) => {
      if (uri.startsWith(schemas.file)) {
        const schemaFile = uri.substring(schemas.file.length + 1);
        const rawSchema = readFile(schemaFile);
        return rawSchema;
      }

      return Promise.reject(`Unable to load schema at ${uri}`);
    }
  });

  const jsonDocument = jsonLanguageService.parseJSONDocument(textDocument);

  const diagnostics = await jsonLanguageService.doValidation(
    textDocument,
    jsonDocument
  );
  return diagnostics;
}

function reportError(error) {
  console.log(
    `${error.range.start.line}:${error.range.start.character}`,
    '\t',
    error.message
  );
}

function reportFile(fileName, errors) {
  if (errors.length === 0) {
    console.log('All good!');
    return;
  }

  console.log(/* newline */);
  errors.map(reportError);
  console.log(`Found ${errors.length} error(s) in ${fileName}`);
}

function exit(errors) {
  if (errors.length === 0) {
    process.exit(exitCodes.valid);
  } else {
    process.exit(exitCodes.invalid);
  }
}

async function run(fileName) {
  const fileRaw = await readFile(fileName);
  const errors = await validate(fileRaw);
  reportFile(fileName, errors);
  exit(errors);
}

try {
  run(process.argv[2]);
} catch (e) {
  console.log(`unexpected error:`, e);
  process.exit(exitCodes.unexpected);
}
