import React, {Component} from 'react'
import { Form, Input } from 'antd'
import './MovieSearch.css'
import { debounce } from 'lodash'

export default class MovieSearch extends Component {

    constructor( props ) {
        super(props)
        const onSearch = props.onSearch
            this.state = {
                searchText: '',
            }
            this.handleSearchDebounced = debounce((searchText) => {
                onSearch(searchText);
              }, 100);
    }

    handleChange = (event) => {
        const { value } = event.target
        this.setState({ searchText: value })
        this.handleSearchDebounced(value)
      }
      
    
    render() {
       
        const { searchText } = this.state

        return (
            <Form className='movie-search' name='movie-search' onSubmit={ this.handleSubmit }>
                <Input placeholder='Type to search...' ref={this.textInput} type='text'
                onChange={ this.handleChange }
                value={ searchText }
                name='movie-search'/>
            </Form>    
        )
    }
}