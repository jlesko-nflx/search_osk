import BaseTag from '/tags/_common/BaseTag.js';

X.variants({
    fVideoMute: false,
});


export default class CoreVideoTag extends BaseTag {

    onMount() {
        this.state = {
            videoId: 0,
            cadmiumPlayer: null,

            currentTime: 0,
            totalTime: 100,
            isPaused: false
        };

        if (this.data.episodeId) {
            this.playEpisode({ id: this.data.episodeId });
        } else {
            this.playNew(this.data.videoId);
        }
    }

    destroy() {
        this.cadmiumPlayer && this.cadmiumPlayer.close();
    }

    seek(delta) {
        this.cadmiumPlayer.seek(this.state.currentTime + delta);
    }

    seekTo(time) {
        this.cadmiumPlayer.seek(time);
    }

    playNew(videoId) {

        if (!videoId) {
            console.error('Video.playNew: no videoId', videoId);
            return;
        }

        var video = DATA.videos[videoId];

        if (!video) {
            // MONTAGES aren't in the data
            console.log('Video.playNew: no video data', videoId);
        }

        var isShow = false;
        if (video && video.seasons) {
            var firstEp = video.seasons[0].episodes[0];
            this.playableId = firstEp.id;
            isShow = true;
        } else {
            this.playableId = Number(videoId);
        }

        console.log('Player', 'playableId=' + this.playableId, '(videoId=' + videoId + ')', 'isShow=' + isShow);

        this.initPlayer();
    }

    playEpisode(episode) {

        this.playableId = Number(episode.id);

        console.log('Player', 'episodeId=' + this.playableId);

        this.initPlayer();
    }

    initPlayer() {
        this.createPlayer(this.playableId);
        this.data.skipBookmark ? this.playFromBeginning() : this.play();

        if (X.flag('fVideoMute')) {  
            this.cadmiumPlayer.setVolume(0);  
        }

        this.data.onInit && this.data.onInit(this);
    }

    playFromBeginning() {
        this.cadmiumPlayer.seek(1);
        this.cadmiumPlayer.play();
    }

    play() {
        if (this.data.startTime) { 
            this.cadmiumPlayer.seek(this.data.startTime); 
        }
        this.cadmiumPlayer.play();
    }

    togglePause(setPause) {
        var isBool = setPause === true || setPause === false;
        var doPause = isBool ? setPause : !this.state.isPaused;
        if (doPause) {
            this.cadmiumPlayer.pause();
        } else {
            this.cadmiumPlayer.play();
        }
        this.setState({ isPaused: doPause });

       // this.trigger(this.data.playerId + '.pause', doPause);

        return doPause;
    }

    createPlayer(videoId) {

        // API is in playercore.js at 'function cadmiumPlayer'
        this.destroy();

        this.videoSession = new netflix.player.VideoSession({
            environment: 'PROD',
            enforceSinglePlayback: false
        });

        var trackId = 9999;
        this.cadmiumPlayer = this.videoSession.createPlayer(videoId, trackId);

        this.addEventListeners(videoId);

       // X.set('player.' + videoId, this);


            setTimeout(()=>{
                $('.cadmium').empty().append(this.cadmiumPlayer.getElement());
            },1);
            
      //  }
    }

    addEventListeners(videoId) {

        this.cadmiumPlayer.addEventListener('loadedmetadata', ()=> {
            this.onMetadataLoaded();
        });

        this.cadmiumPlayer.addEventListener('loaded', ()=> {
            this.onLoaded();
        });

        this.cadmiumPlayer.addEventListener('currenttimechanged', ()=> {
            this.onTick();
        });

        this.cadmiumPlayer.addEventListener('durationchanged', ()=>{ 
            this.onDurationChange();
        });

        this.cadmiumPlayer.addEventListener('error', (args)=>{ 
            this.onError(args); 
        });
    }

    onMetadataLoaded() {
      //  this.cadmiumPlayer.seek(0);
    }

    onLoaded() {

         // turn off subtitles which are on by default
        this.cadmiumPlayer.setTimedTextTrack(this.cadmiumPlayer.getTimedTextTrackList()[0])

        this.data.onLoaded && this.data.onLoaded();
        // this.trigger(this.data.playerId + '.loaded');

    }

    onTick() {

        this.state.currentTime = this.cadmiumPlayer.getCurrentTime();

        var time = {

            currentTime: this.state.currentTime,
            totalTime: this.state.totalTime,
            timeLeft: this.state.totalTime - this.state.currentTime,
            progress: (this.state.currentTime / this.state.totalTime) * 100.0,

            getTimes: function (id) {
                var duration = this[id];
                return {
                    milliseconds: parseInt((duration%1000)/100),
                    seconds:      parseInt((duration/1000)%60),
                    minutes:      parseInt((duration/(1000*60))%60),
                    hours:        parseInt((duration/(1000*60*60))%24)
                };
            },

            getFormat: function(id) {

                var t = this.getTimes(id);
                var hours   = (t.hours < 10)   ? "0" + t.hours   : t.hours;
                var minutes = (t.minutes < 10) ? "0" + t.minutes : t.minutes;
                var seconds = (t.seconds < 10) ? "0" + t.seconds : t.seconds;

                var hasHours = this.getTimes('totalTime').hours > 0;

                return hasHours
                    ? hours + ":" + minutes + ":" + seconds
                    : minutes + ":" + seconds;
              }
        };

        this.data.onTimeChange && this.data.onTimeChange(time);
       // this.trigger(this.data.playerId + '.timeChanged', time);

    }

    onDurationChange() {
        this.state.totalTime = this.cadmiumPlayer.getDuration();
    }

    onError(args) {
        console.error('Player Error', this.data.videoId, args);
    }

    html() {
        let cls = this.data.class || '';
        return jml`
            <"${'cadmium layer ' + cls}"></>
        `;
    }

}

