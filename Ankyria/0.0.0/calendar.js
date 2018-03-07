l.calendar = new Object();
l.calendar.setup = function(){
    l.calendar.date = new Object();
    l.calendar.year = 0;
    l.calendar.day = 0;
    l.calendar.hour = 0;
    l.calendar.thirst = 0; //how thirsty or hungry you are
    l.calendar.hunger = 0;
}

l.calendar.plushour = function(){
    l.calendar.hour++;
    if (l.calendar.hour % 5 == 0){
        l.calendar.consume();
        if (l.calendar.hour == 60){
            l.calendar.hour = 0;
            l.calendar.day++;
            if (l.calendar.day == 60){
                l.calendar.day = 0;
                l.calendar.year ++;
            }
        }
    }
}

l.calendar.update = function(){
    document.getElementById("calhour").innerHTML = l.calendar.hour+":00 ";
    document.getElementById("calday").innerHTML = "Day "+l.calendar.day +",";
    document.getElementById("calyear").innerHTML = l.calendar.year;
}

l.calendar.draw = function(){
    if (!document.getElementById("cal")){
        document.getElementById("topbar").innerHTML += "<div id='cal'></div>";
    }
    x = document.getElementById("cal");
    x.innerHTML += "<div id='calhour'></div>";
    x.innerHTML += "<div id='calday'></div>";
    x.innerHTML += "<div id='calyear'></div>";
    l.calendar.update();
}

l.calendar.timestamp = function(){
    var timestamp = "";
    timestamp+=l.calendar.hour+":00 ";
    timestamp+="Day "+l.calendar.day;
    timestamp+=", "+l.calendar.year;
    return timestamp;
}

l.calendar.tick = function(){
    l.calendar.plushour();
    l.calendar.update();
}

l.calendar.nowatermessages = [
"You are running out of water... if you don't get more you will dehydrate to death",
"If you don't get more water you will die!",
"Why don't you go collect some water??",
"Okay this is your last warning...",
"Haha you feinted from thirst. Game paused until further notice..."
]

//consumptions of food and water
l.calendar.consume = function(){
    if (l.res.get("water").num>=1){
        l.res.get("water").num-=1;
        l.calendar.thirst += 1;
    } else if (l.calendar.thirst % 24 == 0) {
        l.log("<div class='logwarning'>"+l.calendar.nowatermessages[l.calendar.thirst/24]+"</div>");
    }
}






