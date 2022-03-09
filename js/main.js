//方块形状数组
var layouts=[
    [
        [1,1,1,1]
    ],
    [
        [1,1],
        [1,1]
    ],
    [
        [0,1,0],
        [1,1,1]
    ],
    [
        [1,1,0],
        [0,1,1]
    ],
    [
        [0,1,1],
        [1,1,0]
    ],
    [
        [1,0,0],
        [1,1,1]
    ],
    [
        [0,0,1],
        [1,1,1]
    ]
];
/*得到游戏的画布及画布中的画笔*/
var gameCanvas=document.getElementById("gameCanvas");
var gameContext=gameCanvas.getContext("2d");

/*得到显示下一个方块的画布及画笔*/
var nextCanvas=document.getElementById("nextCanvas");
var nextContext=nextCanvas.getContext("2d");

//定义方格的大小
var blockSize=window.innerWidth*0.6/10;

//计算游戏画布及显示下一个方块画布的宽度和高度
gameCanvas.width=blockSize*10+3;
gameCanvas.height=blockSize*20+3;
//计算显示下一个方块的画布的宽度和高度
nextCanvas.width=blockSize*4;
nextCanvas.height=blockSize*2;

//定义俄罗斯方块
var shape;
//定义下一个俄罗斯方块
var nextShape;
//定义用来存储不再下落的方块的数组
var list=[];
//控制暂停和播放
var isStart=true;
//定义定时器
var timer;

var num=0;

shape=new Shape();
shape.img.onload=function(){
	shape.drawShape();
}

//画网格
drawLine();

//创建用来存储不再下落的方块的数组
createList();

//初始化下一个显示的方块
nextShape=new NextShape();
nextShape.img.onload=function(){
	nextShape.updateFrame();
	nextShape.drawNextShape();
}

//获取五个按钮
var imgs = document.querySelectorAll("img");
for(var i=0;i<imgs.length;i++){
	var img = imgs[i];
	//给图片一个属性,变形-0，暂停-1，加速-2，向左-3，向右-4
	img.index=i;
	img.onclick=function(){
		keyAndDown(this.index);
	}
}






//方块不断的下落
timer = setInterval("move()",500);


function drawLine()
{
	//画横线
	for(var i=0;i<21;i++)
	{
		gameContext.beginPath();
		gameContext.strokeStyle="white";//线的颜色
		gameContext.lineWidth=2;
		//指定线的起始坐标
		gameContext.moveTo(0.5,blockSize*i+0.5);
		//指定线的终点坐标
		gameContext.lineTo(blockSize*10+0.5,blockSize*i+0.5);
		
		gameContext.stroke();
		gameContext.closePath();
	}
	
	//画竖线
	for(var i=0;i<11;i++)
	{
		gameContext.beginPath();
		gameContext.strokeStyle="white";
		gameContext.lineWidth=2;
		
		gameContext.moveTo(blockSize*i+0.5,0.5);
		gameContext.lineTo(blockSize*i+0.5,blockSize*20+0.5);
		
		gameContext.stroke();
		gameContext.closePath();
	}
}

//定义方块
function Shape(){
	this.currentX=3;
	this.currentY=0;
	
	//图片
	this.img=getImage();
	
	//从图片中随机的取一块
	this.color=Math.floor(Math.random()*7);
	
	//俄罗斯方块的形状
	this.layout=layouts[Math.floor(Math.random()*7)];
	
	//画方块的方法
	this.drawShape=function(){
		
		for(var i=0;i<this.layout.length;i++)
		{
			for(var j=0;j<this.layout[0].length;j++)
			{
				if(this.layout[i][j]>0)
				{
	    gameContext.drawImage(this.img,this.color*20,0,20,20,
	    	(this.currentX+j)*blockSize,
	    	(this.currentY+i)*blockSize,blockSize,blockSize);
				}
			}
		}
	}
}

function getImage()
{
	var img=new Image();
	img.src="img/blocks1.png";
	return img;
}

//方块的下落
function move()
{
    //修改方块的纵坐标
    if(isMove(0,1))
    {
	shape.currentY=shape.currentY+1;
	
	}else{
		//存储不再下落的方块
		pushShapeToList();
		
		clearList();
		
		//方块不再下落的时候，让下一个方块开始下落
		shape.currentX=3;
		shape.currentY=0;
		shape.color=nextShape.color;
		shape.layout=nextShape.layout;
		
		//判断游戏石佛结束
		for(var i=0;i<shape.layout.length;i++){
			for(var j=0;j<shape.layout.length;j++){
				if(shape.layout[i][j]>0&& list[shape.currentY+i][shape.currentX+j]>0)
				window.location.reload();
			}
		}
		//重新生成一个新的下一个显示的方块
		nextShape.updateFrame();
		nextContext.clearRect(0,0,nextCanvas.width,nextCanvas.height);
		nextShape.drawNextShape();
	}
	//重新画
	updateGameCanvas();
}
function updateGameCanvas(){
	//清空画布
	gameContext.clearRect(0,0,gameCanvas.width,gameCanvas.height);
	//画网格
	drawLine();
	//画方块
	shape.drawShape();
	//画不再下落的方块
	drawList();
}
//判断方块是否能继续下落
function isMove(x,y)

