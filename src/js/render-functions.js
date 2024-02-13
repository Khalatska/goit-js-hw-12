
const galleryElem = document.querySelector('.gallery-list');
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


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

 
 export function renderImages(images){
    const markup = images.map(imageTemplate).join('');
    galleryElem.insertAdjacentHTML('beforeend', markup);
    const lightBox = new SimpleLightbox('.gallery-list a');
    lightBox.refresh();
}