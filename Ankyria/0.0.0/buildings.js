l.buildings = new Object();

l.buildings.list = [{
    name: "Traps",
    id: "trap",
    time: 10,
    basecost: [{id: "wood", val: 100}],
    prereq: {explore: ["plainscen"]},
    des: "Trap animal meat",
    ratio: 2,
    get: [{id: "rawmeat", val: 0.01}]
    }
];

l.buildings.setup = function(){
    for (var i in this.list){
        if (!this.list[i].name){this.list[i].name=this.list[i].id.charAt(0).toUpperCase() + this.list[i].id.slice(1);};
        if (this.list[i].cost === undefined){this.list[i].cost = []};
        if (this.list[i].vis === undefined){this.list[i].vis = false};
        if (this.list[i].num === undefined){this.list[i].num = 0};
        if (this.list[i].bought === undefined){this.list[i].bought = false};
        if (this.list[i].prereq === undefined)(this.list[i].prereq = []);
        if (this.list[i].ratio === undefined)(this.list[i].ratio = 2);
        this.list[i].checkprereq = function(){
            var unlocked = true;
            if (this.prereq.explore){
                for (var j in this.prereq.explore){
                    if (!l.explore.get(this.prereq.explore[j]).bought){unlocked = false}
                }
            }
            if (this.prereq.res){
                for (var j in this.prereq.res){
                    if (l.res.get(this.prereq.res[j]).num=0){unlocked = false}
                }
            }
            if (unlocked){this.vis = true};
        }
        this.list[i].cost = [];
        for (j in this.list[i].basecost){
            var x = new Object();
            x.id = this.list[i].basecost[j].id;
            x.name = l.res.get(this.list[i].basecost[j].id).name;
            x.val = this.list[i].basecost[j].val;
            x.mul = 1;
            this.list[i].cost.push(x)
            
        }
        this.list[i].costmul = 1;
        this.list[i].updcostmultiplier = function(){
            this.list[i].mul = Math.pow(this.list[i].ratio,this.list[i].num);
        }
    }
}


l.buildings.get = function(name){
    for (var i in this.list){
        if (this.list[i].id == name){return this.list[i];}
    }
    return undefined;
}

l.buildings.updateallprereq = function(){
    for (var i in this.list){
        this.list[i].checkprereq();
    }
}

l.buildings.cur = null;
l.buildings.do = function(id){
    x = this.get(id);
    l.jobs.cur = this.get(id);
    l.jobs.time = this.get(id).time;
    l.jobs.cur.type = "building";
    this.cur = id;
    l.topbarjoblooks();
}

l.buildings.finished = function(id){
    item = l.building.get(id);
    item.num++;
    item.updatecost();
    l.jobs.cur = null;
    if (item.log){
        l.log(item.log);
    } else {
        l.log("Built a wooden hut");
    }
    l.updateall();
}

//draw the buildings
l.buildings.draw = function(){
    l.buildings.updateallprereq();
    x = document.getElementById("maingame");
    x.innerHTML = "";
    for (var i in this.list){
        if ((this.list[i].vis) && !(this.list[i].bought)){
            x.innerHTML += "<div class='buildingitem' id='building"+this.list[i].id+"' onclick = 'l.buildings.do(\""+this.list[i].id+"\")'></div>";
            y = document.getElementById("building"+this.list[i].id);
            y.innerHTML += "<div class='buildingitemtitle'>"+this.list[i].name+"  ("+this.list[i].num+")</div>";
            y.innerHTML += "<div class='buildingitemtime'>Time: "+this.list[i].time+"</div>";
            costgrid = "";
            for (var j in this.list[i].cost){
                costgrid += "<div class='jobitemcostitem'>"+this.list[i].cost[j].name+": "+(this.list[i].cost[j].val*this.list[i].cost[j].mul)+"</div>";
            }
            if (costgrid!==""){y.innerHTML += "<div class='buildingitembox buildingitemcostgrid'><div class='buildingitemlistcaption'>Cost:</div>"+costgrid+"</div>";}
            y.innerHTML += "<div class='buildingitemdes'>"+this.list[i].des+"</div>";
        }
    }
}


