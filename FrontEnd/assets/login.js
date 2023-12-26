const loginForm = document.querySelector('.login')

if(sessionStorage.getItem("userToken")===null){
    sessionStorage.setItem("token", null)
}

loginForm.addEventListener("submit", e=>{
    e.preventDefault();
    const userLogin = {
        email: e.target.querySelector("[name=email]").value,
        password: e.target.querySelector("[name=password]").value,
    }
    const bodyLoaded = JSON.stringify(userLogin)
    
    fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: bodyLoaded
    }).then(r=>{
        if(r.status!==200){
            alert("Erreur dans l’identifiant ou le mot de passe")
        }
        else if(r.status===200){
            console.log("c'est good")
            return r.json()
            .then(r=> {
                console.log(r)
                sessionStorage.setItem("logged", true)
                sessionStorage.setItem("userToken", r.token)
                token = r.token
                location.href="index.html"
            })
        }
    })
})
