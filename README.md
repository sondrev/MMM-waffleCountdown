# MMM-waffleCountdown

This module for the [MagicMirror](https://github.com/MichMich/MagicMirror) shows the time left until waffleMondays

## Installation

  1\. Execute the following commands to install the module:

```bash
cd ~/MagicMirror/modules # navigate to module folder
git clone https://github.com/sondrev/MMM-waffleCountdown.git # clone this repository
```

  2\. Then, add the following into the `modules` section of your `config/config.js` file:

````javascript
{
        module: 'MMM-waffleCountdown',
        position: "bottom_bar",
        config: {
                dayOfWeek: 1, //1 for mondays
                timeOfDay: 14,
                minuteOfDay: 0,
        },
},
````
