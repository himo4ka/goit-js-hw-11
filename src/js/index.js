import PixabayApi from './fetchImages.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const input = document.querySelector('.search-form-input');

// const btnSearch = document.querySelector('.search-form-button');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

const pixabayApiService = new PixabayApi();

btnLoadMore.style.display = 'none';
form.addEventListener('submit', onSubmit);
btnLoadMore.addEventListener('click', fetchPic);

function onSubmit(e) {

  e.preventDefault();
  cleanGallery();

  const form = e.currentTarget;
  const value = input.value.trim();

  if (value.length === 0) {
    return Notiflix.Notify.failure(`You've entered nothing. Please try again.`);
  };
  pixabayApiService.resetPage();
  
  pixabayApiService.query = value;

  fetchPic();
};

async function fetchPic() {

  try {
    const data = await pixabayApiService.getImage();

    const { hits, totalHits } = data;

    if (hits.length === 0) throw new Error(onNothingFound());

    const markup = hits.reduce(
      (markup, hits) => createMarkup(hits) + markup,
      ''
    );
    appendNewToList(markup);

    let page = pixabayApiService.page - 1;

    if (pixabayApiService.page - 1 === 1) onInfo(totalHits);
    const totalPages = totalHits / 40;

    if (page > totalPages) throw new Error(onNoMore());

    btnLoadMore.style.display = 'block';
  } catch (err) {
    return err;
  }
}

function appendNewToList(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
  gallerySimpleLightbox.refresh();
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  
      return `<div class="photo-card">
      <div class="images">
      <a href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" title="${tags}" loading="lazy"/></a>
      </div>
        <div class="info">
            <p class="info-item">
                <b>Likes</b> <span class="info-item-api"> ${likes} </span>
            </p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${downloads}</span> 
            </p>
        </div>
    </div>`;
    
}

function cleanGallery() {
  gallery.innerHTML = '';
  btnLoadMore.style.display = 'none';
}

function onNothingFound(err) {
  btnLoadMore.style.display = 'none';
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onNoMore() {
  btnLoadMore.style.display = 'none';
  Notiflix.Notify.info(
  "That's all! We couldn't find more pictures..."
  );
}

function onInfo(info) {
  Notiflix.Notify.success(
    `Hooray! We found ${info} images.`
  );
}