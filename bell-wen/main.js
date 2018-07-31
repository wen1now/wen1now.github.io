function outputstring(){
    var x=new Date();
    if ((x.getHours()>=16)||((x.getHours()>=15)&&(x.getMinutes()>=10))){
        return ["School has finished","Finished"]
    }
    var y=x.getDay();
    if ((y==0)||(y==6)){
        if (y==0){t="Sun"}else{t="sat"}
        return ["No school today",t]
    }
    if ((y==1)||(y==5)){
        z=["8:25","8:30","13:15","13:19","14:07","14:11","14:59","15:03","15:10"]
        for (var i in z){
            k=new Date(z[i]+" "+parseInt(x.getMonth()+1)+"/"+x.getDate()+"/"+x.getFullYear());
            if (x.getTime()<k.getTime()){
                return [format(k.getTime()-x.getTime()),format(k.getTime()-x.getTime())]
            }
        }
    }
    if ((y==2)||(y==3)){
        z=["8:25","8:30","13:31","13:35","14:15","14:19","14:59","15:03","15:10"]
        for (var i in z){
            k=new Date(z[i]+" "+parseInt(x.getMonth()+1)+"/"+x.getDate()+"/"+x.getFullYear());
            if (x.getTime()<k.getTime()){
                return [format(k.getTime()-x.getTime()),format(k.getTime()-x.getTime())]
            }
        }
    }
    if (y==4){
        z=["8:25","8:30","13:31","13:35","14:15","14:19","14:59","15:03","15:10"]
        for (var i in z){
            k=new Date(z[i]+" "+parseInt(x.getMonth()+1)+"/"+x.getDate()+"/"+x.getFullYear());
            if (x.getTime()<k.getTime()){
                return [format(k.getTime()-x.getTime()),format(k.getTime()-x.getTime())]
            }
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
output();
var dostuff=setInterval(output,250)