import Accounts from './users.js';
import versions from '/info.js';

document.getElementById("version").innerHTML = versions.v;

const icon = document.getElementById("account-icon");
icon.src = "https://static.vecteezy.com/system/resources/previews/007/407/995/original/account-symbol-leader-and-workers-team-logo-vector.jpg";
icon.alt = "Profile";

const useLogin = false;

if (useLogin && !localStorage.getItem('login')) {
    document.getElementById("site").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
} else if (!useLogin || localStorage.getItem('login')) {
    document.getElementById("site").style.display = "block";
    document.getElementById("loginForm").remove();
} else {
    localStorage.setItem("login",false);
    location.href = location.href;
}

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
