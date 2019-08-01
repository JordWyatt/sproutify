import React from "react";
import PropTypes, { object } from "prop-types";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

export default function Search(props) {
  const makeListItem = track => (
    <ListItem button>
      <ListItemText primary={track.name} />
    </ListItem>
  );
  return (
    <div>
      <TextField fullWidth="true" label={`Search Track`} margin="normal" />
      <List component="nav">
        {props.tracks.map(track => makeListItem(track))}
      </List>
    </div>
  );
}

Search.propTypes = {
  tracks: PropTypes.arrayOf(object),
  artists: PropTypes.arrayOf(object)
};
