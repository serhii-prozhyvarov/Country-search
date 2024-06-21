import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';


const DEBOUNCE_DELAY = 300;
const refs = {
  searchInput: document.getElementById('search-box'),
  container: document.querySelector('.country-info'),
  list: document.querySelector('.country-list'),
};

const onInput = debounce(evt => {
  const name = evt.target.value.trim();
  if (!name) {
    refs.container.innerHTML = '';
    refs.list.innerHTML = '';
    return;
  }
  fetchCountries(name)
    .then(choiceCountry)
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      refs.container.innerHTML = '';
      refs.list.innerHTML = '';
    });
}, DEBOUNCE_DELAY);

function choiceCountry(countries) {
  const arrLength = countries.length;
  if (arrLength > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    refs.container.innerHTML = '';
    refs.list.innerHTML = '';
    return;
  }
  if (arrLength === 1) {
    refs.list.innerHTML = '';
    return renderCountryInfo(countries);
  }
  if (arrLength >= 2 && arrLength <= 10) {
    refs.container.innerHTML = '';
    return renderCountriesAll(countries);
  }
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(country => {
      return `<div class="country">
      <img src="${country.flags.svg}" width="100" height="60" alt="flag of ${
        country.name.official
      }">
      <h2 class="country-title">${country.name.official}</h2></div>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages).join(', ')}</p>`;
    })
    .join('');
  refs.container.innerHTML = markup;
}

function renderCountriesAll(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country">
      <img src="${country.flags.svg}" width="75" height="45" alt="flag of ${country.name.official}">
      <p>${country.name.official}</p></li>`;
    })
    .join('');
  refs.list.innerHTML = markup;
}

refs.searchInput.addEventListener('input', onInput);


        
      