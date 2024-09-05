document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "95975020"; // Your OMDB API key
  const BASE_URL = "http://www.omdbapi.com/";
  const searchForm = document.getElementById("search-form");
  const filmsContainer = document.querySelector(".films_container");
  const filmInfoContainer = document.querySelector(".info_container");
  const paginationContainer = document.querySelector(".pagination");

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.getElementById("movie-title").value.trim();
    const type = document.getElementById("movie-type").value;

    console.log("Title:", title); // Додано для налагодження
    console.log("Type:", type); // Додано для налагодження

    if (title) {
      await fetchFilms(title, type, 1);
    }
  });

  async function fetchFilms(title, type, page) {
    try {
      const url = `${BASE_URL}?s=${encodeURIComponent(
        title
      )}&type=${type}&page=${page}&apikey=${API_KEY}`;
      console.log("Request URL:", url); // Додано для налагодження
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True") {
        displayFilms(data.Search);
        setupPagination(data.totalResults, title, type);
      } else {
        filmsContainer.innerHTML = "Movie not found!";
        filmInfoContainer.classList.add("none-display");
      }
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  }

  function displayFilms(films) {
    filmsContainer.innerHTML = films
      .map(
        (film) => `
            <div class="movie-item item border">
                <div>
                    <img class="item-image" src="${film.Poster}" alt="${film.Title}">
                </div>
                <div class="item-description" data-id="${film.imdbID}">
                    <span class="item-type">${film.Type}</span>
                    <span class="item-title">${film.Title}</span>
                    <span class="item-year">${film.Year}</span>
                    <button class="item-details">Details</button>
                </div>
            </div>
        `
      )
      .join("");
    filmsContainer.classList.remove("none-display");
    filmInfoContainer.classList.add("none-display");

    document.querySelectorAll(".item-details").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const imdbID = event.target
          .closest(".item-description")
          .getAttribute("data-id");
        await fetchFilmInfo(imdbID);
      });
    });
  }

  async function fetchFilmInfo(imdbID) {
    try {
      const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
      const film = await response.json();
      filmInfoContainer.innerHTML = `
                <div class="info-item border">
                    <div>
                        <img class="info-image" src="${film.Poster}" alt="${film.Title}">
                    </div>
                    <div class="info-description">
                        <table class="info-table">
                            <tr>
                                <td>Title:</td>
                                <td>${film.Title}</td>
                            </tr>
                            <tr>
                                <td>Released:</td>
                                <td>${film.Released}</td>
                            </tr>
                            <tr>
                                <td>Genre:</td>
                                <td>${film.Genre}</td>
                            </tr>
                            <tr>
                                <td>Country:</td>
                                <td>${film.Country}</td>
                            </tr>
                            <tr>
                                <td>Director:</td>
                                <td>${film.Director}</td>
                            </tr>
                            <tr>
                                <td>Writer:</td>
                                <td>${film.Writer}</td>
                            </tr>
                            <tr>
                                <td>Actors:</td>
                                <td>${film.Actors}</td>
                            </tr>
                            <tr>
                                <td>Awards:</td>
                                <td>${film.Awards}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            `;
      filmInfoContainer.classList.remove("none-display");
    } catch (error) {
      console.error("Error fetching film info:", error);
    }
  }

  function setupPagination(totalResults, title, type) {
    const totalPages = Math.ceil(totalResults / 10);
    paginationContainer.innerHTML = Array.from(
      { length: totalPages },
      (_, i) => `
            <button class="pagination-button" data-page="${i + 1}">${
        i + 1
      }</button>
        `
    ).join("");

    document.querySelectorAll(".pagination-button").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const page = event.target.getAttribute("data-page");
        await fetchFilms(title, type, page);
      });
    });
  }
});
