
let dayOfWeek = 4; // 1 for monday
let timeOfDay = 21+1; //END time

let overlayIsOn=false
let globalOverlay=undefined

let pad = function(value) {if (value<10) return '0'+value; else return value}

let overlayOn = function() {
  if (!overlayIsOn) {
    var overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.innerHTML += "<div class=\"black_overlay\"></div>";
    document.body.insertBefore(overlay, document.body.firstChild);


    globalOverlay = document.createElement("div");
    globalOverlay.className= "fullscreenApp"
    overlay.appendChild(globalOverlay)

  }
  overlayIsOn=true
}

let overlayOff = function() {
  if (overlayIsOn) {
    var overlay = document.getElementById("overlay");
		overlay.parentNode.removeChild(overlay);
  }
  overlayIsOn=false
  globalOverlay=undefined
}

let displayWaffleEnd = function() {
  var wrapper = document.createElement("div");
  var headerD = document.createElement("span");
  var timeLeft = document.createElement("span");

  timeLeft.innerHTML = "No more waffles!";
  timeLeft.className = "doooom";

  wrapper.appendChild(headerD);
  wrapper.appendChild(timeLeft);
  return wrapper;
}

let displayWaffleCountdown = function() {
  var nowDate = new Date();
  var startDate = new Date();
  if (startDate.getDay()!=dayOfWeek) {
    startDate.setDate(startDate.getDate() + (7+dayOfWeek-startDate.getDay()%7)  );
  } else {
    startDate.setDate(startDate.getDate());
  }

  startDate.setHours(timeOfDay)
  startDate.setMinutes(0)
  startDate.setSeconds(0)

  var timeparser = Date.parse(startDate) - Date.parse(nowDate);
  daysLeft = Math.floor(timeparser/(1000*60*60*24));
  hoursLeft= Math.floor(timeparser/(1000*60*60));
  minsLeft= Math.floor(timeparser/(1000*60));
  secsLeft= Math.floor(timeparser/(1000));


  var wrapper = document.createElement("div");
  var headerD = document.createElement("span");
  var timeLeft = document.createElement("span");

  headerD.innerHTML = "Waffles in:" + "<br/><br/>";
  headerD.className = "doooom";
  var timeLeft = document.createElement("span")
  timeLeft.innerHTML = pad(daysLeft) + ':' + pad(hoursLeft % 24) + ':' + pad(minsLeft % 60) + ':' + pad(secsLeft % 60)
  timeLeft.className = "timeLeft";

  wrapper.appendChild(headerD);
  wrapper.appendChild(timeLeft);
  return wrapper;
}

let displayWaffleFullscreen = function(timeLeft) {

//overlayOn()
//globalOverlay.innerHTML="BLABLABLABLA"

var wrapper = document.createElement("div");
var headerD = document.createElement("span");
headerD.innerHTML = "Waffle ready!";
var span = document.createElement("span");
var barLength=20
var stekeTid=180 //2:50
var venteTid=30 //20sec
var totaltTid=stekeTid+venteTid
let now = new Date()
var loadingTimeNow = Math.round(now.getTime() / 1000) % totaltTid

if (loadingTimeNow<stekeTid) {
  headerD.innerHTML = "Loading waffle:" + "<br/><br />";
  var steps=Math.round(barLength*(loadingTimeNow/stekeTid))
  var unfinished=barLength
  var loadingBar = ""
  for (var i=0;i<steps;i++) {
    loadingBar+='#'
    unfinished-=1
  }
  for (var i=0;i<unfinished;i++) {
    loadingBar+='_'
  }
  headerD.innerHTML += loadingBar
}
wrapper.appendChild(headerD);
wrapper.appendChild(span);
return wrapper;

}


Module.register("MMM-waffleCountdown", {
    // Define start sequence.
    start: function() {
        var self = this;

        Log.info("Starting module: " + this.name);

        setInterval(function() {
            self.updateDom();
            //self.sendNotification("SHOW_ALERT", {title:'TEST',message:'Woooooohoo'});
        }, 1000);
    },

    getStyles: function () {
        return ["MMM-waffleCountdown.css"];
    },

    getDom: function() {

        var nowDate = new Date();
        var startDate = new Date();
        if (startDate.getDay()!=dayOfWeek) {
          startDate.setDate(startDate.getDate() + (7+dayOfWeek-startDate.getDay()%7)  );
        } else {
          startDate.setDate(startDate.getDate());
        }

        startDate.setHours(timeOfDay)
        startDate.setMinutes(0)
        startDate.setSeconds(0)

        var timeparser = Date.parse(startDate) - Date.parse(nowDate);
        var timeLeft =
        {
          days: Math.floor(timeparser/(1000*60*60*24)),
          hours: Math.floor(timeparser/(1000*60*60)),
          mins: Math.floor(timeparser/(1000*60)),
          secs: Math.floor(timeparser/(1000))
        }

        if (timeLeft.days<=0 && timeLeft.hours<-2) {
          return displayWaffleEnd();
        } else if (timeLeft.days<=0 && timeLeft.secs<0) {
          return displayWaffleFullscreen(timeLeft);
        } else {
          return displayWaffleCountdown();
        }


    }
});
