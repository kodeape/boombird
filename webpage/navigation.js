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
addPage("about", "about.html", "elsys7.JPG");
addPage("data","data.html","frontpage.jpg");

$("#menu a").click(function(){
    pages[linkToPageId[this.id]].loadPage();
});