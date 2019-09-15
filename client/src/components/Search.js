import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
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
      showResults: true
    };

    this.timer = null;
    this.triggerChange = this.triggerChange.bind(this);
    this.makeListItem = this.makeListItem.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
    this.blurHandler = this.blurHandler.bind(this);
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

  blurHandler(e) {
    const currentTarget = e.currentTarget;
    // new element isn't focused as the blur event happens, so this will report body. Set timeout to avoid this
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({ showResults: false });
      }
    }, 0);
  }

  focusHandler() {
    this.setState({ showResults: true });
  }

  resultClickHandler(item) {
    this.props.onSearchResultClick(item);
    this.setState({ showResults: false });
  }

  makeListItem(item) {
    return (
      <div>
        <ListItem button dense onClick={() => this.resultClickHandler(item)}>
          <ListItemAvatar>
            <Avatar style={styles.avatar} src={item.imageUrl} />
          </ListItemAvatar>
          <ListItemText primary={item.label} />
        </ListItem>
      </div>
    );
  }

  render() {
    const { results, searchTypes, selectedSearchType } = this.props;
    return (
      <div onBlur={this.blurHandler}>
        <div style={styles.inputWrapper}>
          <TextField
            fullWidth="true"
            value={this.state.value}
            label={`Search ${selectedSearchType.label}`}
            margin="normal"
            onChange={this.handleChange}
            onFocus={this.focusHandler}
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
          <List dense>
            {results && results.map(result => this.makeListItem(result))}
          </List>
        )}
      </div>
    );
  }
}

Search.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  onSearchTypeChange: PropTypes.func,
  onChange: PropTypes.func,
  onSearchResultClick: PropTypes.func,
  results: PropTypes.arrayOf(PropTypes.object),
  searchTypes: PropTypes.arrayOf(PropTypes.object),
  selectedSearchType: PropTypes.object
};
