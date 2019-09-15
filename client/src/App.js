import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Header from "./components/Header";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#43a047"
    },
    secondary: {
      main: "#43a047"
    }
  }
});

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: null,
      user: null
    };

    this.getUser = this.getUser.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

  getUser() {
    fetch(`${process.env.REACT_APP_PROXY_URL}/auth/login/success`, {
      credentials: "include"
    })
      .then(response => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then(responseJson => {
        this.setState({
          isAuthenticated: true,
          user: responseJson.user
        });
      })
      .catch(e => {
        this.setState({
          isAuthenticated: false,
          user: null
        });
        console.error(e);
      });
  }

  render() {
    const { user, isAuthenticated } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Header user={user} />
          <Switch>
            <Route path="/login" component={Login} />
            {isAuthenticated !== null && (
              <PrivateRoute
                path="/"
                isAuthenticated={isAuthenticated}
                component={Home}
              />
            )}
          </Switch>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
