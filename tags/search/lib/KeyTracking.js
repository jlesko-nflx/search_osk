export default {

	init(variant) {

		let prevSession = window.localStorage.getItem('search.currentSession');
		if (prevSession && prevSession !== '{}') {
			this.stats = JSON.parse(prevSession);
			this.endSession('refresh');
		}

		this.variant = variant;
		this.newSession();
	},

	onClickKey(key) {

		if (!key) { return; }

		// Calculate time between keys
		let betweenKeyTime = Date.now() - this.lastKeyTime;
		this.stats.betweenKeyTimes.push(betweenKeyTime);
		this.lastKeyTime = Date.now();
		let totalKeyTime = 0;
		this.stats.betweenKeyTimes.forEach((e)=>{
			totalKeyTime += e;
		});
		this.stats.averageBetweenKeyTime = Math.floor(totalKeyTime / this.stats.betweenKeyTimes.length);
		
		this.stats.numKeyClicks += 1;
		this.stats.query += key.toUpperCase();
		this.gazeStartTime = Date.now();

		this.log('key: ' + key);
	},

	// type = key|result|suggestion
	onMove(type) {

		if (this.gazeStartTime) {
			this.stats.gazeTime += Date.now() - this.gazeStartTime;
			this.stats.gazeCount += 1;
			this.stats.gazeTimeAverage = Math.floor(this.stats.gazeTime / this.stats.gazeCount);
			this.gazeStartTime = 0;

		}
		if (type == 'key') {
			this.stats.numKeyMoves += 1;
		}
		
		this.log('move: ' + type);
	},

	onClear() {
		this.stats.query = '';
		this.stats.numClears += 1;
		this.log('clear');
		//this.endSession('clear');
	},

	onDelete() {

		if (this.prevEvent != 'delete') {
			this.stats.numDeletes += 1;
		}
		this.gazeStartTime = Date.now();
		this.stats.query = this.stats.query.substr(0, this.stats.query.length - 1);
		this.log('delete');	
	},

	onClickResult(resultTitle) {
		this.stats.clickedResultTitle = resultTitle;
		this.log('result: ' + resultTitle);
		this.endSession('clickedResult');
	},

	onClickSuggestion(suggestionName) {
		this.stats.numSuggestionClicks += 1;
		this.log('suggestion: ' + suggestionName);
	},





	////// Private

	newSession() {

		this.sessionStartTime = Date.now();
		this.lastKeyTime = 0;
	    this.prevEvent = '';

		let now = new Date ();
		let date = (now.getMonth() + 1) + '/' + now.getDate() + ' @ ' +  now.getHours() + ':' + now.getMinutes() + ":" + now.getSeconds();

		this.sessionName = '[' + this.variant + '] ' + date;  

		this.gazeStartTime = 0;

		this.stats = {
			date: date,
			variant: this.variant,
			numKeyMoves: 0,
			numKeyClicks: 0,
			numDeletes: 0,
			numClears: 0,
			queryLength: 0,  
			clickedResultTitle: '',
			gazeCount: 0,
			gazeTime: 0,
			gazeTimeAverage: 0,
			query: '',
			firstEventTime: 0,
			lastEventTime: 0, 
			durationMs: 0,
			endEvent: '',
			log: [],
			betweenKeyTimes: [],
			averageBetweenKeyTime: 0,
			numSuggestionClicks: 0,
		};
	},

	endSession(endEvent) {
		this.stats.endEvent = endEvent;
		this.log('end');

		let sSessions = window.localStorage.getItem('search.sessions') || '[]';
		let sessions = JSON.parse(sSessions);
		sessions.push(this.stats);

		window.localStorage.setItem('search.sessions', JSON.stringify(sessions));
		window.localStorage.setItem('search.currentSession', '{}');

		this.newSession();
	},

	log(logString) {
		if (!this.stats.firstEventTime) {
			this.stats.firstEventTime = Date.now();
			this.lastKeyTime = Date.now();
			this.log('start');
		}
		this.stats.lastEventTime = Date.now();

		this.stats.durationMs = this.stats.lastEventTime - this.stats.firstEventTime;
		this.stats.queryLength = this.stats.query.length;

		this.stats.log.push([Date.now() - this.sessionStartTime, logString]);

		window.localStorage.setItem('search.currentSession', JSON.stringify(this.stats));

		this.prevEvent = logString;
	},

};
