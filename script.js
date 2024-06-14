const signInButton = document.getElementById("signInButton");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

let userId = localStorage.getItem("userId");
if (userId) {
   window.location.href = "../ShowProjects/showList.html";
}


signInButton.addEventListener("click", async (e) => {
   e.preventDefault();
   let data = {
      email: emailInput.value,
      password: passwordInput.value,
   };
   const URL = "http://localhost/BackendOfCodeEdititor/login.php";
   let response = await (
      await fetch(URL, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      })
   ).json();
   if (response.status == 200) {
      localStorage.setItem("userId", response.userId);
      window.location.href ="../ShowProjects/showList.html";
   } else {
      alert(response.message);
   }
});
