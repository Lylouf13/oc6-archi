//#region Buttons Creation
const galleryContainer = document.querySelector(".gallery")
const galleryElements = []
const galleryButtonsContainer = document.querySelector(".galleryFilter")
const galleryButtons = []

// Adds "ALL" button to buttons list
galleryButtons.push(newButton = {
    element : document.querySelector(".galleryFilter__button"),
    categoryId : 0
    })
let galleryCategories = []

// Get Categories
const galleryFetch = fetch('http://localhost:5678/api/categories')
    .then(galleryFetch=> galleryFetch.json())
        // Create HTML Buttons base ond Categories
        .then(galleryFetch =>{
            galleryCategories = new Set()
            for (category of galleryFetch){
                galleryCategories.add(category)
                    
            }
            
            for(category of galleryCategories)
            {
                let newCategoryButton = document.createElement("button")
                newCategoryButton.classList.add("galleryFilter__button")
                newCategoryButton.innerHTML=category.name
                galleryButtonsContainer.appendChild(newCategoryButton)

                // Store Buttons to add EventListeners afterwards
                galleryButtons.push(
                    newButton={
                        element : newCategoryButton,
                        categoryId : category.id
                    }
                )
            }         
        })
        // Addind eventListeners on buttons to filter
        .then(()=>{
            for(button of galleryButtons){
                let eventButton = button
        
                eventButton.element.addEventListener("click", () =>{
                    for(button of galleryButtons){
                    button.element.classList.remove("galleryFilter__button-js-selected")
                    }
                    eventButton.element.classList.add("galleryFilter__button-js-selected")
                    for(work of galleryElements){
                        // Shows Elements of the Category pressed if they are currently hidden
                        if (eventButton.categoryId === work.categoryId){
                            if(work.element.classList.contains("js-hidden")){
                                work.element.classList.toggle("js-hidden")
                            }
                        }
                        // Hides Elements which are not in the Category pressed
                        else if(!work.element.classList.contains("js-hidden") && eventButton.categoryId !== 0){
                            work.element.classList.toggle("js-hidden")
                        }
                        // Shows all Elements currently hidden ("All" button)
                        else if(work.element.classList.contains("js-hidden") && eventButton.categoryId === 0){
                            work.element.classList.toggle("js-hidden")
                        }
        
                    }
                })
            }
        })
//#endregion

//#region Project Creation
const modifierSection = document.querySelector(".modifier")
const modifierElements = document.querySelector(".modifier__panel__content__elements")
function addProject(title, categoryId, imageUrl , workId){
    // Creating project on gallery DOM
    let newWork = document.createElement("figure")
    let newImage = document.createElement("img")
    newImage.setAttribute("src", imageUrl)
    let newText = document.createElement("figcaption")
    newText.innerHTML=title
    newWork.appendChild(newImage)
    newWork.appendChild(newText)
    galleryContainer.appendChild(newWork)

    // Store Elements with their Category in an array to be used to filter afterwards
    galleryElements.push(
        newElement ={
            element : newWork,
            categoryId : Number(categoryId)
        }
    )

    // Adding project to modifier DOM
    let newModifierElement = document.createElement("figure")
    let newModifierImage = document.createElement("img")
    let newModifierDelete = document.createElement("div")
    newModifierDelete.classList.add("iconContainer")
    newModifierDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
    newModifierImage.setAttribute("src", imageUrl)
    newModifierElement.appendChild(newModifierImage)
    newModifierElement.appendChild(newModifierDelete)
    modifierElements.appendChild(newModifierElement)

    // Add Deletion function to the modifier Element
    newModifierDelete.addEventListener("click", ()=>{
        let deletionTarget = {
        id : workId
    }
    fetch('http://localhost:5678/api/works/'+workId, {
        method: "DELETE",
        headers: { "Authorization":"Bearer "+ sessionStorage.getItem("userToken")},
        body: deletionTarget
    }).then(r=>{
        if(r.ok===true){
            newWork.remove()
            newModifierElement.remove()
        }}
        )
    })
}


// Gallery Initialization
fetch('http://localhost:5678/api/works')
    .then(r=>{
        if(r.ok === true){
            return r.json()
        }
    }) 
        .then(works =>{
            for (let i=0; i<works.length ; i++){
                addProject(
                    works[i].title,
                    works[i].categoryId,
                    works[i].imageUrl,
                    works[i].id
                    )
                }
        })
//#endregion

//#region Logged State Management
// Logged state check + Modification of hidden / shown elements
const logInButton = document.querySelector(".header__login")
const logOutButton = document.querySelector(".header__logout")
const openModifierButton = document.querySelector(".portfolio__title__modify")

