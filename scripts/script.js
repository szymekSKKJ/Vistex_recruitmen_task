import { data, metadata } from "../data/firstData.js";
import { data as secondData, metadata as secondMetaData } from "../data/SecondData.js";

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
    this.data = structuredClone(data); // Deep copy
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
      const currentHeadColumnCellElement = [...this.head.firstChild.children][this.hiddenColumnsCount];

      currentHeadColumnCellElement.classList.add("hidden");
      this.hiddenColumnsCount++;
    }

    if (this.hiddenColumnsCount !== 0) {
      this.tableData.forEach((tableDataObject) => {
        const { rowElement } = tableDataObject;

        const columnCellElement = [...rowElement.children].find((columnElement) => parseInt(columnElement.dataset.column) === this.hiddenColumnsCount - 1);

        type === "hide" ? columnCellElement.classList.add("hidden") : columnCellElement.classList.remove("hidden");
      });

      if (type === "show" && this.hiddenColumnsCount > 0) {
        const currentHeadColumnCellElement = [...this.head.firstChild.children][this.hiddenColumnsCount - 1];
        currentHeadColumnCellElement.classList.remove("hidden");
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
    const tableHeadLength = [...this.head.firstChild.children].length;
    const currentHiddenColumnsCount = this.hiddenColumnsCount;

    for (let i = 0; i <= currentHiddenColumnsCount - 1; i++) {
      this.hideOrShowFirstColumn("show");
    }
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

      Object.keys(data).forEach((key, index) => {
        const quantity = data["quantity"];
        const unitPrice = data["unit_price"];
        const totalValue = data["total_value"];

        if (data[key] === null) {
          // The data is sorted that's why I can use index of children
          const cellElement = [...rowElement.children][index];

          // All assignments (data[key]) are of deep clone data (this.data)

          if (key === "total_value") {
            const cellValue = quantity * unitPrice;

            cellElement.innerText = `${cellValue}`;
            data[key] = quantity * unitPrice;
          } else if (key === "unit_price") {
            const cellValue = totalValue / quantity;

            cellElement.innerText = `${cellValue}`;
            data[key] = totalValue / quantity;
          } else if (key === "quantity") {
            const cellValue = totalValue / unitPrice;
            cellElement.innerText = `${cellValue}`;
            data[key] = totalValue / unitPrice;
          }
        }
      });
    });
  }

  onCountEmptyClick(event) {
    let counter = 0;

    this.tableData.forEach((tableDataObject) => {
      const { data } = tableDataObject;

      Object.keys(data).forEach((key) => {
        if (data[key] === null) {
          counter++;
        }
      });
    });

    window.alert(`Found ${counter} empty cells`);
  }

  onComputeTotalsClick(event) {
    const isAnyCellEmpty = this.data.find((dataObject) => Object.values(dataObject).some((value) => value === null));

    if (isAnyCellEmpty) {
      window.alert("First fill all the cells");
    } else {
      let sumOfTotal = 0;

      this.data.forEach((dataObject) => {
        Object.keys(dataObject).forEach((key) => {
          if (key === "total_value") {
            sumOfTotal += parseInt(dataObject[key]);
          }
        });
      });

      window.alert(`Total sum is: ${sumOfTotal}`);
    }
  }

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
    data.forEach((dataObject, rowIndex) => {
      const currentDataRow = data[rowIndex];

      Object.keys(currentDataRow).forEach((key, index) => {
        if (currentDataRow[key] === null) {
          const childElement = [...this.tableData[rowIndex].rowElement.children][index];

          // Reseting deep cloned data to initial state

          const cellValue = this.tableData[rowIndex]["data"][key];

          cellValue = null;

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
