# INFO30005-Project

Team Project for WEB30005 shared repository.

## Running

From command line, run `npm install` to install dependencies. Run `npm start` to run app, and `npm run serve` to run the live test version (autocompile scss, reload on file change, etc).

## Testing

Run `npm test` to run the mocha tests for the app.

## CSS

Edit .scss files in src/scss/ to change css. Do not edit public/stylesheets/_style.css as changes will be removed upon the next scss build.

## Functionalities

### Contacts page

Accesses our mongoDB database of contacts that contain the information of charities and other services that offer food collection services.

- `routes/routes-content.js`
- `views/contacts.ejs`
- `controllers/contactController.js`
- `models/contact.js`

[Contacts Page](https://endwaste.herokuapp.com/contacts)

### Recipe page

Accesses our mongoDB database derived from taste.com. Once a user inputs their ingredients, the site querys the database and returns a list of recipes containing some or all these ingredients. A user can mark their ingredients as a priority if they must rid of a certain ingredient. After selecting a recipe, there are three steps: Ingredients, Method, and Cleanup.

- `routes/routes-content.js`
- `views/recipe.ejs`
- `views/recipe-step-1.ejs`
- `views/recipe-step-2.ejs`
- `views/recipe-step-3.ejs`
- `controllers/recipeController.js`
- `controllers/ingredientController.js`
- `controllers/userController.js`
- `models/recipe.js`
- `models/ingredient.js`
- `models/user.js`

[Ingredients Page](https://endwaste.herokuapp.com/ingredients)

## Access our master page

endwaste.herokuapp.com

