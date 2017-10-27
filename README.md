# Places App

An Angular 2 app utilizing Google Places API, built with Angular CLI and written in TypeScript and JavaScript. Search for anything in the input field, and can submit your own search text or select from the Autocomplete list feature. A list of locations within or close to the map boundary will render to the left, as well as markers inside the map DOM. Hovering over a list item or marker will show selected marker's relevant information.

### Demo
Renders relevant list and markers from search input on the map
![image](https://github.com/kl2611/places-app/blob/master/src/assets/demo1.png)

Filters list of places and markers based on your map boundaries
![image](https://github.com/kl2611/places-app/blob/master/src/assets/demo2.png)

### To Run
Clone this repository to your local directory 
```
git clone https://github.com/kl2611/places-app.git
```

Navigate to folder
```
cd places-app
```

Install dependencies
```
npm install
```
Run a dev server
```
ng serve
```
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Thoughts and Future Implementations
I chose Angular 2 for this project due to its speed and performance in browser rendering. Angular CLI allowed for quick testing due to its reload on save. Furthermore, TypeScript is able to compile down to a version of JavaScript that runs on all browsers. 
<br />
Future implementations incude: 
- Render more information for each place from search results
- Ability to search based on current user location 
- Option to select if you want to search as you move the map
- Unit testing as app expands and adds new components
- More filtering options after list renders
