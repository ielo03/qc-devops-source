const addRecipe = (title, recipe) => {
  const pastRecipesDiv = document.getElementById("past-recipes");
  const recipeLink = document.createElement("a");
  const newRecipeDiv = document.createElement("div");
  newRecipeDiv.classList.add("new-recipe");

  // Set the link text and href attribute
  recipeLink.textContent = title;
  recipeLink.href = "#";
  recipeLink.classList.add("recipe-link");

  // When the link is clicked, display the recipe in the "recipe" div
  recipeLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default link behavior
    const recipeDiv = document.getElementById("recipe");
    recipeDiv.innerHTML = recipe;
  });

  newRecipeDiv.appendChild(recipeLink);
  pastRecipesDiv.appendChild(newRecipeDiv);
};

const displayRecipe = (recipe) => {
  const recipeDiv = document.getElementById("recipe");
  recipeDiv.innerHTML = recipe;
};

document.addEventListener("DOMContentLoaded", async () => {
  const submitButton = document.getElementById("submit");

  submitButton.addEventListener("click", function () {
    submitButton.value = "Concocting...";
    submitButton.style.backgroundColor = "purple";
    submitButton.disabled = true;

    const ingredients = document.getElementById("ingredients").value;
    const drink = document.getElementById("drink").value;

    const data = {
      ingredients: ingredients,
      drink: drink,
    };

    fetch("/api/concoct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        // Display the response in the recipe div
        displayRecipe(result.recipe);
        addRecipe(result.title, result.recipe);

        // Revert button appearance to normal
        submitButton.value = "Concoct";
        submitButton.style.backgroundColor = "";
        submitButton.disabled = false;
      })
      .catch((error) => {
        console.error("Error:", error);
        const recipeDiv = document.getElementById("recipe");
        recipeDiv.innerHTML = `<p>The cocktail blew up! Try again later.</p>`;

        // Revert button appearance to normal even in case of an error
        submitButton.value = "Concoct";
        submitButton.style.backgroundColor = "";
        submitButton.disabled = false;
      });
  });

  try {
    const response = await fetch("/api/recipes", {
      method: "GET",
    });

    if (response.ok) {
      for (const {title, recipe} of await response.json()) {
        addRecipe(title, recipe);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
