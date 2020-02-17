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
    this.dmy = this.d + "." + this.m + "." + this.y;
    this.setWithString = function(dateStr){
        this.dmy = dateStr;
        var dateArr = dateStr.split('.');
        this.d = dateArr[0];
        this.m = dateArr[1];
        this.y = dateArr[2];
    }
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
    $("#historyTable tr:not(#infoRow)").remove();
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


// ---- STATISTIKK ----

function addOpt(idSel,idOp,value,text) {  // Funksjon som legger til et alternativ i en dropdown-liste med id = idSel-parameter
    var opt = document.createElement("option");  // Lager det nye elementet
    opt.setAttribute("id",idOp);  // Gir elementet id = idOp (fra parameter)
    opt.setAttribute("value",value);  // Gir elementet verdi = value (fra parameter). Dette er det verdien dropdown-lista blir satt til når dette alternativet er valgt
    opt.setAttribute("class","opt");
    if(text == "" || text == null){  // Hvis parameteren text ikke er spesifisert i funksjonskallet, skal den settes lik value
        text = value;
    }
    opt.innerHTML = text;  // Gir elementet en innerHTML (teksten som vises for alternativet i dropdown-lista, delen av alternativet som brukeren ser og velger) lik text (som er lik value hvis text ikke er spesifisert)
    document.getElementById(idSel).appendChild(opt);  // Legger elementet til i dropdown-lista med id = idSel (fra parameter)
}

// Legger til alle dags-, måneds- og årsalternativene i dropdownene i datovelgeren

addOpt("daySel","dayId", "", "Alle dager");
for(var i = 1; i <= 31; i++){
    addOpt("daySel","dayOpt" + i, i);
}

const monthNames = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];
addOpt("monthSel","monthId", "", "Alle måneder");
for(var i = 1; i <= monthNames.length; i++){
    addOpt("monthSel","monthOpt" + i, i, monthNames[i-1]);
}

var years = []
addOpt("yearSel","yearId", "", "Alle år");
function addYearOpts(earliest){  // Denne funksjonen tar inn det første året en fugl ble observert og legger til alle år fra og med det året til og med nåværende år i årvelgeren
    var date = new Date();
    var year = date.getFullYear();
    var idInt = 1;
    for(var i = year; i >= earliest; i--){
        addOpt("yearSel","yearOpt" + idInt, i);
        years.push(i);
        idInt++;
    }
}

function getTargetObs(obs,d,m,y){  // Denne funksjonen returnerer alle observasjoner som tilfredsstiller datosøket
    var statObs = obs.slice();  // statObs settes lik en kopi av obs (alle observasjoner noensinne) for å ikke endre på selve obs-arrayet når vi endrer på statObs
    if(y != ""){  // Kodeblokk vil kjøre hvis et år er spesifisert i søket
        for(var i = 0; i < statObs.length; i++){  // Kjører gjennom alle observasjonene i statObs
            if(Number(y) != Number(statObs[i].date.y)){  // Kodeblokk kjører hvis året fra søket ikke er lik året til gjeldende observasjon
                statObs.splice(i,1);  // Observasjonen in question fjernes fra lista
                i--;  // Nå som vi har fjernet observasjonen med indeks i, vi den neste observasjonen i lista være det nye elementet med indeks i. Dette elementet vil bli hoppet over når i økes i neste iterasjon om vi ikke reduserer indeksen med 1 her
            }
        }
    }
    // De to neste if-blokkene har nøyaktig samme logikk som den over, bare at det her filtreres bort etter søkemåned og søkedag i stedet for søkeår
    if(m != ""){
        for(var i = 0; i < statObs.length; i++){
            if(Number(m) != Number(statObs[i].date.m)){
                statObs.splice(i,1);
                i--;
            }
        }
    }
    if(d != ""){
        for(var i = 0; i < statObs.length; i++){
            if(Number(d) != Number(statObs[i].date.d)){
                statObs.splice(i,1);
                i--;
            }
        }
    }
    return statObs;
}

// Definerer forskjellige HTML-elementer som konstanter (fungerer helt likt som variabler, det er bare litt annerledes for datamaskinen)
const amtEl = document.getElementById("amt");
const pcntEl = document.getElementById("pcnt");
const firstDateEl = document.getElementById("firstDate");
const firstTimeEl = document.getElementById("firstTime");
const lastDateEl = document.getElementById("lastDate");
const lastTimeEl = document.getElementById("lastTime");

function updateStats(obs,ofObs,showPcnt){
    $("#statsDisp").removeClass("hide");
    amt = obs.length;
    first = obs[amt-1];
    last = obs[0];
    amtEl.innerHTML = amt;
    if(showPcnt){
        pcnt = Math.round(amt/ofObs.length*100);
        pcntEl.innerHTML = pcnt;
        $("#percent").removeClass("hide");
    }
    else {
        $("#percent").addClass("hide");
    }
    firstDateEl.innerHTML = first.date.dmy;
    firstTimeEl.innerHTML = first.time.timeStr;
    lastDateEl.innerHTML = last.date.dmy;
    lastTimeEl.innerHTML = last.time.timeStr;
}

