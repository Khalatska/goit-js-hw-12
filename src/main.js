import {PixabayAPI} from './js/pixabay-api';
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

 const pixabayAPI = new PixabayAPI();
 
//===============================================================

refs.formElem.addEventListener('submit', onBtnSubmit);

async function onBtnSubmit(e) {
e.preventDefault();

showLoader();
const inputValue = e.target.elements.query.value.trim();
if(!inputValue) {
    refs.loaderElem.classList.add('hidden');
    iziToast.show({
        message: `Please enter your search query.`,
        position: 'topRight',
        color: 'red',
    })
    return;
};
pixabayAPI.query = inputValue;
pixabayAPI.currentPage = 1;
refs.galleryElem.innerHTML = '';
try{
    const data = await pixabayAPI.getImages();
    pixabayAPI.totalResult = data.totalHits;
    renderImages(data.hits);
}catch(err){
    pixabayAPI.totalResult = 0;
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
 try{
    pixabayAPI.currentPage += 1;
    const data = await pixabayAPI.getImages();
    renderImages(data.hits); 
 }catch(err){
    pixabayAPI.totalResult = 0;
    iziToast.error({
        title: 'Error',
        message: err.message,
      });
}
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
    const maxPage = Math.ceil(pixabayAPI.totalResult / PixabayAPI.PAGE_SIZE);
    const lastPage = maxPage <= pixabayAPI.currentPage;
    if(lastPage){
        refs.btnLoadMoreElem.classList.add('hidden');
        if(pixabayAPI.totalResult === 0){
            iziToast.show({
                message: `We're sorry, there are no results.`,
                position: 'topRight',
                color: 'red',
            })}else {
        iziToast.show({
            message: `We're sorry, but you've reached the end of search results.`,
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


