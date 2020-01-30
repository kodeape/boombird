// ---- NAVIGATION ----

$cont = $("#content");
$cont.hide();

// JavaScript does have actual classes today, rather than the functions imitating classes that is used in this script
// I recommend using those instead in your own development
function Page(pageId, linkId, file, backgroundImg, showPage){
    this.id = pageId;
    this.link = linkId;
    this.content = file;
    this.img = backgroundImg;
    this.show = showPage;

    this.loadPage = function() {
        if (this.show && $cont.is(":hidden")) $cont.show();
        else if (!this.show && $cont.is(":visible")) $cont.hide();
        if (this.content != "") $cont.load(this.content);
        else $cont.html("");
        $("#frontpage").css("backgroundImage", "url(img/" + this.img + ")");
    }
}

var pages = [];
var linkToPageId = {};

function addPage(linkId, file, backgroundImg, showPage = true) {
    var pageId = pages.length;
    var newPage = new Page(pageId, linkId, file, backgroundImg, showPage);
    pages.push(newPage);
    linkToPageId[linkId] = pageId;
}

addPage("home", "", "frontpage.jpg", false);
pages[0].loadPage();  // The page that was added first is the default loaded page
addPage("about", "about.html", "frontpage.jpg");

$("#menu a").click(function(){
    pages[linkToPageId[this.id]].loadPage();
});


// ---- OBSERVATION HANDLING ----

function Observation(date, time, height, more) {  // Klasse for en ny observasjon
    // Definerer observasjonens datamedlemmer/egenskaper:
    this.id = obsIndex;
    this.date = date;
    this.time = time;
    this.height = height;
    this.more = more;

    this.addRow = function() {  // Metode som lager en rad i historikk-tabellen tilhørende observasjonen
        var tr = document.createElement('tr');
        tr.setAttribute('id','row' + this.id);
        var tdDate = document.createElement('td');
        tdDate.innerHTML = this.date.dmy + " / " + this.time.time;
        tr.appendChild(tdDate);
        var tdHeight = document.createElement('td');
        tdHeight.innerHTML = this.height + ' m';
        tr.appendChild(tdHeight);
        var tdMore = document.createElement('td');
        tdMore.innerHTML = this.more;
        tr.appendChild(tdMore);
        document.getElementById('historyTable').appendChild(tr);
    }
}

var allObs = [];
var obsIndex = 0;
function newObs(date, time, height, more) {
    allObs[obsIndex] = new Observation(date, time, height, more);
    obsIndex++;
}

function DateO(year,month,day) {  // Datoklasse
    this.y = year;
    this.m = month;
    this.d = day;
    this.dmy = this.d + "." + this.m + "." + this.y;
    this.logDate = function(){
        console.log("Dato: " + this.dmy);
    }
}

function Time(hours,minutes,seconds) {  // Tidsklasse
    this.hrs = hours;
    this.mins = minutes;
    this.secs = seconds;
    this.time = this.hrs + ":" + this.mins + ":" + this.secs;
    this.setWithString = function(timeStr){

    }
    this.logTime = function(){
        console.log("Tid: " + this.time);
    }
}

function handleDate(dateTime) {  // Denne funksjonen tar inn datostrengen og returnerer den som datoen og tiden som brukbare objekter
    dateTime = dateTime.split(" ");
    date = new DateO(date[0],date[1],date[2]);  // Oppretter et nytt objekt fra datoklassen med parametre year = date[0] = 2018, month = date[1] = 10 og day = date[2] = 24
    var time = dateTime[1];
    time = time.split(':');  // time = [11, 46, 22]
    time = new Time(time[0],time[1],time[2]);  // Oppretter et nytt objekt fra tidsklassen med parametre hours = time[0] = 11, minutes = time[1] = 46 og seconds = time[2] = 22
    return {date: date, time: time};  // Returnerer dato- og tidsobjekt i et array
}



// ---- HISTORY ----
function clearHist(){
    $("#historikk_table tr:not(#infoRow)").remove();
}

function printObs(obs) {  // Funksjon som printer alle observasjonene (fra parameter) til historikk-tabellen
    clearHist();
    for(var i = 0; i < obs.length; i++){
        obs[i].addRow();
    }
}

var curObs;
var curPages;
var curDisp;

function histPages(obs,perPage) {
    modObs = obs.slice();
    var pages = []
    var page = 0;
    for(var i = 0; i < obs.length; i+=perPage){
        pages[page] = modObs.splice(0,perPage);
        page++;
    }
    return pages;
}

function printPage(pages,page) {
    page--;
    printObs(pages[page]);
}

function perPageChange(obs){
    curDisp = "pages";
    $("#pageSel").removeClass("hide");
    const perPageEl = document.getElementById("perPage");
    var perPage = Number(perPageEl.value);
    if(perPage < 1){
        perPage = 1;
        perPageEl.value = 1;
    }
    if(perPage % 1 != 0){perPage = Math.floor(perPage);}
    curPages = histPages(obs,perPage);
    document.getElementById("numPages").innerHTML = curPages.length;
    document.getElementById("page").value = 1;
    pageChange(curPages);
}

function pageChange(pages){
    const pageEl = document.getElementById("page");
    var page = Number(pageEl.value);
    if(page % 1 != 0){
        page = Math.round(page);
        pageEl.value = page;
    }
    if(page < 1){
        page = 1;
        pageEl.value = "1";
    }
    else if(page > pages.length){
        page = pages.length;
        pageEl.value = pages.length;
    }
    printPage(pages,page);
}

function printAll(obs){
    curDisp = "all";
    $("#pageSel").addClass("hide");
    document.getElementById("perPage").value = "";
    printObs(obs);
}

function handlePrinting(obs,disp){
    if(disp == "pages"){
        perPageChange(obs);
    }
    else {
        printAll(obs);
    }
}

$("#showAll").click(function(){
    printAll(curObs);
});

$("#perPage").change(function(){
    perPageChange(curObs);
});

$("#page").change(function(){
    pageChange(curPages);
});


// ---- JSON/FILE HANDLING ----

function handleJSON(jsonObs) {
    for(var i = jsonObs.length-2; i >= 0; i--){
        obj = jsonObs[i];
        var dateTime = handleDate(obj.time);
        var date = dateTime.date;
        var time = dateTime.time;
        newObs(date,time,"height","more??");
    }
    addYearOpts(allObs[allObs.length-1].date.y);
    curObs = allObs;
    perPageChange(curObs);
    searchStats(allObs);
}

function decodeJSON(jsonArr) {
    jsonObs = [];
    for(var i = 0; i < jsonArr.length-1; i++){
        var obj = JSON.parse(jsonArr[i]);
        jsonObs.push(obj);
    }
    return jsonObs;
}

function openFile(file){  // Denne funksjonen åpner ei tekstfil med AJAX, her er det mye du ikke trenger å forstå
    var txt = '';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
      if(xmlhttp.status == 200 && xmlhttp.readyState == 4){  // status 200 = "OK", readyState 4 = "request finished and response is ready"
        txt = xmlhttp.responseText;  // Lagrer rein tekst fra fila i txt-variabelen
        jsonArr = txt.split("\r\n");  // jsonArr blir nå et array hvor hver linje i tekstfila blir et eget element (i datalog-fila er hver linje et nytt JSON-objekt)
        handleJSON(decodeJSON(jsonArr));
      }
    };
    xmlhttp.open("GET",file,true);
    xmlhttp.send();
}

//openFile("datalog.txt");