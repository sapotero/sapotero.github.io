"use strict";

WebFont.load({
  custom: {
    families: ["Elusive"]
  },
  active: function() {
    initPlayer();
  }
});


function initPlayer(){
  var PIXI_WIDTH = 900;
  var PIXI_HEIGHT = 100;

  var circles = [];
  for(var i = 0; i < 128; i++) {
    circles[i] = {x: (window.innerWidth / 128) * i,y: window.innerHeight / 2};
  }
  var graphics = new PIXI.Graphics();

  var stage = new PIXI.Container();
  var renderer = new PIXI.WebGLRenderer(1, 1,{
    antialiasing : true,
    transparent  : true,
    resolution   : 1
  });
  renderer.resize(window.innerWidth, window.innerHeight);

  document.querySelector('#player').appendChild(renderer.view);


  var buttonPlayWrapper = new PIXI.Graphics();
  buttonPlayWrapper.beginFill(0xacacac);
  buttonPlayWrapper.drawCircle(100, 50,27);
  buttonPlayWrapper.endFill();
  buttonPlayWrapper.alpha = 0.5;

  var buttonPlay = new PIXI.Graphics();
  buttonPlay.beginFill(0xfcfcfc);
  buttonPlay.drawCircle(100, 50, 25 );
  buttonPlay.endFill();

  var buttonPlayIcon = new PIXI.Text('\uf1c7', { 
    fill: '#000000',
    font: '20px Elusive'
  });
  buttonPlayIcon.x = 93;
  buttonPlayIcon.y = 40;
  buttonPlayIcon.alpha = 0.5;
  buttonPlayIcon.play  = true;

  var forward = new PIXI.Graphics();
  forward.beginFill(0x000000);
  forward.drawCircle(151, 50, 25-5);
  forward.endFill();
  forward.alpha = 0.0;

  forward.interactive = true;
  forward.buttonMode = true;

  forward.mouseup = function (e) {
    forwardIcon.alpha = 0.5;
  }
  forward.mousedown = function (e) {
    console.log('forward.mousedown');
    forwardIcon.alpha = 0.75;
  }

  var forwardIcon = new PIXI.Text('\uf16b', { 
    fill: '#000000',
    font: '20px Elusive'
  });
  forwardIcon.x = 143;
  forwardIcon.y = 40;
  forwardIcon.alpha = 0.5;

  var backward = new PIXI.Graphics();
  backward.beginFill(0x000000);
  backward.drawCircle(41, 50, 25-5);
  backward.endFill();
  backward.alpha = 0.0;

  backward.interactive = true;
  backward.buttonMode  = true;

  backward.mouseup = function (e) {
    backwardIcon.alpha = 0.5;
  }
  backward.mousedown = function (e) {
    console.log('backward.mousedown');
    backwardIcon.alpha = 0.75;
  }

  var backwardIcon = new PIXI.Text('\uf110', { 
    fill: '#000000',
    font: '20px Elusive'
  });
  backwardIcon.x = 38;
  backwardIcon.y = 40;
  backwardIcon.alpha = 0.5;

  forward.mouseup = function (e) {
    forwardIcon.alpha = 0.5;
  }
  forward.mousedown = function (e) {
    console.log('forward.mousedown');
    forwardIcon.alpha = 0.75;
  }


  buttonPlay.interactive = true;
  buttonPlay.buttonMode = true;

  buttonPlay.hitArea = new PIXI.Circle(100, 50, 25 );

  buttonPlay.mouseover = function(mouseData) {
    buttonPlayWrapper.alpha = 0.75;
  }
  buttonPlay.mouseout = function(mouseData) {
    buttonPlayWrapper.alpha = 0.5;
  }
  buttonPlay.mouseup = function(mouseData) {
    buttonPlayWrapper.alpha = 0.75;

    if ( buttonPlayIcon.play ) {
      buttonPlayIcon.text = '\uf1b9';
      buttonPlayIcon.x = 91;
      buttonPlayIcon.y = 40;

      if ( audio && audio.paused ) {
        PIXI.audioManager.resume();

        console.log( audio );

      } else if (audio) {
        audio.play();
      }
    } else {
      buttonPlayIcon.text = '\uf1c7';
      buttonPlayIcon.x = 93;
      buttonPlayIcon.y = 40;

      if ( audio && audio.playing ) {
        PIXI.audioManager.pause();
      } else if (audio) {
        audio.stop();
      }
    }
    buttonPlayIcon.play = !buttonPlayIcon.play;
  }
  buttonPlay.mousedown = function (e) {
    console.log(this, e);
    buttonPlayWrapper.alpha = 1;
  }




  var dropShadowFilter = new PIXI.filters.DropShadowFilter();
  dropShadowFilter.color = 0x000000;
  dropShadowFilter.alpha = 0.25;
  dropShadowFilter.blur = 0.5;
  dropShadowFilter.distance = 5;
  dropShadowFilter.angle = 135;

  var strongBlurFilter = new PIXI.filters.BlurFilter();
  strongBlurFilter.blur = 20;
  strongBlurFilter.padding = 20;

  var weakBlurFilter = new PIXI.filters.BlurFilter();
  weakBlurFilter.blur = 10;



  buttonPlayWrapper.filters = [ dropShadowFilter, strongBlurFilter ];
  buttonPlay.filters = [weakBlurFilter];

  stage.addChild(buttonPlayWrapper, buttonPlay, buttonPlayIcon, forward, forwardIcon, backward, backwardIcon, graphics );

  requestAnimFrame(animate);

  function animate() {

    graphics.clear();

    for(var i = 0; i < circles.length; i++) {
      if (i % 2 == 0) {
          graphics.beginFill( 0xcccccc);
      } else {
      graphics.beginFill(0xffffff);
      }
      graphics.drawCircle(circles[i].x, circles[i].y, 2);
    }

    if ( audio ) {
      audio.data.analyser.getByteFrequencyData(audio.data.buffer_array);
    
      for (var i = 0; i < audio.data.buffer_length; i++) {
        circles[i].x = (window.innerWidth / 128) * i;
        circles[i].y += ((((PIXI_HEIGHT /2 - (audio.data.buffer_array[i] / 2)) - circles[i].y) + ((audio.data.buffer_array[i] * 2)))) / 1.5;
      }
    }

    requestAnimFrame(animate);
    renderer.render(stage);
  }
}



