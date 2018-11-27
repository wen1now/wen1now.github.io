main = document.getElementById('game');
playing = false;

document.getElementById("tooltip").style.visibility = "hidden";
saveLocation = "gravity_blocks"
//default is jailbreak_save
//other options: ukteam,tempsave

golden_keys = 0;
drawMenu = function(){
	main.innerHTML = '';
	document.getElementById("information").innerHTML = "";
	document.getElementById("sizeincrease").style.visibility = "hidden";
	document.getElementById("sizedecrease").style.visibility = "hidden";
	playing = false;
	main.innerHTML = '&nbspPick a level:<br>';
	checkunlocks();
	for (var i = 0; i < levels.length; i++){
		if (levels[i].vis||levels[i].completed){
			if (levels[i].completed){
				main.innerHTML += '<div onclick="drawlevel_('+i+')" class="choicebutton levelbutton" id="level'+i+'">'+(i+1)+'</div>';
			} else {
				main.innerHTML += '<div onclick="drawlevel_('+i+')" class="choicebutton unfinishedlevelbutton" id="level'+i+'">'+(i+1)+'</div>';				
			}
		}
	}
}

drawScore = function(){
	document.getElementById("score").innerHTML = "Keys: "+points;
}

drawlevel_ = function(index){
	level_index = parseInt(index);
	loadlevel(levels[level_index].level);
	document.getElementById("information").innerHTML = "Level "+(index+1);
	document.getElementById("sizeincrease").style.visibility = "visible";
	document.getElementById("sizedecrease").style.visibility = "visible";
}

class Block {
	constructor(x,y,letter){
		this.x = x;//x,y coordinates are inverted be careful
		this.y = y;
		this.letter = letter;
	}

	setmovable(dir){
		if (!this.momentum){return}
		var stuff = new Set([this]);
		var stillgoing = true;
		while (stillgoing){
			stillgoing = false;
			for (var i of stuff){
				for (var j = 0; j<=3; j++){
					var tempblock = getsquare(i.x+d[j][0],i.y+d[j][1]);
						if ((!stuff.has(tempblock))
							&& (tempblock instanceof Block)
							&& (tempblock.momentum==i.momentum)
							&& tempblock.letter == i.letter){
								stuff.add(tempblock);
								stillgoing = true
						}
				}
				var tempblock = getsquare(i.x+d[dir][0],i.y+d[dir][1])
				if (tempblock =='#'){
					this.movable = false; return
				} else if (tempblock instanceof Block && (!stuff.has(tempblock))){
					stuff.add(tempblock);
					stillgoing = true
				}
			}
		}
		for (var i of stuff){
			i.movable = true;
			this.movable = true; //failsafe just in case??
		}
	}
}

getsquare = function(x,y){
	for (var i in walls){
		if (walls[i][0]==x && walls[i][1]==y){
			return '#'
		}
	}
	for (var i in blocks){
		if (blocks[i].x == x && blocks[i].y == y){
			return blocks[i]
		}
	}
	return undefined
}

/*
loadlevel = function(string){
    main.innerHTML='<canvas id="canvas" width="1200px" height="1200px"></canvas>';
	x=string.split('\n');
	gameover = false;
	win = false;
	lastattempted = string;
	undolist = [];
	walls = [];
	blocks = [];
	var i = 0;
	for (var i_ = 0; i_<x.length; i_++){
		var j = 0;
		for (var j_ = 0; j_<x[i_].length; j_++){
			t=x[i_][j_];
			if (t=='#'){
				walls.push([i,j])
			} else if (t==' '){
				j--;
			} else if (t in letters){
				var block = new Block(i,j,x[i_][j_]);
				blocks.push(block);
				console.log('here')
			}
			j++;
		}
		i++;
	}
	playing = true;
	drawlevel(50);
}
*/

print = function(string){
	console.log(string)
}

