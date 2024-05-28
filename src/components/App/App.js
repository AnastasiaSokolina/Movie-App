import React, { Component } from 'react';
import './App.css';
import MovieService from '../../services/movie-api';
import MovieList from '../MovieList/MovieList';
import { Alert, Spin } from 'antd'
import MovieHeader from '../MovieHeader/MovieHeader';
import MovieSearch from '../MovieSearch/MovieSearch';
import MoviePagination from '../MoviePagination/MoviePagination';
import { GenresProvider } from '../genresContext/genresContext';


export default class App extends Component {


    constructor(props) {
        super(props);
        this.state = {
          movies: null,
          error: false,
          loading: false,
          query: '',
          currentPage: 1,
          totalPages: null,
          guestSessionId: null,
          activeTab: '1',
          ratedMovies: [],
        };
        this.movieService = new MovieService()
        this.filmsRatings = new Map()
      }

      onError = (error) => {
        this.setState({
          error,
          loading: false
        })
      }

      getMoviesInfo = async (query, page = 1) => {
        if (query === '') {
          this.setState({ loading: false, error: false });
          return;
        }
        try {
          const movies = await this.movieService.getMoviesInfo(query, page);
          this.setState({ loading: true, error: null });
            if (movies.length === 0) {
            this.setState({ error: <Alert message='Ooops!' description='Sorry! Nothing found on this query!' type='warning' showIcon className='error_search' />, loading: false, movies: null });
          } else {
            this.setState({ movies, loading: false });
          }
        } catch (error) {
          this.setState({ error: <Alert message="Error" description={error.message} type="error" showIcon className='error_search' />, loading: false, movies: null });
        }
      };

      componentDidMount() {
        this.getMoviesInfo('');
        this.handleSearch('');
        this.createGuestSession();
        this.loadGenres();
      }

      handleSearch = async (searchText) => {
        this.setState({ loading: true, error: null, currentPage: 1 }, async () => {
          if (searchText.trim() !== '') {
            const totalPages = await this.movieService.getTotalPage(searchText);
            this.setState({ query: searchText, totalPages });
            await this.getMoviesInfo(searchText, 1);
          } else {
            this.setState({ loading: false, error: null, movies: [], totalPages: 0, currentPage: 1 });
          }
        });
      };

      pageChangePagination = (page) => {
        this.setState({ currentPage: page }, () => {
          if (page === 1) {
            this.handleSearch(this.state.query);
          } else {
            this.getMoviesInfo(this.state.query, page);
          }
        });
      };

      createGuestSession = () => {
        this.movieService
          .createGuestSession()
          .then((result) => {
            const { guest_session_id: guestSessionId } = result
            this.setState({ guestSessionId })
          })
          .catch((error) => {
            console.error('Error creating guest session:', error)
          })
      }

      buttonChange = (activeTab) => {
        const { ratedMovies, guestSessionId } = this.state
        this.setState({ activeTab }, () => {
          if (activeTab === '2') {
            this.loadRatedMovies()
          }
        })
        if (activeTab === '2' && Array.isArray(ratedMovies)) {
          if (ratedMovies.length === 0) {
            this.getRatedFilms(guestSessionId)
          }
        }
      }

      onSetFilmRate = (id, value, guestSessionId) => {
        this.movieService
          .rateFilm(id, value, guestSessionId)
          .then(() => {
            if (guestSessionId) {
              this.getRatedFilms(guestSessionId)
            }
            this.filmsRatings.set(id, value)
          })
          .catch((error) => {
            console.error('Error rating film:', error)
          })
      }

      getRatedFilms = (guestSessionId, page = 1) => {
        if (!guestSessionId) {
          return
        }
        setTimeout(() => {
          this.movieService
            .getRatedFilms(guestSessionId, page)
            .then((ratedFilms) => {
              this.setState((prevState) => ({
                ...prevState,
                ratedMovies: ratedFilms.results,
                currentPage: ratedFilms.page,
              }))
              console.log(this.state.ratedMovies)
            })
            .catch((error) => {
              console.error('Error fetching rated films:', error)
            })
        }, 1000)
      }

      loadRatedMovies = async () => {
        try {
          this.setState({ loading: true, error: null })
          const { guestSessionId } = this.state
          const ratedFilms = await this.movieService.getRatedFilms(guestSessionId)
          this.setState({ ratedMovies: ratedFilms.results, loading: false })
        } catch (error) {
          this.setState({ error: error.message, loading: false })
        }
      }

      async loadGenres() {
        try {
          const genres = await this.movieService.getGenres()
          this.setState({ genres })
        } catch(error) {
          this.setState({ error })
        }
      }
      
     render() {
        const { movies, error, query, loading, currentPage, totalPages, guestSessionId, activeTab, genres, ratedMovies } = this.state;
        const spinner = loading ? <Spin size='large' /> : null;
        const errorMessage = error
      
        return (
          <GenresProvider value={genres}>
            <div className='App'>
              <MovieHeader
               guestSessionId={guestSessionId}
                onButtonChange={this.buttonChange}
                getRatedFilms={this.getRatedFilms} 
                />
              {activeTab === '1' && (
                <>
                  <MovieSearch onSearch={this.handleSearch}/>
                  { loading ? (
                    <div className='spinner_loading'>
                      { spinner }
                    </div>
                  ) : (
                    <>
                      { errorMessage }
                      <div className='container'>
                        <MovieList movies={movies} error={error}
                          query={ query } 
                          guestSessionId={guestSessionId}
                          filmsRatings={this.filmsRatings}
                          onSetFilmRate={this.onSetFilmRate}
                        />
                      </div>
                      {this.state.totalPages > 1 && 
                        (<MoviePagination 
                          total={totalPages} pageSize={5}
                          onPageChange={ this.pageChangePagination }
                          currentPage={ currentPage }
                        />)}
                    </>
                  )}
                </>
              )
            }
               {activeTab === '2' && Array.isArray(ratedMovies) && ratedMovies.length > 0 && (
                <>
                  {loading ? (
                    <div className='spinner_loading'>
                      {spinner}
                    </div>
                    ) : (
                    <>
                      <div className='container'>
                        { ratedMovies && <MovieList movies={ratedMovies} error={error}
                          query={query}
                          guestSessionId={guestSessionId}
                          filmsRatings={this.filmsRatings}
                          onSetFilmRate={this.onSetFilmRate} />}
                      </div>
                      <MoviePagination
                        total={ratedMovies.length} pageSize={5}
                        onPageChange={this.pageChangePagination}
                        currentPage={currentPage} />
                  </>
                  )}
                </>
              )}
                {activeTab === '2' && (!Array.isArray(ratedMovies) || ratedMovies.length === 0) && (
                  <div className='rated_movies'>
                  <Alert message='Whoa whoa whoa whoa!' description='Rate the movies first!' type='warning' showIcon />
                  </div>
                )
                }
            </div>
          </GenresProvider>
        );
     }
}
