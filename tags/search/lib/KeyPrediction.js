
let PEOPLE = `

	adam sandler
	david letterman
	kevin hart
	ali wong
	will smith
	denzel washington
	leonardo dicaprio
	jackie chanb
	jacky chan
	steve martin
	nicolas cage
	dave chapelle
	jim carrey
	john mulaney
	ryan reynolds
	quentin tarantino
	tom cruise
	jennifer aniston
	michelle wolf
	clint eastwood
	jim gaffigan
	tom hanks
	matt damon
	sandra bullock
	tyler perry
	robert de niro
	melissa mccarthy
	angelina jolie
	bill burr
	morgan freeman 
	roseanne barr
	brad pitt
	will ferrell
	al pacino
	mark wahlberg
	tig notaro
	bruce willis
	matthew mcconaughey
	jeff dunham
	stephen king
	kevin costner
	johnny depp
	ken burns 
	eddie murphy
	kevin james
	chris pratt
	howard stern
	meg ryan
	gerard butler
	john cusack
	meryl streep
	john wayne
	drew barrymore
	carol burnett
	george carlin
	sam elliott
	harrison ford
	mel gibson
	alfred hitchcock

`.trim().split(/\s*\n\s*/);


export default {

	freq: {
		mid: {},
		first: {}
	},

	// PUBLIC

	// aggregate predictions in order of priority:
	//   1. triglyphs (3-letters)
	//   2. diglyph (2-letters)
	//   3. glyph (single-letter)
	// then truncate list to 5 predicted keys or less.
	// 
	predictForQuery(query) {

		if (!query.length) {
    		return [];
    	}

		let current = query[query.length-1];
    	let prev    = query[query.length-2];
    	let prev2   = query[query.length-3];

    	let dist = query.length == 1 || (prev == ' ') ? 'first' : 'mid';
    	let predictedChars = this.predictForGlyph(dist, current.toLowerCase());

    	let numTri = 0;
    	let numDi = 0;
   // 	if (dist == 'mid') {
    		let di = prev + current;
    		let predicted2 = this.predictForGlyph(dist, di.toLowerCase());
    		if (predicted2) {
    			numDi = predicted2.length;
    			predictedChars = predicted2.concat(predictedChars);
    		}	

    		let tri = prev2 + prev + current;

    		let predicted3 = this.predictForGlyph(dist, tri.toLowerCase());
    		if (predicted3) {
    			numTri = predicted3.length;
    			predictedChars = predicted3.concat(predictedChars);
    		}	
    	//}

    	if (predictedChars) {

    		let numChars = X.num('sPredictKeys');

    		if (X.flag('fAzPredict2')) {
    		 	numChars = Math.min(numTri + numDi, numChars);
    		} 
    		else if (X.flag('fAzPredict3')) {
    		 	numChars = Math.min(numTri, numChars);
    		} 

			predictedChars = predictedChars.slice(0, numChars);
   			return predictedChars;
    	}

    	return [];
	},

	analyze(videos) {

		let samples = this.getSamples(videos);
		
		this.analyzeSamples(samples);
		this.calcPredicted();

		console.log(this.freq);
	},


	// PRIVATE

	getSamples(videos) {
		let samples = PEOPLE;

		Object.keys(videos).forEach((videoId,i)=>{

			let vid = videos[videoId];
			let title = vid.title.short.toLowerCase();
			title = title.replace(/'s/g, 's');
			title = title.replace(/&/g, ' and ');
			title = title.replace(/[^a-z0-9]+/g, ' ');

			samples.push(title);
		});

		return samples;
	},

	analyzeSamples(samples) {

		samples.forEach((sample)=>{

			let chars = sample.split('');

			let isNewWord = true;

			chars.forEach((c, i)=>{

				if (c == ' ') {
					
					isNewWord = true;

				} else {

					let dist = isNewWord || i == 1 ? 'first' : 'mid';
					isNewWord = false;

					// single letter
					if (i > 0) {
						let prevChars = chars.slice(i-1, i);
						this.incCount(dist, c, prevChars);
					}

					// diglyph
					if (i > 1) {
						let prevChars = chars.slice(i-2, i);
						this.incCount(dist, c, prevChars);
					}

					// triglyph
					if (i > 2) {
						let prevChars = chars.slice(i-3, i);
						this.incCount(dist, c, prevChars);
					}
				}
				
			});
		});
	},

	calcPredicted() {

		Object.keys(this.freq).forEach((dist)=>{
			this.freq[dist]['predicted'] = {};
			Object.keys(this.freq[dist]).forEach((char)=>{

				if (char == 'predicted') { return; }

				let countByChar = this.freq[dist][char];

				let nextChars = Object.keys(countByChar);
				let numChars = 0;
				nextChars.forEach((c)=>{
					numChars += parseInt(countByChar[c]);
				});
				let thresh = 0; // Math.floor(numChars * 0.1);

				let strip = [];

				nextChars = nextChars.sort(function(a,b){
					if (countByChar[a] == countByChar[b]) { return 0; }
					return countByChar[a] < countByChar[b] ? 1 : -1;
				});

				nextChars.forEach((c)=>{
					if (countByChar[c] >= thresh && c !== ' ') {
						strip.push(c);
					}
				});

				this.freq[dist]['predicted'][char] = strip;
			});
		});
	},

	incCount(dist, c, prevChars) {

		prevChars = prevChars.join('');

		if (prevChars.match(/\s/)) { return; }

		if (!this.freq[dist][prevChars]) {
			this.freq[dist][prevChars] = {};
		}
		if (!this.freq[dist][prevChars][c]) {
			this.freq[dist][prevChars][c] = 0;
		}
		this.freq[dist][prevChars][c] += 1;

	},

	predictForGlyph(dist, glyph) {
		return this.freq[dist].predicted[glyph];
	}
}