loadlevel = function(string){
    main.innerHTML='<canvas id="canvas" width="1200px" height="1200px"></canvas>';
	x=string.split('\n');
	gameover = false;
	win = false;
	lastattempted = string;
	undolist = [];
	level = [];
	walls = [];
	leveltemplate = [];
	blocks = [];
	var i = 0;
	for (var i_ = 0; i_<x.length; i_++){
		level.push([]);
		leveltemplate.push([]);
		var j = 0;
		for (var j_ = 0; j_<x[i_].length; j_++){
			level[i].push([]);
			leveltemplate[i].push(0);
			t=x[i_][j_];
			if (t=='#'){
				walls.push([i,j])
			} else if (letters.includes(t)){
				var block = new Block(i,j,x[i_][j_]);
				blocks.push(block);
			} else if (t==' '){
				level[i].pop();
				leveltemplate[i].pop();
				j--;
			}
			j++;
		}
		if (level[i].length==0){level.pop()}
		else {i++}
	}
	playing = true;
	drawlevel();
}

size = 40;
colorscheme = new Object()
letters = ['a','b','c','d',,'e','f','A','B','C','D','E','F','G']
colors = ['#1e1','#e11','#11e','#cc2','#c2c','#2cc','#999','#999','#999','#999','#999','#999','#999']
for (var i in letters){
	colorscheme[letters[i]] = colors[i]
}

drawlevel = function( /*size is the size of each square*/){
	if (size == undefined){
		size = 50;
	} //failsafe if anything dies
	var canvas = document.getElementById('canvas');
	var c = canvas.getContext('2d');
	c.clearRect(0, 0, 1200, 1200);
	c.beginPath();
	for (var i in walls){
		e = walls[i];
		c.fillStyle = '#222';
		c.fillRect(e[1]*size,e[0]*size,size,size);
	}
	for (var i in blocks){
		e = blocks[i];
		c.fillStyle = colorscheme[e.letter];
		c.fillRect((e.y+0.05)*size,(e.x+0.05)*size,size*0.9,size*0.9);
		//now for the hard part -- the four corners, four edges
		var b,r;
		b=getsquare(blocks[i].x+1,blocks[i].y);
		r=getsquare(blocks[i].x,blocks[i].y+1);
		if (b instanceof Block && b.letter == blocks[i].letter){
			c.fillRect((e.y+0.05)*size,(e.x+0.95)*size,size*0.9,size*0.1);
		}
		if (r instanceof Block && r.letter == blocks[i].letter){
			c.fillRect((e.y+0.95)*size,(e.x+0.05)*size,size*0.1,size*0.9);
			if (b instanceof Block && b.letter == blocks[i].letter){
				var rb = getsquare(blocks[i].x+1,blocks[i].y+1);
				if (rb instanceof Block && rb.letter == blocks[i].letter){
					c.fillRect((e.y+0.95)*size,(e.x+0.95)*size,size*0.1,size*0.1);
				}
			}
		}
	}
}

sizeincrease = function(){
	size *= 1.1;
	drawlevel();
}

sizedecrease = function(){
	size /= 1.1;
	drawlevel();
}
//edittiti iosfa osdfao dfhpsaihf pasdohf
stringlevel = function(){
	string = ''
	for (var i in level){
		for (var j in level[i]){
			space=true;
			for (var k in blocks){
				if (blocks[k].x==i && blocks[k].y==j){
					space = false;
					string+=blocks[k].letter
				}
			}
			for (var k in walls){
				if (walls[k][0]==i && walls[k][1]==j){
					space = false;
					string+='#'
				}
			}
			if (space){string+='.'}
		}
		string+='\n'
	}
	return string;
}

undo = function(){
	if (undolist.length>0){
		var temp = lastattempted;
		var temp_ = undolist.slice();
		loadlevel(undolist.pop());
		undolist = temp_;
		undolist.pop()
		lastattempted = temp;
		drawlevel(50);
	}
}

undolist = []

nextlevel = function (){
	if (level_index+1<levels.length){
		drawlevel_(level_index+1)
	} else {drawMenu()}
}

d=[[-1,0],[0,1],[1,0],[0,-1]];
function move(dir){//this function moves objects
	var cont = true;
	var undosaved = false;
	for (var i in blocks){
		blocks[i].momentum = true;
	}
	while (cont){
		for (var i in blocks){
			blocks[i].movable = undefined;
		}
		for (var i in blocks){
			if (blocks[i].movable === undefined){
				blocks[i].setmovable(dir);
			}
		}
		cont = false;
		for (i in blocks){
			if (blocks[i].movable){
				if (!undosaved){
					undolist.push(stringlevel());
					undosaved = true
				}
				blocks[i].x += d[dir][0];
				blocks[i].y += d[dir][1];
				cont = true;
			} else {
				blocks[i].momentum = false;
			}
		}
	}
	drawlevel();
	if (gamewon()){
		gameover = true;
		win = true;
		playing = false;
		levels[level_index].completed = true;
		checkunlocks();
		save();
		setTimeout(nextlevel,500);
	}
}

