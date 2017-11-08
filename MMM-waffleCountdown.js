
Module.register("MMM-waffleCountdown", {

    defaults: {
      dayOfWeek: 1, // 1 for monday
      timeOfDay: 14,
      minuteOfDay: 0
    },

    start: function() {
        var self = this;

        Log.info("Starting module: " + this.name);
        this.waffleOverlayCreate();
        setInterval(function() {
            self.updateDom();
        }, 1000);
    },

    padTime: function(value) {if (value<10) return '0'+value; else return value},

    waffleOverlayCreate: function(html) {
      waffleOverlay = document.createElement("div");
      waffleOverlay.id = "waffleOverlay";
      waffleOverlay.innerHTML="<div></div>"
      document.body.insertBefore(waffleOverlay, document.body.firstChild);
    },

    waffleOverlayUpdate: function(html) {
      let waffleOverlay = document.getElementById("waffleOverlay");
      if (waffleOverlay!==undefined) {
        waffleOverlay.innerHTML = "<div class=\"Aligner\"><div class=\"Aligner-item\">"+html+"</div></div>";
      }
    },

    waffleOverlayDisable: function() {
      let waffleOverlay = document.getElementById("waffleOverlay");
      if (waffleOverlay!==undefined) {
        waffleOverlay.innerHTML="<div></div>"
      }
    },

    displayWaffleEnd: function() {
      var wrapper = document.createElement("div");
      var spanText = document.createElement("span");

      spanText.innerHTML = "No more waffles!";
      spanText.className = "text";

      wrapper.appendChild(spanText);
      return wrapper;
    },

    displayWaffleCountdownBig: function(timeLeft) {
      var wrapper = document.createElement("div");
      var headerD = document.createElement("span");
      var timer = document.createElement("span");

      timer.innerHTML = this.padTime(timeLeft.days) + ':' + this.padTime(timeLeft.hours % 24) + ':' + this.padTime(timeLeft.mins % 60) + ':' + this.padTime(timeLeft.secs % 60)
      timer.className = "timeLeftBig";

      //wrapper.appendChild(headerD);
      //wrapper.appendChild(timer);
      this.waffleOverlayUpdate("<div class=\"timeLeftBig2\">"+timer.innerHTML+"</div>")
      return wrapper;
    },

    displayWaffleFullscreen: function(timeLeft) {
      var wrapper = document.createElement("div");
      var headerD = document.createElement("span");
      headerD.innerHTML = "Waffle ready!";
      var span = document.createElement("span");
      var barLength=20
      var stekeTid=200 //2:50
      var venteTid=50 //20sec
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

      this.waffleOverlayUpdate("<div class=\"fullscreenApp2\">"+headerD.innerHTML+"</div>")
      return wrapper;

    },

     displayWaffleCountdown: function(timeLeft) {
      var wrapper = document.createElement("div");
      var spanHeader = document.createElement("span");
      var spanCountdown = document.createElement("span");

      spanHeader.innerHTML = "Waffles in:" + "<br/><br/>";
      spanHeader.className = "text";
      spanCountdown.innerHTML = this.padTime(timeLeft.days) + ':' + this.padTime(timeLeft.hours % 24) + ':' + this.padTime(timeLeft.mins % 60) + ':' + this.padTime(timeLeft.secs % 60)
      spanCountdown.className = "timeLeft";

      wrapper.appendChild(spanHeader);
      wrapper.appendChild(spanCountdown);
      return wrapper;
    },

    getStyles: function () {
        return ["MMM-waffleCountdown.css"];
    },

    getDom: function() {

        var nowDate = new Date();
        var startDate = new Date();
        if (startDate.getDay()!=this.config.dayOfWeek) {
          startDate.setDate(startDate.getDate() + (7+this.config.dayOfWeek-startDate.getDay()%7)  );
        } else {
          startDate.setDate(startDate.getDate());
        }

        startDate.setHours(this.config.timeOfDay)
        startDate.setMinutes(this.config.minuteOfDay)
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

        this.waffleOverlayDisable()
        if (timeLeft.days<=0 && timeLeft.hours<-2) {
          return this.displayWaffleEnd();
        } else if (timeLeft.days<=0 && timeLeft.secs<0) {
          return this.displayWaffleFullscreen(timeLeft);
        } else if (timeLeft.days<=0 && timeLeft.secs<=10) {
          return this.displayWaffleCountdownBig(timeLeft);
        } else {
          return this.displayWaffleCountdown(timeLeft);
        }


    }
});
