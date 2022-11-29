'use strict';

const countriesContainer = document.querySelector('.countries');

const btn = document.getElementById('btnSubmit');
const countryName = document.getElementById('input');

function getJSON(url, errorMsg = `Something went wrong`) {
  document.querySelector('.lds-ellipsis').style.display = 'inline';
  //
  return fetch(url).then(function (response) {
    document.querySelector('.lds-ellipsis').style.display = 'none';
    document.querySelector('.resetBtn').style.display = 'inline';
    // console.log(response);
    if (!response.ok) {
      throw new Error(`${errorMsg} ${response.status}`);
    }
    return response.json();
  });
}
function getCountryData(country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, `Country not found`)
    .then(function (data) {
      // console.log(`cc`);
      console.log(data[0]);
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];
      if (!neighbour) {
        document.querySelector('.neighbourInfo').style.display = 'inline';
        throw new Error(`No neighbour found!`);
      }
      //country 2

      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        `Country not found`
      );
    })
    .then(function (data) {
      renderCountry(data[0], 'neighbour');
    })
    .catch(function (err) {
      //   return alert(err);
      console.error(`${err} 🔥`);
      document.querySelector(
        '.errorMsg'
      ).textContent = `${err.message}. Try again later`;
      document.querySelector('.errorMsg').style.display = 'inline';
      document.querySelector('.lds-ellipsis').style.display = 'none';
      console.log(err);
      // renderError(`Something went wrong ${err.message}. Try again! ${err}`);
    })
    .finally(function () {
      // return (countriesContainer.style.opacity = 1);
      console.log(`we have finished!`);
    });
}
function renderCountry(data, className = '') {
  const d = data.currencies;
  const [currName] = Object.values(d);
  const html = ` 
  <article class="country ${className}">
  <p class="neighbourInfo">This country has no neighbour</p>
    <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
          <h3 class="country__name">${data.name.common}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)}M people</p>
          <p class="country__row"><span>🗣️</span>${Object.values(
            data.languages
          )}</p>
          <p class="country__row"><span>💰</span>${
            Object.values(currName)[0]
          }</p>
      </div>
  </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
  document.querySelector('.my-form').style.display = 'none';
}
btn.addEventListener('click', function (e) {
  e.preventDefault();
  if (countryName.value) {
    getCountryData(countryName.value);
  } else {
    document.querySelector('.errorMsg').textContent =
      'Invalid input. Try again';
  }
});
document.querySelector('.resetBtn').addEventListener('click', function () {
  location.reload();
});
