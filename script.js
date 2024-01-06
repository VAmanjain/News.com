const GNEWS_API_KEY = "5e03d15119b619681f013f719b916b30";
const gnewsApiUrl = "https://gnews.io/api/v4/search";

window.addEventListener("load", () => fetchNews("Globe"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  try {
    const res = await fetch(`${gnewsApiUrl}?q=${query}&token=${GNEWS_API_KEY}`);
    if (!res.ok) {
      throw new Error(`Error fetching news data from GNews API: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);
    bindData(data.articles);
  } catch (error) {
    console.error(error);
  }
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  if (!articles || articles.length === 0) {
    // FOR THE CASES WHEN NO NEWS ARTICLES ARE AVAILABLE
    console.log("No news articles available.");
    return;
  }

  articles.forEach((article) => {
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");
  const newsMore = cardClone.querySelector("#button-read");

  newsImg.src = article.image || "http://via.placeholder.com/400x200"; //USE IMAGE WHEN AVAILABLE OR USE PLACEHOLDER

  newsTitle.textContent = article.title || "N/A";
  newsDesc.textContent = article.description || "No description available";
  newsSource.textContent = article.source.name || "Unknown source";

  newsMore.addEventListener("click", () => {
    if (article.url) {
      window.open(article.url, "_blank");
    }
  });
}

let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-btn");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;

  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});

