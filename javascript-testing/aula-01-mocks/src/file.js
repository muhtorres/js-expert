const { readFile } = require('fs/promises');
const { join } = require('path');
const { error } = require('./constants');

const DEFAULT_OPTIONS = {
    maxLines: 3,
    fields: [
        "id", "name", "profession", "age"
    ]
}

class File {
    static async csvToJson(pathToFile) {
        const content = await File.getFileContent(pathToFile);
        const validation = File.isValid(content);

        if (!validation.valid)
            throw new Error(validation.error);

        return content;
    }

    static async getFileContent(pathToFile) {
        const filename = join(__dirname, pathToFile);

        return (await readFile(filename)).toString('utf8');
    }

    static isValid(csvString, options = DEFAULT_OPTIONS) {
        const [header, ...fileWithoutHeader] = csvString.split('\n');
        const isHeaderValid = header === options.fields.join(',');

        if (!isHeaderValid) {
            return {
                error: error.FILE_FIELDS_ERROR_MESSAGE,
                valid: false
            }
        }

        const isContentLengthAccepted = (
            fileWithoutHeader.length > 0 &&
            fileWithoutHeader.length <= options.maxLines
        );

        if(!isContentLengthAccepted){
            return {
                error: error.FILE_LENGTH_ERROR_MESSAGE,
                valid: false
            }
        }

        return { valid: true };
    }
}

(async () => {
    const threeItems = await File.csvToJson('./../mocks/threeItems-valid.csv');
    const fourItems = await File.csvToJson('./../mocks/fourItems-invalid.csv');

    console.log('result', threeItems);
    console.log('four items', fourItems);
})();