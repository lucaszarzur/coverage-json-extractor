## :page_with_curl: About this project / Motivation
Large projects such as Hybris projects demand a lot of customization and, therefore, work by different development teams, each with their own programming style. So a lot of “dead” code, that is, unused, can be left in the code. When part of this code is loaded by browsers, it can compromise the performance of the website, since it loads a series of codes unnecessarily.

In addition, Google's constant updates on SEO aspects, in which the requirements for a good website positioning are more and more careful, some action points are necessary to keep the website's SEO up to date.

Some of these action points are the "Reduce unused CSS" and "Reduce unused JavaScript" topics. It is they that this project seeks to help in solving this problem/challenge.

Google Chrome, through Chrome DevTools, has a good tool called “Coverage” that can help us identify files and CSS and JS codes that are never used. It allows the display of used and unused code, showing a file-by-file view, however this way can make our point of action difficult. Chrome's Coverage even allows the export of a JSON file with the analysis. However, it does not have a tool to import this JSON and export the codes (used and unused).

I looked for several sources for the export of these codes based on this JSON file and I didn't find it, only for CSS which is a tool/site called "Coverage JSON to CSS converter", which was one of the inspirations of this project. So, I decided to create my own version with some improvements! ;)


## :rocket: Technologies used

This project was developed with the following technologies:

#### Backend
* Node.js (https://nodejs.org)


## Run this project :computer: :computer_mouse:
#### Prerequisites
- Node.js;


#### Step by step / Usage

1. Create a folder called "/app", or customize "fromFileFolder", "cssSavedFilesFolder" and "jsSavedFilesFolder" variables inside the file "coverage-json_file.js" to the desired folder.
2. Clone this repository into the previously created folder;
3. Put your json coverage file inside the folder "fromFileFolder"
4. Modify variable "jsonFileName" to your json coverage file name
5. Configure "global variables" to what you want:
5.1. What types of files are available to export in the topic "used code"
5.2. What types of files are available to export in the topic "unused code"


## Remarks & Tips :ok_hand:
1. For CSS files, all results will be inside a single file called "_CSS_usedCode"
2. For JS files, all results will be in separate files, with the original filename followed by an "_unusedCode"


### Todo
1 - Improve the results of the JS export, so that it can be the same as CSS files, in a single file (today, when the export of all JS files in a single file is enabled, the names of each file do not behave as expected)
2 - Add the option to scan only a specific file within the file listing of the json coverage file

## References
https://nachovz.github.io/devtools-coverage-css-generator/
< /br>https://marian-caikovski.medium.com/remove-unused-css-a6c4c7f25689
