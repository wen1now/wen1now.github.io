/*This game can be freely distributed, modified and you
  can literally do whatever you want with it. Except try to
  make money out of it because then you'll be sued
  for copyright from the TETRIS company. Tough luck.*/


//Wait function
wait = function(milliseconds){
    start_time = new Date().getTime();
    for (var i = 0; i < Infinity; i++){
        if ((new Date().getTime() - start_time) > milliseconds){ break;}
    }
}

/*-------------------BLOCKS----------------*/
//Basic tetromino blocks, in coordinates
//e.g [[0,0],[0,1],[0,2],[1,1]] means 
/* ooo
   xox  <--- o = block, x = nothing
*/

var l = new Object(); //just habit to use l

l.blocksets = {
    tetrominoes: [
        [[0,0],[1,0],[2,0],[3,0]], //I
        [[0,0],[0,1],[1,0],[1,1]], //O
        [[0,0],[0,1],[0,2],[1,1]], //T
        [[0,0],[0,1],[1,0],[2,0]], //J
        [[0,0],[0,1],[1,1],[2,1]], //L
        [[0,0],[1,0],[1,1],[2,1]], //S
        [[0,1],[1,0],[1,1],[2,0]]  //Z
    ],
    eighthole: [
        [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1]]
    ],
    premiums: [
        [[0,0],[1,0],[2,0],[3,0],[4,0]],
        [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]] //really good for scores :)
    ],
    trominoes: [
        [[0,0],[1,0],[1,1]],
        [[0,0],[1,0],[2,0]]
    ],
    domino: [[[0,0],[1,0]]],
    square: [[[0,0]]]
}

l.blocksets.eighthole

/*------------------GRID STUFF--------------*/
//set up the grid

l.blocks = [];
l.setupblocks = function(){
    for (var i = 0; i < 30; i++){
        l.blocks[i]=[]
        for (var j = 0; j<10; j++){
            l.blocks[i].push(0);        //now the program has the grid in storage
        }
    }
}

l.colours = ["red","blue","green","yellow","orange","BlueViolet","Brown"];

//draw the blocks onto the screen
l.draw = function(){
    var x = "";
    for (var i in l.blocks){
        for (var j in l.blocks[i]){
            if ((l.blocks[i][j] != 0) && (i<20)){
                left = 20*j;
                bottom = 20*i;
                x+="<div class='block colour"+l.blocks[i][j]+"' style='left:"+left+"px; bottom:"+bottom+"px'></div>";
            }
        }
    };
    if (l.gameover){
        x += "<div id='gameover'><pre>Game over!</pre></div>";
    }
    document.getElementById("mainGame").innerHTML = x;
}

l.nextblock = [];
l.nextcolor = 0;
l.drawnext = function(){
    var x = "";
    for (var i in l.nextblock){
        left = 20*l.nextblock[i][1];
        bottom = 20*l.nextblock[i][0];
        x+="<div class='block colour"+l.nextcolor+"' style='left:"+left+"px; bottom:"+bottom+"px'></div>";
    }
    document.getElementById("nextblockspace").innerHTML = x;
}

/*------------------Moving the block--------------*/
//-----Key presses first------//
//l.current = []; //blocks that are currently being controlled
l.currentcolor = 1; //change this later
l.current = []; //blocks that are currently being controlled
l.incurrent = function(value){
    for (var i in l.current){
        if ((l.current[i][0]==value[0]) && (l.current[i][1]==value[1])){
            return true;
        }
    }
    return false;
}

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;
    if (l.gamestatus != 1){
        e = new Object();
        e.keyCode = 'paused';
    }

    if (e.keyCode == '38') {
        // up arrow: rotate
        l.rot();
    }
    else if (e.keyCode == '40') {
        // down arrow: go down
        l.godown();
    }
    else if (e.keyCode == '37') {
        // left arrow: move left (obviously)
        canmove = true;
        for (var i in l.current){
            if (((Boolean(l.blocks[l.current[i][0]][l.current[i][1]-1]) && !(l.incurrent([l.current[i][0],l.current[i][1]-1])))) || l.current[i][1]<1){
                canmove = false;
            }
        }
        if (canmove){
            for (var i in l.current){
                l.blocks[l.current[i][0]][l.current[i][1]]=0;
            }
            for (var i in l.current){
                l.blocks[l.current[i][0]][l.current[i][1]-1]=l.currentcolor;
                l.current[i][1]--;
            }
        }
    }
    else if (e.keyCode == '39') {
       // right: move left (jokes)
       canmove = true;
       for (var i in l.current){
           if (((Boolean(l.blocks[l.current[i][0]][l.current[i][1]+1]) && !(l.incurrent([l.current[i][0],l.current[i][1]+1])))) || l.current[i][1]>8){
               canmove = false;
           }
       }
       if (canmove){
           for (var i in l.current){
               l.blocks[l.current[i][0]][l.current[i][1]]=0;
           }
           for (var i in l.current){
               l.blocks[l.current[i][0]][l.current[i][1]+1]=l.currentcolor;
               l.current[i][1]++;
           }
       }
    }
    if (l.gamestatus == 1){
        l.draw();
        if (l.gameover){l.gameoverfunc();}
    }
}

