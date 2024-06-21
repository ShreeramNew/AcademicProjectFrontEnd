let inputBox = document.querySelector(".codeEditor");
let runButton = document.getElementById("run");
let saveButton = document.getElementById("save");
inputBox.focus();

let allFiles = {};
let recievedFilesURL = {};
let ProjectId = localStorage.getItem("CurrentProject");

//The following function creates div for resourceFiles to show in side bar
function createResourceFile(fileName) {
   let sideBar = document.getElementById("sideBar");
   //Show the files in side bar
   let fileDiv = document.createElement("div");
   fileDiv.className = "resource";
   fileDiv.innerHTML = fileName;
   sideBar.appendChild(fileDiv);
}
async function fetchCode() {
   let url = "http://localhost/BackendOfCodeEdititor/getCode.php?projectId=" + ProjectId;
   let response = await (await fetch(url)).json();

   let resourceUrl =
      "http://localhost/BackendOfCodeEdititor/getResources.php?projectId=" + ProjectId;
   let resourceResponse = await (await fetch(resourceUrl)).json();
   if (resourceResponse.status == 200) {
      let RecievedFiles = resourceResponse.allFile;
      RecievedFiles.forEach((file) => {
         let fileName = file.fileName;
         let fileExtension = fileName.split(".").pop();
         let MIMEType = getMimeType(fileExtension);
         let url = `data:${MIMEType};base64,${file.fileContent}`;
         recievedFilesURL[fileName] = url;
         createResourceFile(fileName);
      });
   }
   localStorage.setItem("index.html", response.html);
   inputBox.innerText = response.html;
   localStorage.setItem("script.js", response.javascript);
   localStorage.setItem("style.css", response.css);
}
fetchCode();

let RefreshCodeEditor = (fileName) => {
   //Sync the input box with currently active file
   inputBox.innerText = localStorage.getItem(fileName);
};

//The following function will recieve the extension and return the corresponding MIME type
function getMimeType(extension) {
   const mimeTypes = {
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      webp: "image/webp",
      mp4: "video/mp4",
      webm: "video/webm",
      ogg: "video/ogg",
      mp3: "audio/mpeg",
      wav: "audio/wav",
   };
   return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
}

let currentFile = "index.html";
let setLocalStorage = (fileName) => {
   //It takes the current code in inputBox and saves it in corresponding localStorage item
   let currentCode = inputBox.innerText;
   localStorage.setItem(fileName, currentCode);
};

//Handle Run button
runButton.addEventListener("click", () => {
   setLocalStorage(currentFile);
   let htmlCode = localStorage.getItem("index.html");

   // Add the line  "<meta charset='UTF-8'/>" in the given code, for handling extra space given in user code
   if (htmlCode.includes("<head>")) {
      let indexOfHeadTag = htmlCode.indexOf("<head>");
      htmlCode =
         htmlCode.substring(0, indexOfHeadTag + 6) +
         "<meta charset='UTF-8'/>" +
         htmlCode.substring(indexOfHeadTag + 6, htmlCode.length);
   }

   //Handle if there are any other resources like image,audio,video etc
   for (let key in allFiles) {
      if (htmlCode.includes(key)) {
         let file = allFiles[key];
         let url = URL.createObjectURL(file);
         htmlCode = htmlCode.replace(key, url);
      }
   }
   for (let key in recievedFilesURL) {
      if (htmlCode.includes(key)) {
         let URL = recievedFilesURL[key];
         htmlCode = htmlCode.replace(key, URL);
      }
   }

   //Integrate html with css
   if (htmlCode.includes("link")) {
      let cssCode = localStorage.getItem("style.css");
      let cssBlob = new Blob([cssCode], { type: "text/stylesheet" });
      let cssUrl = URL.createObjectURL(cssBlob);
      htmlCode = htmlCode.replace(`style.css`, cssUrl);
   }
   //Integrate html with javaScript
   if (htmlCode.includes("script")) {
      let jsCode = localStorage.getItem("script.js");
      let jsBlob = new Blob([jsCode], { type: "application/javascript" });
      let jsUrl = URL.createObjectURL(jsBlob);
      htmlCode = htmlCode.replace(`script.js`, jsUrl);
   }

   //convert the code written by user to an actual html file
   let blob = new Blob([htmlCode], { type: "text/html" });
   let url = URL.createObjectURL(blob);
   let aTag = document.createElement("a");
   aTag.href = url;
   aTag.target = "_new";
   aTag.click();
});

let files = document.querySelectorAll(".file");

const clearActive = () => {
   files.forEach((file) => {
      file.classList = "file";
   });
};

files.forEach((file) => {
   file.addEventListener("click", (e) => {
      clearActive();
      e.target.classList = "file active";
      setLocalStorage(currentFile);
      currentFile = e.target.innerText; //Change current file
      RefreshCodeEditor(currentFile);
      inputBox.focus();
   });
});

//Handle Save button
saveButton.addEventListener("click", async () => {
   setLocalStorage(currentFile);
   let htmlCode = localStorage.getItem("index.html");
   let cssCode = localStorage.getItem("style.css");
   let jsCode = localStorage.getItem("script.js");

   let data = {
      projectId: ProjectId,
      htmlCode: htmlCode,
      jsCode: jsCode,
      cssCode: cssCode,
   };

   //For saving the code
   const URL = "http://localhost/BackendOfCodeEdititor/saveProject.php";
   let response = await (
      await fetch(URL, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      })
   ).json();
   alert(response.message);

   //For saving the resource files like images, audio, video etc
   const SaveResourceURL =
      "http://localhost/BackendOfCodeEdititor/saveResorces.php?projectId=" + ProjectId;
   let formData = new FormData();//It can be used to send the large files like images, video, audio etc
   for (let key in allFiles) {
      formData.append(key, allFiles[key], key);
   }
   let NewResponse = await (
      await fetch(SaveResourceURL, {
         method: "POST",
         body: formData,
      })
   ).json();
   alert(NewResponse.message);
});

//Handle Import button
let importButton = document.getElementById("import");
importButton.addEventListener("click", () => {
   let inputElement = document.createElement("input");
   inputElement.type = "file";
   inputElement.click();
   inputElement.addEventListener("change", () => {
      let file = inputElement.files[0]; //User selected file
      let fileName = file.name;
      let blobFile = new Blob([file], { type: file.type });
      allFiles[fileName] = blobFile; //Added new file to all files

      //Show the files in side bar
      createResourceFile(fileName);
   });
});
