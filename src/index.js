import './css/styles.css';
import Notiflix from 'notiflix';
import lodash from 'lodash.debounce';
import {fetchCountries} from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  infoBox: document.querySelector('.country-info'),
};

function countriesMarkup(countries) {
    const countriesList = countries.map(({name,capital,population,flags,languages}) => {
    return `<li>
    <img src= ${flags.svg} style="width:50px; height:50px/>
    <h2>${name.common}</h2>
    <p>Capital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${Object.values(languages).join(",")}</p>>
    </li>`

    })
    .join("");
    refs.list.insertAdjacentHTML('beforeend', countriesList);
    console.log(countriesList);
    // document.querySelector('li').remove();
}

function countryMarkup(countries) {
    const countryCard = countries.map(({name,flags}) => {
    return `
    <img src= ${flags.svg} style="width:50px; height:50px/>
    <h2>${name.common}</h2>
    `
    })
   
    refs.infoBox.insertAdjacentHTML('beforeend', countryCard);
    // countryCard.remove();
}

// refs.input.addEventListener('input', lodash(onInput, DEBOUNCE_DELAY));
refs.input.addEventListener('input',onInput);
function onInput (e) {
  e.preventDefault();
  const name = e.currentTarget.value.trim();

  const result = fetchCountries(name);
  result.then(countries => { console.log(countries);
    console.log(countries.length);

    function countryCardMaker(country){
        if (countries.length === 1) {
          countryMarkup(countries);
        //   refs.infoBox.innerHTML = `<img src= ${flags.svg} style="width:50px; height:50px/>
        //   <h2>${name.common}</h2>`;
        } else if (countries.length >= 2 && countries.length <= 10) {
          countriesMarkup(countries);
        } else if(countries.length > 10){
            Notiflix.Notify.info(
                'Too many matches found. Please enter a more specific name.'
              ); 
        }else {
          Notiflix.Notify.failure(
            'Oops, there is no country with that name');
        }
      }

      countryCardMaker();
    })
}




