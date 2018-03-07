l.explore = new Object();
l.explore.list = [{
    name: "Shuttle",
    id: "shuttle",
    pos: [0,0],
    bought: true,
    vis: true,
    des: "Home sweet home"
    },{
    name: "North",
    id: "north",
    pos: [0,5],
    time: 5,
    visprereq: {explore: ["shuttle"]},
    des: "Explore the area around you to the north.",
    log: "After going to the north I discovered a large, sweeping plain. Will explore more later"
    },{
    name: "South",
    id: "south",
    pos: [0,-5],
    time: 5,
    visprereq: {explore: ["shuttle"]},
    des: "Explore the area around you to the south",
    log: "It looks like a desert down there... there won't be much water, unfortunately"
    },{
    name: "East",
    id: "east",
    pos: [5,0],
    time: 5,
    visprereq: {explore: ["shuttle"]},
    des: "Explore the area around you to the east",
    log: "Hiked to the east, found a lake! Plenty of water now."
    },{
    name: "West",
    id: "west",
    pos: [-5,0],
    time: 5,
    visprereq: {explore: ["shuttle"]},
    des: "Explore the area around you to the west",
    log: "Went to the west, didn't find much. It appears there's a desert down south and a forest to the west."
    },{
    id: "forest",
    pos: [-11,-1],
    time: 20,
    visprereq: {explore: ["west"]},
    des: "Go exploring in the forest",
    log: "I found a bunch of trees to chop down. Well, what did I expect from a forest."
    },{
    name: "Deep forest",
    id: "deepforest",
    pos: [-14,-4],
    time: 200,
    visprereq: {explore: ["forest"]},
    cost: [{id: "water", val: 100}],
    des: "Explore deeper in the forest",
    log: "I found even more trees to chop down. Well, what did I expect from more forest?"
    },{
    id: "jungle",
    pos: [-18,-5],
    time: 400,
    visprereq: {explore: ["deepforest"]},
    cost: [{id: "water", val: 500}],
    des: "Go exploring in the jungle",
    log: "Out here, there are some massive trees that I could use for wood."
    },{
    name: "Plains",
    id: "plains",
    pos: [2,8],
    time: 25,
    cost: [{id: "water", val: 100}],
    visprereq: {explore: ["north"]},
    des: "A massive plain lies this way, stretching to the horizon",
    log: "The plain extends onwards... I'm out of water and have to go back. Maybe next time."
    },{
    name: "More plains",
    id: "plainscen",
    pos: [5,14],
    time: 125,
    cost: [{id: "water", val: 1000}],
    get: [{id: "rawmeat", val: 2}],
    visprereq: {explore: ["plains"]},
    des: "There are some weird animals on the horizon. Perhaps you could hunt them...?",
    log: "I caught some weird animal. The meat seems edible-ish."
    },{
    name: "North western plain",
    id: "plainsnw",
    pos: [-3,23],
    time: 400,
    cost: [{id: "water", val: 2500}],
    visprereq: {explore: ["plainscen"]},
    des: "See if there's an end to this unending plain.",
    log: "Ah-ha! The plain gives way to... sea. Tough luck, time for me to go back."
    },{
    id: "desert",
    pos: [-1,-12],
    time: 20,
    cost: [{id: "water", val: 100}],
    get: [{id: "water", val: 20}],
    visprereq: {explore: ["south"]},
    des: "Go exploring in the desert",
    log: "Nothing to see in the desert except cactus and an oasis, got some water back."
    },{
    name: "Deep desert",
    id: "deepdesert",
    pos: [0,-23],
    time: 200,
    cost: [{id: "water", val: 1000}],
    visprereq: {explore: ["desert"]},
    des: "Go exploring deep into the desert",
    log: "There's a lot of shiny stuff in the ground around here."
    }
]

l.explore.setup = function(){
    for (var i in this.list){
        if (!this.list[i].name){this.list[i].name=this.list[i].id.charAt(0).toUpperCase() + this.list[i].id.slice(1);};
        if (this.list[i].bought==undefined){this.list[i].bought = false;};
        if (this.list[i].cost==undefined){this.list[i].cost = [];};
        if (this.list[i].vis==undefined){this.list[i].vis = false;};
        if (this.list[i].visprereq==undefined){this.list[i].visprereq = {explore: []};};
        if (this.list[i].prereq==undefined){this.list[i].prereq = this.list[i].visprereq.explore;};
        if (this.list[i].connect==undefined){this.list[i].connect = this.list[i].visprereq.explore;};
        this.list[i].basetime = this.list[i].time;
        if (this.list[i].settime == undefined){
            this.list[i].settime = function(){
                this.time = this.basetime/l.explore.globalspeedboost;
            }
        }
        if (this.list[i].cost){
            for (var j in this.list[i].cost){
                this.list[i].cost[j].name = l.res.get(this.list[i].cost[j].id).name;
                this.list[i].cost[j].col = l.res.get(this.list[i].cost[j].id).col;
                if (this.list[i].cost[j].mul==undefined){this.list[i].cost[j].mul = 1};
            }
        }
        this.list[i].checkprereq = function(){
            if (!this.vis){
                var allgood = true;
                if (this.visprereq.explore){
                    for (var j in this.visprereq.explore){
                        if(l.explore.get(this.visprereq.explore[j]).bought==false){
                            allgood = false;
                        }
                    }
                };
                if (allgood){this.vis = true;};
            }
        }
        this.list[i].buy = function(){
            l.explore.curbuy = this.id;
        }
    }
}

