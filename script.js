const signInButton = document.getElementById("signInButton");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

signInButton.addEventListener('click',()=>{
    let AllProjectsLink=document.createElement('a');
    AllProjectsLink.href='./ShowProjects/showList.html';
    AllProjectsLink.click();
})