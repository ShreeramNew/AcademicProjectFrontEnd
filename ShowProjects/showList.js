let container = document.querySelector(".container"); //Imported parent container
let createProject = document.getElementById("create");
let emailShower = document.querySelector("#emailShower");
emailShower.innerText = localStorage.getItem("email");
async function fetchAllProjects() {
   let userId = localStorage.getItem("userId");
   //Requests the server and fetches all the projects
   let projects = await (
      await fetch("http://127.0.0.1/BackendOfCodeEdititor/getProjects.php?userId=" + userId)
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
   let response = {
      titleContainer: titleContainer,
      fullFolder: eachProject,
      folderImage: folderImage,
   };
   return response;
}

createProject.addEventListener("click", async () => {
   let userId = localStorage.getItem("userId");
   let newProject = {
      id: 0,
      projectName: "New Folder",
   };

   let newFolder = createProjectFolder(newProject);

   let titleContainer = newFolder.titleContainer;
   let fullFolder = newFolder.fullFolder;
   let folderImage = newFolder.folderImage;

   titleContainer.contentEditable = true;

   let range = document.createRange();
   range.selectNodeContents(titleContainer);
   let selection = window.getSelection();
   selection.removeAllRanges();
   selection.addRange(range);

   titleContainer.addEventListener("keydown", async (event) => {
      if (event.key == "Enter") {
         titleContainer.contentEditable = false;
         selection.removeAllRanges();
         let newTitle = titleContainer.innerText;
         //Here a request will be made to Server, and it will return a new project id and name
         let response = await (
            await fetch(
               "http://127.0.0.1/BackendOfCodeEdititor/createProject.php?userId=" +
                  userId +
                  "&pname=" +
                  newTitle
            )
         ).json();
         if (response.status == 200) {
            fullFolder.className = "project " + response.id;
            folderImage.className = "folderIcon " + response.id;
            titleContainer.className = "title " + response.id;
         } else {
            alert(response.message);
            titleContainer.contentEditable = true;
            let range = document.createRange();
            range.selectNodeContents(titleContainer);
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
         }
      }
   });
});

//Handle Logout
let logout = document.querySelector(".logout");
let shower = document.querySelector(".shower");
let account = document.querySelector(".account");
let accountDetails = document.querySelector(".account-detail-container");

shower.addEventListener("click", () => {
   if (accountDetails.style.visibility == "visible") {
      accountDetails.style.visibility = "hidden";
   } else {
      accountDetails.style.visibility = "visible";
   }
});
logout.addEventListener("click", () => {
   localStorage.removeItem("userId");
   window.location.href = "../index.html";
});

//Handle right to click to show delete and rename option
let menu = document.querySelector(".menu");
let rightClicked_ProjectId = 0;
document.addEventListener("contextmenu", (event) => {
   event.preventDefault();
   if (event.target.classList[1] > 0) {
      rightClicked_ProjectId = event.target.classList[1];
      menu.style.left = event.clientX + "px";
      menu.style.top = event.clientY + "px";
      menu.style.display = "block";
   }
});
document.addEventListener("click", () => {
   menu.style.display = "none";
});
let deleteOption = document.querySelector(".delete");
let rename = document.querySelector(".rename");

//Handle delete Project
deleteOption.addEventListener("click", async () => {
   if (rightClicked_ProjectId > 0) {
      if (confirm("Are you sure want to delete this project?")) {
         let response = await (
            await fetch(
               "http://127.0.0.1/BackendOfCodeEdititor/deleteProject.php?projectId=" +
                  rightClicked_ProjectId
            )
         ).json();
         if (response.status == 200) {
            let items = document.querySelectorAll(".project");
            items.forEach((element) => {
               if (element.classList[1] == rightClicked_ProjectId) {
                  container.removeChild(element);
               }
            });
            alert("Project deleted successfully!");
         }
      }
   }
});

//Handle rename Project
rename.addEventListener("click", () => {
   if (rightClicked_ProjectId > 0) {
      let items = document.querySelectorAll(".title");
      items.forEach((element) => {
         if (element.classList[1] == rightClicked_ProjectId) {
            element.contentEditable = true;
            let range = document.createRange();
            range.selectNodeContents(element);
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            element.addEventListener("keydown", async (event) => {
               if (event.key == "Enter") {
                  element.contentEditable = false;
                  selection.removeAllRanges();
                  let newTitle = element.innerText;
                  //Here a request will be made to Server, and it will return a new project id and name
                  let response = await (
                     await fetch(
                        "http://127.0.0.1/BackendOfCodeEdititor/renameProject.php?projectId=" +
                           rightClicked_ProjectId +
                           "&pname=" +
                           newTitle
                     )
                  ).json();
                  if (response.status == 400) {
                     alert(response.message);
                     element.contentEditable = true;
                     let range = document.createRange();
                     range.selectNodeContents(element);
                     let selection = window.getSelection();
                     selection.removeAllRanges();
                     selection.addRange(range);
                  }
               }
            });
         }
      });
   }
});
