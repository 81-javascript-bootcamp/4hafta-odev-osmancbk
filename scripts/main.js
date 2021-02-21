import data from "./data.js";
import {searchMovieByTitle, makeBgActive} from "./helpers.js";

class MoviesApp {
    constructor(options) {
        const {root, searchInput, searchForm, yearHandler, yearSubmitter, yearFilter, genreFilter, genreSubmitter, genreHandler} = options;
        this.$tableEl = document.getElementById(root);
        this.$tbodyEl = this.$tableEl.querySelector("tbody");
        this.$tableTrEl = this.moviesArr;

        this.$searchInput = document.getElementById(searchInput);
        this.$searchForm   = document.getElementById(searchForm);
        this.yearHandler = yearHandler;
        this.$yearSubmitter = document.getElementById(yearSubmitter);
        this.$yearFilter = document.getElementById(yearFilter);
        this.$genreFilter=document.getElementById(genreFilter);
        this.$genreSubmitter = document.getElementById(genreSubmitter);
        this.$genreHandler = genreHandler;

        this.yearCounts = {};
        this.filterYears=[];
        this.genreCounts=[];
        this.selectedGenre= [];
        this.selectedYear=[];

    }

    createMovieEl(movie){
        const {image, title, genre, year,id} = movie;
        return `<tr data-id="${id}"><td><img src="${image}"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`
    }

    fillTable(){
        /* const moviesHTML = data.reduce((acc, cur) => {
            return acc + this.createMovieEl(cur);
        }, "");*/
        const moviesArr = data.map((movie) => {
           return this.createMovieEl(movie)
        }).join("");
        this.$tbodyEl.innerHTML = moviesArr;
    }

    reset(){
        this.$tbodyEl.querySelectorAll("tr").forEach((item) => {
            item.style.background = "transparent";
        })
    }


    handleSearch(){
        this.$searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.reset();
            const searchValue = this.$searchInput.value;
            const matchedMovies = data.filter((movie) => {
                return searchMovieByTitle(movie, searchValue);
            }).forEach(makeBgActive)
            //!clear
            this.$searchInput.value=""; 
            //!clear
            this.UnSelectElements("radio")
            this.UnSelectElements("checkbox")

        });
    }

    //
    getYears(){   
        let moviesYears = [];
        for (let i = 0 ; i<data.length ; i++){
            moviesYears.push(data[i].year);
         }
         //counts
        moviesYears.forEach((el) => {
        this.yearCounts[el] = this.yearCounts[el] ? (this.yearCounts[el] += 1) : 1;
    });
        //type conversion
        this.yearCounts = Object.keys(this.yearCounts).map((key) => [Number(key), this.yearCounts[key]]);
        //sorting
        this.yearCounts =this.yearCounts.sort(function (a, b) {
            return b[1] - a[1];
            });
        }

    createFilterByYearEl(fYear,fYearCnt){
        return `<div class="form-check"><input class="form-check-input" type="radio" name="year" id="${fYear}" value="${fYear}"><label class="form-check-label" for="${fYear}">${fYear} (${fYearCnt}) </label></div>`
    }

    fillYearFilterBox(){
        const yearsArr = this.yearCounts.map((year) => {
            return this.createFilterByYearEl(year[0],year[1])
        }).join("");
        this.$yearFilter.innerHTML = yearsArr;
  
    }

//
    handleYearFilter(){
        this.$yearSubmitter.addEventListener("click", () => {
            this.reset();
            const selectedYear = document.querySelector(`input[name='${this.yearHandler}']:checked`).value
            const matchedMovies = data.filter((movie) => {
                return movie.year === selectedYear;
            }).forEach(makeBgActive)
            //clear
            this.UnSelectElements("checkbox")
        });
    }

    UnSelectElements(whichType) {
        let items = document.querySelectorAll(`input[type=${whichType}]:checked`);     
            for(var item of items.values()) {
                item.checked=false;
        }
    }

    getGenres(){
        let movieGenres = [];
    for (let i = 0 ; i<data.length ; i++){
        movieGenres.push(data[i].genre);
     }
     //counts
     movieGenres.forEach((el) => {
        this.genreCounts[el] = this.genreCounts[el] ? (this.genreCounts[el] += 1) : 1;
    });
    //type conversion
    this.genreCounts = Object.keys(this.genreCounts).map((key) => [String(key), this.genreCounts[key]]);
    //sorting
    this.genreCounts =this.genreCounts.sort(function (a, b) {
        return b[1] - a[1];
      });
    }



    createFilterByGenreEl(fGenre, fGenreCount){
        return `<div class="form-check"> <input class="form-check-input" type="checkbox" name="genre" id="${fGenre}" value="${fGenre}"> <label class="form-check-label" for="${fGenre}"  > ${fGenre} (${fGenreCount}) </label> </div>`
    }
    fillGenreFilterBox(){
        const genreArr = this.genreCounts.map((genre) => {
            return this.createFilterByGenreEl(genre[0],genre[1])
        }).join("");
        this.$genreFilter.innerHTML = genreArr;
    }

    handleGenreFilter(){
        this.$genreSubmitter.addEventListener("click", () =>{
            this.reset();
            let matchedMovies;
            this.selectedGenre = document.querySelectorAll('input[name="genre"]:checked');
            for(var genre of this.selectedGenre.values()) {
                matchedMovies = data.filter((movie) => {
                    return movie.genre === genre.value;
                }).forEach(makeBgActive)
              }
              //clear year filter
              this.UnSelectElements("radio")
        });
    }


    init(){
        this.fillTable();
        this.handleSearch();
        this.handleYearFilter();//
        this.getYears();
        this.getGenres();
        this.fillYearFilterBox();
        this.fillGenreFilterBox();
        this.handleGenreFilter();
        this.handleYearFilter();    
    }
}

let myMoviesApp = new MoviesApp({
    root: "movies-table",
    searchInput: "searchInput",
    searchForm: "searchForm",
    yearHandler: "year",
    yearSubmitter: "yearSubmitter",
    //
    yearFilter: "yearFilter",
    genreFilter: "genreFilter",
    genreSubmitter: "genreSubmitter",
    genreHandler: "genre"
});

myMoviesApp.init();