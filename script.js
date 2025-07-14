const JSON_URL = "http://localhost:3000/users";

async function bringContent(url){
    let content;
    try{
        const response = await fetch(url);
        if (!response.ok){
            throw new Error(response.status)
        }
        const data = await response.text()
        content = data
    }
    catch (error) {
        content = `<h2>Not Found</h2>
        ${error}`
    }
    document.getElementById("content").innerHTML = content;
}

async function bringData(inputEmail, inputPass) {
    let userData;
    try{
        const response = await fetch(JSON_URL);
        if(!response.ok){
            throw new Error(response.status)
        }
        const data = await response.json();
        userData = data.find( email => email.email == inputEmail)
        if(!userData || inputPass != userData.password){
            throw new Error("Usuario no encontrado")
        }
        return (userData)
        //mostrar(JSON.stringify(userData)); //Cambiar a lo que quiera hacer con el dato del usuario
    } catch (error){
        console.log("hubo un error");
        return(false)
    }
}

function updateLateralBar(info){
    info = JSON.parse(info);
    document.querySelector('.mainv-titleii').textContent = info.name
    document.querySelector('.mainv-titleiii').textContent = info.rol
}

async function main(){
    if(!localStorage.getItem('Auth')){
        await bringContent("./pages/login.html");
        singIn()
    }
    else{
        isInside()
    }
}

function singIn(){
    document.getElementById("signin-form").addEventListener('submit', async function(event){
        event.preventDefault();
        const inputEmail = this.querySelector("#login-email").value;
        const inputPass = this.querySelector("#login-password").value;
        console.log(inputEmail);
        console.log(inputPass);
        userInfo = await bringData(inputEmail,inputPass);
        if (!userInfo) {
            console.log("Usuario incorrecto")
            return
        }
        localStorage.setItem('Auth', JSON.stringify(userInfo))
        isInside()
    })
}

async function isInside(){ 
    updateLateralBar(localStorage.getItem('Auth'))
    await bringContent('/pages/home.html')
    document.getElementById('nav_buttons').addEventListener('click', async function(event) {
        event.preventDefault()
        if (event.target.tagName === "A" ){
            let path = `./pages/${event.target.getAttribute('href')}.html`
            bringContent(path)
        }        
    })

    document.getElementById("logout").addEventListener('click',function(event){
        localStorage.clear()
        document.querySelector(".mainv-lateralbar").innerHTML = ""
        main()
    })
}

main()