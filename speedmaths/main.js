

function updatequizinfo(){
	s_quiz = quizzes[select.value];
	quizinfo.innerHTML = "This quiz is rated "+s_quiz["difficulty"]+" and contains "+String(s_quiz["questions"].length)+" questions.";
	if (s_quiz["description"]){quizbonusinfo.innerHTML = s_quiz["description"]}
}

var timeremaining;
var questionnum;
var questions;
var defaulttime;
var quiz;
var current;
var answers;
var timer;
function startquiz(){
	quizinfo.innerHTML = "";
	quiz = quizzes[select.value];
	document.getElementById("endquiz").disabled = false;
	document.getElementById("startquiz").disabled = true;
	//defaults time to 60
	if (!quiz.defaulttime){defaulttime = 60} else {defaulttime = quiz.defaulttime}
	//sets start time
	if (quiz.starttime){timeremaining = quiz.starttime}
	else {timeremaining = defaulttime}
	//initialises questions
	questions = quiz.questions;
	questionnum = 0;
	answers = [];
	loadquestion();
}

function loadquestion(){
	current = questions[questionnum];
	clearInterval(timer);
	timer = setInterval(decrementTime,1000);
	//setup time for questions
	if (quiz.timestyle == "a"){
		if (current.time){timeremaining = current.time}
		else {timeremaining = defaulttime}
	} else if (quiz.timestyle == "b"){
		if (current.time){timeremaining += current.time}
		else {timeremaining += defaulttime}
	}
	if (!current.type){
		mainbox.innerHTML = "<div>"+current.question+"</div>";
		mainbox.innerHTML += "<input type='text' id='answer'></div>";
		answerelement = document.getElementById("answer");
		answerelement.addEventListener("keyup",function(event){
			if (event.keyCode === 13){
				answers.push(answerelement.value);
				if (++questionnum<questions.length){
					loadquestion(questionnum);
				} else {
					endquiz(false);
				}
			}
		});
		answerelement.focus();
	}
	showTime();
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"mainbox"]);
}

function answercheck(answer){
	if (!current.type){
		if (current.answer){
			return current.answer == answer;
		}
		if (current.answercheck){
			return current.answercheck(answer);
		}
	}
}

function endquiz(clicked){
	clearInterval(timer);
	var defaultscore = 1;
	var totalscore = 0;
	var maxscore = 0;
	if (quiz.defaultscore){
		defaultscore = quiz.defaultscore;
	}
	for (i in questions){
		current = questions[i];
		if (answercheck(answers[i])){
			if (current.score){
				totalscore += questions[i].score;
			} else {
				totalscore += defaultscore;
			}
		}
		if (current.score){
			maxscore += questions[i].score;
		} else {
			maxscore += defaultscore;
		}
	}
	if (timeremaining <= 0){
		mainbox.innerHTML = "<div>You timed out on "+quiz.name+" :(</div>"
	} else if (!clicked){
		mainbox.innerHTML = "<div>"+quiz.name+" complete!</div>"
	} else {
		mainbox.innerHTML = "<div>"+quiz.name+" ended early!</div>"
	}
	mainbox.innerHTML += "<div>Your score was "+String(totalscore)+"/"+String(maxscore)+"</div>";
	document.getElementById("endquiz").disabled = true;
	document.getElementById("startquiz").disabled = false;
}

function timestamp(){
	var a = Math.floor(timeremaining/60);
	var b = Math.floor(timeremaining%60);
	if (a>60){
		/////////////////////////////finish this off later
	} else {
		if (b<10){
			return String(a)+":0"+String(b);
		} else {
			return String(a)+":"+String(b);
		}
	}
}

function decrementTime(){
	timeremaining--;
	if (timeremaining <= 0){
		if (quiz.timestyle == "b"){
			endquiz();
		} else if (quiz.timestyle == "a") {
			if (++questionnum<questions.length){
				loadquestion(questionnum);
			} else {
				endquiz(false);
			}
		} else {
			endquiz();
		}
	}
	showTime();
}

function showTime(){
	timebox.innerHTML = "Time remaining: "+timestamp();
}

