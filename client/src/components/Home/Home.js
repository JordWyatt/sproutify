import React, { Component } from "react";
const queryString = require("query-string");
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi();

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        };
    }
    componentDidMount() {
        const { location } = this.props;
        const { access_token } = queryString.parse(location.search);
        if (!access_token) return;
        spotifyApi.setAccessToken(access_token);
        spotifyApi.getMe().then(
            data => {
                this.setState({
                    userInfo: data.body
                });
            },
            err => {
                console.log("Something went wrong!", err);
            }
        );
    }

    render() {
        return (
            <div className="App">
                <h1>Hello {this.state.userInfo.display_name || ""}</h1>
            </div>
        );
    }
}
export default Home;
