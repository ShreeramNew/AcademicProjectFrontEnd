let inputBox = document.querySelector(".codeEditor");
let runButton = document.getElementById("runButton");
console.log(runButton);
runButton.addEventListener('click',()=>{
    let htmlCode=inputBox.innerText;
    localStorage.setItem('htmlCode',htmlCode);

    let blob=new Blob([htmlCode],{type:'text/html'})
    let url=URL.createObjectURL(blob);

    let aTag=document.createElement('a');
    aTag.href=url
    aTag.target='_new'
    aTag.click();
})
