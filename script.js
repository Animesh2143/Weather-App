const userTab= document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer= document.querySelector(".weather-container");

const grantAccessContainer= document.querySelector(".grant-location");
const searchForm= document.querySelector('[data-searchForm]');
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorSection=document.querySelector(".error-section");

let currentTab= userTab;
let API_KEY= "c06d5397fe0143438ee150548233010" ;
currentTab.classList.add("current-tab");
getfromSessionStorage();



function switchTab(clickedTab){
    errorSection.classList.remove("active");
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
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



function getfromSessionStorage(){
    const localCoordinates= sessionStorage.getItem("user-Coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat ,lon}=coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response= await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`);
        const data=await response.json();

        if(data?.error?.code == 1006){
            throw new Error("Error");
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        errorSection.classList.remove("active");

        renderWeatherInfo(data);
    }

    catch(err){
        loadingScreen.classList.remove("active");
        errorSection.classList.add("active");
    }
}

function renderWeatherInfo(data){
    const cityName= document.querySelector("[data-cityName]");
    const country= document.querySelector("[country]");
    const desc= document.querySelector("[data-weatherDesc]");
    const weatherIcon= document.querySelector("[data-weatherIcon]");
    const temp= document.querySelector("[data-temp]");
    const windspeed= document.querySelector("[data-windspeed]");
    const humidity= document.querySelector("[data-humidity]");
    const clouds= document.querySelector("[data-clouds]");


    console.log(data);

    cityName.textContent= `${data?.location?.name},`;
    country.innerText = `${data?.location?.country}`;
    desc.innerHTML = data?.current?.condition?.text;
    //weatherIcon.src = `${data?.current?.condition?.icon}` ;
    temp.innerText= `${data?.current?.temp_c} °C`;
    windspeed.innerText= `${data?.current?.wind_kph} km/h`;
    humidity.innerText= `${data?.current?.humidity} %`;
    clouds.innerText= `${data?.current?.cloud} %`;


    const whole= document.querySelector(".wrapper");

    if(desc.innerText=="Cloudy" || desc.innerText=="Clear"){
        whole.classList.remove("fog");
        whole.classList.remove("thunder");
        whole.classList.remove("sunny"); 
        whole.classList.remove("rain");
        whole.classList.add("cloud");
    }
    else if(desc.innerText=="Mist" || desc.innerText=="Fog"){
        whole.classList.remove("thunder");
        whole.classList.remove("rain");
        whole.classList.remove("sunny"); 
        whole.classList.remove("cloud");
        whole.classList.add("fog");
    }
    else if(desc.innerText=="Thunder" || desc.innerText=="Storm"){
        whole.classList.remove("rain");
        whole.classList.remove("cloud");
        whole.classList.remove("fog");
        whole.classList.remove("sunny"); 
        whole.classList.add("thunder");
    }
    else if(desc.innerText=="Rain" || desc.innerText=="Hailstorm"){
        whole.classList.remove("thunder");
        whole.classList.remove("fog");
        whole.classList.remove("cloud");
        whole.classList.remove("sunny"); 
        whole.classList.add("rain");
    }
    else if(desc.innerText=="Sunny" || desc.innerText=="Humidity"){
        whole.classList.remove("thunder");
        whole.classList.remove("fog");
        whole.classList.remove("cloud");
        whole.classList.remove("rain"); 
        whole.classList.add("sunny");
    }
    else{
        whole.classList.remove("thunder");
        whole.classList.remove("fog");
        whole.classList.remove("cloud");
        whole.classList.remove("sunny"); 
        whole.classList.remove("rain");   
    }

}



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);                  
    }
    else{
        alert("Your Device has no geolocation support");
    }
}


function showPosition(position){

    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,   
    }

    sessionStorage.setItem("user-Coordinates",JSON.stringify(userContainer));

    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton= document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",getLocation);


const searchInput= document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName===""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorSection.classList.remove("active");

    try{
        const response= await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
        const data=await response.json();

        if(data?.error?.code == 1006){
            throw new Error("Error");
        }

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        errorSection.classList.remove("active");

        renderWeatherInfo(data);
    }

    catch(err){
        loadingScreen.classList.remove("active");
        errorSection.classList.add("active");
    }
}