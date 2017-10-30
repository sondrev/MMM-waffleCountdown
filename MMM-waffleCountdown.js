
let dayOfWeek = 1; // 1 for monday
let timeOfDay = 14; //star time.

let overlayIsOn=false
let globalOverlay=undefined

let pad = function(value) {if (value<10) return '0'+value; else return value}

let overlayOn = function() {
  var overlayBlack = document.getElementById("overlayBlack");
  if (overlayBlack!==undefined) {
    overlayBlack.innerHTML = "<div class=\"black_overlay\"></div>";
  }
}

let overlayOff = function() {
  var overlayBlack = document.getElementById("overlayBlack");
  if (overlayBlack!==undefined) {
    overlayBlack.innerHTML="<div></div>"
  }
}

let displayWaffleEnd = function() {
  var wrapper = document.createElement("div");
  var headerD = document.createElement("span");
  var timeLeft = document.createElement("span");

  timeLeft.innerHTML = "No more waffles!";
  timeLeft.className = "text";

  wrapper.appendChild(headerD);
  wrapper.appendChild(timeLeft);
  return wrapper;
}

let displayWaffleCountdown = function(timeLeft) {
  var wrapper = document.createElement("div");
  var headerD = document.createElement("span");
  var timer = document.createElement("span");

  headerD.innerHTML = "Waffles in:" + "<br/><br/>";
  headerD.className = "text";
  timer.innerHTML = pad(timeLeft.days) + ':' + pad(timeLeft.hours % 24) + ':' + pad(timeLeft.mins % 60) + ':' + pad(timeLeft.secs % 60)
  timer.className = "timeLeft";

  wrapper.appendChild(headerD);
  wrapper.appendChild(timer);
  return wrapper;
}

let displayWaffleCountdownBig = function(timeLeft) {
  overlayOn()
  var wrapper = document.createElement("div");
  var headerD = document.createElement("span");
  var timer = document.createElement("span");

  timer.innerHTML = pad(timeLeft.days) + ':' + pad(timeLeft.hours % 24) + ':' + pad(timeLeft.mins % 60) + ':' + pad(timeLeft.secs % 60)
  timer.className = "timeLeftBig";

  wrapper.appendChild(headerD);
  wrapper.appendChild(timer);
  return wrapper;
}

let displayWaffleFullscreen = function(timeLeft) {
  overlayOn()
  var wrapper = document.createElement("div");
  var headerD = document.createElement("span");
  headerD.innerHTML = "Waffle ready!";
  headerD.className = "fullscreenApp"
  var span = document.createElement("span");
  var barLength=20
  var stekeTid=170 //2:50
  var venteTid=30 //20sec
  var totaltTid=stekeTid+venteTid
  let now = new Date()
  var deltaTime = Math.floor((now.getTime() - timeLeft.startTime)/1000)
  //var deltaTime=(timeLeft.startTime - Math.floor(now.getTime() / 1000))
  var loadingTimeNow = (deltaTime) % totaltTid


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

        overlayBlack = document.createElement("div");
        overlayBlack.id = "overlayBlack";
        overlayBlack.innerHTML="<div></div>"
        document.body.insertBefore(overlayBlack, document.body.firstChild);

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
          startTime: Date.parse(startDate),
          days: Math.floor(timeparser/(1000*60*60*24)),
          hours: Math.floor(timeparser/(1000*60*60)),
          mins: Math.floor(timeparser/(1000*60)),
          secs: Math.floor(timeparser/(1000))
        }

        overlayOff()
        if (timeLeft.days<=0 && timeLeft.hours<-2) {
          return displayWaffleEnd();
        } else if (timeLeft.days<=0 && timeLeft.secs<0) {
          return displayWaffleFullscreen(timeLeft);
        } else if (timeLeft.days<=0 && timeLeft.secs<=10) {
          return displayWaffleCountdownBig(timeLeft);
        }else {
          return displayWaffleCountdown(timeLeft);
        }


    }
});
