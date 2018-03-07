//shuttlestuff and resourcestuff
//RESOURCE STUFF FIRST!
l.res = new Object();
l.res.list = [{
    id: "water",
    des: "Good old H20",
    col: "blue",
    vis: true,
    num: 100
    },{
    id: "wood",
    des: "Sturdy beam of wood"
    },{
    id: "rawmeat",
    name: "Raw meat",
    des: "A chunk of raw meat"
    },{
    id: "cookedmeat",
    name: "Cooked meat",
    des: "Cooked meat, ready to eat",
    ed: true
    },{
    id: "spear",
    des: "Spear for hunting animals"
    },{
    id: "ore",
    des: "Some kind of ore, no idea what it is"
    },{
    id: "woodplank",
    name: "Wooden planks",
    des: "Sturdy wooden plank"
    }
]
l.res.setup = function(){
    for (var i in this.list){
        if (!this.list[i].name){this.list[i].name=this.list[i].id.charAt(0).toUpperCase() + this.list[i].id.slice(1);};
        if (!this.list[i].col){this.list[i].col="#000000"};
        if (this.list[i].vis===undefined){this.list[i].vis=false};
        if (this.list[i].num===undefined){this.list[i].num = 0};
        if (this.list[i].ed===undefined){this.list[i].ed = false};
        this.list[i].checkvis = function(){
            if (this.num>0){this.vis = true};
        }
        this.list[i].quickvis=false;
        this.list[i].togquickvis = function(){
            this.quickvis = !this.quickvis;
        }
    }
}

l.res.checkallvis = function(){
    for (var i in this.list){
        this.list[i].checkvis();
    }
}

l.res.get = function(id){
    for (var i in this.list){
        if (this.list[i].id == id){return this.list[i]}
    }
    return undefined;
}

l.res.update = function(){
    l.res.checkallvis();
    for (var i in l.res.list){
        if (l.res.list[i].vis){
            try {
                document.getElementById("shuttleNumof"+l.res.list[i].id).innerHTML = l.display(l.res.list[i].num);
            } catch(err){l.shuttle.draw()};
        }
    }
}
//==============================================
//shuttlestuff
l.shuttle = new Object();
l.shuttle.draw = function(){
    document.getElementById("maingame").innerHTML = "<div id='shuttleReslist'><div id='shuttleReslistTitle'>Resources:</div></div>";
    x = document.getElementById("shuttleReslist");
    for (var i in l.res.list){
        if (l.res.list[i].vis){
            x.innerHTML+="<div class='shuttleReslistItem'><div class='shuttleReslistName'>"+l.res.list[i].name+": </div><div class='shuttleReslistNum' id='shuttleNumof"+l.res.list[i].id+"'>"+l.display(l.res.list[i].num)+"</div></div>";
        }
    }
}







