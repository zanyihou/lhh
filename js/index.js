$(function(){
		
/****初始化变量****/
	var curChip = 2;//默认筹码是2， 有2,10,50,100,500
	var time = 20;//开奖间隔时间20
	var lotterytime = 18;//正在开奖时间，10s
	var waittime = 5;//空闲时间5秒
	var gametype = 0; //游戏的状态,0是可投注状态，1是正在开奖状态,2是空闲状态，3是游戏非正常状态
	var chipname = "chip0"; //筹码名称
	var chipleft = "9%";//筹码位置
	var mygold = 6000;//我的金币
	var uplimitValue = 5000;//投注上限5000
	var totalChipMoney = 0;//下注金额
	var musicBool = true;//是否开启背景音乐
	var chipdataSelf = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];//17个区域自己的投注筹码
	var chipdataTotal = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];//17个区域总的投注筹码

/****游戏初始化函数****/
	function init(){
		time = 20;//开奖间隔时间15
		lotterytime = 18;//正在开奖时间，10s
		waittime = 5;//空闲时间5秒
		gametype = 0; //游戏的状态,0是可投注状态，1是正在开奖状态,2是空闲状态，3是游戏非正常状态
		totalChipMoney = 0;//下注金额
		
		chipdataSelf = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];//17个区域自己的投注筹码
		chipdataTotal = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];//17个区域总的投注筹码
		
		game_state()
		
		/*播放开始音乐*/
		mbeigin = document.getElementById("mbegin");
		mbeigin.volume = 1;
		mbeigin.src = "./source/begin.mp3"; 
		mbeigin.play();
		
		/*播放背景音乐*/
		if(musicBool)
		{
			mbg = document.getElementById("mbg");
			mbg.src = "./source/bg.wav"; 
			mbg.volume = 1;
			mbg.play();
		}	
	}

	init();

/****游戏音效****/
	$(".bgBtn").click(function(){
		if($(this).hasClass("close"))
		{
			$(this).removeClass("close")
			musicBool =true;
			if(mbg) mbg.play(); 
		}else
		{
			$(this).addClass("close")
			musicBool = false;
			if(mbg) mbg.pause(); 
		}	
	})

/****赋值我的金币****/
	$(".qb_num").text(mygold);	
	
/****充值弹窗****/
	$(".rcg_lg").click(function(){
		showcharge();
	})
	$(".charge_wrap_close").click(function(){
		hidecharge();
	})	
	//显示充值函数
	function showcharge(){
		$(".page").addClass("db");
	}	
	//隐藏充值函数
	function hidecharge(){
		$(".page").removeClass("db");
	}

/****筹码切换****/
	$(".bottom li").on("click",function(){
		chipname = "chip" + $(this).index();//修改筹码名称
		chipleft = 9 + $(this).index()*17 + "%";//修改筹码位置
		$(this).siblings("li").find("img").removeClass("current");
		$(this).find("img").addClass("current");
		//修改筹码值
		curChip = parseInt($(this).find("span").attr("data-value")) ;
	})

/****倒计时函数****/
function game_state(){
		//状态1：正常投注倒计时
		if(gametype == 0)
		{
			$(".timets").text("投注时间")
			$(".timer").text(changeTimeType(time));
			time--;
			$(".chipTs a").attr("class","tsType t1");
			timer1 = setInterval(function(){
				thetime = changeTimeType(time);
				$(".timer").text(thetime);
				if(time == 0)
				{
					//执行等待开奖函数,清除定时器
					clearInterval(timer1);
					setTimeout(function(){
						gametype = 1;
						game_state();
					},1000)	
				}
				time--;
			},1000)
		}

		//状态2：正在开奖中
		if(gametype == 1)
		{
			$(".timer").text(changeTimeType(lotterytime));
			lotterytime--;
			//游戏状态变成开牌状态
			$(".timets").text("正在开牌")
			
			//调用发牌函数
			showCard();

			timer2 = setInterval(function(){
				thetime = changeTimeType(lotterytime);
				$(".timer").text(thetime);
				
				if(lotterytime == 10)
				{
					//闪烁中奖区块
					$(".area0").addClass("winPos");
					$(".area4").addClass("winPos");
					$(".area7").addClass("winPos");
					$(".area10").addClass("winPos");
					$(".area11").addClass("winPos");
					$(".area16").addClass("winPos");
				}
				
				//清空,弹出开奖结果
				if(lotterytime == 8){
					$(".hidebg").addClass("db");
					$(".hisBox").removeClass("db");
					$(".resultTit").addClass("rwin");//赢
					//播放中奖音乐
					winFunc(true);
					//$(".resultTit").addClass("rlose");//输
					//$(".resultTit").addClass("rpeace");//没有下注
					$(".compare").addClass("db animated fadeInDown");	
				}
				
				if(lotterytime == 0){
					clearInterval(timer2);
					$(".hidebg").removeClass("db");
					$(".compare").attr("class","compare");
					$(".mahjong a").attr("class","animated");
					$(".dot,.of,.chipInfo").removeClass("db");
					$(".preHis").addClass("db");
					$(".moveChip").remove();
					$(".lhh").removeClass("winPos");
					setTimeout(function(){
						gametype = 2;
						game_state();
					},1000)	
				}	
				lotterytime--;
			},1000)
		}	
		//状态2：空闲状态，游戏初始化准备
		if(gametype == 2)
		{
			$(".timer").text(changeTimeType(waittime));
			waittime--;
			//游戏状态变成空闲状态
			$(".timets").text("空闲时间")
			
			timer3 = setInterval(function(){
				thetime = changeTimeType(waittime);
				$(".timer").text(thetime);
				if(waittime == 0){
					clearInterval(timer3);
					setTimeout(function(){
						init();
					},1000)		
				}
				waittime--;
			},1000)
		}	
	}