//Moving the block down

l.godown = function(){
    canmove = true;
    for (var i in l.current){
        if (l.current[i][0]<1){
            canmove = false;
        }
        else if (((Boolean(l.blocks[l.current[i][0]-1][l.current[i][1]]) && !(l.incurrent([l.current[i][0]-1,l.current[i][1]]))))){
            canmove = false;
        }
    }
    if (canmove){
        for (var i in l.current){
            l.blocks[l.current[i][0]][l.current[i][1]]=0;
        }
        for (var i in l.current){
            l.blocks[l.current[i][0]-1][l.current[i][1]]=l.currentcolor;
            l.current[i][0]--;
        }
    } else {
        //that means the block cannot move, ADD to score (if applicable),
        //STOP current and CREATE a new block
        //check lines FIRST>>>>
        l.gameover = false;
        for (var i in l.current){
            if (l.current[i][0]>19){
                l.gameover = true;
            }
        }
        if (l.gameover){l.gameoverfunc();}
        lines = 0;
        linescleared = [];
        for (var i in l.blocks){
            cleared = true;
            for (var j in l.blocks[i]){
                if (l.blocks[i][j]==0){
                    cleared = false;
                }
            }
            if (cleared){
                linescleared.push(i-lines);
                lines++;
            }
        }
        //calculate score using l.addscore(score) function here
        l.addscore(lines);
        //remove the lines
        for (var i in linescleared){
            l.blocks.splice(linescleared[i],1);
            l.blocks[l.blocks.length] = [];
            for (var i = 0; i<10; i++){
                l.blocks[l.blocks.length-1].push(0);
            }
        }
        //now we STOP the current block>>>>
        //Randomise generation
        l.newblock()
    }
    l.draw() //who cares about efficiency?? actually i do but meh.
}

//rotating a block (i think that's important);
l.rotate = function(coords){
    result = [];
    for (var i in coords){
        result.push([-coords[i][1],coords[i][0]]);
    }
    le = 0;
    to = 0;
    for (var i in result){
        if (result[i][1]<le){le=result[i][1]};
        if (result[i][1]>to){to=result[i][1]};
    }
    for (var i in result){
        result[i][0]-=to;
        result[i][1]-=le;
    }
    return result;
}

l.rot = function(){ //use this one to rotate the block
    /*Okay, so this is basically the hardest part of the program
    We need a few things: firstly, we rotate around the top left
    Secondly, actually do the rotation
    Lastly (easy part) make sure it is possible*/
    topp = 0; //mispelled because i think top is reserved
    left = 10;
    for (var i in l.current){
        if (l.current[i][0]>topp){topp=l.current[i][0]};
        if (l.current[i][1]<left){left=l.current[i][1]}
    }
    l.rotatecurrent = []; //where the rotated version will go
    temp = [];
    for (var i in l.current){
        temp.push([l.current[i][0]-topp,l.current[i][1]-left]); //move to origin
    }
    temp2 = l.rotate(temp);
    for (var i in temp2){
        l.rotatecurrent.push([temp2[i][0]+topp,temp2[i][1]+left]);
    }
    canmove = true;
    for (var i in l.rotatecurrent){
        if (((Boolean(l.blocks[l.rotatecurrent[i][0]][l.rotatecurrent[i][1]]) && !(l.incurrent([l.rotatecurrent[i][0],l.rotatecurrent[i][1]])))) || (l.rotatecurrent[i][0]<0) || (l.rotatecurrent[i][1]>9)){
           canmove = false;
        }
    }
    if (canmove){
        for (var i in l.current){
            l.blocks[l.current[i][0]][l.current[i][1]]=0;
        }
        for (var i in l.rotatecurrent){
            l.blocks[l.rotatecurrent[i][0]][l.rotatecurrent[i][1]]=l.currentcolor;
        }
        l.current = l.rotatecurrent;
    }
}

