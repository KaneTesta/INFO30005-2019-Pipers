# INFO30005-Project

Team Project for WEB30005 shared repository.

## Running

From command line, run `npm install` to install dependencies. Run `npm start` to run app, and `npm run serve` to run the live test version (autocompile scss, reload on file change, etc).

## CSS

Edit .scss files in src/scss/ to change css. Do not edit public/stylesheets/_style.css as changes will be removed upon the next scss build.

## Functionalities for Deliverable 4

Contacts page - Accesses our mongoDB database of contacts that contain the information of charities and other services that offer food collection services.

Recipe page - Accesses our mongoDB database derived from taste.com. Once a user inputs their ingredients, the site querys the database and returns a list of recipes containing some or all these ingredients. A user can mark their ingredients as a priority if they must rid of a certain ingredient.


All views are found in the /controllers/ directory
Routes-content.js
contactController.js
recipeController.js
ingredientController.js

All views are found in the /src/views/ directory

All relevant models are found in the /models/ directory


## Access our master page
endwaste.herokuapp.com

