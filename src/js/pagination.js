import Pagination from 'tui-pagination';  
import {renderCard} from './render.js'
import { getRecipeByCategory } from "./Api/api-fetch-recipes.js";
import {getAllRecipes } from "./Api/api-fetch-recipes.js";

// function changeLimitByViewportWidth 
//  in file render-recipes-list.js

const container = document.querySelector('.tui-pagination');
const categoriesContainer= document.querySelector(".categories-wrapper");
const  recipesContainer= document.querySelector(".gallery-recipes")
const tuiContainer=document.querySelector("#tui-pagination-container")
let limitRecipes;



const options = { 
    totalItems: 100,
    itemsPerPage: 9,
    visiblePages: 3 ,
    page: 1,
    centerAlign: false,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
        page: '<a href="#" class="tui-page-btn">{{page}}</a>',
        currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
        moveButton:
            '<a href="#" class="tui-page-btn tui-{{type}}">' +
                '<span class="tui-ico-{{type}}">{{type}}</span>' +
            '</a>',
        disabledMoveButton:
            '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
                '<span class="tui-ico-{{type}}">{{type}}</span>' +
            '</span>',
        moreButton:
            '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
                '<span class="tui-ico-ellip">...</span>' +
            '</a>'
    }
};
if (window.matchMedia('(max-width: 767px)').matches) {// Мobile
options.visiblePages=2
limitRecipes='6';
  } 
if (window.matchMedia('(min-width: 768px) and (max-width: 1200px)').matches) {// tablet
    options.visiblePages=3
    limitRecipes='8';
 }
if (window.matchMedia('(min-width: 1200px)').matches) {// desktop
        limitRecipes='9';
} 
 
const pagination = new Pagination(container, options);
  
// ===============================================================
// const buttonsPag=document.querySelectorAll(".tui-page-btn");
/*
buttonsPag.forEach(function(button) {
    button.addEventListener("click", onClickPagination)
});*/
tuiContainer.addEventListener("click",onClickPagination)    


function onClickPagination(e){
    e.preventDefault();
    const activeCategory=document.querySelector('.active') 
   
    
    if (e.target.tagName === 'A') {
        e.preventDefault();
        var link = e.target.textContent;
      
        if (e.target.textContent=='first') {
            loadRecipes(activeCategory.textContent,'1');
        }
        if (e.target.textContent=='prev') {
            const selected=document.querySelector(".tui-is-selected") 
            const number=selected.textContent
            
            loadRecipes(activeCategory.textContent,number);
        }
        if (e.target.textContent=='next') {
            const selected=document.querySelector(".tui-is-selected") 
        const number=selected.textContent
        
        loadRecipes(activeCategory.textContent,number);
        }
        if (e.target.textContent=='last') {
            const selected=document.querySelector(".tui-is-selected") 
        const number=selected.textContent
        
        loadRecipes(activeCategory.textContent,number);
        }
        if (e.target.textContent=='...') {
            return
        }
        loadRecipes(activeCategory.textContent,e.target.textContent);    
        
    }
};
// ===========================================================
function loadRecipes(activeCat,page){
    if (activeCat!=='All categories') {
        while (recipesContainer.firstChild) {
            recipesContainer.removeChild(recipesContainer.firstChild);
          }
        getRecipeByCategory(activeCat, page, limitRecipes).then((response) => {        
            recipesContainer.insertAdjacentHTML("beforeend", renderCard(response.results))

        });
    }
    else{  //All Categories
        while (recipesContainer.firstChild) {
            recipesContainer.removeChild(recipesContainer.firstChild);
        } 
            getAllRecipes( page, limitRecipes).then((response) => {
            recipesContainer.insertAdjacentHTML("beforeend", renderCard(response.results))
         });
    }
}      

 export function zeroPagination(){
    // ===================   обнуління пагінаціі
    const buttonsPag=document.querySelectorAll(".tui-page-btn");
    buttonsPag.forEach(function(button) {
        if (button.textContent=='1') {
          button.classList.add('tui-is-selected');
        }
        else{
          if (button.classList.contains('tui-is-selected')) {
            button .classList.remove('tui-is-selected')
          }
        }
    });
    // ===========================================
}

  