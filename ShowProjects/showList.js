let container=document.querySelector('.container')//Imported parent container
let projects=['NewProject','Calculator','Translator','Portfolio','NewProject','Calculator','Translator','Portfolio','NewProject','Calculator','Translator','Portfolio'];

projects.forEach((project)=>{
    let eachProject=document.createElement('div');//Container for each project
    eachProject.className='project';
    
    let folderImage=document.createElement('img');
    folderImage.src='../folderIcon.svg';
    folderImage.className='folderIcon';
    
    let titleContainer=document.createElement('div');
    titleContainer.className='title';
    titleContainer.innerHTML=project;

    
    eachProject.appendChild(folderImage);
    eachProject.appendChild(titleContainer);
    
    eachProject.addEventListener('click',()=>{
        alert('Jai SHreeram')
    })
    container.appendChild(eachProject);
})

let createProject=document.getElementById('create');
createProject.addEventListener('click',()=>{
    let codeEditorLink=document.createElement('a');
    codeEditorLink.href='../HomePage/home.html';
    codeEditorLink.click();
})


