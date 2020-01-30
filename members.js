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

addMember('img/frog.png', 'Helene Markeng', 'Prosjektleder', 'Hei jeg er en frosk:)');
addMember('img/frog.png', 'Sara Roberg Ghabeli', 'IT-ansvarlig', 'Hei jeg er også en frosk:)');
addMember('img/frog.png', 'Steven Francis', 'Leder av dataprosesseringsavdelingen', 'Hei jeg er en rask fouriertransform-frosk:)');
addAllMemBoxes(members);