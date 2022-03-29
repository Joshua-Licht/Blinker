let isModalOpen = false;
/*
    drop down menu
*/
function openMenu(){
    document.body.classList += " menu--open"
}

function closeMenu(){
    document.body.classList.remove('menu--open')
}

function selectElement(selector){
    return document.querySelector(selector);
}

function getSearch(){
    const searchArg = selectElement(".header__search").value;
    localStorage.setItem("search", searchArg);
    window.location.href = `./games.html`;
}

function filterSearch(event){
    event.preventDefault();
    if (event.keyCode === 13 && event.target.value !== ""){
        getSearch();
    }
}

function toggleModal(){
    if (isModalOpen){
        isModalOpen = false;
        return document.body.classList.remove("modal--open");
    }
    isModalOpen = true;
    document.body.classList += " modal--open";
}

function contact(event){
    event.preventDefault();
    const loading = document.querySelector('.modal__overlay--loading');
    const success = document.querySelector('.modal__overlay--success');
    loading.classList += " modal__overlay--visible";

    emailjs
        .sendForm(
            'service_68kbcym',
            'template_i7iy2tq',
            event.target,
            'DXNzMeWDzepH8XZqC'
    ).then(() =>{
        loading.classList.remove("modal__overlay--visible")
        success.classList += " modal__overlay--visible";
    }).catch(() => {
        loading.classList.remove("modal__overlay--visible")
        alert(
            "The email Service is temporarily unavaliable. Please contact me directly at joshualicht18@gmail.com."
        );
    })
}
//console.log(window.location.origin); 