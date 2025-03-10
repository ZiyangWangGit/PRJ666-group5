import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

const FormSelector = ({ onSelect }) => {
  return (
    <DropdownButton id="dropdown-basic-button" title="Add New">
      <Dropdown.Item onClick={() => onSelect("assignment")}>
        Assignment
      </Dropdown.Item>
      <Dropdown.Item onClick={() => onSelect("material")}>
        Material
      </Dropdown.Item>
      <Dropdown.Item onClick={() => onSelect("announcement")}>
        Announcement
      </Dropdown.Item>
      <Dropdown.Item onClick={() => onSelect("quiz")}>Quiz</Dropdown.Item>
    </DropdownButton>
  );
};

export default FormSelector;
