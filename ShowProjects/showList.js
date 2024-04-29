let container = document.querySelector(".container"); //Imported parent container
let createProject = document.getElementById("create");

let projects = [
   { id: 1234, name: "Translator" },
   { id: 5532, name: "Calculator" },
   { id: 5366, name: "Jai SHreeram" },
   { id: 1443, name: "Super" },
];

function handleClickProject(e) {
   let projectId = e.target.classList[1];
   localStorage.setItem("CurrentProject", projectId);
   let codeEditorLink = document.createElement("a");
   codeEditorLink.href = "../HomePage/home.html";
   codeEditorLink.click();
}

function createProjectFolder(project) {
   let eachProject = document.createElement("div"); //Container for each project
   eachProject.className = "project " + project.id;

   let folderImage = document.createElement("img");
   folderImage.src = "../folderIcon.svg";
   folderImage.className = "folderIcon " + project.id;

   let titleContainer = document.createElement("div");
   titleContainer.className = "title " + project.id;
   titleContainer.innerHTML = project.name;

   eachProject.appendChild(folderImage);
   eachProject.appendChild(titleContainer);

   eachProject.addEventListener("click", (e) => handleClickProject(e));

   let nextToCreate = createProject.nextSibling;
   if (nextToCreate) {
      container.insertBefore(eachProject, nextToCreate);
   } else {
      container.append(eachProject);
   }
   return titleContainer;
}

projects.forEach((project) => {
   createProjectFolder(project);
});

createProject.addEventListener("click", () => {
   //Here a request will be made to Server, and it will return a new project id and name
   let newProject = {
      id: 67449,
      name: "New Folder",
   };
   let newFolder = createProjectFolder(newProject);
   newFolder.contentEditable = true;

   let range = document.createRange();
   range.selectNodeContents(newFolder);
   let selection = window.getSelection();
   selection.removeAllRanges();
   selection.addRange(range);

   newFolder.addEventListener("keydown", (event) => {
      if (event.key == "Enter") {
         newFolder.contentEditable = false;
         selection.removeAllRanges();
      }
   });
});
