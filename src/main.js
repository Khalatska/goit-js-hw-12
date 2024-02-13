import {NewsAPI} from './js/pixabay-api';
import {renderImages} from './js/render-functions'
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
 

const refs = {
    formElem: document.querySelector('.form'),
    inputElem: document.querySelector('.form-input'),
    btnElem: document.querySelector('.form-button'),
    galleryElem: document.querySelector('.gallery-list'),
    btnLoadMoreElem: document.querySelector('.btn-load-more'),
    loaderElem: document.querySelector('.loader'),
};

 const newApi = new NewsAPI();
 
//===============================================================

refs.formElem.addEventListener('submit', onBtnSubmit);

async function onBtnSubmit(e) {
e.preventDefault();

showLoader();
const inputValue = e.target.elements.query.value.trim();
if(!inputValue) return;
newApi.query = inputValue;
newApi.currentPage = 1;
refs.galleryElem.innerHTML = '';
try{
    const data = await newApi.getImages();
    newApi.totalResult = data.totalHits;
    console.log(data);
    renderImages(data.hits);
}catch(err){
    newApi.totalResult = 0;
    iziToast.error({
        title: 'Error',
        message: err.message,
      });
}

hideLoader();
checkBtnStatus();
refs.formElem.reset();
}

//===============================================================

refs.btnLoadMoreElem.addEventListener('click', onBtnLoadMore);

async function onBtnLoadMore(){
 showLoader();
 newApi.currentPage += 1;
 const data = await newApi.getImages();
 renderImages(data.hits);
 hideLoader();
 checkBtnStatus();


 const galleryCardHeight = document.querySelector('.gallery-img').getBoundingClientRect().height;
 window.scrollBy({
   top: 2 * galleryCardHeight,
   behavior: 'smooth',  
 });
}
//===============================================================

function checkBtnStatus () {
    const maxPage = Math.ceil(newApi.totalResult / NewsAPI.PAGE_SIZE);
    const lastPage = maxPage <= newApi.currentPage;
    if(lastPage){
        refs.btnLoadMoreElem.classList.add('hidden');
        if(newApi.totalResult === 0){
            iziToast.show({
                message: `"We're sorry, there are no results."`,
                position: 'topRight',
                color: 'red',
            })}else {
        iziToast.show({
            message: `"We're sorry, but you've reached the end of search results."`,
            position: 'topRight',
            color: 'blue',
        });
      }
    } else {
        refs.btnLoadMoreElem.classList.remove('hidden');
    }
    }

//===============================================================

function showLoader(){
 refs.loaderElem.classList.remove('hidden');
 refs.btnLoadMoreElem.classList.add('hidden');
};

function hideLoader(){
 refs.loaderElem.classList.add('hidden');
 refs.btnLoadMoreElem.classList.remove('hidden');
};


