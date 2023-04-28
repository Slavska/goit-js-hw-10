import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('keyup', debounce(searchByInput, DEBOUNCE_DELAY));

function searchByInput() {
  const searchCountries = inputEl.value.trim();
  if (searchCountries === '') {
    clearAll();
    return;
  }

  fetchCountries(searchCountries)
    .then(countries => {
      if (countries.length > 10) {
        clearAll();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countries.length > 1 && countries.length <= 10) {
        findAll(countries);
        return;
      }

      findOne(countries);
    })
    .catch(error => {
      clearAll();
      Notify.failure('Oops, there is no country with that name');
      return;
    });
}

function findAll(countriesAll) {
  countryInfo.innerHTML = '';
  countryList.innerHTML = countriesAll
    .map(
      country =>
        `<li style="display:flex; align-items:center;">
        <img src="${country.flags.svg}" alt="flag" width="30">
        <p style = "margin:10px;">${country.name.official}</p>
        </li>`
    )
    .join('');
}

function findOne(countryOne) {
  countryList.innerHTML = countryOne.map(
    country =>
      `<li style="display:flex; align-items:center;">
      <img src="${country.flags.svg}" alt="flag" width="30">
      <p style="margin:10px; font-size:36px;font-weight:600">${country.name.official}</p>
      </li>`
  );
  countryInfo.innerHTML = countryOne.map(
    country => `<p><b>Capital:</b> ${country.capital}</p>
    <p><b>Population:</b> ${country.population}</p>
    <p><b>Languages:</b> ${Object.values(country.languages).join(' , ')}</p>`
  );
}

function clearAll() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

countryList.style.listStyle = 'none';
countryList.style.display = 'flex';
countryList.style.flexDirection = 'column';
countryList.style.paddingLeft = '0px';
