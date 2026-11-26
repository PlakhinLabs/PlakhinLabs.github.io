(function(){var d=document.documentElement,s=null;try{s=localStorage.getItem("lang")}catch(e){}
var ru=s?s==="ru":/^ru|^uk|^be/i.test(navigator.language||"");
function set(r){d.classList.toggle("ru",r);d.lang=r?"ru":"en"}
set(ru);document.getElementById("lg").addEventListener("click",function(){ru=!ru;set(ru);try{localStorage.setItem("lang",ru?"ru":"en")}catch(e){}});
document.querySelectorAll(".th").forEach(function(b){b.addEventListener("click",function(){d.dataset.theme=b.dataset.th;try{localStorage.setItem("theme",b.dataset.th)}catch(e){}})});
function cp(t,b){function ok(){b.classList.add("done");setTimeout(function(){b.classList.remove("done")},1500)}
if(navigator.clipboard){navigator.clipboard.writeText(t).then(ok)}else{var x=document.createElement("textarea");x.value=t;document.body.appendChild(x);x.select();document.execCommand("copy");x.remove();ok()}}
document.querySelectorAll(".copy[data-a]").forEach(function(b){b.addEventListener("click",function(){cp(b.dataset.a,b)})});
var dl=document.getElementById("qrd");
if(dl){var qi=document.getElementById("qi"),cur="";
document.querySelectorAll(".qrb").forEach(function(b){b.addEventListener("click",function(){
document.getElementById("qn").textContent=b.dataset.name;document.getElementById("qa").textContent=b.dataset.addr;cur=b.dataset.addr;qi.src=b.dataset.qr;
if(dl.showModal){dl.showModal()}else{dl.setAttribute("open","")}})});
document.getElementById("qc").addEventListener("click",function(){cp(cur,this)});
function cl(){if(dl.close){dl.close()}else{dl.removeAttribute("open")}qi.removeAttribute("src")}
dl.querySelector(".x").addEventListener("click",cl);dl.addEventListener("click",function(e){if(e.target===dl)cl()});dl.addEventListener("close",function(){qi.removeAttribute("src")})}
})();
