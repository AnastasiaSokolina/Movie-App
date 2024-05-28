import React, { Component } from "react";
import './CardFilms.css'
import noImg from './3-1536x1482.jpg'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import trimFunction from "../TrimFunction/TrimFunction";
import { Progress, Rate, Tag } from "antd";
import { GenresConsumer } from '../genresContext/genresContext'

export default class CardFilms extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rating: props.rating || 0,
        }
    }

   static ratingColor = (rating) => {
        let color = ''
        if (rating < 3) {
            color = '#E90000'
        } else if (rating >= 3 && rating < 5) {
            color = '#E97E00'
          } else if (rating >= 5 && rating <= 7) {
            color = '#E9D100'
          } else if (rating > 7) {
            color = '#66E900'
          }
          return color
    }

    componentDidUpdate(prevProps) {
        const { rating } = this.props
        if (prevProps.rating !== rating) {
            this.setState({ rating })
        }
    }

    ratingChange = (rating) => {
        const { id, onSetFilmRate, guestSessionId } = this.props;
        this.setState({ rating });
        onSetFilmRate(id, rating, guestSessionId);
    };

    render() {
    const { poster, releaseDate, title, overview, voteAverage, genreIds } = this.props
    const getColor = CardFilms.ratingColor(voteAverage)
    const ratingColor = getColor
    const { rating } = this.state

    return (
     <GenresConsumer>
     {(genres) => (
        <div className='block'>
        <div className='films'>
            <div className='description'>
                <img className='img' alt={ title } src={!poster ? noImg : `https://image.tmdb.org/t/p/original${poster}`} />
                    <div className='text'>
                        <div className="first_line">
                            <span className='name'><h5>{trimFunction(title,20)}</h5></span>
                            <div className="rating">
                                 <Progress type="circle" size={30} steps={1}
                                    trailColor={ratingColor}
                                    percent={voteAverage ? voteAverage.toFixed(1) : 0} max={10}
                                    format={(percent) => `${percent}`} />
                            </div>
                        </div>
                        <span className='data'>{releaseDate ? format(new Date(releaseDate), 'MMMM dd, yyyy', { locale: enGB }) : 'No information'}</span>
                        <div className='buttons'>
                            {genres &&
                            genreIds &&
                            genreIds.slice(0,3).map((genreID) => {
                                const movieGenre = genres.find((genre) => genre.id === genreID)
                                return <Tag key={genreID}>
                                    { movieGenre ?  movieGenre.name : 'Unknown'}
                                        </Tag>
                            })}
                        </div>  
                        <p className='synopsis'>
                            {overview ? trimFunction(overview,180) : 'No synopsis'}
                        </p>  
                        <Rate count={10} allowHalf className="rate_star"
                        onChange={this.ratingChange}
                        value={rating}
                            />
                    </div>
            </div>
        </div>
    </div>
     )}   
     
    </GenresConsumer>   
    )
    }
}



