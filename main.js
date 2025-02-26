import data from "./db/song.js"
console.log(data);
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: data.songs,
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class= "song-node">
					<div class="song" data-index="${index}">
						<div class="thumb"
							style="background-image: url('${song.image}')">
						</div>
						<div class="body">
							<h3 class="title">${song.name}</h3>
							<p class="author">${song.singer}</p>
						</div>
						<div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
					</div>
                </div>    
				`
        })
        playlist.innerHTML = htmls.join('')
    },
    //define a property called currentSong for object 'app'
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", { //see doc for more info for defineProperty()
          get: function () {
            return this.songs[this.currentIndex];
          }
        });
    },

    // listen and handle events functions for this object app 
    handleEvents: function(){
        const _this = this //to save the 'this' aka 'app' into this inner scope
        const cdWidth = cd.offsetWidth
        
        // handles cd rotations - see more on web animation api developer.mozilla.org/en-US/docs/Web/API/Element/animate
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }], {
            duration: 8000, // duration in ms to complete 1 single 360deg rotation
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // handles CD enlargement / reduction
        document.onscroll = function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;
  
        cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0; //even if you scroll fast, negative vals will be assigned to 0 -> completely hide the cd
        cd.style.opacity = newCdWidth / cdWidth;
        };

        // check song status - onplay - see w3 docs for more on html audio/video
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };
  
        // check song status - onpause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // handle when click play/pause with given song status
        playBtn.onclick = function () {
            if (_this.isPlaying) {
            audio.pause();
            } else {
            audio.play();
            }
        };

        // handle progress bar when the song playing
        // ontimeupdate is triggered when current playback position changes aka audio is playing
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100
            );
            progress.value = progressPercent;
            }
        };

        //handle when skip to a given time in the audio
        progress.oninput = function(){ //oninput instead of onchange to trigger immidiately
            const landTime = (audio.duration) * (progress.value / 100)
            audio.currentTime = landTime;
        }
        
    },

    // to load current song's heading, cd and audio
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    
    start: function(){
        // assign configuration from config to application
        //this.loadConfig();
        // defines properties for the object
        this.defineProperties();

        // listening / handling events (DOM events)
        this.handleEvents();

        // load the first song information into the UI when running the app
        this.loadCurrentSong();

        // render playlist
        this.render();
    }
}

app.start();
