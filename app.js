//base 

/*
    slider 
*/
const slider = document.getElementById("slider");
const output = document.getElementById("value");

output.innerHTML = slider.value;

slider.oninput = function(){
    output.innerHTML = slider.value;
    outerHeight.innerHTML = this.value;
}

slider.addEventListener("mousemove", function(){
    const x = slider.value;
    const color = 'linear-gradient(90deg, rgb(96,48,177)'+ Math.floor(x / 30 * 100) + '%, rgb(214,214,214)' + Math.floor(x / 30 * 100) + '%)';
    slider.style.background = color;
})

/*
    drop down menu
*/
function openMenu(){
    document.body.classList += " menu--open"
}

function closeMenu(){
    document.body.classList.remove('menu--open')
}

/*
    Home.html
*/
function search(){
    console.log("linked");
}
/*
    Games.HTML
*/
//base api: https://www.freetogame.com/api/games
// api handler: https://rapidapi.com/digiwalls/api/free-to-play-games-database

const gameWrapper = document.querySelector('.games');
const entries = localStorage.getItem("id");
const base = `https://free-to-play-games-database.p.rapidapi.com/api/games`;
let games;
let gameData;
let filter;
let filterArray = [];
let searchArray = [];

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
		'X-RapidAPI-Key': '554bdbcf7fmshad8fab0cfbcf624p196aa5jsn5bc4c284f1f7'
	}
};

async function filterEntries(){
    return !filter ? renderGames() : filterGames();
}

function getEntries(){
    let entries
    entries = document.getElementById("slider").value;
    return entries
}

async function renderGames(){
    gameWrapper.classList += ' .games__loading';
    
    if (!games) {
        games = await fetch(base, options);
    }
    gameWrapper.classList.remove('games__loading')

    if (!gameData){ gameData = await games.json();}

    gameWrapper.innerHTML = gameData.map(game => gameHTML(game)).slice(0, getEntries() || 6).join('');

    console.log(gameData[0]["release_date"].split("-", 1).join(" "));

    return gameData;
}

/*
    options filter
*/
// resets options to default
function initialize(){
    const selector = document.getElementById('filter');
    selector.value = "SORT";
}

function filterGames(){
    filter = document.getElementById("filter").value;
    //console.log(filter);
    
    if (filter === "Alphabetical"){
        fetch('https://free-to-play-games-database.p.rapidapi.com/api/games?sort-by=alphabetical', options)
        .then(response => response.json())
        .then(response => gameWrapper.innerHTML = response.map(game => gameHTML(game)).slice(0, getEntries() || 6).join(''))
        .catch(err => console.error(err));
    }else if (filter !== "Alphabetical"){
        console.log(filter);
        let prop = "genre"
        let arg = filter
        sortArr(gameData, prop, arg);
    }else{
        renderGames();
    }
}

// array, array catagory, catagory value
function sortArr(arr, prop, arg){
    filterArray = [];
    for (let i = 0; i < arr.length; ++i){
        if (arr[i][prop] === arg){
            filterArray.push(arr[i])
        }
    }
    gameWrapper.innerHTML = filterArray.map(game => gameHTML(game)).slice(0, getEntries() || 6).join('');

    return filterArray;
}

/*
    Search Filter
*/
function selectElement(selector){
    return document.querySelector(selector);
}

function clearSearch(){
    selectElement(".nav__search").innerHTML = "";
}

function filterSearch(){
    const search = selectElement(".nav__search").value;
    searchArray = [];
    const arr = gameData;

    clearSearch();
    for (let i = 0; i < arr.length; ++i){
        if (
            arr[i]["title"].toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            arr[i]["genre"].toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            arr[i]["release_date"].split("-", 1).join(" ").includes(search)
            )
         {
            searchArray.push(arr[i])
        }  
    }

    gameWrapper.innerHTML = searchArray.map(game => gameHTML(game)).slice(0, getEntries() || 6).join('');

    return searchArray;
}

/*
    game tiles html
*/
function gameHTML(game){
    return `
    <div class="game">
        <div class="img__wrapper">
            <a href="${game.freetogame_profile_url}">
                <img src="${game.thumbnail}" alt="" class="game__img">
            </a>
        </div>
        <div class="game__container">
            <h1 class="game__title">${game.title}</h1>
            <div class="game__info">
                <h3 class="game__info-catagory genre">Genre: 
                    <span>${game.genre}</span>
                </h3>
                <h3 class="game__info-catagory publisher">Publisher: 
                    <span>${(game.developer).replace(",", "").split(" ", 2).join(" ")}</span>
                </h3>
                <h3 class="game__info-catagory release--date">Release Date: 
                    <span>${(game.release_date).split("-", 1).join(" ")}</span>
                </h3>
            </div>
            <a href="${game.game_url}" class="more__info">more Info</a>
        </div>
    </div>`
}

setTimeout(() => {
    renderGames();
})