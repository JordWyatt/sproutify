import React from "react";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import PropTypes from "prop-types";

const styles = {
  chip: { marginLeft: "2.5px", marginRight: "2.5px" },
  container: {
    display: "flex",
    justifyContent: "center"
  }
};

const truncate = (string, maxLength) =>
  string.length > maxLength ? `${string.substr(0, maxLength - 3)}...` : string;

const Selections = props => {
  return (
    <div style={styles.container}>
      {props.selections.map(data => (
        <Chip
          key={data.id}
          id={data.id}
          avatar={<Avatar src={data.imageUrl} />}
          style={styles.chip}
          label={truncate(data.label, 30)}
          onDelete={() => props.handleDelete(data)}
        />
      ))}
    </div>
  );
};

Selections.propTypes = {
  selections: PropTypes.array,
  handleDelete: PropTypes.func
};

export default Selections;