function plotDay(obs){
    var hrOcc = [];
    var hrs = [];
    for(var i = 0; i < 24; i++){
        hour = String(i);
        hour = (hour.length == 1) ? "0" + hour : hour;
        hrs.push(hour + ":00");
        hrOcc.push(0);
    }
    for(var i = 0; i < obs.length; i++){
        hrOcc[Number(obs[i].time.hrs)]++;
    }
    var plotData = [{
        x: hrs,
        y: hrOcc,
        type: 'bar'
    }];
    var layout = {
        xaxis: {
            title: 'Tid'
        },
        yaxis: {
            title: 'Antall kollisjoner'
        }
    };
    return [plotData,layout];
}

function plotMonth(obs){
    var daysPerMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    var month = Number(obs[0].date.m);
    var days = [];
    var dayOcc = [];
    for(var i = 1; i <= daysPerMonth[month-1]; i++){
        dayOcc.push(0);
        days.push(String(i));
    }
    for(var i = 0; i < obs.length; i++){
        dayOcc[Number(obs[i].date.d)-1]++;
    }
    var plotData = [{
        x: days,
        y: dayOcc,
        type: 'bar'
    }];
    var layout = {
        xaxis: {
            title: 'Dag'
        },
        yaxis: {
            title: 'Antall kollisjoner'
        }
    };
    return [plotData,layout];
}

function plotYear(obs){
    var months = [];
    var monthOcc = [];
    for(var i = 0; i < 12; i++){
        months.push(monthNames[i]);
        monthOcc.push(0);
    }
    for(var i = 0; i < obs.length; i++){
        monthOcc[Number(obs[i].date.m)-1]++;
    }
    var plotData = [{
        x: months,
        y: monthOcc,
        type: 'bar'
    }];
    var layout = {
        xaxis: {
            title: 'Måned'
        },
        yaxis: {
            title: 'Antall kollisjoner'
        }
    };
    return [plotData,layout];
}

function plotYears(obs){
    sYears = years.sort();
    var yearOcc = [];
    var strYears = [];
    for(var i = 0; i < sYears.length; i++){
        strYears[i] = "År " + String(sYears[i]);
        yearOcc.push(0);
    }
    for(var i = 0; i < obs.length; i++){
        for(var j = 0; j < sYears.length; j++){
            if(obs[i].date.y == sYears[j]){
                yearOcc[j]++;
                break;
            }
        }
    }
    var plotData = [{
        x: strYears,
        y: yearOcc,
        type: 'bar'
    }];
    var layout = {
        xaxis: {
            title: 'År'
        },
        yaxis: {
            title: 'Antall kollisjoner'
        }
    };
    return [plotData,layout];
}

function plot(d,m,y,obs){
    var data;
    if(d != ""){
        data = plotDay(obs);
    }
    else if(m != ""){
        data = plotMonth(obs);
    }
    else if(y != ""){
        data = plotYear(obs);
    }
    else{
        data = plotYears(obs);
    }

    Plotly.newPlot('plotDiv',data[0],data[1]);
}

function searchStats(ofObs){
    var d = document.getElementById("daySel").value;
    var m = document.getElementById("monthSel").value;
    var y = document.getElementById("yearSel").value;
    var statObs;
    var showPcnt;
    if(d == "" && m == "" && y == ""){
        statObs = ofObs.slice();
        showPcnt = false;
    }
    else {
        statObs = getTargetObs(ofObs,d,m,y);
        showPcnt = true;
    }
    if(statObs.length < 1){
        $("#statsDisp").addClass("hide");
        document.getElementById("feedback").innerHTML = "Det ble ikke observert noen fugler som tilfredsstiller søket ditt.";
        $("#feedback").removeClass("hide");
    }
    else {
        $("#feedback").addClass("hide");
        var limitHist = document.getElementById("limitHist").checked;
        updateStats(statObs,ofObs,showPcnt);
        plot(d,m,y,statObs)
        if(limitHist){
            curObs = statObs;
        }
        else {
            curObs = allObs;
        }
        handlePrinting(curObs,curDisp);
    }
}

$(".dateSel").change(function(){
    searchStats(allObs);
});


// ---- JSON/FILE HANDLING ----

function handleJSON(jsonObs) {
    for(var i = jsonObs.length-1; i >= 0; i--){
        obj = jsonObs[i];
        var date = new DateO("","","");
        date.setWithString(obj.date);
        var time = new Time("","","");
        time.setWithString(obj.time);
        addObs(date,time,"more??");
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

openFile("datalog.txt");