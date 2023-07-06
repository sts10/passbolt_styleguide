/**
 * Passbolt ~ Open source TableRow manager for teams
 * Copyright (c) 2023 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2023 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         4.2.0
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import CellWrapper from "./CellWrapper";
import {withTable} from "./Context/TableContext";

/**
 * This component represents a table header
 */
class Row extends Component {
  /**
   * Default constructor
   * @param props Component props
   */
  constructor(props) {
    super(props);
    this.bindCallbacks();
  }

  /**
   * Bind callbacks methods
   * @return {void}
   */
  bindCallbacks() {
    this.handleClick = this.handleClick.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  /**
   * Handle click
   * @param event
   */
  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onClick(event, this.item);
  }

  /**
   * Handle context menu
   * @param event
   */
  handleContextMenu(event) {
    event.preventDefault();
    this.props.onContextMenu(event, this.item);
  }

  /**
   * Handle drag start
   * @param event
   */
  handleDragStart(event) {
    this.props.onDragStart(event, this.item, this.isItemSelected);
  }

  /**
   * Handle drag end
   * @param event
   */
  handleDragEnd(event) {
    this.props.onDragEnd(event);
  }

  /**
   * Get column
   * @return {Object}
   */
  get columns() {
    return this.props.tableContext.columns;
  }

  /**
   * Get item
   * @return {Object}
   */
  get item() {
    return this.props.item;
  }

  /**
   * Is item selected
   * @return {*}
   */
  get isItemSelected() {
    return this.props.tableContext.isRowSelected(this.item.id);
  }

  /**
   * Render the component
   * @return {JSX}
   */
  render() {
    const isSelected = this.isItemSelected;
    return (
      <tr id={this.item.id} draggable="true" className={isSelected ? "selected" : ""}
        onClick={this.handleClick}
        onContextMenu={this.handleContextMenu}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}>
        {this.columns.map(column =>
          <CellWrapper key={column.id} column={column} isSelected={isSelected} value={column.getValue?.(this.item) || this.item[column.field]}/>
        )}
      </tr>
    );
  }
}

Row.propTypes = {
  tableContext: PropTypes.any, // The table context
  item: PropTypes.object.isRequired, // The index of the column
  onClick: PropTypes.func, // The onClick event
  onContextMenu: PropTypes.func, // The onContextMenu event
  onDragStart: PropTypes.func, // The onDragStart event
  onDragEnd: PropTypes.func // The onDragEnd event
};

export default withTable(Row);
