import Accounts from users.js;

//Version of Website
const v="1.0";
document.getElementById("version").innerHTML = v;

const icon = document.getElementById("account-icon");
icon.src = "https://static.vecteezy.com/system/resources/previews/007/407/995/original/account-symbol-leader-and-workers-team-logo-vector.jpg";
icon.alt = "Profile";

const useLogin = true;
let HTML;

if (login && !localStorage.getItem('login')) {
    HTML = document.getElementById("site").innerHTML;
    document.getElementById("site").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
} else if (!login && localStorage.getItem('login')) {
    document.getElementById("site").style.display = "block";
    document.getElementById("loginForm").remove();
} else {
    localStorage.setItem("login",false);
    location.href = location.href;
}

//Adds the CSS
const link1 = document.createElement("link");
link1.rel="stylesheet";
link1.type="text/css";
link1.href="/assets/styles/main.css";
const link2 = document.createElement("link");
link2.rel="stylesheet";
link2.type="text/css";
link2.href="/assets/styles/themes/default.css";
const link3 = document.createElement("link");
link3.rel="stylesheet";
link3.type="text/css";
link3.href="assets/accounts/login.css";

document.head.appendChild(link1);
document.head.appendChild(link2);
document.head.appendChild(link3);

document.getElementById("mainLoginForm").addEventListener("submit", function() {
    const fName = document.forms["mainLoginForm"]["fName"].value;
    const lName = document.forms["mainLoginForm"]["lName"].value;
    for (let firstName in Accounts) {
        if (fName.toUpperCase === firstName.toUpperCase & lName.toUpperCase === Accounts[firstName].toUpperCase) {
            document.getElementById("site").remove();
            document.getElementById("loginForm").style.display = "block";
            localStorage.setItem("login",true)
            localStorage.setItem("user",fName+"."+lName)
            alert("You are seen as " + localStorage.getItem("user"));
        }
    }
    if (!localStorage.getItem("login")) {
        alert("Please enter your first, and last name.")
    }
});
