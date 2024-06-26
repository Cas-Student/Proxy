const icon = document.getElementById("account-icon");
icon.src = "https://static.vecteezy.com/system/resources/previews/007/407/995/original/account-symbol-leader-and-workers-team-logo-vector.jpg";
icon.alt = "Profile";

const login = true;
let HTML;

if (login && !localStorage.getItem('login')) {
    HTML = document.getElementById("site").innerHTML;
    document.getElementById("site").remove();
    document.getElementById("loginForm").style.display = "block";
} else if (!login && localStorage.getItem('login')) {
    document.getElementById("site").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
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

document.getElementById("mainLoginForm").action = "assets/accounts/verify.php";
document.getElementById("mainLoginForm").addEventListener("submit", function() {
    const fName = document.forms["mainLoginForm"]["fName"].value;
    const lName = document.forms["mainLoginForm"]["lName"].value;
    const pin = document.forms["mainLoginForm"]["pin"].value;
    console.log(fName + lName + pin);
    localStorage.setItem('fName',fName);
    localStorage.setItem('lName',lName);
    localStorage.setItem('PIN',pin);
    localStorage.setItem('login',true);
    location.href = location.href;
});