// Changes login button to logout in nav
logOutButton.addEventListener("click", e=>{
    e.target.classList.toggle("js-hidden")
    logInButton.classList.toggle('js-hidden')
    openModifierButton.classList.toggle('js-hidden')
    galleryButtonsContainer.classList.toggle('js-hidden')
    sessionStorage.setItem("userToken", null)
    sessionStorage.setItem("logged", false)
})

// Shows elements only visible to logged users
if (sessionStorage.getItem("logged")==='true'){
    logInButton.classList.toggle('js-hidden')
    logOutButton.classList.toggle('js-hidden')
    openModifierButton.classList.toggle('js-hidden')
    galleryButtonsContainer.classList.toggle('js-hidden')
}
//#endregion

//#region Modifier section
const contentPanel = document.querySelector(".modifier__panel__content")
const editPanel = document.querySelector(".modifier__panel__edit")
const closeModifierButton = document.querySelector(".modifier__panel__content__close")
const editPanelSwitch = document.querySelectorAll(".modifier__panel__switch")

// Panel management - Overview / Edit
openModifierButton.addEventListener("click", ()=>{
    modifierSection.classList.toggle('-active')
})

closeModifierButton.addEventListener("click", ()=>{
    modifierSection.classList.toggle('-active')
})

for(b of editPanelSwitch){
    b.addEventListener("click", ()=>{
        contentPanel.classList.toggle('-active')
        editPanel.classList.toggle('-active')
    })
}

// New Project Panel Elements
const newProjectForm = document.querySelector(".modifier__panel__edit__form")
const newProjectButton = newProjectForm.querySelector("[type=submit]")
const newProjectImage = newProjectForm.querySelector("[name=image]")
const newProjectImageContainer = document.querySelector(".modifier__panel__edit__form__imageContainer")
const newProjectTitle = newProjectForm.querySelector("[name=title]")
const newProjectCategory = newProjectForm.querySelector("[name=category]")
const inputFieldImage = document.querySelector(".modifier__panel__edit__form__imageContainer__input")
const inputFieldPreview = document.querySelector(".modifier__panel__edit__form__imageContainer__preview")

// Modifies Submit button depending on form status
newProjectForm.addEventListener("change", e=>{
    // Updates Missing Values status in the form
    if(newProjectImage.value!==''){
        newProjectImageContainer.classList.remove("fieldMissing")
    }
    if(newProjectTitle.value!==''){
        newProjectTitle.classList.remove("fieldMissing")        
    }
    if(newProjectCategory.value!=='0'){
        newProjectCategory.classList.remove("fieldMissing")        
    }

    // Updates Submit Button
    if( newProjectImage.value==='' || 
        newProjectTitle.value==='' ||
        newProjectCategory.value==="0"){

        if(!newProjectButton.classList.contains("nonFilled")){
            newProjectButton.classList.add("nonFilled")
        }
    }
    else{

        newProjectButton.classList.remove("nonFilled")
    }
})

// Edit Image preview
newProjectImage.addEventListener("change", ()=>{
    inputFieldImage.classList.toggle("-active")
    inputFieldPreview.classList.toggle("-active")
    inputFieldPreview.setAttribute("src", URL.createObjectURL(newProjectImage.files[0]))
})

inputFieldPreview.addEventListener("click", ()=>{
    newProjectImage.value=""
    inputFieldImage.classList.toggle("-active")
    inputFieldPreview.classList.toggle("-active")
})

// Project creation - Push data to the server
newProjectForm.addEventListener("submit", e=>{
    e.preventDefault()

    if(newProjectImage.value!=='' && newProjectTitle.value!=='' && newProjectCategory.value !=='0')
    {
        fetch('http://localhost:5678/api/works/',{
            method : "POST",
            headers : {"Authorization":"Bearer "+ sessionStorage.getItem("userToken")},
            body: new FormData(e.target),
        })
        .then(r=>{
            if(r.ok === true){
                return r.json()
            }
        }) 
        .then(r=>{
            console.log(r)
            addProject(
                r.title, 
                r.categoryId, 
                r.imageUrl,
                r.id)
                
            // reset and close edit panel when a project is succesfully added
            newProjectImage.value=""
            newProjectTitle.value=""
            newProjectCategory.value="0"
            inputFieldPreview.classList.toggle("-active")
            inputFieldImage.classList.toggle("-active")
            modifierSection.classList.toggle('-active')
            contentPanel.classList.toggle('-active')
            editPanel.classList.toggle('-active')
            })
    }
    // Shows the user missing values in the form 
    else{
        if(newProjectImage.value===''){
            newProjectImageContainer.classList.add("fieldMissing")
        }
        if(newProjectTitle.value===''){
            newProjectTitle.classList.add("fieldMissing")        
        }
        if(newProjectCategory.value==='0'){
            newProjectCategory.classList.add("fieldMissing")        
        }
    }
})
//#endregion