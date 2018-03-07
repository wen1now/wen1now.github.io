l.jobs = new Object();
l.jobs.list = [{
    name: "Water collecting",
    id: "watercol",
    time: 1,
    cost: [],
    get: [{id: "water", val: 1, updmul: function(){
        var val = 1;
        if (l.workshop.get("twinbuckets").bought){val+=1};
        return val;
    }}], //want MUL and UPDMUL for multipliand update multiplier (see below)
    prereq: {explore: ["east"]},
    des: "Collect some water from the lake"
    },{
    name: "Woodcutting",
    id: "smalltreecut",
    time: 5,
    get: [{id: "wood", val: 3, updmul: function(){
        var val = 1;
        if (l.workshop.get("woodhatchet").bought){val+=0.2};
        return val;
    }}],
    prereq: {explore: ["forest"]},
    des: "Cut down some of the small trees in the forest"
    },{
    name: "Larger woodcutting",
    id: "mediumtreecut",
    time: 60,
    get: [{id: "wood", val: 40, updmul: function(){
        var val = 1;
        if (l.workshop.get("woodhatchet").bought){val+=0.2};
        return val;
    }}],
    prereq: {explore: ["deepforest"]},
    des: "Cut down some of the trees in the forest"
    },{
    name: "Big woodcutting",
    id: "bigtreecut",
    time: 300,
    get: [{id: "wood", val: 300}],
    prereq: {explore: ["jungle"]},
    des: "Cut down some of the big trees in the jungle"
    },{
    name: "Spear making",
    id: "spearmaking",
    time: 20,
    cost: [{id: "wood", val: 1}],
    get: [{id: "spear", val: 1}],
    prereq: {explore: ["plains", "forest"]},
    des: "Make a spear for hunting"
    },{
    name: "Mining",
    id: "mining",
    time: 8,
    get: [{id: "ore", val: 1}],
    prereq: {
        explore: ["deepforest"],
        workshop: ["woodpick"]
    },
    des: "Make a spear for hunting"
    },{
    name: "Hunting",
    id: "hunting",
    time: 20,
    cost: [{id: "spear", val: 1}],
    get: [{id: "rawmeat", val: 1}],
    prereq: {explore: ["plainscen"]},
    des: "Go hunting on the plain"
    },{
    name: "Cooking",
    id: "cooking",
    time: 5,
    cost: [{id: "wood", val: 5},{id: "rawmeat", val: 1}],
    get: [{id: "cookedmeat", val: 1}],
    prereq: {explore: ["plainscen"]},
    des: "Cook a piece of meat"
    }
]

l.jobs.setup = function(){
    for (var i in this.list){
        if (this.list[i].name === undefined){this.list[i].name = this.list[i].id};
        if (this.list[i].cost === undefined){this.list[i].cost = []};
        if (this.list[i].type === undefined){this.list[i].type = "normal"};
        if (this.list[i].vis === undefined){this.list[i].vis = false};
        this.list[i].checkprereq = function(){
            var unlocked = true;
            if (this.prereq.explore){
                for (var j in this.prereq.explore){
                    if (!l.explore.get(this.prereq.explore[j]).bought){unlocked = false}
                }
            }
            if (this.prereq.workshop){
                for (var j in this.prereq.workshop){
                    if (!l.workshop.get(this.prereq.workshop[j]).bought){unlocked = false}
                }
            }
            if (unlocked){this.vis = true};
        }
        for (var j in this.list[i].get){
            this.list[i].get[j].mul = 1;
            this.list[i].get[j].name = l.res.get(this.list[i].get[j].id).name;
            if (this.list[i].get[j].updmul === undefined){this.list[i].get[j].updmul = function(){return 1}}
        }
        for (var j in this.list[i].cost){
            this.list[i].cost[j].mul = 1;
            this.list[i].cost[j].name = l.res.get(this.list[i].cost[j].id).name;
            if (this.list[i].cost[j].updmul === undefined){this.list[i].cost[j].updmul = function(){return 1}}
        }
    }
}

