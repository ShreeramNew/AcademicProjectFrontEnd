let inputBox = document.querySelector(".codeEditor");
let runButton = document.getElementById("run");
let saveButton = document.getElementById("save");
inputBox.focus();

let ProjectId = localStorage.getItem("CurrentProject");
// alert(ProjectId);
localStorage.setItem("index.html", "");
localStorage.setItem("script.js", "");
localStorage.setItem("style.css", "");

let currentFile = "index.html";

let setLocalStorage = (fileName) => {
   //It takes the current code in inputBox and saves it in corresponding localStorage item
   let currentCode = inputBox.innerText;
   localStorage.setItem(fileName, currentCode);
};

let RefreshCodeEditor = (fileName) => {
   //Sync the input box with currently active file
   inputBox.innerText = localStorage.getItem(fileName);
};

runButton.addEventListener("click", () => {
   setLocalStorage(currentFile);
   let htmlCode = localStorage.getItem("index.html");

   if (htmlCode.includes("link")) {
      let cssCode = localStorage.getItem("style.css");
      let cssBlob = new Blob([cssCode], { type: "text/stylesheet" });
      let cssUrl = URL.createObjectURL(cssBlob);
      htmlCode = htmlCode.replace(`style.css`, cssUrl);
   }
   if (htmlCode.includes("script")) {
      let jsCode = localStorage.getItem("script.js");
      let jsBlob = new Blob([jsCode], { type: "application/javascript" });
      let jsUrl = URL.createObjectURL(jsBlob);
      htmlCode = htmlCode.replace(`script.js`, jsUrl);
   }

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

saveButton.addEventListener("click", async () => {
   setLocalStorage(currentFile);
   let htmlCode = localStorage.getItem("index.html");
   let cssCode = localStorage.getItem("style.css");
   let jsCode = localStorage.getItem("script.js");

   let codes = {
      htmlCode: htmlCode,
      jsCode: jsCode,
      cssCode: cssCode,
   };

   const URL = "http://localhost/BackendOfCodeEdititor/index.php";
   let response = await (
      await fetch(URL, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(codes),
      })
   ).text();

   console.log(response);
});
