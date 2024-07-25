const icon = document.getElementById("account-icon");
icon.src = "https://static.vecteezy.com/system/resources/previews/007/407/995/original/account-symbol-leader-and-workers-team-logo-vector.jpg";
icon.alt = "Profile";

if (process.env.login && !localStorage.getItem('login')) {
    document.getElementById("site").style.display = "none";
    document.getElementsByClassName("fixed-nav-bar").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
} else if (!process.env.login || localStorage.getItem('login')) {
    document.getElementById("site").style.display = "block";
    document.getElementsByClassName("fixed-nav-bar").style.display = "block";
    document.getElementById("loginForm").remove();
} else {
    localStorage.setItem("login",false);
    location.href = location.href;
}

function checkLogin() {
    const fName = document.forms["mainLoginForm"]["fName"].value;
    const lName = document.forms["mainLoginForm"]["lName"].value;
    for (let firstName in process.env.Accounts) {
        if (fName.toUpperCase === firstName.toUpperCase & lName.toUpperCase === process.env.Accounts[firstName].toUpperCase) {
            document.getElementById("loginForm").remove();
            document.getElementById("site").style.display = "block";
            localStorage.setItem("login",true)
            localStorage.setItem("user",fName+"."+lName)
            alert("You are seen as " + localStorage.getItem("user"));
        }
    }
    if (!localStorage.getItem("login")) {
        alert("Please enter your first, and last name.")
    }
    alert("form sent!");
}

document.getElementById("mainLoginForm").addEventListener("submit", alert("Submitted form!"));

document.getElementById("logout").onclick(function() {
    localStorage.setItem("login",false);
    location.href = location.href;
});