{   //得到修改之后的纵坐标
	var nextY = shape.currentY+y;
	var nextX = shape.currentX+x;
	//判断修改之后的纵坐标是否超范围
	if(nextY>20-shape.layout.length){
		return false;
	}
	//判断修改后横坐标是否超范围
	if(nextX<0||nextX>10-shape.layout[0].length){
		return false;
	}
	//判断重叠
	for(var i=0;i<shape.layout.length;i++){
		for(var j=0;j<shape.layout[0].length;j++){
			if(shape.layout[i][j]>0 && list[nextY+i][nextX+j]>0){
			return false;
		}
		}
	}
	
	
	
	return true;
}

//定义下一个显示的方块
function NextShape(){
	
	this.img=getImage();
	
	this.updateFrame=function(){
		this.color=Math.floor(Math.random()*7);
		this.layout=layouts[Math.floor(Math.random()*7)];
	}
	
	//画方块的函数
	this.drawNextShape=function(){
		for(var i=0;i<this.layout.length;i++)
		{
			for(var j=0;j<this.layout[0].length;j++)
			{
				if(this.layout[i][j]>0){
					nextContext.drawImage(this.img,this.color*20,0,20,20,j*blockSize,i*blockSize,blockSize,blockSize);
				}
			}
		}
	}
}

//创建用来存储不再下落方块的数组
function createList(){
	
	for(var i=0;i<20;i++)
	{
		list[i]=[];
		for(var j=0;j<10;j++)
		{
			list[i][j]=0;
		}
	}
	console.log(list);
}
//存储不再下落的方块
function pushShapeToList(){
	
	//遍历方块
	for(var i=0;i<shape.layout.length;i++)
	{
		for(var j=0;j<shape.layout[0].length;j++)
		{
			if(shape.layout[i][j]>0)
			{
				list[shape.currentY+i][shape.currentX+j]=shape.color+1;//存储的是颜色值+1
			}
		}
	}
	
	console.log(list);
}
//把不再下落的方块画到网格上对应的位置
function drawList()
{
	for(var i=0;i<list.length;i++)
	{
		for(var j=0;j<list[0].length;j++)
		{
			if(list[i][j]>0)
			{
				gameContext.drawImage(shape.img,(list[i][j]-1)*20,
				0,20,20,j*blockSize,blockSize*i,blockSize,blockSize);
			}
		}
	}
}
function keyAndDown(obj){
	switch(obj){
		case 0://暂停
		var btn = document.querySelector("img");
		if(isStart){
			isStart=false;
			btn.src="img/bofang.png";
			clearInterval(timer);
		}else{
			isStart=true;
			btn.src="img/zanting.png";
			timer=setInterval("move()",500);
		}
		
		break;
		default:
		if(isStart){
			switch(obj){
				case 1://变形
				
				var lay=[];
				for(var j=0;j<shape.layout[0].length;j++){
					lay[j]=[];
					for(var i=0;i<shape.layout.length;i++){
						lay[j][i]=shape.layout[shape.layout.length-i-1][j]
					}
				}
				//变形后越界问题
				//变形后坐标
				var offsetX=shape.currentX+lay[0].length;
				var offsetY=shape.currentY+lay.length;
				
				var xZuoBiao=shape.currentX;
				var yZuoBiao=shape.currentY;
				if(offsetX>10)
				xZuoBiao=10-lay[0].length;
				if(offsetY>20)
				yZuoBiao=20-lay.length;
				//变形后是否重叠
				for(var i=0;i<lay.length;i++){
					for(var j=0;j<lay.length;j++){
						if(lay[i][j]>0&&list[yZuoBiao+i][xZuoBiao+j]>0){
							return;
						}
					}
				}
				
				shape.currentX=xZuoBiao;
				shape.currentY=yZuoBiao;
				shape.layout=lay;
				
				break;
				case 2://加速
				if(isMove(0,1)){
					shape.currentY+=1;
				}
				break;
				case 3://左
				if(isMove(-1,0)){
					shape.currentX-=1;
				}
				break;
				case 4://右
				if(isMove(1,0)){
					shape.currentX+=1;
				}
				break;
			}
		}
		
		break;	
	}
}
function clearList(){
	for(var i=list.length-1;i>=0;i--){
		//判断这一行是否都是大于0的数
		var flag=true;
		for(var j=0;j<list[0].length;j++){
			if (list[i][j]==0)
			flag=false;
		}
		//判断flag的值
		if(flag){
			//消除这一行，把每一行下移
			for(var x=i;x>0;x--){
				for(var y=0;y<list[0].length;y++){
					list[x][y]=list[x-1][y];
				}
			}
			//分数
			num+=100;
			document.getElementById("score").innerHTML="得分:"+num;
			i++;
			
		}
	}
}
