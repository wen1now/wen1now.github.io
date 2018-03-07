/*Stuffs:
NAME: what the USER sees
ID: what the game uses, THIS is the important one
vis: visible, store as BOOLEAN
bought: USE on basically every UPGRADE, EXPLORE etc.
-----------------------------------------------------
Other important messages go here

-----------------------------------------------------
TODO:
- Jobs; make the game semi-playable at least
- Add resource stuff, automatic resource adding and stuff
*/

//--------------------------------------------------
l.draw = function(){//basically load the game to look like what it's supposed to,
                    //with the log and tabs and stuff.
    var x;
    x=document.getElementById("gameContainer");
    x.innerHTML = "<div id='topbar'></div><div id='logCont'><div id='logHead'>Log</div><div id='log'></div></div> <div id='rightside'><div id='tabbar'></div><div id='maingame'></div></div>";
    l.logstuff.update();
    l.tabs.draw();
    l.calendar.draw();
    l.options.icodraw();
    var y;
    y = document.getElementById('topbar');
    y.innerHTML += "<div id='notenoughwarning' opacity>Not enough resources for your current job!</div>";
    document.getElementById("notenoughwarning").style.opacity = "0";
}

//--------------------------------------------------
//tab-related stuff, e.g. initialise the tab things
l.tabs = new Object();
l.tabs.list = [{
    name: "Shuttle",
    des: "Go back to your shuttle landing site. View resources here",
    link: "shuttle",
    vis: true
    },{
    name: "Exploration",
    des: "Explore your surroundings.",
    link: "explore"
    },{
    name: "Jobs",
    des: "Mostly gather resources for yourself to use",
    link: "jobs"
    },{
    name: "Workshop",
    des: "Build yourself some tools to use",
    link: "workshop"
    },{
    name: "Buildings",
    des: "Build yourself some buildings",
    link: "buildings"
    }
]

l.tabs.setup = function(){
    for (var i in this.list){
        if (this.list[i].vis === undefined){this.list[i].vis = false};
        this.list[i].settab = function(){
            if (l.playing){
                l.tabs.curtab = this.link;
                l[this.link].draw();
            }
        }
    }
}

l.tabs.draw = function(){
    x=document.getElementById("tabbar");
    for (var i in this.list){//add vis in later
        document.getElementById("tabbar").innerHTML+="<div><button class='tabBut' onclick='l.tabs.list["+i+"].settab()'>"+this.list[i].name+"</button></div>";
    }
}

//--------------------------------------------------
//log stuff and function
l.logstuff = new Object();
l.logstuff.logged = "";
l.logstuff.update = function(){
    document.getElementById("log").innerHTML=this.logged;
}

var stuffs;
l.log = function(stuffs){
    l.logstuff.logged = "<div class='logtimestamp'>"+l.calendar.timestamp() +"</div>" + stuffs + "<br>" + l.logstuff.logged;
    l.logstuff.update();
}

//--------------------------------------------------
//get stuff ready for user
l.bignumbers = ["","K","M","G","T","P"];
l.smallnumbers = ["","m","u","n"];
l.display = function(number){
    if (number==0){return 0};
    var digits = Math.floor(Math.log(number)/(3*Math.LN10));
    number = number/Math.pow(1000,digits);
    var rounded = Math.round(number*1000)/1000;
    suffix = "";
    if (digits>0){suffix = l.bignumbers[digits]} else {suffix = l.smallnumbers[digits]}
    return rounded+suffix;
}


//--------------------------------------------------
//topbar stuff, jobs etc. etc.
l.topbarjoblooks = function(fromtick,onload){
    if (!document.getElementById("topbarjob")){document.getElementById("topbar").innerHTML += "<div id='topbarjob'></div>"}
    x = document.getElementById("topbarjob");
    if ((l.jobs.cur !== null && l.jobs.time == l.jobs.cur.time) || onload){
        if (l.jobs.cur.type == "normal"){
            x.innerHTML = l.jobs.cur.name;
        }
        if (l.jobs.cur.type == "explore"){
            x.innerHTML = "Exploring: "+l.jobs.cur.name;
        }
        if (l.jobs.cur.type == "workshop"){
            x.innerHTML = "Making: "+l.jobs.cur.name;
        }
        if (l.jobs.cur.type == "building"){
            x.innerHTML = "Building: "+l.jobs.cur.name;
        }
        if (!fromtick || !(l.jobs.cur.type == "normal")){
            l.timebar.restart(); //stop this running multiple times
        }
        x.innerHTML += "<div id='timebar'><div id='timedone'></div></div>";
    } else if (l.jobs.cur == null){
        document.getElementById("topbarjob").innerHTML = "";
    }
}

//timebar
l.timebar = new Object();

l.timebar.restart = function(w,redraw){
    l.timebar.job = l.jobs.cur.id;
    var finaltime = l.jobs.cur.time*40;
    if (!w){
        var width = 0;
    } else {
        var width = Math.round(finaltime-(finaltime * parseFloat(w)/100));
    }
    if (redraw){
        l.topbarjoblooks(true,true);
    }
    clearInterval(l.timebar.timer);
    l.timebar.timer = setInterval(frame, 25);
    function frame() {
        if (width == finaltime) {
            clearInterval(l.timebar.timer);
        } else {
            width++;
            try {document.getElementById("timedone").style.width = 100 - 100 * width/finaltime + "%";} catch(err){};
        }
    }
}

//--------------------------------------------------
//temporary stuff that gets tested now
l.start = function(){
    l.res.setup();
    l.explore.setup();
    l.jobs.setup();
    l.tabs.setup();
    l.calendar.setup();
    l.workshop.setup();
    l.buildings.setup();
    l.draw();
    l.load();
    if (!(localStorage.getItem("__save"))){
        l.aims.initiate();
    } else {
        l.playing = true;
        l.tabs.list[0].settab();
    }
    l.updateall();
    setInterval(function(){l.tick()}, 1000);
};

l.tick = function(){
    if (l.playing){
        l.jobs.do();
        l.topbarjoblooks(true);
        l.calendar.tick();
        if (l.tabs.curtab == "shuttle"){
            l.res.update();
        }
        if (Math.random()<0.1){
            //l.updateall();
        }
    }
}

//-----------------------------------------------
//Update everything, from requirements to enhancements
l.updateall = function(){
    l.explore.setglobalspeedboost();
    l.explore.setalltimes();
    l.jobs.updateall();
    l.calendar.update();
}





















