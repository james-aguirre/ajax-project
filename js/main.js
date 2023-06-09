// global dom variables
const $navbarForm = document.querySelector('.navbar-form');
const $mainForm = document.querySelector('.home-form');
const $resultList = document.querySelector('#result-list');
const $searchPage = document.querySelector('.main-search');
const $resultPage = document.querySelector('#results');
const $navbarIcon = document.querySelector('#navbar-icon');
const $resultsHeader = document.querySelector('.results-header');
const $topPage = document.querySelector('#top');
const $navbarTopAnime = document.querySelector('#top-anime');
const $currentlyAiring = document.querySelector('.currently-airing');
const $upAndComing = document.querySelector('.up-and-coming');
const $byPopularity = document.querySelector('.by-popularity');
const $modal = document.querySelector('.modal-container');
const $modalText = document.querySelector('.modal-text');
const $watchlistUl = document.querySelector('#watchlist-ul');
const $watchlistIcon = document.querySelector('#watchlist-icon');
const $watchlistPage = document.querySelector('#watchlist');
const $plusIcon = document.querySelector('.fa-solid');
const $noEntries = document.querySelector('.no-entries');

// navbar search bar function
$navbarForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const $search = event.target.elements.search.value;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.jikan.moe/v4/anime?limit=5&q=${$search}&type=tv`);
  xhr.responseType = 'json';
  removeAllChildNodes($resultList);
  xhr.addEventListener('load', function () {
    switchContent(xhr);
    data.entries.push(xhr.response.data);
    $resultsHeader.textContent = `Search results for ${$search}`;
  });
  $navbarForm.reset();
  viewSwap('results');
  xhr.send();
});

// home page search bar function
$mainForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const $search = event.target.elements.homesearch.value;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.jikan.moe/v4/anime?limit=5&q=${$search}&type=tv`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    switchContent(xhr);
    data.entries.push(xhr.response.data);
    $resultsHeader.textContent = `Search results for ${$search}`;
  });
  $mainForm.reset();
  viewSwap('results');
  xhr.send();
});

// currently airing search function
$currentlyAiring.addEventListener('click', function (event) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v4/top/anime?type=tv&filter=airing&limit=5');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    switchContent(xhr);
    data.entries.push(xhr.response.data);
    $resultsHeader.textContent = 'Top anime currently airing';
    viewSwap('results');
  });
  xhr.send();
});

// up and coming search function
$upAndComing.addEventListener('click', function (event) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v4/top/anime?type=tv&filter=upcoming&limit=5');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    switchContent(xhr);
    data.entries.push(xhr.response.data);
    $resultsHeader.textContent = 'Top upcoming anime';
    viewSwap('results');
  });
  xhr.send();
});

// by popularity function
$byPopularity.addEventListener('click', function (event) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v4/top/anime?type=tv&filter=bypopularity&limit=5');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    switchContent(xhr);
    data.entries.push(xhr.response.data);
    $resultsHeader.textContent = 'Top anime by popularity';
    viewSwap('results');
  });
  xhr.send();
});

// for loop to render api data to result page
function switchContent(xhr) {
  for (let i = 0; i < xhr.response.data.length; i++) {
    $resultList.appendChild(renderEntry(xhr.response.data[i]));
  }
}

// render entries to DOM result list
function renderEntry(entry) {
  const $li = document.createElement('li');
  $li.setAttribute('data-entry-id', data.nextEntryId);
  data.nextEntryId++;
  $resultList.appendChild($li);

  const $row = document.createElement('div');
  $row.classList.add('row', 'slide-container');
  $li.appendChild($row);

  const $columnThird = document.createElement('div');
  $columnThird.className = 'column-third';
  $row.appendChild($columnThird);

  const $img = document.createElement('img');
  $img.src = entry.images.jpg.image_url;
  $img.setAttribute('alt', `a picture of ${entry.title}`);
  $columnThird.appendChild($img);

  const $columnTwoThirds = document.createElement('div');
  $columnTwoThirds.className = 'column-two-thirds';
  $row.appendChild($columnTwoThirds);

  const $slideHeader = document.createElement('div');
  $slideHeader.className = 'slide-header';
  $columnTwoThirds.appendChild($slideHeader);

  const $headerTitle = document.createElement('h3');
  $headerTitle.textContent = entry.title;
  $slideHeader.appendChild($headerTitle);
  $headerTitle.classList.add('slide-header-title');

  const $fontAwesome = document.createElement('i');
  $fontAwesome.className = 'fa-sharp fa-solid fa-square-plus fa-2x';
  $slideHeader.appendChild($fontAwesome);

  const $description = document.createElement('p');
  $description.textContent = entry.synopsis;
  $columnTwoThirds.appendChild($description);

  return $li;
}

