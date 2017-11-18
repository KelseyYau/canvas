//**************************初始化设置*********************************
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

var bigCenterX = 300;
var bigCenterY = 200;
var bigRadius = 50;

//初始化关卡
var level;
if(parseInt(window.location.href.split("#")[1])){
    level = parseInt(window.location.href.split("#")[1]);
}else{
    level = 0;
}

//*************************初始化转动球*****************************
var smallBallRadius = 10;
//等级设置
var levelArray = [
    {"initNum":3,"WaitNum":5,"speed":200},
    {"initNum":4,"WaitNum":8,"speed":180},
    {"initNum":5,"WaitNum":5,"speed":160},
    {"initNum":3,"WaitNum":5,"speed":140},
    {"initNum":4,"WaitNum":8,"speed":120},
    {"initNum":5,"WaitNum":5,"speed":100},
    {"initNum":6,"WaitNum":7,"speed":90}
];

//绘制转动球
var rotBalls = [];
var rotBallNum = levelArray[level].initNum;
var rotBallLen = 130;
for(var i = 0;i < rotBallNum;i++ ){
    var angle = (360/rotBallNum) * (i + 1);
    rotBalls.push({"angle":angle,"numStr":""});
}

//
var waitBallLen = 260;
var waitballX = bigCenterX;
var waitballY = rotBallLen + waitBallLen; 

var waitBalls = [];
var waitBallNum = levelArray[level].WaitNum;
for(var i = waitBallNum;i > 0;i--){
    waitBalls.push({"angle":"","numStr":i});
}

//绘制中间大球
function bigball(){
    ctx.save();
    ctx.beginPath();
    ctx.arc(bigCenterX,bigCenterY,bigRadius,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.save();


//*******************绘制关卡数********************/
    if(level == levelArray.length){
        level = levelArray.length - 1;
    }
    var txt = (level + 1) + "";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "60px Microsoft Yahei"
    ctx.fillStyle = "#ffffff";
    ctx.fillText(txt,bigCenterX,bigCenterY);
    ctx.restore();
}

//****************绘制转动球***************** */
function drawRotBall(deg){
    rotBalls.forEach(function(e){
        ctx.save();
        ctx.globalCompositonOperation = "destination-over";
        e.angle = e.angle + deg;
        if(e.angle >= 360){
            e.angle = 0;
        }

        //绘制旋转球线段
        ctx.moveTo(bigCenterX,bigCenterY);
        var rad = 2 *  Math.PI * e.angle / 360;
        var x = bigCenterX + rotBallLen * Math.cos(rad);
        var y = bigCenterY + rotBallLen * Math.sin(rad);
        ctx.strokeStyle = "#000000";
        ctx.lineTo(x,y);
        ctx.stroke();
        ctx.restore();
        
        //绘制旋转球
        ctx.beginPath();
        ctx.arc(x,y,smallBallRadius,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fillStyle = "#000000";
        ctx.fill();

        //填充文字
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "15px Microsoft Yahei";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(e.numStr,x,y);
    });
}


//***********等待球************
function drawWaitBall(){
    ctx.clearRect(0,350,400,600);
    waitBalls.forEach(function(e){
        ctx.moveTo(waitballX,waitballY);
        ctx.beginPath();
        ctx.arc(waitballX,waitballY,smallBallRadius,0,Math.PI*2,true);
        ctx.closePath();

        ctx.fillStyle = "#000000";
        ctx.fill();
        
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "15px Microsoft Yahei";
        ctx.fillStyle = "#fff";
        ctx.fillText(e.numStr,waitballX,waitballY);
        waitballY += 3*smallBallRadius;

    });
}

//************初始化所有内容*************
function initial(deg){
    ctx.clearRect(0,0,900,800);
    bigball();
    drawRotBall(deg);
    drawWaitBall();
}
initial(0);

//******************设置旋转速度**********************
setInterval(function(){
    ctx.clearRect(0,0,900,345);
    bigball();
    drawRotBall(10);
},levelArray[level].speed);


//****************游戏进行**********************
canvas.addEventListener("click",function(){
    if(waitBalls == 0) return;
    waitballY = rotBallLen + 200;
    drawWaitBall();

    var selectBall = waitBalls.shift();
    selectBall.angle = 90;
    var failed = true;
    var state;
    rotBalls.forEach(function(e,index){
        if(!failed) return;
        if(Math.abs(e.angle-selectBall.angle) < 2){
            state = 0;
            failed = false;
        }else if(index == rotBalls.length - 1 && waitBalls.length == 0){
            failed = false;
            state = 1;
        }
    });

    rotBalls.push(selectBall);

    waitballY = rotBallLen + waitBallLen;
    drawWaitBall(0);
    if(state == 0){
        alert("闯关失败！");
        window.location.href = "index.html#" + level;
    }else if(state == 1){
        alert("闯关成功！");
        level += 1;
        window.location.href = "index.html#" + level;
    }
})