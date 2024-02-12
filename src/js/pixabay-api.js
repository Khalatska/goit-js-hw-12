import axios from 'axios';
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

//===============================================================

let query = null;
let totalResult = 0;
let currentPage = 1;
const PAGE_SIZE = 15;

async function getImages(){
    const url = 'https://pixabay.com/api/';
    
    const options = {
        params: {
            key : '42200986-2d8f017897691a4245488f945',
            q: query,
            image_type: 'photo',
            orientation: 'horizontal',
            safeSearch: true, 
            page: currentPage, 
            per_page: 15,
        },
    };
    const res = await axios.get(url , options);
    return res.data
};
//===============================================================

refs.formElem.addEventListener('submit', onBtnSubmit);

async function onBtnSubmit(e) {
e.preventDefault();

showLoader();
const inputValue = e.target.elements.query.value.trim();
if(!inputValue) return;
query = inputValue;
currentPage = 1;
refs.galleryElem.innerHTML = '';
const data = await getImages();
totalResult = data.totalHits;
console.log(data);
renderImages(data.hits);

hideLoader();
checkBtnStatus();
refs.formElem.reset();
}


function imageTemplate ({
    webformatURL, 
    largeImageURL, 
    tags, 
    likes, 
    views, 
    comments, 
    downloads}){
    return ` <a href="${largeImageURL}" class="gallery">
    <figure class="gallery-figure"> 
     <img src="${webformatURL}" alt="${tags}" class="gallery-img"/>
     <figcaption class="gallery-figcaption">
     <div class="img-item">Likes <span class="img-elem">${likes}</span></div>
     <div class="img-item">View <span class="img-elem">${views}</span></div>
     <div class="img-item">Comments <span class="img-elem">${comments}</span></div>
     <div class="img-item">Downloads <span class="img-elem">${downloads}</span></div>
     </figcaption>
     </figure>
     </a>`;
}

 
function renderImages(images){
    const markup = images.map(imageTemplate).join('');
    refs.galleryElem.insertAdjacentHTML('beforeend', markup);
}


//===============================================================

refs.btnLoadMoreElem.addEventListener('click', onBtnLoadMore);

async function onBtnLoadMore(){
 showLoader();
 currentPage += 1;
 const data = await getImages();
 renderImages(data.hits);
 hideLoader();
 checkBtnStatus();


 const galleryCardHeight = document.querySelector('.gallery-img').getBoundingClientRect().height;
 window.scrollBy({
   top: 2 * galleryCardHeight,
   behavior: 'smooth',  
 });
}


function checkBtnStatus () {
    const maxPage = Math.ceil(totalResult/PAGE_SIZE);
    const lastPage = maxPage <= currentPage;
    if(lastPage){
        refs.btnLoadMoreElem.classList.add('hidden');
        iziToast.show({
            message: `"We're sorry, but you've reached the end of search results."`,
            color: 'blue',
        });
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



 