function displayRecipeResults(data) {
  console.log(data);

  // grab element
  const searchResultsContainer = document.querySelector(
    "#search-results-container"
  );

  // iterate fetched data
  data.forEach((result) => {
    // destructuring assignment
    const { image, name, cookTime, servings } = result;

    // create div element for each hit/result
    const searchResult = document.createElement("div");

    // to style each div
    searchResult.classList.add("search-result");

    // manipulate dom
    searchResult.innerHTML = `
    <img src="${image}" alt="${name}"/>
    <p>${name}</p>
    <p>Cook Time: ${cookTime}</p>
    <p>Servings: ${servings}</p>    
    `;

    // attach to parent container
    searchResultsContainer.appendChild(searchResult);
  });
}

function bindUrlWithParams(url, params) {
  const queryString = new URLSearchParams(params).toString(); //e.g., "name=...&excludeIngredients=..."
  return `${url}?${queryString}`;
}

function fetchRecipes(searchValue, dietValue, excludeIngredientValue) {
  const urlApi = "https://low-carb-recipes.p.rapidapi.com/search";
  const queryParams = {
    name: searchValue,
    excludeIngredients: excludeIngredientValue,
    tags: dietValue,
  };

  // combine url with params
  const urlWithParams = bindUrlWithParams(urlApi, queryParams);

  // ! fetch API - all
  fetch(urlWithParams, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-RapidAPI-Key": config.API_KEY,
      "X-RapidAPI-Host": "low-carb-recipes.p.rapidapi.com",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // invoke upon receiving data
      displayRecipeResults(data);
    })
    .catch((err) => {
      // !reponse.ok/fetch error
      console.log(err);
    });
}

function recipeFormHandler(e) {
  // prevent default refresh behavior
  e.preventDefault();

  // grab user form input values
  const searchValue = document.querySelector("#recipe-name").value;
  const dietValue = document.querySelector("#diet").value;
  const excludeIngredientValue = document.querySelector(
    "#exclude-ingredient"
  ).value;

  // invoke to fetch recipes that match specified filters
  fetchRecipes(searchValue, dietValue, excludeIngredientValue);

  // clear form values upon submission
  e.target.reset();
}

function displaySelectDiets() {
  // grab element
  const select = document.querySelector("#diet");

  const options = [
    "Select tag",
    "beef-free",
    "chicken-free",
    "fish-free",
    "gluten-free",
    "keto",
    "kid-freely",
    "lchf",
    "meal-plan-ok",
    "peanut-free",
    "pork-free",
    "relevant-meal-sides",
    "shellfish-free",
    "soy-free",
    "vegetarian",
    "wheat-free",
  ];

  // iterate options array
  options.forEach((value) => {
    // create option element for each item
    const option = document.createElement("option");

    // manipulate dom
    option.value = value;
    option.innerHTML = value;

    // attach each option to select
    select.appendChild(option);
  });
}

function handleDOMContentLoaded(e) {
  // grab element
  const recipeForm = document.querySelector("#recipe-form");

  // invoke to display options in select
  displaySelectDiets();

  // search for recipe
  recipeForm.addEventListener("submit", (e) => {
    recipeFormHandler(e);
  });
}

// wait HTML to load first
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
