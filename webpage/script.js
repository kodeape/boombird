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
addPage("data","data.html","frontpage.jpg");

$("#menu a").click(function(){
    pages[linkToPageId[this.id]].loadPage();
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