l.jobs.updateall = function(){
    l.jobs.updateallgetcost();
    l.jobs.updateallprereq();
}

l.jobs.updateallgetcost = function(){
    for (var i in this.list){
        for (var j in this.list[i].get){this.list[i].get[j].mul = this.list[i].get[j].updmul()};
        for (var j in this.list[i].cost){this.list[i].cost[j].mul = this.list[i].cost[j].updmul()};
    }
}

l.jobs.updateallprereq = function(){
    for (var i in this.list){
        this.list[i].checkprereq();
    }
}

l.jobs.get = function(id){
    for (var i in this.list){
        if (this.list[i].id == id){return this.list[i]}
    }
    return undefined;
}

l.jobs.cur = null;
l.jobs.setjob = function(jobid){
    this.cur = this.get(jobid);
    this.time = this.cur.time;
    l.topbarjoblooks();
}

//do the job
l.jobs.do = function(){
    x = this.cur;
    if (x){
        this.time--;
        abletodo = true;
        for (var i in x.cost){
            if (l.res.get(x.cost[i].id).num<x.cost[i].val){abletodo = false}
        }
        if (!(abletodo)){document.getElementById('notenoughwarning').style.opacity = '1'}
        else {document.getElementById('notenoughwarning').style.opacity = '0'}
    } else {document.getElementById('notenoughwarning').style.opacity = '0'}
    if (l.jobs.time<=0.5 && x){
        abletodo = true;
        for (var i in x.cost){
            if (l.res.get(x.cost[i].id).num<x.cost[i].val){abletodo = false}
        }
        if (abletodo){
            for (var i in x.get){l.res.get(x.get[i].id).num+=x.get[i].val*x.get[i].mul;}
            for (var i in x.cost){l.res.get(x.cost[i].id).num-=x.cost[i].val*x.cost[i].mul;}
            if (x.type=="explore"){l.explore.explored(x.id);}
            else if (x.type=="workshop"){l.workshop.finished(x.id)}
            else if (x.type=="building"){l.building.finished(x.id)}
            else {l.jobs.time=x.time;}
            if (!(x.type == "normal")){
                l[l.tabs.curtab].draw();
            }
            l.topbarjoblooks();
        } else {
            l.jobs.cur = null;
            l.topbarjoblooks();
        }
    }
}

//draw the jobs section
l.jobs.draw = function(){
    l.jobs.updateall();
    x = document.getElementById("maingame");
    x.innerHTML = "";
    for (var i in this.list){
        if (this.list[i].vis){
            x.innerHTML += "<div class='jobitem' id='jobitem"+this.list[i].id+"' onclick = 'l.jobs.setjob(\""+this.list[i].id+"\")'></div>";
            y = document.getElementById("jobitem"+this.list[i].id);
            y.innerHTML += "<div class='jobitemtitle'>"+this.list[i].name+"</div>";
            y.innerHTML += "<div class='jobitemtime'>Time: "+this.list[i].time+"</div>";
            costgrid = "";
            for (var j in this.list[i].cost){
                costgrid += "<div class='jobitemcostitem'>"+this.list[i].cost[j].name+": "+l.display(this.list[i].cost[j].val*this.list[i].cost[j].mul)+"</div>";
            }
            getgrid = "";
            for (var j in this.list[i].get){
                getgrid += "<div class='jobitemgetitem'>"+this.list[i].get[j].name+": "+l.display(this.list[i].get[j].val*this.list[i].get[j].mul)+"</div>";
            }
            //console.log(getgrid);
            y.innerHTML += "<div class='jobitembox jobitemgetgrid'><div class='jobitemlistcaption'>Get:</div>"+getgrid+"</div>";
            if (costgrid!==""){y.innerHTML += "<div class='jobitembox jobitemcostgrid'><div class='jobitemlistcaption'>Cost:</div>"+costgrid+"</div>";}
            y.innerHTML += "<div class='jobitemdes'>"+this.list[i].des+"</div>";
        }
    }
}





