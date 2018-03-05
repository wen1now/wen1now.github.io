/*
Tetris is 10x20 blocks
*/
/*-------------------BLOCKS----------------*/
//Basic tetromino blocks, in coordinates
//e.g [[0,0],[0,1],[0,2],[1,1]] means 
/* ooo
   xox
*/

var l = new Object(); //just habit to use l


l.tetrominoes = [
[[0,0],[1,0],[2,0],[3,0]], //I
[[0,0],[0,1],[1,0],[1,1]], //O
[[0,0],[0,1],[0,2],[1,1]], //T
[[0,0],[0,1],[1,0],[2,0]], //J
[[0,0],[0,1],[1,1],[2,1]], //L
[[0,0],[1,0],[1,1],[2,1]], //S
[[0,1],[1,0],[1,1],[2,0]]  //Z
]

/*------------------GRID STUFF--------------*/
//set up the grid

l.blocks = [];
l.setupblocks = function(){
    for (var i = 0; i < 24; i++){
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
    l.draw();
    if (l.gameover){l.gameoverfunc();}
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
            if (l.current[i][0]>20){
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
            l.blocks[23] = [];
            for (var i = 0; i<10; i++){
                l.blocks[23].push(0);
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
l.getrandom = function(n){
    if (l.randomnumbers.length < 5){
        for (var i = 0; i<n; i++){
            for (var j=0; j<4; j++){
                l.randomnumbers.push(i);
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

    x=l.getrandom(7);
    l.nextblock = l.tetrominoes[x];
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
    l.speed = 1000*(l.level**(-1/2));
    document.getElementById("writeLevel").innerHTML = l.level;
    clearInterval(l.gameInterval);
    l.gameInterval = setInterval(l.godown, l.speed);
}

/*---------------Game begin/end stuffs-------------*/
l.gamestatus = 0; //0 = hasn't started, 1 = started, 2 = paused
l.level = 1;
l.speed = 1000;
l.buttonClick = function(){
    if (l.gamestatus == 0){
        l.lines = 0;
        l.score = 0;
        l.level = 1;
        document.getElementById("writeLevel").innerHTML = "1";
        document.getElementById("writeScore").innerHTML = "0";
        document.getElementById("writeLines").innerHTML = "0";
        l.speed = 1000;
        l.gamestatus = 1;
        l.gameover = false;
        l.setupblocks();
        l.generatenext();
        l.newblock();
        l.gameInterval = setInterval(l.godown, 1000);
        document.getElementById("gameButton").innerHTML = "Pause";
        document.getElementById("mainGame").innerHTML = "";
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
}

l.gameover = false;
l.gameoverfunc = function(){
    l.gamestatus = 0;
    clearInterval(l.gameInterval);
    document.getElementById("gameButton").innerHTML = "New game";
    l.draw();
}