/****发牌特效****/
	function showCard()
	{
		$(".preHis").removeClass("db");
		$(".mahjong a").eq(0).addClass("out").addClass("bounceInRight");
		setTimeout(function(){
			$(".mahjong a").eq(1).addClass("out").addClass("bounceInRight");
		},300);
		setTimeout(function(){
			$(".mahjong a").eq(2).addClass("out").addClass("bounceInRight");
		},600)
		setTimeout(function(){
			$(".mahjong a").eq(3).addClass("out").addClass("bounceInRight");
		},900)
		setTimeout(function(){
			$(".mahjong a").eq(4).addClass("out").addClass("bounceInRight");
		},1200);
		setTimeout(function(){
			$(".mahjong a").attr("class","out");
			$(".mahjong .of").addClass("db")
		},2000);
		setTimeout(function(){
			$(".mahjong a").eq(0).addClass("cho");
		},2500)
		setTimeout(function(){
			$(".mahjong a").eq(0).find(".dot").addClass("db");
			$(".mahjong a").eq(1).addClass("cho")
		},3500)
		setTimeout(function(){
			$(".mahjong a").eq(1).find(".dot").addClass("db");
			$(".mahjong a").eq(2).addClass("cho")
		},4500)
		setTimeout(function(){
			$(".mahjong a").eq(2).find(".dot").addClass("db");
			$(".mahjong a").eq(3).addClass("cho")
		},5500)
		setTimeout(function(){
			$(".mahjong a").eq(3).find(".dot").addClass("db");
			$(".mahjong a").eq(4).addClass("cho")
		},6500)
		setTimeout(function(){
			$(".mahjong a").eq(4).find(".dot").addClass("db");
		},7500)
	}

/****点击投注****/
	$(".lhh").click(function(){
		//判断游戏状态,如果是非投注状态，则不执行任何操作，直接返回
		if(gametype) return;
		
		//存储this变量
		_this = this;
		
		//点击的区域0,1,2,3,4,5,6,7...16(龙，和，虎，1同....发财)
		var tarIndex = parseInt($(this).attr("data-attr"));//当前点击的区域索引
		chipdataSelf[tarIndex] += curChip;//更新当前区域自己总的投注数量
		
		 
		//判断金币
		moneybool = moneyFun();//金币是否足够，返回true,false
		
		//判断投注上限
		uplimitbool = uplimit(chipdataSelf[tarIndex]); //是否单个区域达到投注上限，返回true,false
		
		//金币不足，弹出充值窗口
		if(!moneybool) {
			showcharge();
			chipdataSelf[tarIndex] -= curChip;
			return;
		//单个投注上限， 弹出上限提示窗口
		}else if(!uplimitbool){
			console.log("单个区域最高投注5000金币");
			chipdataSelf[tarIndex] -= curChip;//还原当前区域所有的投注数量
			return;
		}
		
		//投注成功， 减去投注金币， 更新总的投注金额和页面余额显示
		chipdataTotal[tarIndex] += curChip;//更新当前区域所有的投注数量
		mygold -= curChip;//更新我的金币总数量
		totalChipMoney = totalChipMoney + curChip;//更新我自己当前总投注金额
		$(".qb_num").text(mygold);	//更新页面余额显示
		
		//播放下注音乐
		mcoin = document.getElementById("mbegin");
		mcoin.src = "./source/coin.mp3"; 
		mcoin.volume = 1;
 		mcoin.play();
 
		//对应区域显示投注金额
		$(this).find(".chipInfo").addClass("db")
		$(this).find(".selfChip").text(chipdataSelf[tarIndex]); //当前区域自己的投注金额
		$(this).find(".totalChip").text(chipdataTotal[tarIndex]);//当前区域总的投注金额
		
		//创建筹码并移动
		var moveChip = '<i style="left:'+chipleft+'" class="moveChip '+chipname+'"></i>';
		var targetl = $(this).offset().left;
		var targetw = $(this).innerWidth();
		var targett = $(this).offset().top;
		var targeth = $(this).innerHeight(); 
		var disl = Math.random()*(targetw - 15);
		var dist = Math.random()*(targeth - 15);
		var t_l = targetl + disl;
		var t_t = targett + dist;
		
		//玩家1：
		psl = $(".user-li").eq(0).offset().left+20+"px";
		pst = $(".user-li").eq(0).offset().top+20+"px";
		//玩家2：
		psl = $(".user-li").eq(1).offset().left+20+"px";
		pst = $(".user-li").eq(1).offset().top+20+"px";
		
		//玩家4：
		psl = $(".user-li").eq(2).offset().left+20+"px";
		pst = $(".user-li").eq(2).offset().top+20+"px";
		//玩家5：
		psl = $(".user-li").eq(3).offset().left+20+"px";
		pst = $(".user-li").eq(3).offset().top+20+"px";
		
		//玩家自己：
		psl = $(".self").offset().left+20+"px";
		pst = $(".self").offset().top+20+"px";

		//参数，_this:点击的对象，disl,dist:目标位置相对于本区域的位置，t_l,t_t目标位置相对于整个页面的位置，psl,pst：起始位置
		moveChipFun(_this,disl,dist,t_l,t_t,psl,pst);
	})
	
	function moveChipFun(_this,disl,dist,t_l,t_t,psl,pst){
		var moveChip = '<i style="left:'+psl+';top:'+pst+'" class="moveChip '+chipname+'"></i>';	
		$(moveChip).appendTo("body").animate({"left":t_l,"top":t_t},function(){
			$(this).css({"left":disl,"top":dist});
			$(_this).append($(this));
		})
	}