// audio
var audio = false;

var audio = {
  ctx: new AudioContext(),
  sound: {
    url: "./mp3/song.mp3a",
    loop: true
  },
  request: new XMLHttpRequest(),
  data: {}
}

audio.sound.source = audio.ctx.createBufferSource();
audio.sound.volume = audio.ctx.createGain();
audio.sound.panner = audio.ctx.createPanner();
audio.data.analyser = audio.ctx.createAnalyser();

audio.request.open("GET", audio.sound.url, true);
audio.request.responseType = "arraybuffer";
audio.request.onload = function (e) {
  audio.ctx.decodeAudioData(this.response, function onSuccess (buffer) {
    audio.sound.buffer = buffer;
    audio.sound.source.buffer = audio.sound.buffer;
    audio.sound.source.start(0);
  },function onError (error) {
    alert(error);   
  });
};
audio.request.send();

audio.sound.source.connect(audio.sound.volume);
audio.sound.volume.connect(audio.sound.panner);
audio.sound.volume.connect(audio.data.analyser);
audio.sound.panner.connect(audio.ctx.destination);
// audio.sound.source.loop = true;
audio.sound.panner.setPosition(0,0,1);

audio.data.analyser.fftSize = 256;
audio.data.buffer_length = audio.data.analyser.frequencyBinCount;
audio.data.buffer_array = new Uint8Array(audio.data.buffer_length);
audio.data.analyser.getByteFrequencyData(audio.data.buffer_array);

// PIXI.loader.add([
//   {
//     name:"song",
//     url:"./mp3/song.mp3"
//   }
// ]).load(function( _s ){

//   audio = PIXI.audioManager.getAudio('song');
  
//   audio._sound = {};
//   audio._data  = {};
  
//   audio._sound.source  = audio.manager.context.createBufferSource();
//   audio._sound.volume  = audio.manager.context.createGain();
//   audio._sound.panner  = audio.manager.context.createPanner();
//   audio._data.analyser = audio.manager.context.createAnalyser();

//   audio._sound.buffer = _s;
//   audio._sound.source.buffer = audio._sound.buffer;
//   audio._sound.source.start(0);

//   audio._sound.source.connect(audio._sound.volume);
//   audio._sound.volume.connect(audio._sound.panner);
//   audio._sound.volume.connect(audio._data.analyser);
//   audio._sound.panner.connect(audio.manager.context.destination);

//   audio._data.analyser.fftSize = 256;
//   audio._data.buffer_length = audio._data.analyser.frequencyBinCount;
//   audio._data.buffer_array = new Uint8Array(audio._data.buffer_length);
//   audio._data.analyser.getByteFrequencyData(audio._data.buffer_array);

//   console.log(audio._data.buffer_array);
  
//   console.log('load');
// });