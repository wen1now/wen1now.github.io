function outputstring(){
    var x=new Date();
    x.setTime(x.getTime()-v*500);
    if ((x.getHours()>=16)||((x.getHours()>=15)&&(x.getMinutes()>=10))){
        return ["School has finished","Finished"]
    }
    var y=x.getDay();
    if ((y==0)||(y==6)){
        if (y==0){t="Sun"}else{t="sat"}
        return ["No school today",t]
    }
    tw=["8:25","8:30","8:42","8:46","9:27","9:31","10:12","10:37","10:41","11:22","11:26","12:07","12:11","12:51","13:11","13:31","13:35","14:15","14:19","14:59","15:03","15:10"];
    mf=["8:25","8:30","8:42","8:46","9:34","9:38","10:26","10:51","10:55","11:43","11:47","12:35","12:55","13:15","13:19","14:07","14:11","14:59","15:03","15:10"];
    thur=["8:25","8:30","8:42","8:46","9:30","9:34","10:18","10:43","10:47","11:30","11:34","12:17","12:21","12:51","13:11","13:31","13:35","14:15","14:19","14:59","15:03","15:10"];
    special1=["8:25","8:30","8:38","8:40","9:16","9:17","9:53","9:54","10:30","10:55","11:00","11:36","11:37","12:13","12:14","12:50","13:10","13:30","13:35","15:05"]
    if (y==1){z=mf}
    if (y==2){z=tw}
    if (y==3){z=tw}
    if (y==4){z=thur}
    if (y==5){z=tw}
    for (var i in z){
        k=new Date(z[i]+" "+parseInt(x.getMonth()+1)+"/"+x.getDate()+"/"+x.getFullYear());
        if (x.getTime()<k.getTime()){
            return [format(k.getTime()-x.getTime()),format(k.getTime()-x.getTime())]
        }
    }
}

function format(msec){
    var h = Math.floor(msec / 1000 / 60 / 60);
    msec -= h * 1000 * 60 * 60;
    var m = Math.floor(msec / 1000 / 60);
    msec -= m * 1000 * 60;
    var s = Math.floor(msec / 1000);
    msec -= s * 1000;
    if(m<10){mm="0"+m}else{mm=String(m)}
    if(s<10){ss="0"+s}else{ss=String(s)}
    if(h<10){hh="0"+h}else{hh=String(h)}
    if(h>0){return hh+"h"+mm+"m"+ss+"s"}
    return mm+"m"+" "+ss+"s"
}

function output(){
    document.getElementById("timeleftbox").innerHTML=outputstring()[0];
    document.title="Time left: "+outputstring()[1];
}

s=document.getElementById("slider");
t=document.getElementById("slidertext");
var v=0;
if (localStorage.getItem("clocktime")){s.value=parseInt(localStorage.getItem("clocktime"))}
s.oninput = function(){
    v=parseInt(this.value);
    if (v%2==0){s="&nbsp&nbsp&nbsp"}else{s=""}
    if (this.value<0){t.innerHTML="My clock is "+s+(-this.value/2)+" seconds behind the bell"}
    if (this.value>0){t.innerHTML="My clock is "+s+this.value/2+" seconds ahead of the bell"}
    if (this.value==0){t.innerHTML="My clock is pretty close to the bell"}
    localStorage.setItem("clocktime",String(v));
}
s.oninput()

output();
var dostuff=setInterval(output,250)