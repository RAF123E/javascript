




$(document).ready(function() {
    
    $('#menu-button').on('click', function(e) {
        $('#menu-button').removeClass('fa-align-justify');
        $('#menu-button').addClass('fa-x');
        $('#sidebar').toggleClass('open');
        $('.side').toggleClass('d-none');
    });

    
    $('#search').on('click', function() {
        
        $('#main-content').html(`
            <div id="search-fields" class="space-y-4 w-full">
                <input type="text" id="search-by-name" placeholder="Search by name" class="w-full p-2 border border-gray-300 rounded">
                <input type="text" id="search-by-letter" placeholder="Search by first letter" class="w-full p-2 border border-gray-300 rounded" maxlength="1">
                <button id="search-submit" class="bg-blue-500 text-white p-2 rounded">Submit</button>
            </div>
           
        `);
        
        $('#search-submit').on('click', searchMeals);
       
    });

    $('#categories').on('click', fetchCategories);
    $('#areas').on('click', fetchAreas);
    $('#ingredients').on('click', fetchIngredients);
    $('#contact').on('click', displayContactForm);

    
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
        .then(response => response.json())
        .then(data => displayMeals(data.meals))
        
        .catch(error => console.error('Error fetching initial meals:', error));
        
    function searchMeals() {
        const nameQuery = $('#search-by-name').val().trim();
        const letterQuery = $('#search-by-letter').val().trim();
             
        if (nameQuery) {
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${nameQuery}`)
                .then(response => response.json())
                .then(data => {
   
                    if (data.meals) {
                        displayMeals(data.meals);
                    } else {
                        $('#main-content').html('<p>No meals found.</p>');
                    }
                })
                
.catch(error => {
    
    console.error('Error searching by name:', error);
});

        } else if (letterQuery) {
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letterQuery}`)
                .then(response => response.json())
                .then(data => {
    
                    if (data.meals) {
                        displayMeals(data.meals);
                    } else {
                        $('#main-content').html('<p>No meals found.</p>');
                    }
                })
                .catch(error => {
    
    console.error('Error searching by letter:', error);
});
        }
    }

    function fetchCategories() {
    $('#loading-indicator').show();
        fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
            .then(response => response.json())
            .then(data => {
    $('#loading-indicator').hide();
                $('#main-content').html(data.categories.map(category => `
                    <div class="category p-4 w-full md:w-1/2 lg:w-1/4">
                        <h3 class="text-lg font-bold text-white">${category.strCategory}</h3>
                        <img src="${category.strCategoryThumb}" class="w-full rounded">
                    </div>
                `).join(''));
            })
             .catch(error => {
    $('#loading-indicator').hide();
    console.error('Error fetching categories:', error);
});
    }

    function fetchAreas() {
    $('#loading-indicator').show();
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
            .then(response => response.json())
            .then(data => {
    $('#loading-indicator').hide();
                $('#main-content').html(data.meals.map(area => `
                    <div class="area p-4 w-full md:w-1/2 lg:w-1/4 text-white">
                        <i class="fa-solid fa-house-laptop fa-4x cursor-pointer"></i>
                        <h3 class="text-lg font-bold fs-3 cursor-pointer" data-area="${area.strArea}">${area.strArea}</h3>
                    </div>
                `).join(''));

                
                $('.area h3').on('click', function() {
                    const areaName = $(this).data('area');
                    fetchMealsByArea(areaName);
                });
            })
            .catch(error => {
    $('#loading-indicator').hide();
    console.error('Error fetching areas:', error);
});
    }

    function fetchIngredients() {
    $('#loading-indicator').show();
        fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
            .then(response => response.json())
            .then(data => {
    $('#loading-indicator').hide();
                $('#main-content').html(data.meals.map(ingredient => {
                    
                    let description = ingredient.strDescription ? ingredient.strDescription.split(' ').slice(0, 20).join(' ') + '...' : '';
                    return `
                        <div class="ingredient p-4 w-full md:w-1/2 lg:w-1/4 text-white text-center">
                            <i class="fa-solid fa-drumstick-bite fa-4x cursor-pointer" id="ingredItem"></i>
                            <h3 class="text-lg font-bold fs-3 cursor-pointer" data-ingredient="${ingredient.strIngredient}">${ingredient.strIngredient}</h3>
                            <p class="cursor-pointer">${description}</p>
                        </div>
                    `;
                }).join(''));

                
                $('.ingredient').on('click', function() {
                    const ingredientName = $(this).find('h3').data('ingredient');
                    fetchMealsByIngredient(ingredientName);
                });
            })
            .catch(error => {
    $('#loading-indicator').hide();
    console.error('Error fetching ingredients:', error);
});
    }

    function displayContactForm() {
        $('#main-content').html(`
            <div class="container w-75 text-center">
                <div class="row d-flex mt-24 g-4">
                    <div class="col-md-6">
                        <input type="text" id="name" placeholder="Enter Your name" class="w-full p-2 border border-gray-300 rounded">
                    </div>
                    <div class="col-md-6">
                        <input type="email" id="email" placeholder="Enter Your Email" class="w-full p-2 border border-gray-300 rounded">
                    </div>
                    <div class="col-md-6">
                        <input type="number" id="phone" placeholder="Enter Your Phone" class="w-full p-2 border border-gray-300 rounded">
                    </div>
                    <div class="col-md-6">
                        <input type="number" id="age" placeholder="Enter Your Age" class="w-full p-2 border border-gray-300 rounded">
                    </div>
                    <div class="col-md-6">
                        <input type="password" id="password" placeholder="Enter Your Password" class="w-full p-2 border border-gray-300 rounded">
                    </div>
                    <div class="col-md-6">
                        <input type="password" id="repassword" placeholder="Repassword" class="w-full p-2 border border-gray-300 rounded">
                    </div>
                    <button type="submit" id="submit-button" class="btn btn-outline-danger text-white w-20 m-auto p-2 text-red-200 mt-3 rounded" disabled>Submit</button>
                </div>
            </div>
        `);

        $('#contact-form').on('input', validateContactForm);
    }

    function validateContactForm() {
        const name = $('#name').val();
        const email = $('#email').val();
        const password = $('#password').val();

        const nameValid = /^[a-zA-Z\s]+$/.test(name);
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const passwordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);

        $('#submit-button').prop('disabled', !(nameValid && emailValid && passwordValid));
    }

    function displayMeals(meals) {
        $('#main-content').html(meals.slice(0, 20).map(meal => `
            <div class="meal p-4 w-full md:w-1/2 lg:w-1/4 cursor-pointer" data-id="${meal.idMeal}">
                <h3 class="text-lg font-bold">${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" class="w-full rounded">
            </div>
        `).join(''));

       
        $('.meal').on('click', function() {
            const mealId = $(this).data('id');
            fetchMealDetails(mealId);
        });
    }

    function fetchMealDetails(mealId) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                $('#main-content').html(`
                    <div class="meal-details flex flex-wrap">
                        <div class="w-full md:w-1/3 p-4">
                            <img src="${meal.strMealThumb}" class="w-full rounded ">
                            <h2 class="mt-3 fs-2 text-white">${meal.strMeal}</h2>
                        </div>
                        <div class="w-full md:w-2/3 p-4 text-white">
                        <h2 class="fs-3"><strong>Instructions:</strong> </h2>
                        <p>${meal.strInstructions}</p>
                            <h2 class="fs-3"><strong>Category:</strong> ${meal.strCategory}</h2>
                            <h2 class="fs-3"><strong>Area:</strong> ${meal.strArea}</h2>
                            
                            <h3 class="text-lg font-bold mt-3">Ingredients:</h3>
                            <ul class="list-disc list-inside">
                                ${Array.from({ length: 20 }, (_, i) => {
                                    const ingredient = meal[`strIngredient${i + 1}`];
                                    const measure = meal[`strMeasure${i + 1}`];
                                    return ingredient ? `<li>${ingredient} - ${measure}</li>` : '';
                                }).join('')}
                            </ul>
                            ${meal.strTags ? `<p><strong>Tags:</strong> ${meal.strTags.split(',').join(', ')}</p>` : ''}
                            ${meal.strSource ? `<p><strong>Source:</strong> <a href="${meal.strSource}" target="_blank" class="text-blue-400">${meal.strSource}</a></p>` : ''}
                            ${meal.strYoutube ? `<p><strong>Youtube:</strong> <a href="${meal.strYoutube}" target="_blank" class="text-blue-400">${meal.strYoutube}</a></p>` : ''}
                        </div>
                    </div>
                `);
            })
            .catch(error => console.error('Error fetching meal details:', error));
    }

    function fetchMealsByArea(areaName) {
    $('#loading-indicator').show();
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`)
            .then(response => response.json())
            .then(data => {
    $('#loading-indicator').hide();
                if (data.meals) {
                    displayMeals(data.meals);
                } else {
                    $('#main-content').html('<p>No meals found.</p>');
                }
            })
             .catch(error => {
    $('#loading-indicator').hide();
    console.error('Error fetching meals by area:', error);
});
    }

    function fetchMealsByIngredient(ingredientName) {
    $('#loading-indicator').show();
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`)
            .then(response => response.json())
            .then(data => {
    $('#loading-indicator').hide();
                if (data.meals) {
                    displayMeals(data.meals);
                } else {
                    $('#main-content').html('<p>No meals found.</p>');
                }
            })
             .catch(error => {
    $('#loading-indicator').hide();
    console.error('Error fetching meal ingredien:', error);
});
    }
});