gamewon = function(){
	types = new Object();
	for (var i in blocks){
		if (types[blocks[i].letter]){
			types[blocks[i].letter].push([blocks[i].x,blocks[i].y])
		} else {
			types[blocks[i].letter] = [[blocks[i].x,blocks[i].y]]
		}
	}
	for (var letters in types){
		var s = [types[letters].pop()]
		var cont = true;
		while (cont){
			cont = false;
			for (var j of types[letters]){
				keepgoing = true;
				for (var k of s){
					if (keepgoing && (((j[0]-k[0])**2+(j[1]-k[1])**2)<=1)){
						cont = true;
						s.push(j);
						for( var i = 0; i < types[letters].length; i++){ 
						   if ( types[letters][i] === j) {
						     types[letters].splice(i, 1);
						   }
						}
						keepgoing = false
					}
				}
			}
		}
		if (types[letters].length!==0){
			return false
		}
	}
	return true
}

document.onkeydown = checkKey;

function checkKey(e){
    e = e || window.event;
    if (playing){
	    if (e.keyCode == '37' || e.keyCode == '65') {
	        // left  arrow
	        move(3)
	    } else if (e.keyCode == '38' || e.keyCode == '87') {
	        // up    arrow
	        move(0)
	    } else if (e.keyCode == '39' || e.keyCode == '68') {
	    	// right arrow 
	    	move(1)
	    } else if (e.keyCode == '40' || e.keyCode == '83') {
	    	// down  arrow
	    	move(2)
	    } else if (e.keyCode == '82') {
	    	// 'r' key
	    	loadlevel(lastattempted);
	    } else if (e.keyCode == '85' || e.keyCode == '90') {
	    	// 'r' key
	    	undo();
	    }
	}
}

points = 0;

save = function(){
	//it *should* save the game here at some point
	//stuff to save: which levels have been completed, player's current point number
	var finished = []
	for (var i = 0; i < levels.length; i++) {
		if (levels[i].completed){finished.push(levels[i].id)}
	}
    localStorage.setItem(saveLocation, JSON.stringify(finished));
}

delsave = function(){
    localStorage.removeItem(saveLocation);
}

load = function(){
	//load the game too, that seems necessary
    if (localStorage.getItem(saveLocation)){
        var finished = JSON.parse(localStorage.getItem(saveLocation));
		for (var i = 0; i < levels.length; i++){
			if (finished.includes(levels[i].id)){
				levels[i].completed = true;
			}
		}
    }
}

setup = function(){
	for (var i = 0; i < levels.length; i++) {
		levels[i].completed = false;
		levels[i].vis = false;
	}
}

checkunlocks = function(){
	c = 0; //number of levels visible at a time
	for (var i = 0; (c<=2)&&(i < levels.length); i++) {
		levels[i].vis = true
		if (!levels[i].completed){
			c+=1
		}
	}
}

levels = [{
	id: '00000',
	level:
`
#####
#...##
#....#
##...#
#..a.##
#..##a#
#..a.a#
#.#####
###
`
},{
	id: '007a',
	level: 
`
######
#..a.#
#.#A.#
#AAA.#
#..a.#
######
`
},{
	id: '007',
	level: 
`
######
#.Ca.#
#.#AB#
#AAAB#
#..a.#
######
`
},{
	id: '006',
	level: 
`
########
#####aa#
######a#
#..BBaA#
#.#B.###
#....###
########
`
},{
	id: '004',
	level:
`
######
#ab..#
#ba..#
#ab#.#
#ba..#
######
`
},{
	id: '002',
	level:
`
######
#abab#
#baba#
##...#
#....#
######
`
},{
	id: '007d',
	level: 
`
######
#.CD.#
#a#AB#
#AAAB#
#..E.#
##a###
#aa#
####
`
}]

setup();
load();


drawMenu();
save();