/*------------------Generating a block--------------*/
l.randomnumbers = [];
l.getrandom = function(chances,sum){
    if (l.randomnumbers.length < sum/5){
        for (var i in chances){
            for (var j=0; j<chances[i]; j++){
                l.randomnumbers.push(parseInt(i));
            }
        }
    }
    var randomIndex = Math.floor(Math.random()*l.randomnumbers.length);
    return l.randomnumbers.splice(randomIndex, 1)[0];
}

l.numblocks = 0;
l.generatenext = function(){
    l.numblocks ++;
    /*------LEVEL INCREASE-----*/
    if (l.numblocks % 24 == 0){
        l.levelincrease();
    }

    x=l.getrandom(l.cgamemode.chances,l.cgamemode.chancesum);
    l.nextblock = l.cgamemode.blocks[x];
    l.nextcolor = x+1;
    topp = 0;
    left = 10000;
    for (var i in l.nextblock){
        if (l.nextblock[i][0]>topp){topp=l.nextblock[i][0]};
        if (l.nextblock[i][1]<left){left=l.nextblock[i][1]}
    }
    l.rotated = []; //where the rotated version will go
    temp = [];
    for (var i in l.nextblock){
        temp.push([l.nextblock[i][0]-topp,l.nextblock[i][1]-left]); //move to origin
    }
    for (i=0;i<Math.floor(Math.random()*4);i++){
        temp=l.rotate(temp);
    }
    l.rotated = temp;
    l.nextblock = [];
    for (var i in l.rotated){
        l.nextblock.push([l.rotated[i][0]+topp,l.rotated[i][1]+left]);
    }
    l.drawnext();
}

l.newblock = function(){
    l.current = [];
    l.currentcolor = l.nextcolor;
    for (var i in l.nextblock){
        l.current.push([20+l.nextblock[i][0],l.nextblock[i][1]+4])
    }
    l.generatenext();
    //HAHAHAH special effects
    for (var i in l.cgamemode.onnewblock){
        if (l.numblocks % l.cgamemode.onnewblock[i][1] == 0){
            if (Math.round(Math.random()*l.cgamemode.onnewblock[i][2]) == 1){
                l.cgamemode.onnewblock[i][0]()
            }
        }
    }
    l.drawnext();
}

/*------------------Score stuffs-------------------*/
l.lines = 0;
l.score = 0;
l.addscore = function(lines){
    l.lines += lines;
    l.score += (lines*(lines+1))/2;
    document.getElementById("writeScore").innerHTML = l.score;
    document.getElementById("writeLines").innerHTML = l.lines;
}

//Subsection of ^ ?? probs not
l.levelincrease = function(){
    l.level++;
    l.speed = l.cgamemode.speed(l.level);
    document.getElementById("writeLevel").innerHTML = l.level;
    clearInterval(l.gameInterval);
    l.gameInterval = setInterval(l.godown, l.speed);
    l.cgamemode.onlevelup();
}

