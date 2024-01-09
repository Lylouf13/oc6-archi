const loginForm = document.querySelector('.login')

// Create eventlistener on form's Button and assemble body to use in fetch
loginForm.addEventListener("submit", e=>{
    e.preventDefault();
    const userLogin = {
        email: e.target.querySelector("[name=email]").value,
        password: e.target.querySelector("[name=password]").value,
    }
    const bodyLoaded = JSON.stringify(userLogin)
    
    // api request for login using body previously assembled
    fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: bodyLoaded
    }).then(r=>{
        //check request answer and either activate error message or redirect to index with logged state
        if(r.status!==200){
            loginForm.querySelector("[id=passwordError]").classList.remove("js-hidden")
        }
        else if(r.status===200){
            return r.json()
            .then(r=> {
                sessionStorage.setItem("logged", true)
                sessionStorage.setItem("userToken", r.token)
                location.href="index.html"
            })
        }
    })
})
