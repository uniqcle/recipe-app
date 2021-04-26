const meals = document.getElementById('meals'); 

getRandomMeal(); 
fetchFevMeals(); 

async function getRandomMeal(){
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php'); 
    const responseData = await response.json();
    const randomMeal = responseData.meals[0]; 

    addMeal(randomMeal, true); 
}

async function getMealById(id){
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id); 
    const respData = await response.json(); 
    const meal = respData.meals[0]; 
    return meal; 
}

async function getMealsBySearch(term){
    const meals = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term ); 
}

function addMeal(mealData, random = false){
    const meal = document.createElement('div'); 
    meal.classList.add('meal'); 
    meal.innerHTML = `
                <div class="meal-header">
                    
                ${ random ? `
                    <span class="random">
                        Recipe of the Day
                    </span>` : '' }
                    <img src="${mealData.strMealThumb}" alt="${mealData.Meal}">
                </div>
                
                <div class="meal-body">
                    <h4>${mealData.strMeal}</h4>
                    <button class = "fav-btn "><i class="fas fa-heart "></i></button>
                </div>
    `; 

    const btn =  meal.querySelector('.meal-body .fav-btn'); 

    btn.addEventListener("click", ()=>{

        if( btn.classList.contains("active")) {

            removeMealFromLS(mealData.idMeal); 
            btn.classList.remove("active"); 
       
        } else {
            addMealToLS(mealData.idMeal); 
            btn.classList.add("active"); 
        }

    }) 
    
    meals.appendChild(meal);        
}

//Local Storage
function getMealsFromLS(){
    const mealIds = JSON.parse( localStorage.getItem("mealIds") )
    return mealIds === null ? [] : mealIds; 
}

function addMealToLS(mealId){
     const mealIds = getMealsFromLS(); 
     localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId])); 
}

function removeMealFromLS(mealId){
    const mealIds = getMealsFromLS(); 
    localStorage.setItem(
        "mealIds",
        JSON.stringify( mealIds.filter((id)=> id !== mealId )) 
        ); 
}

async function fetchFevMeals(){
    const mealIds = getMealsFromLS(); 

    const meals = []; 

    for( let i = 0; i < mealIds.length; i++ ){
        const mealId = mealIds[i]; 
        meal = await getMealById(mealId);

        meals.push(meal)
    }

    console.log( meals ); 
}