/*---------------Game begin/end stuffs-------------*/
l.gamestatus = 0; //0 = hasn't started, 1 = started, 2 = paused, 3 = new game
l.level = 1;
l.speed = 1000;
l.buttonClick = function(){
    if (l.gamestatus == 0){
        l.setother();
        l.lines = 0;
        l.score = 0;
        l.level = 1;
        document.getElementById("writeLevel").innerHTML = "1";
        document.getElementById("writeScore").innerHTML = "0";
        document.getElementById("writeLines").innerHTML = "0";
        l.cgamemode = l.gamemodes[l.cmode];
        l.speed = l.cgamemode.speed(l.level);
        l.gamestatus = 1;
        l.gameover = false;
        l.randomnumbers = [];
        l.numblocks = 0;
        l.setupblocks();
        l.generatenext();
        l.newblock();
        document.getElementById("rightarrow").disabled = true;
        document.getElementById("leftarrow").disabled = true;
        document.getElementById("gameButton").innerHTML = "Pause";
        document.getElementById("mainGame").innerHTML = "";
        l.cgamemode.ongamestart();
        clearInterval(l.gameInterval);
        l.gameInterval = setInterval(l.godown, l.speed);
    }
    else if (l.gamestatus == 1){
        l.gamestatus = 2;
        clearInterval(l.gameInterval);
        document.getElementById("gameButton").innerHTML = "Play";
    }
    else if (l.gamestatus == 2){
        l.gamestatus = 1;
        l.gameInterval = setInterval(l.godown, l.speed);
        document.getElementById("gameButton").innerHTML = "Pause";
    }
    else if (l.gamestatus == 3){
        l.gamestatus = 0;
        document.getElementById("writeLevel").innerHTML = "1";
        document.getElementById("writeScore").innerHTML = "0";
        document.getElementById("writeLines").innerHTML = "0";
        document.getElementById("mainGame").innerHTML = "";
        document.getElementById("rightarrow").disabled = false;
        document.getElementById("leftarrow").disabled = false;
        document.getElementById("nextblockspace").innerHTML = "";
        document.getElementById("gameButton").innerHTML = "Begin game";
    }
}

l.gameover = false;
l.gameoverfunc = function(){
    l.gamestatus = 3;
    clearInterval(l.gameInterval);
    l.savehighscore();
    l.gamemodechanged();
    document.getElementById("gameButton").innerHTML = "New game";
    l.draw();
}

/*--------Gamemodes (as of v1.1)-------*/
l.incmode = function(){
    if (l.cmode<(l.gamemodes).length-1){
        l.cmode++;
        l.gamemodechanged();
    }
}

l.decmode = function(){
    if (l.cmode>0){
        l.cmode--;
        l.gamemodechanged();
    }
}

l.gamemodechanged = function(){
    document.getElementById("gamemodename").innerHTML = l.gamemodes[l.cmode].name;
    if (l.gamemodes[l.cmode].dif != 0){
        document.getElementById("dif").innerHTML = l.gamemodes[l.cmode].dif;
    } else {document.getElementById("dif").innerHTML = "???"}
    l.setother();
    if (l.current_highscores[l.gamemodes[l.cmode].name].length>0){
        x="<tr><td class='column1'>User</td><td class='othercolumnheads'>Score</td><td class='othercolumnheads'>Lines</td><td class='othercolumnheads'>Level</td></tr>";
        for (var i in l.current_highscores[l.gamemodes[l.cmode].name]){
            y = l.current_highscores[l.gamemodes[l.cmode].name][i];
            x+="<tr><td class='column1'>"+y.user+"</td>";
            x+="<td>"+y.score+"</td>";
            x+="<td>"+y.lines+"</td>";
            x+="<td>"+y.level+"</td></tr>";
        }
        document.getElementById("highscoretable").innerHTML = x;
    } else {
    document.getElementById("highscoretable").innerHTML = "Nobody has scored anything worthy yet! Be the first!";
    }
}

l.gamemodespeeds = [
    
]