/****判断金币是否足够****/
	function moneyFun(){
		if(mygold < curChip){
			return false;
		}else{
			return true;
		}
	}
	
/****判断是否达到投注上限****/
	function uplimit(value){
		if(value > uplimitValue){
			return false;
		}else {
			return true;
		}
	}

/****撤销****/
	$(".clear_con").on("click",function(){
		if(gametype) return; //非投注状态不能撤销
		$(".revokets").addClass("db");
	})
	
	$(".cancelBtn").click(function(){
		$(".revokets").removeClass("db");
	})
	$(".sureBtn").click(function(){
		$(".revokets").removeClass("db");
		mygold += totalChipMoney;
		$(".qb_num").text(mygold);
		clearChip();
	})
	
/****清除筹码下注****/
	function clearChip(){
		$(".moveChip").remove();
		$(".selfChip").text("0");
		//更新总的投注数组
		for(var i=0;i<17;i++)
		{
			
			chipdataTotal[i]-=chipdataSelf[i];
			//如果当前区域总的投注为0 ，那么隐藏投注数据显示
			if(chipdataTotal[i]==0)
			{
				$(".area"+i).find(".chipInfo").removeClass("db");
			}
		}
		//更新我的总投注金币数量
		totalChipMoney = 0;
		//更新自己的投注数组
		chipdataSelf = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//自己8个区域的投注筹码
		//调用更新投注数据显示函数
		showChipData();
	}

/****更新投注数据的显示****/
	function showChipData(){
		for(var i=0;i<17;i++)
		{
			$(".area"+i).find(".selfChip").text(chipdataSelf[i]);
			$(".area"+i).find(".totalChip").text(chipdataTotal[i]);
		}
	}
	
/****时间格式转换(不足10秒的前面补0)****/
	function changeTimeType(time){
		if(time<10) return "0" + time;
		return time;
	}

/****开奖后筹码去向(如果赢了就传参数winArg=true,输了或者没有投注就不传参数)****/
function winFunc(winArg)
{
	if(winArg)
	{
		setTimeout(function(){
			/*播放中奖音乐*/
			mwin = document.getElementById("mwin");
			mwin.volume = 1;
			mwin.src = "./source/win.wav"; 
			mwin.play();
		},1500)
	}
}
			 
/**中奖区域闪烁函数(总共8个区块，对应0，1,2,3,4,5,6,7)，参数place是闪烁区域数组**/
function flicker(place)
{
	for(var i=0; i<place.length; i++)
	{
		$(".chipTable div").eq(place[i]).addClass("cho")
	}
}

/**历史记录弹出**/
	$(".moreBtn").click(function(){
		$(".hisBox").toggleClass("db")
	})

	$(".cloHis").click(function(e){
		$(".hisBox").removeClass("db");
	})

/**菜单栏弹出**/
	$(".note").click(function(){
		$(".note_in22").toggleClass("db")
	})

	$(document).click(function(e){
		if(e.target.className == "note"){
			return
		}else{
			$(".note_in22").removeClass("db")
		}
		
	})
	
	//游戏规则
	$(".game_rule").click(function(){
		$(".rule").addClass("db");
	})
	
	$(".pop_close,.btn_return").click(function(){
		$(".rule").removeClass("db");
	})
	
	//投注记录
	$(".record").click(function(){
		$(".record_content").addClass("db");
	})
	$(".pop_close,.btn_return").click(function(){
		$(".record_content").removeClass("db");
	})
	
	$(".record_con").click(function(){
		$(this).next(".record_more2").toggleClass("db")
	})

/****第一次进游戏提示****/
	$(".guide_one").addClass("db")
	$(".next_step").click(function(){
		$(".guide_one").removeClass("db")
		$(".guide_two").addClass("db")
	})
	$(".return_step").click(function(){
		$(".guide_two").removeClass("db")
	})
 
})