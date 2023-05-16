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

    for (const column of this.metadata) {
      const cell = row.insertCell();

      cell.innerText = column.label;
    }
  }

  renderBody() {
    for (const dataRow of this.data) {
      const row = this.body.insertRow();

      for (const column of this.metadata) {
        const cell = row.insertCell();

        cell.classList.add(column.type);
        cell.innerText = dataRow[column.id];
      }

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

          if (currentRowData.toString().includes(currentInputElementValue)) {
            return rowDataValue;
          }
        }
      });

      if (!matchingData) {
        rowElement.classList.add("hidden");
      } else if (rowElement.className.includes("hidden")) {
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

  onColumnHideClick(event) {}

  onColumnShowClick(event) {}

  onColumnReset(event) {}

  onMarkEmptyClick(event) {}

  onFillTableClick(event) {}

  onCountEmptyClick(event) {}

  onComputeTotalsClick(event) {}

  onFunctionsResetClick(event) {}
}

new Grid();
