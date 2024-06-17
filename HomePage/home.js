let inputBox = document.querySelector(".codeEditor");
let runButton = document.getElementById("run");
let saveButton = document.getElementById("save");
inputBox.focus();

let ProjectId = localStorage.getItem("CurrentProject");

async function fetchCode() {
   let url = "http://localhost/BackendOfCodeEdititor/getCode.php?projectId=" + ProjectId;
   let response = await (await fetch(url)).json();
   localStorage.setItem("index.html", response.html);
   inputBox.innerText =response.html;
   localStorage.setItem("script.js", response.javascript);
   localStorage.setItem("style.css", response.css);

}
fetchCode();

let RefreshCodeEditor = (fileName) => {
   //Sync the input box with currently active file
   inputBox.innerText = localStorage.getItem(fileName);
};

let currentFile = "index.html";
let setLocalStorage = (fileName) => {
   //It takes the current code in inputBox and saves it in corresponding localStorage item
   let currentCode = inputBox.innerText;
   localStorage.setItem(fileName, currentCode);
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

   let data = {
      projectId: ProjectId,
      htmlCode: htmlCode,
      jsCode: jsCode,
      cssCode: cssCode,
   };

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
});