l.explore.checkallprereq = function(){
    for (var i in this.list){
        this.list[i].checkprereq();
    }
}

l.explore.setalltimes = function(){
    for (var i in this.list){
        this.list[i].settime();
    }
}

l.explore.explore=function(id){
    x = l.explore.get(id);
    if (!x.bought){
        l.jobs.cur = l.explore.get(id);
        l.jobs.time = l.explore.get(id).time;
        l.jobs.cur.type = "explore";
        l.explore.cur = id;
    }
    l.topbarjoblooks();
}

l.explore.explored = function(id){
    l.explore.get(id).bought = true;
    l.jobs.cur = null;
    var item = l.explore.get(id);
    if (item.log){
        l.log(item.log);
    } else {
        l.log("I explored "+item.name+" today.");
    };
    l[l.tabs.curtab].draw();
    l.topbarjoblooks();
    l.updateall();
}

//set size of the thing
l.explore.setsize = function(){
    var minx, miny, maxx, maxy;
    minx = miny = maxx = maxy = 0;
    for (var i in this.list){
        if (this.list[i].vis){
            if (this.list[i].pos[0]>maxx){maxx=this.list[i].pos[0]};
            if (this.list[i].pos[0]<minx){minx=this.list[i].pos[0]};
            if (this.list[i].pos[1]>maxy){maxy=this.list[i].pos[1]};
            if (this.list[i].pos[1]<miny){miny=this.list[i].pos[1]};
        }
    }
    this.size = [minx, miny, maxx, maxy];
}

l.explore.ctop = function(x){//ctop is coordinates to position, eg. INPUT: [0,0] OUTPUT [325,400]
    return [24*(x[0]-this.size[0])+24, 24*(this.size[3]-x[1])+24]
}

l.explore.draw = function(){
    document.getElementById("maingame").innerHTML = "<div id='explorebox'></div>";
    l.explore.drawinside();
}

l.explore.drawinside = function(){
    x = document.getElementById("explorebox");
    x.innerHTML = "";
    l.explore.checkallprereq();
    l.explore.setsize();
    for (var i in this.list){
        if (this.list[i].vis){
            var pos = l.explore.ctop(this.list[i].pos);
            x.innerHTML+="<div class='exploreico' id='exploreplace"+this.list[i].id+"' style='left:"+pos[0]+"px; top:"+pos[1]+"px' onclick='l.explore.explore(\""+this.list[i].id+"\")'></div>";
            y = document.getElementById("exploreplace"+this.list[i].id);
            if (this.list[i].bought){
                y.innerHTML = "<div class='exploretooltip'><div class='explorelocname'>"+this.list[i].name+"</div><div class='explored'>Explored</div><div>"+this.list[i].des+"</div></div>";
                y.innerHTML += "<object data='icons/"+this.list[i].id+".ico' width='16px' height='16px'></object>";
                y.className += " explorebought";
            } else {
                costgrid = "";
                for (var j in this.list[i].cost){
                    costgrid += "<div class='exploreitemcostitem'>"+this.list[i].cost[j].name+": "+this.list[i].cost[j].val+"</div>";
                }
                y.innerHTML = "<div class='exploretooltip'><div class='explorelocname'>"+this.list[i].name+"</div><div class='exploretime'>Time: "+l.display(this.list[i].time)+"</div>"+costgrid+this.list[i].des+"</div></div>";
            }
        }
    }
}

l.explore.get = function(name){
    for (var i in this.list){
        if (this.list[i].id == name){
            return this.list[i];
        }
    }
    return undefined;
}

l.explore.globalspeedboost = 1;

l.explore.calcglobalspeedboost = function(){
    var sb = 1;
    //do stuff here
    if (l.workshop.get("walkingstick").bought){sb+=0.5};
    if (l.workshop.get("woodhatchet").bought){sb+=0.5};
    return sb;
}

l.explore.setglobalspeedboost = function(){
    this.globalspeedboost = this.calcglobalspeedboost();
}








