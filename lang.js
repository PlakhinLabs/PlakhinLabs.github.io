(function(){var d=document.documentElement,s=null;try{s=localStorage.getItem("lang")}catch(e){}
var ru=s?s==="ru":/^ru|^uk|^be/i.test(navigator.language||"");
function set(r){d.classList.toggle("ru",r);d.lang=r?"ru":"en"}
set(ru);document.getElementById("lg").addEventListener("click",function(){ru=!ru;set(ru);try{localStorage.setItem("lang",ru?"ru":"en")}catch(e){}})})();