l.gamemodes = [{
    name: "Frozen",
    speed: function(level){return 1e11;},
    dif: 6
    },{
    name: "Neverchanging SLOW",
    speed: function(level){return 2000;},
    dif: 8
    },{
    name: "Neverchanging",
    speed: function(level){return 1000;},
    dif: 10
    },{
    name: "Neverchanging II",
    speed: function(level){return 200;},
    dif: 30
    },{
    name: "Neverchanging III",
    speed: function(level){return 100;},
    dif: 75
    },{
    name: "Extra slow",
    speed:
        function(level){
           return 2000*((level+10)**(-1/4));
        },
    dif: 12
    },{
    name: "Slow",
    speed:
        function(level){
           return 1200*((level+10)**(-1/3));
        },
    dif: 20
    },{
    name: "Classic",
    dif: 26,
    speed:
        function(level){
           return 1000*((level+10)**(-1/2));
        },
    },{
    name: "Fast",
    speed:
        function(level){
           return 800*((level+10)**(-3/5));
        },
    dif: 33
    },{
    name: "Extra fast",
    speed:
        function(level){
           return 600*((level+10)**(-3/4));
        },
    dif: 40
    },{
    name: "Insane",
    speed:
        function(level){
           return 500/(level+10);
        },
    dif: 60
    },{
    name: "Infini speed",
    speed:
        function(level){
           return 200*((level+10)**(-1/2));
        },
    dif: 80
    },{
    name: "Transcendant",
    speed:
        function(level){
           return 180*((level+10)**(-2/5));
        },
    dif: 130
    },{
    name: "Transdimensional",
    speed:
        function(level){
           return 120*((level+15)**(-1/5));
        },
    dif: 150
    },{
    name: "Neverchanging IV",
    speed: function(level){return 65;},
    dif: 150
    },{
    name: "Hellish",
    speed:
        function(level){
           return 180*((level+10)**(-1/2));
        },
    dif: 180
    },{
    name: "Impossible",
    speed:
        function(level){
           return 400*((level+100)**(-1/2));
        },
    dif: 210
    },{
    name: "Skip to 20",
    ongamestart:
        function(){
           l.level = 19;
           l.levelincrease();
        },
    dif: 48
    },{
    name: "Wavespeed",
    ongamestart:
        function(){
           l.speed = 200;
        },
    speed: function(level){
            return l.speed;
        },
    onlevelup: function(){
            l.speed *= (0.5+(360*Math.random()+1)/l.speed);
        },
    dif: 48
    },{
    name: "Wavespeed II",
    ongamestart:
        function(){
           l.speed = 100;
        },
    speed: function(level){
            return l.speed;
        },
    onlevelup: function(){
            l.speed *= (0.4+(300*Math.random()+1)/l.speed);
        },
    dif: 88
    },{
    name: "Wavespeed III",
    ongamestart:
        function(){
           l.speed = 80;
        },
    speed: function(level){
            return l.speed;
        },
    onlevelup: function(){
            l.speed *= (0.4+(240*Math.random()+1)/l.speed);
        },
    dif: 140
    },{
    name: "Wavespeed IV",
    ongamestart:
        function(){
           l.speed = 60;
        },
    speed: function(level){
            return l.speed;
        },
    onlevelup: function(){
            l.speed *= (0.3+(200*Math.random()+1)/l.speed);
        },
    dif: 160
    },{
    name: "Glitched",
    onnewblock: [[   //basically this happens every now and 
                  //again, in the form [[function, every m blocks, with chance 1/x],[nextfunction, every n blocks, with chance 1/y]]
        function(){
            l.gamestatus = "glitched";//a little hack to stop everything working
            document.getElementById("gameButton").innerHTML = "GlItchEd";
            x = l.numblocks;
            clearInterval(l.gameInterval);
            while (x == l.numblocks){
                l.godown();
            }
            document.getElementById("gameButton").innerHTML = "Pause";
            l.gameInterval = setInterval(l.godown, l.speed);
            l.gamestatus = 1;          
        }, 3, 9]],
    dif: 41,
    speed:
        function(level){
           return 1000*((level+10)**(-1/2));
        }
    },{
    name: "Rigged",
    chances: [2,9,3,2,2,19,19],
    dif: 50,
    speed:
        function(level){
           return 1000*((level+10)**(-1/2));
        }
    },{
    name: "More rigged",
    chances: [2,9,3,2,2,19,19],
    dif: 70,
    onnewblock: [[
        function(){
            l.nextblock = [[0,0],[1,0],[1,1],[2,1]]; //S
            l.nextcolor = 6
        },1,5
        ],[
        function(){
            l.nextblock = [[0,1],[1,0],[1,1],[2,0]];  //Z
            l.nextcolor = 7
        },1,6
        ]],
    speed:
        function(level){
           return 1000*((level+10)**(-1/2));
        }
    },{
    name: "Nice",
    chances: [6,4,3,7,7,2,2],
    dif: 18
    },{
    name: "Nice and fast",
    chances: [6,4,3,7,7,2,2],
    dif: 30,
    speed:
        function(level){
           return 600*((level+10)**(-3/4));
        }
    },{
    name: "Nice and fast II",
    chances: [6,4,3,7,7,2,2],
    dif: 40,
    speed:
        function(level){
           return 200*((level+10)**(-1/2));
        }
    },{
    name: "Rare block!",
    chances: [3,4,4,4,4,4,4,1,0],
    dif: 37,
    speed:
        function(level){
           return 300*((level+10)**(-1/2));
        },
    blocks: Array.prototype.concat(l.blocksets.tetrominoes,l.blocksets.premiums)
    },{
    name: "Rare block II!",
    chances: [9,12,12,12,12,12,12,2,1],
    dif: 28,
    speed:
        function(level){
           return 300*((level+10)**(-1/2));
        },
    blocks: Array.prototype.concat(l.blocksets.tetrominoes,l.blocksets.premiums)
    },{
    name: "Rare block II (F)",
    chances: [9,12,12,12,12,12,12,2,1],
    dif: 60,
    speed:
        function(level){
           return 100*((level+10)**(-1/2));
        },
    blocks: Array.prototype.concat(l.blocksets.tetrominoes,l.blocksets.premiums)
    },{
    name: "Full set",
    dif: 24,
    speed:
        function(level){
           return 1000*((level+10)**(-1/2));
        },
    blocks: Array.prototype.concat(l.blocksets.tetrominoes,l.blocksets.trominoes,l.blocksets.domino,l.blocksets.square)
    },{
    name: "Full set FAST",
    dif: 64,
    speed:
        function(level){
           return 300*((level+10)**(-3/5));
        },
    blocks: Array.prototype.concat(l.blocksets.tetrominoes,l.blocksets.trominoes,l.blocksets.domino,l.blocksets.square)
    },{
    name: "Sky city",
    dif: 90,
    speed:
        function(level){
           return 800*((level+10)**(-1/2));
        },
    onnewblock: [[
        function(){
            for (var i in (l.blocks[6])){
                if (Math.random()<0.05){
                    l.blocks[6][i] = 8;
                }
            }
        },5,8
        ],[
        function(){
            for (var i in (l.blocks[6])){
                if (Math.random()<0.15){
                    l.blocks[6][i] = 8;
                }
            }
        },5,6
        ],[
        function(){
            for (var i in (l.blocks[7])){
                if (Math.random()<0.25){
                    l.blocks[7][i] = 8;
                }
            }
        },5,5
        ],[
        function(){
            for (var i in (l.blocks[8])){
                if (Math.random()<0.3){
                    l.blocks[8][i] = 8;
                }
            }
        },5,4
        ],[
        function(){
            for (var i in (l.blocks[9])){
                if (Math.random()<0.35){
                    l.blocks[9][i] = 8;
                }
            }
        },5,4
        ],[
        function(){
            for (var i in (l.blocks[10])){
                if (Math.random()<0.3){
                    l.blocks[10][i] = 8;
                }
            }
        },5,4
        ],[
        function(){
            for (var i in (l.blocks[11])){
                if (Math.random()<0.25){
                    l.blocks[11][i] = 8;
                }
            }
        },5,5
        ],[
        function(){
            for (var i in (l.blocks[12])){
                if (Math.random()<0.15){
                    l.blocks[12][i] = 8;
                }
            }
        },5,6
        ],[
        function(){
            for (var i in (l.blocks[13])){
                if (Math.random()<0.05){
                    l.blocks[13][i] = 8;
                }
            }
        },5,8
        ]],
    ongamestart: function(){
            for (var i in (l.blocks[8])){
                if (Math.random()<0.3){
                    l.blocks[8][i] = 8;
                }
            }
            for (var i in (l.blocks[9])){
                if (Math.random()<0.35){
                    l.blocks[9][i] = 8;
                }
            }
            for (var i in (l.blocks[10])){
                if (Math.random()<0.3){
                    l.blocks[10][i] = 8;
                }
            }
        }
    }
]

