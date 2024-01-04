const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFound = document.querySelector('.errorContainer');

currentTab=userTab;
currentTab.classList.add('current-tab');

grantAccessContainer.classList.add('active');//maybe i will change it..


function getfromSessionStorage(){
    let localCoordinates=sessionStorage.getItem("userCordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add('active');
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//switch tab function

function switchTab(newTab){

    notFound.classList.remove('active');

    if(currentTab!=newTab){
        currentTab.classList.remove('current-tab');
        currentTab=newTab;
        currentTab.classList.add('current-tab');

        if(!searchForm.classList.contains('active')){
            grantAccessContainer.classList.remove('active');
            userInfoContainer.classList.remove('active');
            searchForm.classList.add('active'); 
        }
        else{
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            getfromSessionStorage();

        }

    }
}


userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

function getLocation(){
    if(!navigator.geolocation){
        alert('ur browser not supports gelolocation ');
    }
    else{
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}



function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    
    try{  
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data=await response.json();
        if (!data.sys) {
            throw data;
        }
        userInfoContainer.classList.add('active');
        loadingScreen.classList.remove("active");
        notFound.classList.remove('active');

        renderWeatherInfo(data);
    }
    catch(error){
        // alert(error);
        notFound.classList.add('active');
        loadingScreen.classList.remove("active");
        notFound.classList.add('active');
    }

}

async function fetchUserWeatherInfo(coordinates){
    grantAccessContainer.classList.remove('active');
    loadingScreen.classList.add("active");

    let {lat,lon}=coordinates;
    
    try{
        let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        let data= await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        notFound.classList.remove('active');
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        notFound.classList.add('active');

        
    }
}

function showPosition(position){
    let coordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("userCordinates",JSON.stringify(coordinates));
    fetchUserWeatherInfo(coordinates);

}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");


searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName===""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

