const mainGridContainer = document.getElementById("mainGridContainer");
const loadGridPattern = document.getElementById("loadGridPattern");
const gridsize = 25;
let mainGridArray = [];
let pathArray = [];

const rowDiv = document.createElement("div");
rowDiv.classList.add("rows");

// #region generation of HTML + CSS based main grid
for (let j = 0; j < gridsize; j++) {
  const colDiv = document.createElement("div");
  colDiv.classList.add("columns");
  colDiv.classList.add("cells");
  rowDiv.appendChild(colDiv);
  console.log("inner loop was run");
}

for (let i = 0; i < gridsize; i++) {
  const cloneRoWDiv = rowDiv.cloneNode(true);
  mainGridContainer.appendChild(cloneRoWDiv);
}
// #endregion generation of HTML and CSS based main grid

// #region generation of js based array state for main grid

for (let i = 0; i < gridsize; i++) {
  let tempArr = [];
  for (let j = 0; j < gridsize; j++) {
    tempArr.push(false);
  }
  mainGridArray.push(tempArr);
}

// #endregion generation of js based array state for main grid

let pathCells = document.getElementsByClassName("pathCell");

let coorSelCells = [];

// The function below returns the path as (row#,col#) coordinates
// function findpathCells() {
//   coorSelCells = [];
//   [...pathCells].forEach((cellDOM) => {
//     const rowDOM = cellDOM.parentElement;
//     const colNum = [...rowDOM.children].indexOf(cellDOM);
//     const rowNum = [...rowDOM.parentElement.children].indexOf(rowDOM);
//     coorSelCells.push([rowNum, colNum]);
//   });
//   return coorSelCells;
// }

// The grid file contents should be in [[row#,col#],[...],...] format
loadGridPattern.addEventListener("click", async () => {
  try {
    const [handle] = await window.showOpenFilePicker({
      multiple: false,
      startIn: "desktop",
      types: [
        {
          description: "grid coordinates in json array format",
          accept: { "application/json": [".txt"] },
        },
      ],
    });
    const file = await handle.getFile();
    const text = await file.text();

    let jsonExtract;

    try {
      jsonExtract = JSON.parse(text);
      pathCoord = [...jsonExtract];
    } catch (err) {
      console.error(err);
    }
    [...pathCells].forEach((selCell) => {
      selCell.classList.remove("pathCell");
    });
    // jsonExtract.forEach((mainCoorArr) => {
    //   mainGridContainer.children[mainCoorArr[0]].children[
    //     mainCoorArr[1]
    //   ].classList.add("pathCell");
    // });
    let pathArray = [...mainGridArray];
    pathCoord.forEach((pathItem) => {
      pathArray[pathItem[0]][pathItem[1]] = ["path"];
    });

    pathArray.forEach((rowItem, rowIndex) => {
      rowItem.forEach((colItem, colIndex) => {
        if (colItem) {
          mainGridContainer.children[rowIndex].children[colIndex].classList.add(
            "pathCell"
          );
        }
      });
    });

    pathArray.forEach((rowItem) => {
      rowItem.forEach((colItem) => {
        if (colItem) {
          colItem.push("food");
        }
      });
    });

    pathArray.forEach((rowItem, rowIndex) => {
      rowItem.forEach((colItem, colIndex) => {
        if (colItem && colItem.includes("food")) {
          mainGridContainer.children[rowIndex].children[colIndex].classList.add(
            "food"
          );
        }
      });
    });
    console.log("pathArray is now:", pathArray);
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("User has cancelled the Select File operation ");
    } else {
      console.error(err);
    }
  }
});
