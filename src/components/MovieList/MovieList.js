import React, { Component } from 'react';
import CardFilms from '../CardFilms/CardFilms';
import './MovieList.css'


export default class MovieList extends Component {
  
  render() {
    const { movies, onSetFilmRate, guestSessionId, filmsRatings } = this.props;
    return(
      <>
        {movies && movies.map((movie) => (
          <CardFilms
            key={movie.id}
            id={movie.id}
            poster={movie.poster_path}
            title={movie.title}
            releaseDate={movie.release_date}
            overview={movie.overview} 
            voteAverage = {movie.vote_average}
            guestSessionId={guestSessionId}
            genreIds={movie.genre_ids}
            onSetFilmRate={onSetFilmRate}
            rating={filmsRatings.get(movie.id) || 0}
          />
        ))}
    </>
    )
  }
}