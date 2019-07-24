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
        fetch("http://localhost:3333/auth/login/success", {
            credentials: "include"
        })
            .then(response => {
                console.log(response);
                if (response.status === 200) return response.json();
                throw new Error("failed to authenticate user");
            })
            .then(responseJson => {
                this.setState({
                    authenticated: true,
                    user: responseJson.user
                });
            })
            .catch(error => {
                this.setState({
                    authenticated: false,
                    error: "Failed to authenticate user"
                });
            });
    }

    render() {
        const { authenticated } = this.state;
        return (
            <div className="App">
                {authenticated ? (
                    <div>
                        {!authenticated ? (
                            <h1>Welcome!</h1>
                        ) : (
                            <div>
                                <h1>You have logged in succcessfully!</h1>
                                <h2>Welcome {this.state.user.name}!</h2>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            window.location =
                                "http://localhost:3333/auth/spotify";
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
