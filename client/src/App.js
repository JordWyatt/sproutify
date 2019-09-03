import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home/Home";
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

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <ThemeProvider theme={theme}>
            <Route exact path="/" component={Home} />
          </ThemeProvider>
        </Switch>
      </div>
    );
    return <App />;
  }
}
export default App;
