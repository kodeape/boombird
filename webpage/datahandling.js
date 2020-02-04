// ---- OBSERVATION HANDLING ----

function Observation(id, date, time, more) {  // Klasse for en ny observasjon
    // Definerer observasjonens datamedlemmer/egenskaper:
    this.id = id;
    this.date = date;
    this.time = time;
    this.more = more;

    this.addRow = function() {  // Metode som lager en rad i historikk-tabellen tilhørende observasjonen
        $('<tr/>', {'id':'row' + this.id}).appendTo('#historyTable');
        $('<td/>', {}).html(this.date.dmy).appendTo('#row' + this.id);
        $('<td/>', {}).html(this.time.timeStr).appendTo('#row' + this.id);
        $('<td/>', {}).html(this.more).appendTo('#row' + this.id);
    }
}

var allObs = [];
function addObs(date, time, more) {
    var newObs = new Observation(allObs.length, date, time, more);
    allObs.push(newObs);
}

function DateO(year,month,day) {  // Datoklasse
    this.y = year;
    this.m = month;
    this.d = day;
    this.dmy = this.d + "/" + this.m + "/" + this.y;
    this.logDate = function(){
        console.log("Date: " + this.dmy);
    }
}

function Time(hours,minutes,seconds) {  // Tidsklasse
    this.hrs = hours;
    this.mins = minutes;
    this.secs = seconds;
    this.timeStr = this.hrs + ":" + this.mins + ":" + this.secs;
    this.setWithString = function(timeStr){
        this.timeStr = timeStr;
        var timeArr = timeStr.split(':');
        this.hrs = timeArr[0];
        this.mins = timeArr[1];
        this.hrs = timeArr[2];
    }
    this.logTime = function(){
        console.log("Time: " + this.timeStr);
    }
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
    var pages = [];
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
        if(Object.keys(obj).length > 2) addObs(obj.date,obj.time,"more??");
    }
    addYearOpts(allObs[allObs.length-1].date.y);
    curObs = allObs;
    perPageChange(curObs);
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