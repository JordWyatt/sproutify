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
                    user: data.body
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
                {this.state.user ? (
                    <div>
                        <h1>Hello {this.state.user.display_name || ""}</h1>
                        {JSON.stringify(this.state.user)}
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            window.location = "http://localhost:3333/login";
                        }}
                        style={{
                            padding: "20px",
                            "font-size": "50px",
                            "margin-top": "20px"
                        }}
                    >
                        Sign in with Spotify
                    </button>
                )}
            </div>
        );
    }
}
export default Home;
