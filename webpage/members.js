function Member(memberId, img, name, title, quote){
    this.id = memberId;
    this.img = img;
    this.name = name;
    this.title = title;
    this.quote = quote;

    this.addMemBox = function(){
        $('<div/>', {'id':'memBox' + this.id,'class':'memBox'}).appendTo('#members');
        $('<img/>', {'class':'memPic', 'src':this.img}).appendTo('#memBox' + this.id);
        $('<div/>', {'id':'memText' + this.id,'class':'memText'}).appendTo('#memBox' + this.id);
        $('<h3/>', {'class':'memName'}).html(this.name).appendTo('#memText' + this.id);
        $('<p/>', {'class':'memTitle'}).html(this.title).appendTo('#memText' + this.id);
        $('<q/>', {'class':'memQuote'}).html(this.quote).appendTo('#memText' + this.id);
    }
}

var members = [];

function addMember(img, name, title, quote){
    var newMember = new Member(members.length, img, name, title, quote);
    members.push(newMember);
}

function addAllMemBoxes(mems){
    for(var i = 0; i < mems.length; i++){
        mems[i].addMemBox();
    }
} 

addMember('img/erlend.jpg', 'Erlend Kristiansen Berg', 'Kommunikasjonsansvarlig', 'For kommunikasjon er ikke bare et fag på Dragvoll.');
addMember('img/helene.jpg', 'Helene Markeng', 'Prosjektleder', 'Å lede et team som leder seg selv er som risenrynsgrøt på pose, enkelt og tidsparende.');
addMember('img/jacob.jpg', 'Jacob August Rangnes', '3D-modellerer', 'Fra idé til modell til virkelighet, jeg fikser det.');
addMember('img/mathias.jpg', 'Mathias Olsen', 'Leder av strømforsyning', 'Et batteri holder deg gående i en måned eller to. Vi holder deg gående for alltid.');
addMember('img/sara.jpg', 'Sara Roberg Ghabeli', 'IT-ansvarlig', 'En kode er ikke en kode hvis en ikke brukte tre timer på å finne et manglende semikolon.');
addMember('img/sindre.jpg', 'Sindre Byre', 'Algoritmeutvikler', 'Når man kjenner oppskriften blir løsningen på problemet enkel. Vi lager oppskriften for deg.');
addMember('img/steven.jpg', 'Steven Francis', 'Testansvarlig', 'Du har ikke gjennomført en test med mindre du endrer resultatet i din favør.');
addAllMemBoxes(members);