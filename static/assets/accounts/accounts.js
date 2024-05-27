const icon = document.getElementById("account-icon");
icon.src = "https://static.vecteezy.com/system/resources/previews/007/407/995/original/account-symbol-leader-and-workers-team-logo-vector.jpg";
icon.alt = "Profile";

//Hides main site
document.getElementById("site").style.display = "none";

//Adds the CSS
const link1 document.createElement("link");
link1.rel="stylesheet";
link1.href="/assets/styles/main.css";
const link2 document.createElement("link");
link2.rel="stylesheet";
link2.href="/assets/styles/themes/default.css";

document.head.appendChild(link1);
document.head.appendChild(link2);
