//=====================================================


l.save = function(){
    //------------------------------------------
    //save main stuff here
    var save = new Object();
    save.res = new Object();
    save.res.list = new Object();
    for (var i in l.res.list){
        var x = l.res.list[i];
        save.res.list[x.id] = new Object();
        save.res.list[x.id].num = x.num;
        save.res.list[x.id].vis = x.vis;
    }
    //jobstuffs here
    save.jobs = new Object();
    save.jobs.list = new Object();
    for (var i in l.jobs.list){
        var x = l.jobs.list[i];
        save.jobs.list[x.id] = new Object();
        save.jobs.list[x.id].vis = x.vis;
    }
    //workshopstuffs
    save.workshop = new Object();
    save.workshop.list = new Object();
    for (var i in l.workshop.list){
        var x = l.workshop.list[i];
        save.workshop.list[x.id] = new Object();
        save.workshop.list[x.id].vis = x.vis;
        save.workshop.list[x.id].bought = x.bought;
    }
    //buildingstuffs
    save.buildings = new Object();
    save.buildings.list = new Object();
    for (var i in l.buildings.list){
        var x = l.buildings.list[i];
        save.buildings.list[x.id] = new Object();
        save.buildings.list[x.id].vis = x.vis;
        save.buildings.list[x.id].num = x.num;
    }
    save.jobs.cur = l.jobs.cur;
    save.jobs.time = l.jobs.time;
    if (document.getElementById("timedone")){save.timebar = document.getElementById("timedone").style.width;}
    save.explore = new Object();
    save.explore.list = new Object();
    for (var i in l.explore.list){
        var x = l.explore.list[i];
        save.explore.list[x.id] = new Object();
        save.explore.list[x.id].vis = x.vis;
        save.explore.list[x.id].bought = x.bought;
    }
    save.calendar = new Object();
    save.calendar.hour = l.calendar.hour;
    save.calendar.day = l.calendar.day;
    save.calendar.year = l.calendar.year;
    localStorage.setItem("__save", JSON.stringify(save));
    //-------------------------------------------------
    //save log (is this necessary? Will make this optional :)
    localStorage.setItem("__log",JSON.stringify(l.logstuff.logged));
    savenotify = document.getElementById('savenotify');
    savenotify.style.visiblity = 'visible';
    savenotify.style.display = 'block';
    if (typeof l.savedfadetimer != undefined){clearInterval(l.savedfadetimer);};
    savenotify.style.opacity = 1;
    savenotify.style.filter.alpha = 100;
    setTimeout(function(){l.savefade(savenotify)},700);
}

l.load = function(){
    var save = JSON.parse(localStorage.getItem("__save"));
    if (save){
        for (var i in l.res.list){
            if (save.res.list[l.res.list[i].id]){
                l.res.list[i].num = save.res.list[l.res.list[i].id].num
                if(save.res.list[l.res.list[i].id].vis){l.res.list[i].vis = save.res.list[l.res.list[i].id].vis;}
            }
        }
        //jobstuffs here
        for (var i in l.jobs.list){
            if (save.jobs.list[i]){
                if (save.jobs.list[i].vis){
                    l.jobs.list[i].vis = save.jobs.list[l.jobs.list[i].id].vis;
                }
            }
        }
        l.jobs.cur = save.jobs.cur;
        l.jobs.time = save.jobs.time;
        if (save.timebar){l.timebar.restart(save.timebar,true);}
        //explorestuffs
        for (var i in l.explore.list){
            if (save.explore.list[l.explore.list[i].id]){
                if (save.explore.list[l.explore.list[i].id]){
                    l.explore.list[i].vis = save.explore.list[l.explore.list[i].id].vis;
                    l.explore.list[i].bought = save.explore.list[l.explore.list[i].id].bought;
                }
            }
        }
        //workshopstuffs 
        for (var i in l.workshop.list){
            if (save.workshop.list[l.workshop.list[i].id]){
                var x = l.workshop.list[i];
                x.vis = save.workshop.list[x.id].vis;
                x.bought = save.workshop.list[x.id].bought;
            }
        }
        for (var i in l.buildings.list){
            if (save.buildings.list[l.buildings.list[i].id]){
                l.buildings.list[i].vis = save.buildings.list[l.buildings.list[i].id].vis;
                l.buildings.list[i].num = save.buildings.list[l.buildings.list[i].id].num;
            }
        }
        l.calendar.hour = save.calendar.hour;
        l.calendar.day = save.calendar.day;
        l.calendar.year = save.calendar.year;
    }
    //logstuff
    if (localStorage.getItem("__log")){
        l.logstuff.logged = JSON.parse(localStorage.getItem("__log"));
        l.logstuff.update();
    }
}
//=====================================================
l.options = new Object();
l.options.draw = function(){
    document.getElementById("maingame").innerHTML = "<button onclick=l.save()>Save</button>";
}

l.options.icodraw = function(){
    optionsmenuhtml = "";
    optionsmenuhtml += "<button class='optionsitem' onclick='l.options.delsave()'>Delete save</button>";
    optionsmenuhtml += "<button class='optionsitem' onclick='l.save()'>Save</button>";
    optionsmenuhtml += "<button class='optionsitem'>Export</button>";
    optionsmenuhtml += "<button class='optionsitem'>Import</button>";
    savenotify = "<div id='savenotify' style='display:none'>Game saved!</div>";
    document.getElementById("gameContainer").innerHTML += savenotify+"<div id='optionsico'><object data='icons/options.ico'></object><div id='optionsmenu'>"+optionsmenuhtml+"</div></div>";
}

l.options.delsave = function(){
    if (confirm("Are you sure?")){
        localStorage.removeItem("__save");
        localStorage.removeItem("__log");
        localStorage.removeItem("log");
    }
}

l.savefade = function(element){
    var op = 1;  // initial opacity
    l.savedfadetimer = setInterval(function (){
        if (op <= 0.04){
            clearInterval(l.savedfadetimer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.05+0.03;
    }, 100);
}