l.gamemodeget = function(name){
    for (var i in l.gamemodes){
        if (l.gamemodes[i].name==name){return l.gamemodes[i];}
    }
    return undefined;
}

l.gamemodegetnumof = function(name){
    for (var i in l.gamemodes){
        if (l.gamemodes[i].name==name){return i;}
    }
    return 1;
}

l.cmode = l.gamemodegetnumof("Classic");
l.gamemodesetup = function(){
    for (var i in l.gamemodes){
        if (l.gamemodes[i].speed == undefined){
            l.gamemodes[i].speed = function(level){
                return 1000*(level**(-1/2));
            }
        }
        if (l.gamemodes[i].blocks == undefined){
            l.gamemodes[i].blocks = l.blocksets.tetrominoes;
        }
        if (l.gamemodes[i].onnewblock == undefined){
            l.gamemodes[i].onnewblock = [];
        }
        if (l.gamemodes[i].onlevelup == undefined){
            l.gamemodes[i].onlevelup = function(){};
        }
        if (l.gamemodes[i].ongamestart == undefined){
            l.gamemodes[i].ongamestart = function(){};
        }
        if (l.gamemodes[i].dif == undefined){
            l.gamemodes[i].dif = 0;
        }
        if (l.gamemodes[i].chances == undefined){
            l.gamemodes[i].chances = new Array();
            for (var j in l.gamemodes[i].blocks){
                l.gamemodes[i].chances.push(4);
            }
        }
        l.gamemodes[i].chancesum = 0;
        for (var j in l.gamemodes[i].chances){
            l.gamemodes[i].chancesum+=l.gamemodes[i].chances[j];
        }
    }
}

