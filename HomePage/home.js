let inputBox = document.querySelector(".codeEditor");
let runButton = document.getElementById("runButton");
console.log(runButton);
runButton.addEventListener("click", () => {
   setLocalStorage=()=>{
      let htmlCode = inputBox.innerText;
      localStorage.setItem("htmlCode", htmlCode);
      
      let again=localStorage.getItem("htmlCode");
      inputBox.innerText=again;
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

console.log(files);
files.forEach((file) => {
   file.addEventListener("click", (e) => {
      
      clearActive();
      e.target.classList = "file active";
   });
});
