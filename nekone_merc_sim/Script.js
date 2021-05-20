enchant();

window.onload = function () {
	const game = new Game(400, 500);

	/////////////////////////////////////////////////
	//ゲーム開始前に必要な画像・音を読み込む部分


	//クリック音読み込み
	const clickSndUrl = "button_sound.mp3";						//game.htmlからの相対パス
	game.preload([clickSndUrl]); 				//データを読み込んでおく

	//失敗音読み込み
	const failSndUrl = "fail.mp3";
	game.preload([failSndUrl]); 

	//給水音読み込み
	const addwaterSndUrl = "addwater.mp3";
	game.preload([addwaterSndUrl]); 

	//ゲート画像
	const GateImgUrl = "gate_dark.png";	
	game.preload([GateImgUrl]);	

	//祈りボタン
	const prayBtnImgUrl = "pray.png";
	game.preload([prayBtnImgUrl]);

	//給水ボタン
	const addwaterBtnImgUrl = "addwater.png";
	game.preload([addwaterBtnImgUrl]);

	//リトライボタン
	const retryImgUrl = "retry.png";
	game.preload([retryImgUrl]);

	//ツイートボタン
	const tweetImgUrl = "tweet.png";
	game.preload([tweetImgUrl]);	

	//読み込み終わり
	/////////////////////////////////////////////////


	game.onload = function () {					//ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう

		/////////////////////////////////////////////////
		//グローバル変数 

		let point = 0;									//ポイント
		let state = 0;								//現在のゲーム状態
		let timelimit = 30;
		let bp = 1000;
		let intervalId;

		//グローバル変数終わり
		/////////////////////////////////////////////////



		const mainScene = new Scene();					//シーン作成
		game.pushScene(mainScene);  					//mainSceneシーンオブジェクトを画面に設置
		mainScene.backgroundColor = "white"; 

		//ポイント表示テキスト
		const scoreText = new Label(); 					//テキストはLabelクラス
		scoreText.font = "20px Meiryo";				//フォントはメイリオ 20px 
		scoreText.color = 'rgba(0,0,0,1)';		//色　RGB+透明度
		scoreText.width = 400;							//横幅指定
		scoreText.moveTo(0, 30);						//移動位置指定
		mainScene.addChild(scoreText);					//mainSceneシーンにこの画像を埋め込む

		scoreText.text = "現在の祈り値：" + point+"%";					//テキストに文字表示 Pointは変数なので、ここの数字が増える

		//残り時間表示テキスト
		const timeText = new Label();
		timeText.font = "20px Meiryo";
		timeText.color = 'rgba(0,0,0,1)';
		timeText.width = 400;
		timeText.moveTo(0, 60);
		mainScene.addChild(timeText);

		timeText.text = "残り時間：" + timelimit + "秒";
		
		//BP表示テキスト
		const bpText = new Label();
		bpText.font = "20px Meiryo";
		bpText.color = 'rgba(0,0,0,1)';
		bpText.width = 400;
		bpText.moveTo(0, 90);
		mainScene.addChild(bpText);

		bpText.text = "BP：" + bp;

		//ゲート
		const gateImg = new Sprite(150, 150);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		gateImg.moveTo(125, 100);						//ゲートの位置
		gateImg.image = game.assets[GateImgUrl];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		mainScene.addChild(gateImg);					//mainSceneにこのゲート画像を貼り付ける  

		//祈りボタン
		const prayBtn = new Sprite(100, 60);
		prayBtn.moveTo(75, 250);
		prayBtn.image = game.assets[prayBtnImgUrl];
		mainScene.addChild(prayBtn);

		prayBtn.ontouchend = function () {
			if(state == 0)
			{
				timelimit = 30;
				function countdown() {
				  timelimit--;
				} 
				intervalId = setInterval(countdown,1000);
				state = 1;
			}

			if(bp > 15)
			{
				bp-=15;
				point++;
				game.assets[clickSndUrl].clone().play();		//クリックの音を鳴らす。
			}
			else
			{
				game.assets[failSndUrl].clone().play();		//失敗音を鳴らす。
			}
		}

		//給水ボタン
		const addwaterBtn = new Sprite(100, 60);
		addwaterBtn.moveTo(225, 250);
		addwaterBtn.image = game.assets[addwaterBtnImgUrl];
		mainScene.addChild(addwaterBtn);

		addwaterBtn.ontouchend = function () {
			if (bp < 1000)
			{
				bp = 1000;
				game.assets[addwaterSndUrl].clone().play();		//クリックの音を鳴らす。
			}
			else
			{
				game.assets[failSndUrl].clone().play();		//失敗音を鳴らす。
			}
		}

		///////////////////////////////////////////////////
		//メインループ　ここに主要な処理をまとめて書こう
		game.onenterframe = function () {

			//現在のテキスト表示
			scoreText.text = "現在の祈り値：" + point * 2.5 + "%"; 				//point変数が変化するので、毎フレームごとにpointの値を読み込んだ文章を表示する
			timeText.text = "残り時間：" + timelimit + "秒";
			bpText.text = "Bp：" + bp;
			
			gateImg.scaleX = 1+(point/100);
			gateImg.scaleY = 1+(point/100);

			//30秒経過
			if(timelimit <= 0)
			{
				game.popScene();
				game.pushScene(endScene);
				gameOverText.text = "最終祈り値：" + point * 2.5 + "%";
			}
		};



		////////////////////////////////////////////////////////////////
		//結果画面
		const endScene = new Scene();
		endScene.backgroundColor = 'rgba(255,255,255, 1)';

		//GAMEOVER
		const gameOverText = new Label();
		gameOverText.font = "20px Meiryo";
		gameOverText.color = 'rgba(0,0,0,1)';
		gameOverText.width = 400;
		gameOverText.moveTo(0, 30);
		endScene.addChild(gameOverText);



		//リトライボタン
		const retryBtn = new Sprite(120, 60);
		retryBtn.moveTo(50, 320);
		retryBtn.image = game.assets[retryImgUrl];
		endScene.addChild(retryBtn); 

		retryBtn.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			state = 0;
			bp = 1000;
			timelimit = 30;
			point = 0;
			clearInterval(intervalId);
			game.popScene();						//endSceneシーンを外す
			game.pushScene(mainScene);					//mainSceneシーンを入れる
		};

		//ツイートボタン
		const tweetBtn = new Sprite(120, 60);
		tweetBtn.moveTo(230, 320);
		tweetBtn.image = game.assets[tweetImgUrl];
		endScene.addChild(tweetBtn);

		tweetBtn.ontouchend = function () {				//S_Tweetボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			//ツイートＡＰＩに送信
			//結果ツイート時にURLを貼るため、このゲームのURLをここに記入してURLがツイート画面に反映されるようにエンコードする
			const url = encodeURI("https://nekone0510.github.io/");
			window.open("http://twitter.com/intent/tweet?text=" + point * 2.5 + "％祈りました&url=" + url);
		};

	};
	game.start();
};
