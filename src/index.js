import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  infoBox: document.querySelector('.country-info'),
};

function countryMarkup(countries) {
  const countryCard = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `
    <img src="${flags.svg}" alt="#" style="width:50px;height:30px;"/>
    <h2>${name.common}</h2>
    <p>Capital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${Object.values(languages).join(',')}</p>
    `;
    })
    .join('');

  refs.infoBox.innerHTML = '';
  refs.list.innerHTML = '';
  refs.infoBox.insertAdjacentHTML('beforeend', countryCard);
}

function countriesMarkup(countries) {
  const countriesList = countries
    .map(({ name, flags }) => {
      return `
    <li><img src="${flags.svg}" alt="#" style="width:50px;height:30px;"/>
    <h2>${name.common}</h2>
    </li>
    `;
    })
    .join('');
  refs.list.innerHTML = '';
  refs.infoBox.innerHTML = '';
  refs.list.insertAdjacentHTML('beforeend', countriesList);
}

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();

  const name = e.target.value.trim();
  if (name === '') {
    refs.infoBox.innerHTML = '';
    refs.list.innerHTML = '';
    return;
  }

  const result = fetchCountries(name);

  result
    .then(countries => countryCardMaker(countries))
    .catch(error => Notiflix.Notify.failure('error 404'));
}

function countryCardMaker(countries) {
  if (countries.length === 1) {
    countryMarkup(countries);
  } else if (countries.length >= 2 && countries.length <= 10) {
    countriesMarkup(countries);
  } else if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length === 0) {
    refs.infoBox.innerHTML = '';
    refs.list.innerHTML = '';
  } else {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  }
}
