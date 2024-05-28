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
            poster={movie.posterPath}
            title={movie.title}
            releaseDate={movie.releaseDate}
            overview={movie.overview} 
            voteAverage = {movie.voteAverage}
            guestSessionId={guestSessionId}
            genreIds={movie.genreIds}
            onSetFilmRate={onSetFilmRate}
            rating={filmsRatings.get(movie.id) || 0}
          />
        ))}
    </>
    )
  }
}