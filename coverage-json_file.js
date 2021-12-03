/* NOTES
    * Based on version https://marian-caikovski.medium.com/remove-unused-css-a6c4c7f25689
    * Description: Get all USED and UNUSED CSS or JS code
    * OBS:
        * For CSS files, all results will be inside a single file called "_CSS_usedCode"
        * For JS files, all results will be in separate files, with the original filename followed by an "_unusedCode"
        * The files will be saved in "cssSavedFilesFolder" or "jsSavedFilesFolder"
    * Instructions:
        * Put your json coverage file inside the folder "fromFileFolder"
        * Modify variable "jsonFileName" to your json coverage file name
        * Configure "global variables" to what you want
            * What types of files are available to export in the topic "used code"
            * What types of files are available to export in the topic "unused code"
        * Configure coverage json file properties
    * TO-DO:
        * Improve the results of the JS export, so that it can be the same as CSS files, in a single file (today, when the export of all JS files in a single file is enabled, the names of each file do not behave as expected)
        * Add the option to scan only a specific file within the file listing of the json coverage file
*/

const fromFileFolder = "/app/unusedCodeExtractor/fromFileFolder/";
const cssSavedFilesFolder = "/app/unusedCodeExtractor/savedFilesFolder/css/";
const jsSavedFilesFolder = "/app/unusedCodeExtractor/savedFilesFolder/js/";

// global variables
let usedCodeExportOptions = ["css"] // values possible: css, js
let unusedCodeExportOptions = ["js"] // values possible: css, js

// insert coverage json file properties
let jsonFileName = "Coverage-20211202T115437.json";
let jsonPathFile = fromFileFolder + jsonFileName;

const fs = require('fs')
const coverage = require(jsonPathFile);
//console.log(coverage)

let usedCode = ''
let unusedCode = ''
for (cssOrJsFile of coverage) {
    let fileUrl = getFileNameFromUrl(cssOrJsFile.url);
    let firstEntryUnusedCode = true;
    //console.log(cssOrJsFile)

    const ranges = cssOrJsFile.ranges;
    const text = cssOrJsFile.text;
    //console.log(ranges);
    //console.log(text);

    usedCode += identifyUsedCodeFileOnExportedFile(cssOrJsFile, isCssUsedCodeExportEnabled(), isJsUsedCodeExportEnabled());
    unusedCode += identifyUnusedCodeFileOnExportedFile(cssOrJsFile, isCssUnusedCodeExportEnabled(), isJsUnusedCodeExportEnabled());
    for (range of ranges) {
        //console.log(range)
    
        let rangeCode = text.substring(range.start, range.end);
        //console.log("\nrangeCode to add/remove --> ", rangeCode)
        
        // save usedCode
        if (isCssFile(cssOrJsFile) && isCssUsedCodeExportEnabled()) {
            usedCode += rangeCode
        }
        if (isJsFile(cssOrJsFile) && isJsUsedCodeExportEnabled()) {
            usedCode += rangeCode
        }

        if (firstEntryUnusedCode == true) {
            unusedCode += text.replace(rangeCode, '');
            firstEntryUnusedCode = false;
        } else {
            unusedCode = unusedCode.replace(rangeCode, '');
        }
    }
    
    // save CSS or JS file (separated files)
    if (isJsFile(cssOrJsFile) && isJsUnusedCodeExportEnabled()) {
        fs.writeFileSync(jsSavedFilesFolder + fileUrl + "_unusedCode.js", unusedCode);
    }
    if (isCssFile(cssOrJsFile) && isCssUnusedCodeExportEnabled()) {
        fs.writeFileSync(cssSavedFilesFolder + fileUrl + "_unusedCode.css", unusedCode);
    }
}

//console.log("\n\nusedCode --> " + usedCode)
//console.log("\n\nunusedcode --> " + unusedCode)


// save CSS or JS file (unique file)
if (isCssUsedCodeExportEnabled()) {
    fs.writeFileSync(cssSavedFilesFolder + "_CSS" + "_usedCode.css", usedCode);
}
if (isJsUsedCodeExportEnabled()) {
    fs.writeFileSync(jsSavedFilesFolder + "_JS" + "_usedCode.js", usedCode);
}


// methods / utils
function getFileNameFromUrl(url) {
    var n = url.lastIndexOf('/');
    var result = url.substring(n + 1);

    // prevent error "TOO LARGE..."
    if (result.startsWith("?")) {
        result = "custom" + url.substring(n + 1, n + 10);
    }

    // in this case, is the homepage (careful, use the "getAllFilesNamesFromUrl()" function if in doubt)
    else if (result == '') {
        result = "homepage"
    }

    return result;
}

function isJsFile(file) {
    const fileUrl = getFileNameFromUrl(file.url);
    return fileUrl.endsWith('.js') ||
        (getFileNameFromUrl(fileUrl) != null && getFileNameFromUrl(fileUrl).includes('js')) ||
        (file.text !== null && file.text.includes('function('));
}

function isCssFile(file) {
    const fileUrl = getFileNameFromUrl(file.url);
    return fileUrl.endsWith('.css') || (getFileNameFromUrl(fileUrl) != null && getFileNameFromUrl(fileUrl).includes('css'));
}

function isCssUsedCodeExportEnabled() {
    return usedCodeExportOptions.find(o => o == "css") != undefined;
}

function isJsUsedCodeExportEnabled() {
    return usedCodeExportOptions.find(o => o == "js") != undefined;
}

function isCssUnusedCodeExportEnabled() {
    return unusedCodeExportOptions.find(o => o == "css") != undefined;
}

function isJsUnusedCodeExportEnabled() {
    return unusedCodeExportOptions.find(o => o == "js") != undefined;
}

function identifyUsedCodeFileOnExportedFile(cssOrJsFile, isCssUsedCodeExportEnabled, isJsUsedCodeExportEnabled, usedCode) {
    let finalUsedCode = '';
    if (isCssFile(cssOrJsFile) && isCssUsedCodeExportEnabled) {
        finalUsedCode += "\n\n /*File: " + cssOrJsFile.url + "*/\n"; // identify the file
    }
    if (isJsFile(cssOrJsFile) && isJsUsedCodeExportEnabled) {
        finalUsedCode += "\n\n //File: " + cssOrJsFile.url + "\n"; // identify the file
    }
    return finalUsedCode;
}

function identifyUnusedCodeFileOnExportedFile(cssOrJsFile, isCssUnusedCodeExportEnabled, isJsUnusedCodeExportEnabled, unusedCode) {
    let finalUnusedCode = '';
    if (isCssFile(cssOrJsFile) && isCssUnusedCodeExportEnabled) {
        finalUnusedCode += "\n\n /*File: " + cssOrJsFile.url + "*/\n"; // identify the file
    }
    if (isJsFile(cssOrJsFile) && isJsUnusedCodeExportEnabled) {
        finalUnusedCode += "\n\n //File: " + cssOrJsFile.url + "\n"; // identify the file
    }
    return finalUnusedCode;
}

function getAllFilesNamesFromUrl(coverage) {
    let result = []
    for (cssOrJsFile of coverage) {
        var str = cssOrJsFile.url;
        var n = str.lastIndexOf('/');
        result.push(str.substring(n + 1));
    }
    console.log(result)
}