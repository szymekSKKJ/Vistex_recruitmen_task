import { data, metadata } from "../data/firstData.js";

const searchInputElement = document.body.querySelector("input.search-input");
const searchButtonElement = document.body.querySelector("button.search-go");
const searchResetElement = document.body.querySelector("button.search-reset");

const columnHideElement = document.body.querySelector("button.column-hide");
const columnShowElement = document.body.querySelector("button.column-show");
const columnResetElement = document.body.querySelector("button.column-reset");

const markButtonElement = document.body.querySelector("button.function-mark");
const fillButtonElement = document.body.querySelector("button.function-fill");
const countButtonElement = document.body.querySelector("button.function-count");
const computeTotalsButtonElement = document.body.querySelector("button.function-totals");
const resetFunctionButtonElement = document.body.querySelector("button.function-reset");

class Grid {
  constructor() {
    this.data = data;
    this.metadata = metadata;
    this.hiddenColumnsCount = 0;

    // HINT: below map can be useful for view operations ;)) Array now :P
    this.tableData = [];

    // This only works in 'use strict'

    Object.freeze(this.data);
    Object.freeze(this.metadata);

    this.render();
    this.live();
  }

  render() {
    this.table = document.createElement("table");

    this.head = this.table.createTHead();
    this.body = this.table.createTBody();

    this.renderHead();
    this.renderBody();

    document.body.append(this.table);
  }

  renderHead() {
    const row = this.head.insertRow();

    this.metadata.forEach((column, index) => {
      const cell = row.insertCell();

      cell.innerText = column.label;
      cell.dataset.column = `${index}`;
    });
  }

  renderBody() {
    for (const dataRow of this.data) {
      const row = this.body.insertRow();

      this.metadata.forEach((column, index) => {
        const cell = row.insertCell();

        cell.classList.add(column.type);
        cell.dataset.column = `${index}`;
        cell.innerText = dataRow[column.id];
      });

      // Prefer arrays than maps

      this.tableData.push({
        rowElement: row,
        data: dataRow,
      });
    }
  }

  live() {
    searchButtonElement.addEventListener("click", this.onSearchGo.bind(this));

    // There was 'onKeyDown' which is not quite correct, because it fire faster and get old value of inputElement

    searchInputElement.addEventListener("input", this.onSearchChange.bind(this));
    searchResetElement.addEventListener("click", this.onSearchReset.bind(this));

    columnHideElement.addEventListener("click", this.onColumnHideClick.bind(this));
    columnShowElement.addEventListener("click", this.onColumnShowClick.bind(this));
    columnResetElement.addEventListener("click", this.onColumnReset.bind(this));

    markButtonElement.addEventListener("click", this.onMarkEmptyClick.bind(this));
    fillButtonElement.addEventListener("click", this.onFillTableClick.bind(this));
    countButtonElement.addEventListener("click", this.onCountEmptyClick.bind(this));
    computeTotalsButtonElement.addEventListener("click", this.onComputeTotalsClick.bind(this));
    resetFunctionButtonElement.addEventListener("click", this.onFunctionsResetClick.bind(this));
  }

  onSearchGo(event) {
    const currentInputElementValue = searchInputElement.value.toLowerCase();

    this.tableData.forEach((tableDataObject) => {
      const { data: rowData, rowElement } = tableDataObject;

      const matchingData = Object.values(rowData).find((rowDataValue) => {
        if (rowDataValue) {
          const currentRowData = rowDataValue.toString().toLowerCase();

          if (currentRowData.includes(currentInputElementValue)) {
            return rowDataValue;
          }
        }
      });

      if (!matchingData) {
        rowElement.classList.add("hidden");
      } else {
        rowElement.classList.remove("hidden");
      }
    });
  }

  onSearchChange(event) {
    this.onSearchGo();
  }

  onSearchReset(event) {
    searchInputElement.value = "";
    this.onSearchGo();
  }

  hideOrShowFirstColumn(type = "hide") {
    const tableHeadLength = [...this.head.firstChild.children].length;
    if (type === "hide" && this.hiddenColumnsCount < tableHeadLength) {
      [...this.head.firstChild.children][this.hiddenColumnsCount].classList.add("hidden");
      this.hiddenColumnsCount++;
    }

    if (this.hiddenColumnsCount !== 0) {
      this.tableData.forEach((tableDataObject) => {
        const { rowElement } = tableDataObject;

        const columnElement = [...rowElement.children].find((columnElement) => parseInt(columnElement.dataset.column) === this.hiddenColumnsCount - 1);

        type === "hide" ? columnElement.classList.add("hidden") : columnElement.classList.remove("hidden");
      });

      if (type === "show" && this.hiddenColumnsCount > 0) {
        [...this.head.firstChild.children][this.hiddenColumnsCount - 1].classList.remove("hidden");
        this.hiddenColumnsCount--;
      }
    }
  }

  onColumnHideClick(event) {
    this.hideOrShowFirstColumn("hide");
  }

  onColumnShowClick(event) {
    this.hideOrShowFirstColumn("show");
  }

  onColumnReset(event) {
    this.hiddenColumnsCount = 0;

    this.tableData.forEach((tableDataObject) => {
      const { rowElement } = tableDataObject;

      [...rowElement.children].forEach((tableDataElement, index) => {
        [...this.head.firstChild.children][index].classList.remove("hidden");
        tableDataElement.classList.remove("hidden");
      });
    });
  }

  onMarkEmptyClick(event) {
    this.tableData.forEach((tableDataObject) => {
      const { data, rowElement } = tableDataObject;

      Object.keys(data).forEach((key, index) => {
        if (data[key] === null) {
          // The data is sorted that's why I can use index of children

          const cellElement = [...rowElement.children][index];

          cellElement.classList.add("marked");
        }
      });
    });
  }

  onFillTableClick(event) {
    this.tableData.forEach((tableDataObject) => {
      const { data, rowElement } = tableDataObject;

      Object.keys(data).forEach((key, index, array) => {
        const quantity = data["quantity"];
        const unitPrice = data["unit_price"];
        const totalValue = data["total_value"];

        // The data is sorted that's why I can use index of children

        if (data[key] === null) {
          const cellElement = [...rowElement.children][index];

          if (key === "total_value") {
            cellElement.innerText = `${quantity * unitPrice}`;
          } else if (key === "unit_price") {
            cellElement.innerText = `${totalValue / quantity}`;
          } else if (key === "quantity") {
            cellElement.innerText = `${totalValue / unitPrice}`;
          }
        }
      });
    });
  }

  onCountEmptyClick(event) {}

  onComputeTotalsClick(event) {}

  removeMarkedTableCells() {
    this.tableData.forEach((tableDataObject) => {
      const { data, rowElement } = tableDataObject;

      Object.keys(data).forEach((key, index) => {
        const childElement = [...rowElement.children][index];
        if (childElement.className.includes("marked")) {
          childElement.classList.remove("marked");
        }
      });
    });
  }

  removeAutoFilledData() {
    this.tableData.forEach((tableDataObject) => {
      const { data, rowElement } = tableDataObject;

      Object.keys(data).forEach((key, index) => {
        const childElement = [...rowElement.children][index];

        if (data[key] === null) {
          childElement.innerText = "";
        }
      });
    });
  }

  onFunctionsResetClick(event) {
    this.removeMarkedTableCells();
    this.removeAutoFilledData();
  }
}

new Grid();
