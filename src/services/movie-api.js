export default class MovieService {

  _apiUrl = 'https://api.themoviedb.org/3/'

    _options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2YyNGIwZTY0YzRjYTk2N2E3ODRjMWQ2ZDI1NzZhYyIsInN1YiI6IjY2MzlmOWMwZTkyZDgzMDEyMWQ0YTcxYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QjkorPknv0EV_GZaHb6un6v403WiARnzbinkVi4iSSI`
      }
    }
    
    _apiKey = '93f24b0e64c4ca967a784c1d6d2576ac'
    
   
    async getResource (url, options=this._options) {
      const response = await fetch(`${this._apiUrl}${url}`, options)
      if (!response.ok) {
        throw new Error(`Could not fetch!`)
      }
      const data = await response.json()
      return data
    } 

    async searchMovie(query, page=1) {
      const url = `search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`;
      const response = await this.getResource(url)
      return response
    }

    async getMoviesInfo(query,page=1) {
      const response = await this.searchMovie(query,page)
      return response.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids,
      }))
    }   
    
    async getTotalPage(query) {
      const queryResult = await this.searchMovie(query)
      return queryResult.total_pages
    }

    async createGuestSession() {
      const url = `authentication/guest_session/new?api_key=${this._apiKey}`
      const res = await this.getResource(url)
      return res
    }

    async getGenres() {
      try {
        const response = await this.getResource('genre/movie/list')
        return response.genres
      } catch (error) {
        throw new Error(`Could not fetch genres`)
      }
    }

    async rateFilm (id, value, guestSessionId) {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value }),
      }
      const url = `movie/${id}/rating?api_key=${this._apiKey}&guest_session_id=${guestSessionId}`
      let res = []
      try {
        res = await this.getResource(url, options)
        return res
      } catch (error) {
        console.error(error)
      }
      return res
    }
    
    async getRatedFilms(guestSessionId, page = 1) {
      const url = `guest_session/${guestSessionId}/rated/movies?api_key=${this._apiKey}&language=en-US&page=${page}`
      try {
        const res = await fetch(`${this._apiUrl}${url}`, this._options)
        const data = await res.json()
        return data
      } catch (error) {
        throw new Error(`Failed to retrieve data, Server returned status ${error.status}`)
      }
    }
  }    


// (async () => {
//   const movieService = new MovieService();
//   const response = await movieService.searchMovie('dune', 1);
//   console.log(response);
    
// })();


