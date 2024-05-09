let container = document.querySelector(".container"); //Imported parent container
let createProject = document.getElementById("create");

async function fetchAllProjects() {
   //Requests the server and fetches all the projects
   let projects = await (
      await fetch("http://localhost/BackendOfCodeEdititor/getProjects.php")
   ).json();

   //For each projects, folder icons will be created
   projects.forEach((project) => {
      createProjectFolder(project);
   });
}
fetchAllProjects();

function handleClickProject(e) {
   //Handles click on any project folder
   let projectId = e.target.classList[1];
   localStorage.setItem("CurrentProject", projectId);
   let codeEditorLink = document.createElement("a");
   codeEditorLink.href = "../HomePage/home.html";
   codeEditorLink.click();
}

function createProjectFolder(project) {
   //For given project, this function creates folder icon and design
   let eachProject = document.createElement("div"); //Container for each project
   eachProject.className = "project " + project.id;

   let folderImage = document.createElement("img");
   folderImage.src = "../folderIcon.svg";
   folderImage.className = "folderIcon " + project.id;

   let titleContainer = document.createElement("div");
   titleContainer.className = "title " + project.id;
   titleContainer.innerHTML = project.projectName;

   eachProject.appendChild(folderImage);
   eachProject.appendChild(titleContainer);

   eachProject.addEventListener("click", (e) => handleClickProject(e));

   let nextToCreateProject = createProject.nextSibling;
   if (nextToCreateProject) {
      container.insertBefore(eachProject, nextToCreateProject);
   } else {
      container.append(eachProject);
   }
   return titleContainer;
}

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
