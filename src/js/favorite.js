import { save, load } from "./storage-service";
import { getRecipeById } from "./Api/api-fetch-recipe-by-id";
import { renderCard } from "./render";
import { zip } from "lodash";

const refs = {
  favRecipesGallery: document.querySelector(".fav-recipes-list"),
  emptyPageSection: document.querySelector(".empty-section-wrapper"),
  favContainer: document.querySelector(".fav-container"),
  buttonList: document.querySelector(".fav-categories-list"),
}
const storageArr = load("favRecipes")
const storageKey = "favRecipes"
let currentActiveBtn = "";


refs.buttonList.addEventListener("click", categoryBtnClickHandler)

function categoryBtnClickHandler (e) {
  const btnEl = e.target.closest(".fav-category")

  if (btnEl && btnEl.dataset.category) {
    const btnCategory = btnEl.dataset.category
    const newArr = storageArr.filter(({category}) => category === btnCategory )
    renderFavCards(newArr)

  } else if (btnEl && btnEl.dataset.value === 'all') {
    const newStorageArr = load("favRecipes")
    renderFavCards(newStorageArr)
  }

  currentActiveBtn.classList.remove("active")
  btnEl.classList.add("active")
  currentActiveBtn = btnEl;
}
renderPage()
function renderPage () {
  const btn = document.querySelector("[data-value=all]");
  btn.classList.add("active");
  currentActiveBtn = btn;
  
  renderFavCards(storageArr);
  renderFavCategories(storageArr);
}



refs.favRecipesGallery.addEventListener('click', heartBtnClickHandler)

function heartBtnClickHandler (e) {
  if (e.target.closest(".heart")) {
    let currentCard = e.target.closest(".card-item")
    const currentId = currentCard.dataset.id
    const currentCategory = currentCard.dataset.category
    const storage = load("favRecipes")

  // NOT ACTIVE BTN 
    if (!currentCard.classList.contains("active")) {
      currentCard.classList.add("active");
      const obj = createRecipeObject(currentId, currentCategory)

      if (!storage) {
        const newArr = [];
        newArr.push(obj)
        save(storageKey, newArr) 
      } else {
        storage.push(obj)
        const newArr = storage;
        save(storageKey, newArr) 
      }

      return
    }


    //  ACTIVE BTN 
    if (currentCard.classList.contains("active")) {
      currentCard.classList.remove("active")

      const newArr = storage.filter(({id}) => currentId!==id )
      save(storageKey, newArr) 
      return
    }
    

  }
}

function createRecipeObject (id, category){
  return {
    id,
    category
  }
}



function renderFavCategories(arr) {
  //CHECKS IF STORAGE ARR IS EMPTY
  if (arr.length > 0) {
    refs.buttonList.classList.remove("hide")
    // RENDERS CATEGORIES BTN LIST
    const categoriesArr = arr.map(({category}) => category).filter((el, i, arr) => arr.indexOf(el) === i).sort((a,b) => a.localeCompare(b))
    categoriesArr.map(el => {
      refs.buttonList.insertAdjacentHTML("beforeend",
      `<li class="fav-category" data-category=${el}>
              <button class="fav-category-btn" type="button">${el}</button>
        </li>` 
    )
    })
    
  }
}


function renderFavCards(arr) {
  //CHECKS IF STORAGE ARR IS EMPTY
  if (arr.length > 0) {
    refs.emptyPageSection.classList.add("hide")
    refs.favRecipesGallery.classList.remove("hide")
    refs.favRecipesGallery.innerHTML = "";
    
    arr.map(({id}) => {
      getRecipeById(id).then((response) => {
        const markupArr = [response]
      
        refs.favRecipesGallery.insertAdjacentHTML("beforeend", renderCard(markupArr))
    })
  })
  }
}