// swap views without page reload
function viewSwap(string) {
  if (string === 'results') {
    $topPage.classList.add('hidden');
    $resultPage.classList.remove('hidden');
    $searchPage.classList.add('hidden');
    $watchlistPage.classList.add('hidden');
  } else if (string === 'search') {
    $resultPage.classList.add('hidden');
    $searchPage.classList.remove('hidden');
    $topPage.classList.add('hidden');
    $watchlistPage.classList.add('hidden');
    removeAllChildNodes($resultList);
    data.entries = [];
    data.nextEntryId = 0;
  } else if (string === 'top') {
    $resultPage.classList.add('hidden');
    $searchPage.classList.add('hidden');
    $topPage.classList.remove('hidden');
    $watchlistPage.classList.add('hidden');
    removeAllChildNodes($resultList);
    data.entries = [];
    data.nextEntryId = 0;
  } else if (string === 'watchlist') {
    $resultPage.classList.add('hidden');
    $searchPage.classList.add('hidden');
    $topPage.classList.add('hidden');
    $watchlistPage.classList.remove('hidden');
    $plusIcon.classList.add('hidden');
    removeAllChildNodes($resultList);
    toggleNoEntries();
    data.entries = [];
    data.nextEntryId = 0;

  }
  data.view = string;
}

// function to clear results page on viewSwap
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
// to swap views to home page search bar
$navbarIcon.addEventListener('click', function (event) {
  viewSwap('search');
});

// to swap views to top anime page
$navbarTopAnime.addEventListener('click', function (event) {
  viewSwap('top');
});

// fontawesome plus icon eventlistener
$resultList.addEventListener('click', function (event) {
  if (event.target.tagName === 'I') {
    let entryId = event.target.closest('[data-entry-id]').dataset.entryId;
    entryId = entryId / 1;
    const newEntry = data.entries[0][entryId];
    data.saved.push(newEntry);
    $watchlistUl.append(renderWatchlist(newEntry));
    // Targets Sibling above in HTML
    const $showName = event.target.previousElementSibling;
    // So modal flashes briefly on screen
    event.target.className = 'fa-solid fa-check fa-2x modal-text';
    setTimeout(() => {
      $modal.classList.remove('hidden');
      $modalText.textContent = `${$showName.textContent} added to watchlist`;
    }, 200);
    setTimeout(() => {
      $modal.classList.add('hidden');
    }, 2000
    );
  }
}
);

$watchlistIcon.addEventListener('click', function (event) {
  viewSwap('watchlist');
});

// render entries to watchlist
function renderWatchlist(entry) {
  const $li = document.createElement('li');
  $li.setAttribute('data-saved-id', data.nextSavedId);
  data.nextSavedId++;
  $resultList.appendChild($li);

  const $row = document.createElement('div');
  $row.classList.add('row', 'slide-container');
  $li.appendChild($row);

  const $columnThird = document.createElement('div');
  $columnThird.className = 'column-third';
  $row.appendChild($columnThird);

  const $img = document.createElement('img');
  $img.src = entry.images.jpg.image_url;
  $img.setAttribute('alt', `a picture of ${entry.title}`);
  $columnThird.appendChild($img);

  const $columnTwoThirds = document.createElement('div');
  $columnTwoThirds.className = 'column-two-thirds';
  $row.appendChild($columnTwoThirds);

  const $slideHeader = document.createElement('div');
  $slideHeader.className = 'slide-header';
  $columnTwoThirds.appendChild($slideHeader);

  const $headerTitle = document.createElement('h3');
  $headerTitle.textContent = entry.title;
  $slideHeader.appendChild($headerTitle);
  $headerTitle.classList.add('slide-header-title');

  const $fontAwesome = document.createElement('i');
  $fontAwesome.className = 'fa-solid fa-x';
  $slideHeader.appendChild($fontAwesome);

  const $description = document.createElement('p');
  $description.textContent = entry.synopsis;
  $columnTwoThirds.appendChild($description);

  return $li;
}

// to toggle no shows text if data.saved is null
function toggleNoEntries() {
  data.saved.length === 0 ? $noEntries.classList.remove('hidden') : $noEntries.classList.add('hidden');
}

// event listener for x icon on watchlist page
$watchlistUl.addEventListener('click', function (event) {
  if (event.target.tagName === 'I') {
    const savedId = event.target.closest('[data-saved-id]').dataset.savedId;
    data.saved.splice(savedId, 1);
    // for loop to match corresponding LI element with savedId
    for (let i = 0; i < $watchlistUl.childNodes.length; i++) {
      if ($watchlistUl.childNodes[i].tagName === 'LI' && $watchlistUl.childNodes[i].dataset.savedId === savedId) {
        const deleted = $watchlistUl.childNodes[i];
        $watchlistUl.removeChild(deleted);
      }

    }
    // Targets Sibling above in HTML
    const $showName = event.target.previousElementSibling;
    // So modal flashes briefly on screen
    setTimeout(() => {
      $modal.classList.remove('hidden');
      $modalText.textContent = `${$showName.textContent} removed from watchlist`;
    }, 200);
    setTimeout(() => {
      $modal.classList.add('hidden');
    }, 2000
    );
  }
  toggleNoEntries();
}
);

// To render watchlist and stay on same page after refresh
document.addEventListener('DOMContentLoaded', function (event) {
  for (let i = 0; i < data.saved.length; i++) {
    $watchlistUl.appendChild(renderWatchlist(data.saved[i]));
  }
  viewSwap(data.view);
  toggleNoEntries();
}
);
