
let dayOfWeek = 1; // 1 for monday
let timeOfDay = 16; //END time

let pad = function(value) {
  if (value<10) return '0'+value; else return value
}


Module.register("MMM-waffleCountdown", {
    // Define start sequence.
    start: function() {
        var self = this;

        Log.info("Starting module: " + this.name);

        setInterval(function() {
            self.updateDom();
        }, 1000); //Run every sec
    },

    // Define required styles
    getStyles: function () {
        return ["MMM-waffleCountdown.css"];
    },

    // Override dom generator.
    getDom: function() {
        var now = new Date();
        //var d = new Date();

        var d = new Date();
        if (d.getDay()!=dayOfWeek) {
          d.setDate(d.getDate() + (7+dayOfWeek-d.getDay()%7)  );
        } else {
          d.setDate(d.getDate());
        }

        d.setHours(timeOfDay)
        d.setMinutes(0)
        d.setSeconds(0)

        //var d = new Date().getNextWkDay(dayOfWeek);
        //d.setHours(16);

        var timeparser = Date.parse(d) - Date.parse(now);
        daysLeft = Math.floor(timeparser/(1000*60*60*24));
        hoursLeft= Math.floor(timeparser/(1000*60*60));
        minsLeft= Math.floor(timeparser/(1000*60));
        secsLeft= Math.floor(timeparser/(1000));

        var wrapper = document.createElement("div");
        var headerD = document.createElement("span");


        if (daysLeft <= 1) {
          if (daysLeft<=0 && secsLeft<0) {
            var timeLeft = document.createElement("span");
            timeLeft.innerHTML = "No more waffles!";
            timeLeft.className = "doooom";
          } else if (daysLeft==0 && secsLeft<=2*60*60) {
            headerD.innerHTML = "Waffle ready!";
            var timeLeft = document.createElement("span");
            var barLength=20
            var stekeTid=180 //2:50
            var venteTid=30 //20sec
            var totaltTid=stekeTid+venteTid
            var loadingTimeNow = Math.round(now.getTime() / 1000) % totaltTid
            console.log("t:"+loadingTimeNow)

            if (loadingTimeNow<stekeTid) {
              headerD.innerHTML = "Loading waffle:" + "<br/><br />";
              var steps=Math.round(barLength*(loadingTimeNow/stekeTid))
              console.log("s:"+steps)
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

            headerD.className = "doooom";
          } else {
            headerD.innerHTML = "Waffles in:" + "<br/><br />";
            headerD.className = "doooom";
            var timeLeft = document.createElement("span")
            timeLeft.innerHTML = pad(hoursLeft-2) + ':' + pad(minsLeft % 60) + ':' + pad(secsLeft % 60)
            timeLeft.className = "timeLeft";
          }
        } else {
            headerD.innerHTML = "Waffles in:" + "<br/><br/>";
            headerD.className = "doooom";
            var timeLeft = document.createElement("span")
            timeLeft.innerHTML = pad(daysLeft-2) + ':' + pad((hoursLeft-2)%24) + ':' + pad(minsLeft % 60) + ':' + pad(secsLeft % 60)
            timeLeft.className = "timeLeft";
        }

        wrapper.appendChild(headerD);
        wrapper.appendChild(timeLeft);
        return wrapper;
    }
});