var quizinfo,quizbonusinfo,mainbox,select,timebox;
function setup(){
	quizinfo = document.getElementById("quizinfo");
	mainbox = document.getElementById("main");
	quizbonusinfo = document.getElementById("quizbonusinfo");
	timebox = document.getElementById("time");
	select = document.getElementById("select");
	for (var i in quizzes){
	    var opt = document.createElement('option');
	    opt.value = i;
	    opt.innerHTML = quizzes[i]["name"];
	    select.appendChild(opt);
	}
	updatequizinfo();
}






/*
guide to timestyles:
timestyle a: fixed amount of time per question, no carries
timestyle b: time left over from previous question carries to the next


*/



quizzes = [{
	name: "Speed Arithmetic 1",
	difficulty: "baby",
	description: "How fast are your fingers?",
	timestyle: "a",
	defaulttime: 5,
	questions: [{
			question: "7x7=",
			answer: 49
		},{
			question: "11x11=",
			answer: 121
		},{
			question: "12+34=",
			answer: 46
		},{
			question: "$2^7=$",
			answer: 128
		},{
			question: "9x91=",
			answer:819
		},{
			question: "456-123=",
			answer:333
		},{
			question: "$3^2-2^3=$",
			answer:1
		},{
			question: "1000-123=",
			answer:877
		},{
			question: "1+1",
			answer:2
		},{
			question: "10000000+100000000",
			answer:110000000
		}
	]
},{
	name:"Spelling bee",
	difficulty: "medium",
	description: "Can you type quickly annd accurately? Each word is typod. Spell them correctly",
	timestyle: "a",
	defaulttime: 20,
	questions:[{
			question: "flem",
			answer: "phlegm"
		},{
			question: "yot",
			answer: "yacht"
		},{
			question: "mininum",
			answer: "minimum"
		},{
			question: "car key",
			answer: "khaki"
		},{
			question: "f e g",
			answer: "effigy"
		}
	]
},{
	name:"Trained Mathematician",
	difficulty: "hard",
	description: "\"These are fast exercises that any well trained mathematician should be able to perform in under 90 seconds each.\" -- Ross Atkins",
	timestyle: "a",
	defaulttime: 90,
	questions:[{
			question: "Name a prime number greater than 2019 (not too large please)",
			answercheck: function(input){
				num = parseInt(input);
				if (num>100000000){return false}
			    for(let i = 2, s = Math.sqrt(num); i <= s; i++)
			        if(num % i === 0) return false; 
			    return num > 1;
			}
		},{
			question: "What is the prime factorisation of 2119? (answer separated by commas; e.g for 28 the answer would be 2,2,7)",
			answer: "13,163"
		},{
			question: "What is the greatest common divisor of 208 and 247?",
			answer: 13
		},{
			question: "What is the units digit of $27^{27^{27}}$?",
			answer: 3
		},{
			question: "Give an integer a such that $a\\equiv 3 \\pmod {63}$ and $a \\equiv 100 \\pmod {101}$.",
			answercheck: function(input){
				num = parseInt(input);
				return (num%63==3 && num%101==100);
			}
		},{
			question: "Find a pair of integers $x$ and $y$ such that $51x=64y+1$. (answer separated by a comma)",
			answercheck: function(input){
				arr = input.split(',');
				if (arr.length==2){
					return parseInt(51*arr[0]==64*arr[1]+1)
				}
				return false
			}
		},{
			question: `<s>What is the sum of all square numbers which are divisors of $2019^{2019}$?</s>
			Unfortunately this question has to be taken down from the quiz due to technical difficulties :(
			I'll use an honour-based system: type '1' if you manage to solve it else pass`,
			answer: 1
		},{
			question: "Does there exist an integer $n$ such that $n^2\\equiv 3 \\pmod {109}$ (yes/no)?",
			answer: 'yes'
		},{
			question: "How many residues $x$ in mod 19 satisfy: $x^3\\equiv 7 \\pmod {19}$?",
			answer: 3
		},{
			question: "Which is greater: a) the number of digits of 100! or b) the number of divisors of 100!? (a/b)",
			answer: 'b'
		}
	]
}]