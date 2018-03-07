l.workshop = new Object();

l.workshop.list = [{
    name: "Twin buckets",
    id: "twinbuckets",
    time: 20,
    cost: [{id: "wood", val: 20},{id: "water", val: 10}],
    prereq: {explore: ["forest"]},
    des: "Put buckets on logs. Now you can carry more at once.",
    log: "It was tough work; now I can carry more water at once."
    },{
    name: "Walking stick",
    id: "walkingstick",
    time: 100,
    cost: [{id: "wood", val: 250}],
    prereq: {explore: ["forest"]},
    des: "Try to chop wood into the perfect walking stick.",
    log: "Well, I used up a lot of wood until I finally made the perfect walking stick."
    },{
    name: "Wooden pickaxe",
    id: "woodpick",
    time: 200,
    cost: [{id: "wood", val: 350}],
    prereq: {explore: ["deepforest","deepdesert"]},
    des: "Make a pickaxe to mine some of those ores",
    log: "Time to get mining!"
    },{
    name: "Wooden hatchet",
    id: "woodhatchet",
    time: 400,
    cost: [{id: "wood", val: 400}],
    prereq: {explore: ["deepforest"]},
    des: "Make a wooden hatchet to make the going just that little bit easier",
    log: "This hatchet is great! I can now clear paths in no time"
}]

l.workshop.setup = function(){
    for (var i in this.list){
        if (!this.list[i].name){this.list[i].name=this.list[i].id.charAt(0).toUpperCase() + this.list[i].id.slice(1);};
        if (this.list[i].cost === undefined){this.list[i].cost = []};
        if (this.list[i].vis === undefined){this.list[i].vis = false};
        if (this.list[i].bought === undefined){this.list[i].bought = false};
        if (this.list[i].prereq === undefined)(this.list[i].prereq = []);
        this.list[i].checkprereq = function(){
            var unlocked = true;
            if (this.prereq.explore){
                for (var j in this.prereq.explore){
                    if (!l.explore.get(this.prereq.explore[j]).bought){unlocked = false}
                }
            }
            if (unlocked){this.vis = true};
        }
        for (var j in this.list[i].cost){
            this.list[i].cost[j].mul = 1;
            this.list[i].cost[j].name = l.res.get(this.list[i].cost[j].id).name;
        }
    }
}

l.workshop.get = function(name){
    for (var i in this.list){
        if (this.list[i].id == name){return this.list[i];}
    }
    return undefined;
}

l.workshop.updateallprereq = function(){
    for (var i in this.list){
        this.list[i].checkprereq();
    }
}

l.workshop.cur = null;
l.workshop.do = function(id){
    x = this.get(id);
    if (!x.bought){
        l.jobs.cur = this.get(id);
        l.jobs.time = this.get(id).time;
        l.jobs.cur.type = "workshop";
        this.cur = id;
    }
    l.topbarjoblooks();
}

l.workshop.finished = function(id){
    item = l.workshop.get(id);
    item.bought = true;
    l.jobs.cur = null;
    l.explore.calcglobalspeedboost();
    if (item.log){
        l.log(item.log);
    } else {
        l.log("I researched "+item.name+" today.");
    }
    l.updateall();
}

//draw the workshop
l.workshop.draw = function(){
    l.workshop.updateallprereq();
    x = document.getElementById("maingame");
    x.innerHTML = "";
    for (var i in this.list){
        if ((this.list[i].vis) && !(this.list[i].bought)){
            x.innerHTML += "<div class='workshopitem' id='workshop"+this.list[i].id+"' onclick = 'l.workshop.do(\""+this.list[i].id+"\")'></div>";
            y = document.getElementById("workshop"+this.list[i].id);
            y.innerHTML += "<div class='workshopitemtitle'>"+this.list[i].name+"</div>";
            y.innerHTML += "<div class='workshopitemtime'>Time: "+this.list[i].time+"</div>";
            costgrid = "";
            for (var j in this.list[i].cost){
                costgrid += "<div class='jobitemcostitem'>"+this.list[i].cost[j].name+": "+(this.list[i].cost[j].val*this.list[i].cost[j].mul)+"</div>";
            }
            if (costgrid!==""){y.innerHTML += "<div class='workshopitembox workshopitemcostgrid'><div class='workshopitemlistcaption'>Cost:</div>"+costgrid+"</div>";}
            y.innerHTML += "<div class='workshopitemdes'>"+this.list[i].des+"</div>";
        }
    }
}









