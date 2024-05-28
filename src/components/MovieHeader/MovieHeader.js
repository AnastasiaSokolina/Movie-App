import React, { Component } from "react";
import { Tabs } from "antd";
import './MovieHeader.css'

export default class MovieHeader extends Component {

    componentDidMount() {
        const { getRatedFilms, guestSessionId } = this.props
        getRatedFilms(guestSessionId)
    }

    buttonChange = (key) => {
        const { onButtonChange } = this.props
        onButtonChange(key)
    }

    render() {

        const { TabPane } = Tabs

       return (
        <div className='header'>
            <Tabs defaultActiveKey="1" onChange={this.buttonChange}>
                <TabPane tab='Search' key='1' />
                <TabPane tab='Rated' key='2' />
            </Tabs>
        </div>
       )

    }
}

