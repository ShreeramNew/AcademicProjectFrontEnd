const signUpButton = document.getElementById("signInButton");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

let userId = localStorage.getItem("userId");
if (userId) {
   window.location.href = "../ShowProjects/showList.html";
}

signUpButton.addEventListener("click", async (e) => {
   e.preventDefault();

   let data = {
      email: emailInput.value,
      password: passwordInput.value,
   };

   if (data.password === confirmPassword.value) {
      const URL = "http://localhost/BackendOfCodeEdititor/signUp.php";
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
      } else {
         alert(response.message);
      }
      return;
   }
   alert("Please Confirm the password again");
});