l.gamemodesetup();

/*-------------Highscores--------------*/
if (localStorage.getItem("tetris_highscores")){
    l.current_highscores = JSON.parse(localStorage.getItem("tetris_highscores"));
} else {l.current_highscores = new Object();}
for (var i in l.gamemodes){
    if (!l.current_highscores[l.gamemodes[i].name]){
        l.current_highscores[l.gamemodes[i].name] = new Array();
    }
}
if (localStorage.getItem("tetris_other")){
    l.other = JSON.parse(localStorage.getItem("tetris_other"));
    l.cmode = l.gamemodegetnumof(l.other.cmodename);
    l.user = l.other.user;
    document.getElementById("gamemodename").innerHTML = l.gamemodes[l.cmode].name;
} else {
    l.user = "Anonymous";
    l.other = {user: l.user, cmodename: l.gamemodes[l.cmode].name}
}
document.getElementById("changeuserbox").value = l.other.user;

l.setother = function(){
    l.other = {user: l.user, cmodename: l.gamemodes[l.cmode].name}
    localStorage.setItem("tetris_other",JSON.stringify(l.other));
}

l.savehighscore = function(){
    added = false;
    if (l.gamemodes[l.cmode].dif == 0){
    } else if (l.score<(10000/(l.gamemodes[l.cmode].dif**(1.6)))){
        added = true;
    }
    for (var i in l.current_highscores[l.gamemodes[l.cmode].name]){
        if (l.score>l.current_highscores[l.gamemodes[l.cmode].name][i].score && !added){
            added = true;
            l.current_highscores[l.gamemodes[l.cmode].name].splice(i,0,{user: l.user, score: l.score, lines: l.lines, level: l.level});
            if (l.current_highscores[l.gamemodes[l.cmode].name].length > 7){l.current_highscores[l.gamemodes[l.cmode].name].splice(7,1);}
        }
    }
    if (!added && l.current_highscores[l.gamemodes[l.cmode].name].length < 7){
        l.current_highscores[l.gamemodes[l.cmode].name].push({user: l.user, score: l.score, lines: l.lines, level: l.level});
        added = true;
    }
    //highly inefficient but it'll do
    if (added){
        localStorage.setItem("tetris_highscores",JSON.stringify(l.current_highscores));
    }
}

l.changeuser = function(){
    changed = false;
    newUser = document.getElementById("changeuserbox").value;
    if (l.gamestatus == 3){
        for (var i in l.current_highscores[l.gamemodes[l.cmode].name]){
            y = l.current_highscores[l.gamemodes[l.cmode].name][i];
            if ((y.user == l.user) && (y.score == l.score) && (y.lines == l.lines) && (y.level == l.level) && !changed){
                l.current_highscores[l.gamemodes[l.cmode].name][i] = {user: newUser, score: l.score, lines: l.lines, level: l.level};
                localStorage.setItem("tetris_highscores",JSON.stringify(l.current_highscores));
                changed = true;
            }
        }
        l.gamemodechanged();
    }
    l.user = newUser;
    l.other = {user: l.user, cmodename: l.gamemodes[l.cmode].name}
    l.setother();
}

l.gamemodechanged();




















