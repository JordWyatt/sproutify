import React, { Component } from "react";
import PropTypes, { object } from "prop-types";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const WAIT_INTERVAL = 1000;

const styles = {
  inputWrapper: {
    display: "flex"
  },
  select: {
    paddingTop: "32px"
  }
};
export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      hideResults: true
    };

    this.timer = null;
    this.triggerChange = this.triggerChange.bind(this);
    this.makeListItem = this.makeListItem.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    clearTimeout(this.timer);
    this.setState({ value: e.target.value });
    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  }

  triggerChange() {
    const { value } = this.state;
    this.props.onChange(value);
  }

  makeListItem(item) {
    return (
      <ListItem button>
        <ListItemText primary={item.name} />
      </ListItem>
    );
  }

  render() {
    const { results, searchTypes, selectedSearchType } = this.props;
    return (
      <div>
        <div style={styles.inputWrapper}>
          <TextField
            fullWidth="true"
            onFocus={() => this.setState({ showResults: true })}
            onBlur={() => this.setState({ showResults: false })}
            value={this.state.value}
            label={`Search ${selectedSearchType.label}`}
            margin="normal"
            onChange={this.handleChange}
          />
          <div style={styles.select}>
            <Select
              value={selectedSearchType.value}
              onChange={this.props.onSearchTypeChange}
            >
              {searchTypes.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
        {this.state.showResults && (
          <List component="nav">
            {results && results.map(result => this.makeListItem(result))}
          </List>
        )}
      </div>
    );
  }
}

Search.propTypes = {
  items: PropTypes.arrayOf(object),
  onSearchTypeChange: PropTypes.func,
  onChange: PropTypes.func
};
