var header = document.getElementsByTagName("header")[0];
var centerLogo = document.getElementById("logo_center");
var nav = document.getElementById("nav_top");

window.onscroll = function() { navFix() };

function navFix() {
    if (document.body.scrollTop > 0) {
        centerLogo.style.opacity = 0;
        nav.style.opacity = 1;
    } else {
        centerLogo.style.opacity = 1;
        nav.style.opacity = 0;
    }

}
