# ng-watch-notify

Get notified when an Angular watch command finishes, useful when you don't want to context-switch between your IDE and terminal.

```npm install ng-watch-notify --save-dev```

In angular.json, add this to the 'architect' section for each app you want to use it with:

```
"watch-and-notify": {
  "builder": "ng-watch-notify:watch-notify"
},
```

(you can change 'watch-and-notify' to whatever you want.)

Build options will be picked up from the 'build' builder in your angular.json file.

Then run

`npm run your-app-name:watch-and-notify`

To change the configuration from 'development' to something else, or to turn watch off,
add an 'options' object to the key in angular.json you added earlier, e.g.

```
"watch-and-notify": {
  "builder": "ng-watch-notify:watch-notify",
  "options": {
    "configuration": "production",
    "watch": false
  }
},
```