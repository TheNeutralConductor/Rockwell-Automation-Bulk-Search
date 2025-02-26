// script.js
// -----------------------------------
// author : Brian Cowell
// email : contact@cunka.com
// July 2024
// v0.0.1

const searchBtn = document.getElementById("search");
const clearBtn = document.getElementById("reset");

let masterJSONobject = [];
let drawingARRAY = [
  {
    item_Number_input: "Item Number",
    item_Number_ROCKWELL: "ROCKWELL ID",
    drawing_Type: "CAD Drawing Type",
    technical_Description: "ROCKWELL Technical Description",
    download_URL: "Download URL",
    file_name: "CAD File Name",
  },
];

let documentsARRAY = [
  {
    item_Number_input: "Item Number",
    item_Number_ROCKWELL: "ROCKWELL ID",
    document_Type: "Document Type",
    format: "FILE Format",
    download_URL: "Download URL",
    file_name: "FILE Name",
  },
];

console.clear();
console.log(
  "%c--- ROCKWELL BULK SEARCH ---",
  "color: crimson; font-family:sans-serif; font-size: 20px"
);

document.getElementById("reset").style.visibility = "hidden";

// Checkbox for SIMPLE Mode
const simpleModeCheckBox = document.getElementById("simplemode");
simpleModeCheckBox.addEventListener("change", function () {
  if (this.checked) {
    if (document.querySelector(".productView.is-hidden")) {
      document.querySelector(".productView").classList.toggle("is-hidden");
      document.querySelector(".normalView").classList.toggle("is-hidden");
    }
  } else {
    if (document.querySelector(".productView:not(.is-hidden)")) {
      document.querySelector(".productView").classList.toggle("is-hidden");
      document.querySelector(".normalView").classList.toggle("is-hidden");
    }
  }
});

// Checkbox for VERBOSE Mode
const verbosemodeCheckBox = document.getElementById("verbosemode");
verbosemodeCheckBox.addEventListener("change", function () {
  if (this.checked) {
    if (document.querySelector(".verbose-mode.is-hidden")) {
      document.querySelector(".verbose-mode").classList.toggle("is-hidden");
      document.querySelector(".normalView").classList.toggle("is-hidden");
    }
  } else {
    if (document.querySelector(".verbose-mode:not(.is-hidden)")) {
      document.querySelector(".verbose-mode").classList.toggle("is-hidden");
      document.querySelector(".normalView").classList.toggle("is-hidden");
    }
  }
});

// Checkbox for CLIPBOARD
const clipboardCheckBox = document.getElementById("myclip");
clipboardCheckBox.addEventListener("change", function () {
  if (this.checked) {
    if (document.querySelector(".copyCSV.is-hidden")) {
      document.querySelector(".copyCSV").classList.toggle("is-hidden");
    }
  } else {
    if (document.querySelector(".copyCSV:not(.is-hidden)")) {
      document.querySelector(".copyCSV").classList.toggle("is-hidden");
    }
  }
});

// CLEAR button...
clearBtn.addEventListener("click", (e) => {
  clearSelectionList();
  document.getElementById("reset").style.visibility = "hidden";
});

// PRINT button...
document.getElementById("btn-print").addEventListener("click", () => {
  window.print();
});

// JSON DOWNLOAD button...
document.getElementById("json-download").addEventListener("click", () => {
  const jsonData = JSON.stringify(masterJSONobject);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("download", "ROCKWELL-JSON");
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

// CAD DOWNLOAD button...
document.getElementById("cad-download").addEventListener("click", () => {
  const csvRows = [];
  const csvDATA = [];
  const url = [];
  drawingARRAY.forEach((item) => {
    csvDATA.push(Object.values(item));
  });

  drawingARRAY.forEach((item) => {
    if (item.download_URL != "Download URL") {
      url.push(`${item.download_URL}`);
    }
    // console.log(item.download_URL);
  });

  const finalURLS = [...new Set(url)];

  let csvFILEcontent = "";

  csvDATA.forEach((item) => {
    csvFILEcontent += item.join("|") + "\n";
  });

  const blob = new Blob([csvFILEcontent], { type: "text/csv;" });
  const csvURL = URL.createObjectURL(blob);
  const ahref = document.createElement("a");
  document.body.appendChild(ahref);
  ahref.href = csvURL;
  ahref.download = `ROCKWELL-CAD-DOWNLOAD-${Date()
    .slice(0, 24)
    .replaceAll(" ", "-")
    .replaceAll(":", "-")}.csv`;
  ahref.click();

  const downloadFile = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = url.split("/").pop();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const downloadAllFiles = async (urls) => {
    for (const url of urls) {
      try {
        await downloadFile(url);
        // console.log(`Downloaded: ${url}`);
        await delay(1000); // 1-second delay
      } catch (error) {
        // console.error(`Failed to download: ${url}`, error);
      }
    }
  };

  downloadAllFiles(finalURLS);
});

// DOCUMENT DOWNLOAD button...
document.getElementById("documents-download").addEventListener("click", () => {
  const csvRows = [];
  const csvDATA = [];
  const url = [];
  documentsARRAY.forEach((item) => {
    csvDATA.push(Object.values(item));
  });

  const filteredArray = documentsARRAY.filter((item) =>
    item.format.includes("Adobe")
  );

  filteredArray.forEach((item) => {
    if (item.download_URL != "Download URL") {
      url.push(`${item.download_URL}`);
    }
    // console.log(item.download_URL);
  });

  const finalURLS = [...new Set(url)];

  let csvFILEcontent = "";

  csvDATA.forEach((item) => {
    csvFILEcontent += item.join("|") + "\n";
  });

  const blob = new Blob([csvFILEcontent], { type: "text/csv;" });
  const csvURL = URL.createObjectURL(blob);
  const ahref = document.createElement("a");
  document.body.appendChild(ahref);
  ahref.href = csvURL;
  ahref.download = `DOCUMENTS-ROCKWELL-DOWNLOAD-${Date()
    .slice(0, 24)
    .replaceAll(" ", "-")
    .replaceAll(":", "-")}.csv`;
  ahref.click();

  const downloadFile = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = url.split("/").pop();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const downloadAllFiles = async (urls) => {
    for (const url of urls) {
      try {
        await downloadFile(url);
        console.log(`Downloaded: ${url}`);
        await delay(1000); // 1-second delay
      } catch (error) {
        console.error(`Failed to download: ${url}`, error);
      }
    }
  };

  downloadAllFiles(finalURLS);
});

const copyCSVText = document.querySelector(".copyCSV");
copyCSVText.addEventListener("click", () => {
  const text = copyCSVText.innerText;
  navigator.clipboard.writeText(text);
});

document.querySelectorAll('input[name="contentType"]').forEach((elem) => {
  elem.addEventListener("change", function (event) {
    var selection = event.target.value;
    if (selection === "PHOTOS") {
      document
        .querySelectorAll(".main0")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".main1")
        .forEach((pic) => pic.classList.toggle("is-hidden"));
      document
        .querySelectorAll(".main2")
        .forEach((pic) => pic.classList.toggle("is-hidden"));
      document
        .querySelectorAll(".main3")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".main4")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".accessoryTable")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".main5")
        .forEach((pic) => pic.classList.add("is-hidden"));
    } else if (selection === "DOCUMENTS") {
      document
        .querySelectorAll(".main0")
        .forEach((pic) => pic.classList.toggle("is-hidden"));
      document
        .querySelectorAll(".main2")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".main3")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".main4")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".main5")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".accessoryTable")
        .forEach((pic) => pic.classList.add("is-hidden"));
    } else if (selection === "EVERYTHING") {
      document
        .querySelectorAll(".main0")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".main1")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".main2")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".main3")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".main4")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".main5")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".accessoryTable")
        .forEach((pic) => pic.classList.remove("is-hidden"));
    } else if (selection === "ACCESSORY") {
      document
        .querySelectorAll(".main0")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".main1")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".main2")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".main3")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".main4")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".accessoryTable")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".main5")
        .forEach((pic) => pic.classList.add("is-hidden"));
    } else if (selection === "SPECIFICATIONS") {
      document
        .querySelectorAll(".main0")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".main1")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".main2")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".main3")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".main4")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".accessoryTable")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".main5")
        .forEach((pic) => pic.classList.remove("is-hidden"));
    }
  });
});

// SEARCH button...
searchBtn.addEventListener("click", () => {
  console.log(
    "%c\tSEARCH button pressed",
    "color: brown; font-family:sans-serif; font-size: 16px"
  );
  let textarea = document.getElementById("productItems").value;

  console.log("textarea", textarea);

  document.getElementById("reset").style.visibility = "visible";

  let productList = "";

  if (textarea != "") {
    productList = textarea
      .toUpperCase()
      .replaceAll(" ", "")
      .replaceAll(",", "\n")
      .replaceAll(";", "\n")
      .split("\n")
      .filter((item) => !!item);
  }

  let productListURL = productList.map((item) => `${item}`);

  // remove duplicate item numbers
  productListURL = [...new Set(productListURL)];

  document.getElementById("results").style.visibility = "visible";
  document.getElementById("btn-print").classList.toggle("is-hidden");
  document.getElementById("json-download").classList.toggle("is-hidden");

  for (let index = 0; index < productListURL.length; index++) {
    // PRODVIEW (SIMPLE VIEW)
    document.querySelector("#results .productView .prodView").innerHTML += `
    <div class="column is-one-quarter">
      <div class="card" data-id-prodview="${productListURL[index]}">
        <div class="card-content">
          <div class="content">
            <div class="media">
              <div class="media-content is-flex is-justify-content-center">
                <a class="title is-5" href="https://www.rockwellautomation.com/search/ra-en-US;keyword=${productListURL[index]};startIndex=0;activeTab=Products;spellingCorrect=true;facets=;languages=en;locales=en_GLOBAL,en-US;sort=bma;isPLS=false;sessionID=d9f1cfcd-b14c-" target="_blank" title="${productListURL[index]}">${productListURL[index]}</a>                        
              </div>
            </div>
            <div class="card-image is-flex is-justify-content-center" data-product-photo="${productListURL[index]}">
              <span class="icon is-large">
                <span class="fa-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"/><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"/><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"/><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"/><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"/><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"/><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"/></g></svg>
                  <i class="fas fa-spinner fa-pulse"></i>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    document.querySelector("#results .v2024View").innerHTML += `
  <div class="box has-background-primary-light" data-prod2024-id="${productListURL[index]}">
    <div class="scanning"> ${productListURL[index]} 
      <span class="icon is-large">
        <span class="fa-lg">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"/><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"/><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"/><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"/><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"/><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"/><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"/></g></svg>
          <i class="fas fa-spinner fa-pulse"></i>
        </span>
      </span>
    </div>
    <div class="columns is-align-items-center main00 is-hidden">
      <div class="column is-half">
        <div class="title is-size-3">${productListURL[index]}</div>
      </div>
      <div class="column is-quarter" id="rockwellLifeCycle2024"></div>
      <div class="column is-quarter"><div class="is-flex gotoRockwell"><span>Go to Rockwell </span><a href="https://www.rockwellautomation.com/search/ra-en-US;keyword=${productListURL[index]};startIndex=0;activeTab=Products;spellingCorrect=true;facets=;languages=en;locales=en_GLOBAL,en-US;sort=bma;isPLS=false;sessionID=d9f1cfcd-b14c-" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"/></svg></a>
      </div>
    </div>

    </div>
    <div class="columns main0 is-hidden">
    <div class="column is-one-fifth">
     <div class="card card-shadow">
     <div class="card-header-title is-centered">Product Photo</div>
       <div class="card-image">
         <figure class="image is-4by3">
         <a href="" target="_blank" class="rockwellProductPhotoLink">
           <img
             src=""
             class="rockwellRepPhoto"
           />
           </a>
         </figure>
       </div>
     </div>
   </div> 
    </div> 
</div>
 `;

    document.querySelector("#results .verbose-mode").innerHTML += `
    <div class="box" data-prod-id="${productListURL[index]}">
    <table class="table is-fullwidth table is-striped is-size-7">
    <tbody>

    </tbody>
    </table>
    
    </div>`;

    document.querySelector("#results .normalView").innerHTML += `
    <div class="box" data-id="${productListURL[index]}">
    <div class="scanning"> ${productListURL[index]} 
      <span class="icon is-large">
        <span class="fa-lg">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"/><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"/><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"/><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"/><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"/><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"/><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"/></g></svg>
          <i class="fas fa-spinner fa-pulse"></i>
        </span>
      </span>
    </div>
    <div class="columns is-align-items-center main00 is-hidden">
      <div class="column is-half">
        <div class="title is-size-3">${productListURL[index]}</div>
      </div>
      <div class="column is-quarter" id="rockwellLifeCycle"></div>
      <div class="column is-quarter"><div class="is-flex gotoRockwell"><span>Go to Rockwell </span><a href="https://www.rockwellautomation.com/search/ra-en-US;keyword=${productListURL[index]};startIndex=0;activeTab=Products;spellingCorrect=true;facets=;languages=en;locales=en_GLOBAL,en-US;sort=bma;isPLS=false;sessionID=d9f1cfcd-b14c-" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"/></svg></a>
      </div></div>
    </div>  
    
    <div class="columns main0 is-hidden">
      <div class="column is-one-fifth">
        <div class="card card-shadow">
        <div class="card-header-title is-centered">Rep Photo</div>
          <div class="card-image">
            <figure class="image is-4by3">
            <a href="" target="_blank" class="rockwellRepPhotoLink">
              <img
                src=""
                class="rockwellRepPhoto"
              />
              </a>
            </figure>
          </div>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="card card-shadow">
        <div class="card-header-title is-centered">Image</div>
          <div class="card-image">
            <figure class="image is-4by3">
            <a href="" target="_blank" class="rockwellImageLink">
              <img
                src=""
                class="rockwellImage"
              />
              </a>
            </figure>
          </div>
        </div>
      </div>
      <div class="column main1 is-three-fifths">
          <table class="table info1">
            <tbody> 
    
            </tbody>  
          </table> 
      </div>
    </div>
    <div class="columns main2 is-hidden">
      <div class="column is-full-width">
          <table class="table is-fullwidth info2">
            <tbody> 
    
            </tbody>  
          </table> 
          <table class="table is-fullwidth info3">
            <tbody> 
    
            </tbody>  
          </table> 
      </div>
    </div>
    <div class="columns main3 is-hidden">
      <div class="column is-half">
          <div class="table4heading has-text-weight-bold"></div>
          <table class="table is-fullwidth info4">
            <tbody> 
    
            </tbody>  
          </table> 
      </div>
      <div class="column is-half">
          <div class="table5heading has-text-weight-bold"></div>
          <table class="table is-fullwidth info5">
            <tbody> 
    
            </tbody>  
          </table> 
      </div>
    </div>
        <div class="columns main4 is-hidden">
      <div class="column is-half">
          <div class="table6heading has-text-weight-bold"></div>
          <table class="table is-fullwidth info6">
            <tbody> 
    
            </tbody>  
          </table> 
      </div>
      <div class="column is-half">
          <div class="table7heading has-text-weight-bold"></div>
          <table class="table is-fullwidth info7">
            <tbody> 
    
            </tbody>  
          </table> 
      </div>
    </div>
        <div class="columns main5 is-hidden">
      <div class="column is-half">
          <div class="table8heading has-text-weight-bold"></div>
          <table class="table is-fullwidth info8">
            <tbody> 
    
            </tbody>  
          </table> 
      </div>
      <div class="column is-half">
          <div class="table9heading has-text-weight-bold"></div>
          <table class="table is-fullwidth info9">
            <tbody> 
    
            </tbody>  
          </table> 
      </div>
    </div>
      <div class="columns accessoryTable is-hidden">
      <div class="column is-full">
          <div class="tableAccessoryHeading has-text-weight-bold">ACCESSORY PART NUMBERS</div>
          <table class="table is-fullwidth accessories">
            <tbody> 
    
            </tbody>  
          </table> 
    </div>
    </div>`;

    browser.runtime
      .sendMessage({
        text: productListURL[index],
        message: "ROCKWELL2024",
      })
      .then((response2024) => {
        if (response2024.message === "ROCKWELL2024-SUCCESS") {
          console.log("response2024.search");
          console.log(response2024.search);
          document.querySelector(
            `.v2024View [data-prod2024-id="${productListURL[index]}"] .title`
          ).innerText = `${response2024.search.catalogNumber}`;

          document
            .querySelector(
              `.v2024View [data-prod2024-id="${productListURL[index]}"] .scanning`
            )
            .classList.add("is-hidden");

          const ROCKLIFECYCLE = [
            { ACTIVE: "is-primary" },
            { ACTIVEMATURE: "is-success" },
            { "END OF LIFE": "is-warning" },
            { DISCONTINUED: "is-danger" },
          ];
          let endOfLifeObject = ROCKLIFECYCLE.find(
            (item) => item[`${response2024.search.productLifeCycleStatus}`]
          );

          let colorLifCycle = endOfLifeObject
            ? endOfLifeObject[`${response2024.search.productLifeCycleStatus}`]
            : "is-warning";

          document.querySelector(
            `.v2024View [data-prod2024-id="${productListURL[index]}"] #rockwellLifeCycle2024`
          ).innerHTML = `<span class="tag ${colorLifCycle} is-medium">${response2024.search.productLifeCycleStatus}</span>`;

          let checkPhoto = response2024.search.image;
          if (checkPhoto.includes(".jpg")) {
            document.querySelector(
              `.prodView [data-product-photo="${productListURL[index]}"]`
            ).innerHTML = `
          <a href="${response2024.search.image}" target="_blank">
          <img src="${response2024.search.image}" />
          </a>`;
            document
              .querySelector(
                `.v2024View [data-prod2024-id="${productListURL[index]}"] .rockwellRepPhoto`
              )
              .setAttribute("src", `${response2024.search.image}`);
            document
              .querySelector(
                `.v2024View [data-prod2024-id="${productListURL[index]}"] .rockwellProductPhotoLink`
              )
              .setAttribute("href", `${response2024.search.image}`);
          }

          document
            .querySelector(
              `.v2024View [data-prod2024-id="${productListURL[index]}"] .scanning`
            )
            .classList.add("is-hidden");
          document
            .querySelector(
              `.v2024View [data-prod2024-id="${productListURL[index]}"] .main00`
            )
            .classList.remove("is-hidden");
          document
            .querySelector(
              `.v2024View [data-prod2024-id="${productListURL[index]}"] .main0`
            )
            .classList.remove("is-hidden");
        } else if (response2024.message === "ROCKWELL2024-FAIL") {
        }
      });

    browser.runtime
      .sendMessage({
        text: productListURL[index],
        message: "ROCKWELL",
      })
      .then((response1) => {
        if (response1.message === "ROCKWELL-SUCCESS") {
          console.log(response1);
          const objectITEM = { itemNumberNHP: `${productListURL[index]}` };
          objectITEM.itemNumberROCKWELL = `${response1.search.rockwellCatNumber}`;
          objectITEM.rockwellManufacturer = `${response1.search.rockwellManufacturer}`;
          objectITEM.rockwellLifeCycle = `${response1.search.rockwellLifeCycle}`;
          objectITEM.rockwellProductName = `${response1.search.rockwellProductName}`;
          objectITEM.rockwellShortDescription = `${response1.search.rockwellShortDescription}`;
          objectITEM.rockwellDescription = `${response1.search.rockwellDescription}`;
          objectITEM.rockwellInstallationGuidePDF = `${response1.search.rockwellInstallationGuideLink}`;
          objectITEM.rockwellSpecificationPDF = `${response1.search.rockwellSpecificationLink}`;
          objectITEM.rockwellRepPhoto = `${response1.search.rockwellRepPhoto}`;
          objectITEM.rockwellWebsiteURL = `https://www.rockwellautomation.com/search/ra-en-US;keyword=${productListURL[index]};startIndex=0;activeTab=Products;spellingCorrect=true;facets=;languages=en;locales=en_GLOBAL,en-US;sort=bma;isPLS=false;sessionID=d9f1cfcd-b14c-`;
          document.querySelector(
            `.normalView [data-id="${productListURL[index]}"] .title`
          ).innerText = `${response1.search.rockwellCatNumber}`;

          if (
            response1.search.rockwellInstallationGuideLink != "" &&
            response1.search.rockwellInstallationGuideLink != "- - -"
          ) {
            documentsARRAY.push({
              item_Number_input: `${productListURL[index]}`,
              item_Number_ROCKWELL: `${response1.search.rockwellCatNumber}`,
              document_Type: `Installation Guide PDF`,
              format: `Adobe® PDF`,
              download_URL: `${response1.search.rockwellInstallationGuideLink}`,
              file_name: `${response1.search.rockwellInstallationGuideLink
                .split("/")
                .pop()}`,
            });
          }

          if (
            response1.search.rockwellSpecificationLink != "" &&
            response1.search.rockwellSpecificationLink != "- - -"
          ) {
            documentsARRAY.push({
              item_Number_input: `${productListURL[index]}`,
              item_Number_ROCKWELL: `${response1.search.rockwellCatNumber}`,
              document_Type: `Specification PDF`,
              format: `Adobe® PDF`,
              download_URL: `${response1.search.rockwellSpecificationLink}`,
              file_name: `${response1.search.rockwellSpecificationLink
                .split("/")
                .pop()}`,
            });
          }

          let verbAccessoryTable = "";
          if (response1.search.rockwellAccessories.length > 0) {
            response1.search.rockwellAccessories.forEach((acc) => {
              verbAccessoryTable += `<tr><th>${acc.Product}</th><td>${acc.Description}</td></tr>`;
            });
            document.querySelector(
              `.verbose-mode [data-prod-id="${productListURL[index]}"]`
            ).innerHTML += `
            <div class="block">
            <p class="subtitle is-5 mb-1">Accessory</p>
            <table class="table accessory is-fullwidth table table is-bordered is-size-7">
            <tbody>
            ${verbAccessoryTable}
            </tbody>
            </table>
            </div>`;
          }

          let documents1Table = "";
          if (response1.search.rockwellDocuments.length > 0) {
            response1.search.rockwellDocuments.forEach((acc) => {
              // documents
              if (acc.type == "General") {
                document
                  .getElementById("documents-download")
                  .classList.remove("is-hidden");
                documentsARRAY.push({
                  item_Number_input: `${productListURL[index]}`,
                  item_Number_ROCKWELL: `${response1.search.rockwellCatNumber}`,
                  document_Type: `${acc.name}`,
                  format: `${acc.format}`,
                  download_URL: `${acc.urlLink}`,
                  file_name: `${acc.urlLink.split("/").pop()}`,
                });
              }
              // CAD Drawings
              if (acc.type == "Drawing") {
                document
                  .getElementById("cad-download")
                  .classList.remove("is-hidden");
                drawingARRAY.push({
                  item_Number_input: `${productListURL[index]}`,
                  item_Number_ROCKWELL: `${response1.search.rockwellCatNumber}`,
                  drawing_Type: `${acc.title}`,
                  technical_Description: `${response1.search.rockwellTechnicalDescription}`,
                  download_URL: `${acc.urlLink}`,
                  file_name: `${acc.urlLink.split("/").pop()}`,
                });
                // console.log(
                //   `${productListURL[index]}|${response1.search.rockwellCatNumber}|${acc.title}|${response1.search.rockwellTechnicalDescription}|${acc.urlLink}`
                // );
              }
              documents1Table += `<tr>
              <th>${acc.type}</th>
              <td>${acc.docCategory}</td>
              <td>${acc.name}</td>
              <td>${acc.format}</td>
              <td>${acc.title}</td>
              <td><a href="${acc.urlLink}" target="_blank">${acc.urlLink}</a></td></tr>`;

              objectITEM[`Document${acc.name}`] = `${acc.urlLink}`;
            });

            document.querySelector(
              `.verbose-mode [data-prod-id="${productListURL[index]}"]`
            ).innerHTML += `
            <div class="block">
            <p class="subtitle is-5 mb-1">Documents 1</p>
            <table class="table documents1 is-fullwidth table table is-bordered is-size-7">
            <tbody>
            ${documents1Table}
            </tbody>
            </table>
            </div>`;
          }

          let documents2Table = "";
          if (response1.search.rockwellDocuments2.length > 0) {
            response1.search.rockwellDocuments2.forEach((acc) => {
              documents2Table += `<tr>
              <th>${acc.Title}</th>
              <td><a href="${acc.Document}" target="_blank">${acc.Document}</a></td></tr>`;
            });

            document.querySelector(
              `.verbose-mode [data-prod-id="${productListURL[index]}"]`
            ).innerHTML += `
            <div class="block">
            <p class="subtitle is-5 mb-1">Documents 2</p>
            <table class="table documents2 is-fullwidth table table is-bordered is-size-7">
            <tbody>
            ${documents2Table}
            </tbody>
            </table>
            </div>`;
          }

          let detailsTable = "";
          let tableTitle = "";
          if (response1.search.rockwellDetails.length > 0) {
            response1.search.rockwellDetails.forEach((table) => {
              tableTitle = table.Title;
              let thisTable = "";
              table.Descriptors.forEach((myTable) => {
                thisTable += `<tr><th>${myTable.Description}</th><td>${myTable.Values}</td></tr>`;
              });
              detailsTable += `<div class="block">
              <p class="subtitle is-5 mb-1">${tableTitle}</p>
              <table class="table mytable is-fullwidth table table is-bordered is-size-7">
              <tbody>
              ${thisTable}
              </tbody>
              </table>
              </div>`;
            });

            document.querySelector(
              `.verbose-mode [data-prod-id="${productListURL[index]}"]`
            ).innerHTML += `${detailsTable}`;
          }

          let rockImage = "#";
          if (response1.search.rockwellImage != undefined) {
            rockImage = response1.search.rockwellImage;
          }

          let repPhoto = "#";
          if (response1.search.rockwellRepPhoto != undefined) {
            repPhoto = response1.search.rockwellRepPhoto;
          }

          let configurationResultPage = "#";
          if (response1.search.rockwellConfigurationResultPage != "- - -") {
            configurationResultPage =
              response1.search.rockwellConfigurationResultPage;
          }

          let installationGuideLink = "#";
          if (response1.search.rockwellInstallationGuideLink != "- - -") {
            installationGuideLink =
              response1.search.rockwellInstallationGuideLink;
          }

          let specificationLink = "#";
          if (response1.search.rockwellSpecificationLink != "- - -") {
            specificationLink = response1.search.rockwellSpecificationLink;
          }

          document.querySelector(
            `.verbose-mode [data-prod-id="${productListURL[index]}"] table tbody`
          ).innerHTML = `<tr class="has-background-warning-light"><th>Catalogue Number</th><td class="has-text-weight-bold">${response1.search.rockwellCatNumber}</td></tr>
          <tr><th>Type</th><td>${response1.search.rockwellProductType}</td></tr>
          <tr><th>Name</th><td>${response1.search.rockwellProductName}</td></tr>
          <tr><th>Description</th><td>${response1.search.rockwellDescription}</td></tr>
          <tr><th>Short Description</th><td>${response1.search.rockwellShortDescription}</td></tr>
          <tr><th>Technical Description</th><td>${response1.search.rockwellTechnicalDescription}</td></tr>
          <tr><th>Rockwell Image</th><td><a href="${rockImage}" target="_blank">${rockImage}</a></td></tr>
          <tr><th>Rep Photo</th><td><a href="${repPhoto}" target="_blank">${repPhoto}</a></td></tr>
          <tr><th>Configurator</th><td><a href="${configurationResultPage}" target="_blank">${configurationResultPage}</a></td></tr>
          <tr><th>Installation Guide</th><td><a href="${installationGuideLink}" target="_blank">${installationGuideLink}</a></td></tr>
          <tr><th>Specification</th><td><a href="${specificationLink}" target="_blank">${specificationLink}</a></td></tr>
          <tr><th>Manufacturer</th><td>${response1.search.rockwellManufacturer}</td></tr>
          <tr><th>Life Cycle Status</th><td>${response1.search.rockwellLifeCycle}</td></tr>
          <tr><th>Quantity</th><td>${response1.search.rockwellQty}</td></tr>
          <tr><th>Repairable</th><td>${response1.search.rockwellRepairable}</td></tr>
          <tr><th>Replacement Category</th><td>${response1.search.rockwellReplacementCategory}</td></tr>
          <tr><th>UPC</th><td>${response1.search.rockwellUPC}</td></tr>
          <tr><th>UPC 12 Digit</th><td>${response1.search.rockwellUPC12Digit}</td></tr>
          <tr><th>Product Group Code</th><td>${response1.search.rockwellPGC}</td></tr>
          <tr><th>DS</th><td>${response1.search.rockwellDS}</td></tr>
          <tr><th>Last Modified Date</th><td>${response1.search.rockwellLastModifiedDate}</td></tr>
          <tr><th>Locale</th><td>${response1.search.rockwellLocale}</td></tr>
          <tr><th>Currency</th><td>${response1.search.rockwellCurrency}</td></tr>
          <tr><th>List Price</th><td>${response1.search.rockwellListPrice}</td></tr>
          <tr><th>List Price Formatted</th><td>${response1.search.rockwellListPriceFormatted}</td></tr>
          <tr><th>Group Marker</th><td>${response1.search.rockwellGroupMarker}</td></tr>
          <tr><th>Is Preferred</th><td>${response1.search.rockwellIsPreferred}</td></tr>
          <tr><th>Published Lead Time</th><td>${response1.search.rockwellPublishedLeadTime}</td></tr>
          `;

          document
            .querySelector(
              `.normalView [data-id="${productListURL[index]}"] .scanning`
            )
            .classList.add("is-hidden");

          document.querySelector(
            `.normalView [data-id="${productListURL[index]}"] .info1 tbody`
          ).innerHTML = `<tr class="is-size-7"><th>PRODUCT NAME</th><td>${response1.search.rockwellProductName}</td></tr>
          <tr class="is-size-7"><th>SHORT DESCRIPTION</th><td>${response1.search.rockwellShortDescription}</td></tr>
          <tr class="is-size-7"><th>TECHNICAL DESCRIPTION</th><td>${response1.search.rockwellTechnicalDescription}</td></tr>
          <tr class="is-size-7"><th>DESCRIPTION</th><td>${response1.search.rockwellDescription}</td></tr>          
          `;

          document.querySelector(
            `.normalView [data-id="${productListURL[index]}"] .info2 tbody`
          ).innerHTML = `
          <tr class="is-size-7"><th>INSTALLATION GUIDE (PDF)</th><td><a href="${response1.search.rockwellInstallationGuideLink}" target="_blank">${response1.search.rockwellInstallationGuideLink}</a></td></tr>
          <tr class="is-size-7"><th>SPECIFICATION (PDF)</th><td><a href="${response1.search.rockwellSpecificationLink}" target="_blank">${response1.search.rockwellSpecificationLink}</a></td></tr>
          `;

          let table3 = "";
          response1.search.rockwellDocuments2.forEach((elem) => {
            table3 += `<tr class="is-size-7"><th>${elem.Title}</th><td><a href="${elem.Document}" target="_blank">${elem.Document}</a></td></tr>`;
          });

          let howManyMoreTables = response1.search.rockwellDetails.length;

          response1.search.rockwellDetails.forEach((obj, ind) => {
            let tableheading = `.table${ind + 4}heading`;
            document.querySelector(
              `.normalView [data-id="${productListURL[index]}"] ${tableheading}`
            ).innerText = obj.Title;
            obj.Descriptors.forEach((elem) => {
              document.querySelector(
                `.normalView [data-id="${productListURL[index]}"] ${tableheading}+table tbody`
              ).innerHTML += `<tr class="is-size-7"><th>${
                elem.Description
              }</th><td>${elem.Values.join(",")}</td></tr>`;
            });
          });

          document.querySelector(
            `.normalView [data-id="${productListURL[index]}"] .info3 tbody`
          ).innerHTML = table3;

          let dataList = `${productListURL[index]}`;
          let checkRepPhoto = response1.search.rockwellRepPhoto;
          if (checkRepPhoto.includes(".jpg")) {
            dataList += `,${checkRepPhoto}`;
            document
              .querySelector(
                `.normalView [data-id="${productListURL[index]}"] .rockwellRepPhoto`
              )
              .setAttribute("src", `${checkRepPhoto}`);
            document
              .querySelector(
                `.normalView [data-id="${productListURL[index]}"] .rockwellRepPhotoLink`
              )
              .setAttribute("href", `${checkRepPhoto}`);
          } else {
            dataList += `,no photo shown`;
            // remove the outside ahref tag
            let ahrefTag = document.querySelector(
              `.normalView [data-id="${productListURL[index]}"] .rockwellRepPhotoLink`
            );
            let imgTag = ahrefTag.querySelector(
              `.normalView [data-id="${productListURL[index]}"] .rockwellRepPhoto`
            );
            ahrefTag.parentNode.insertBefore(imgTag, ahrefTag);
            ahrefTag.remove();

            imgTag.setAttribute("src", `image_unavailable.svg`);
            let nearestCARDelement = imgTag.closest(".card");
            nearestCARDelement.classList.remove("card-shadow");
            nearestCARDelement.classList.add("card-transparent");
          }

          let checkImage = response1.search.rockwellImage;
          if (checkImage === undefined) {
            dataList += `,no photo shown`;
            // remove the outside ahref tag
            let ahrefTag = document.querySelector(
              `.normalView [data-id="${productListURL[index]}"] .rockwellImageLink`
            );
            let imgTag = ahrefTag.querySelector(
              `.normalView [data-id="${productListURL[index]}"] .rockwellImage`
            );
            ahrefTag.parentNode.insertBefore(imgTag, ahrefTag);
            ahrefTag.remove();

            imgTag.setAttribute("src", `image_unavailable.svg`);
            let nearestCARDelement = imgTag.closest(".card");
            nearestCARDelement.classList.remove("card-shadow");
            nearestCARDelement.classList.add("card-transparent");
          } else {
            dataList += `,${response1.search.rockwellImage}`;
            document
              .querySelector(
                `.normalView [data-id="${productListURL[index]}"] .rockwellImage`
              )
              .setAttribute("src", `${response1.search.rockwellImage}`);
            document
              .querySelector(
                `.normalView [data-id="${productListURL[index]}"] .rockwellImageLink`
              )
              .setAttribute("href", `${response1.search.rockwellImage}`);
          }

          // dataList += `|${response1.search.rockwellProductName}|${response1.search.rockwellDescription}`;

          document.querySelector(
            `#results .copyCSV`
          ).innerHTML += `${dataList} <br>`;

          const ROCKLIFECYCLE = [
            { Active: "is-primary" },
            { "Active Mature": "is-success" },
            { "End of Life": "is-warning" },
            { Discontinued: "is-danger" },
          ];
          let endOfLifeObject = ROCKLIFECYCLE.find(
            (item) => item[`${response1.search.rockwellLifeCycle}`]
          );
          console.log(endOfLifeObject, response1.search.rockwellLifeCycle);
          let colorLifCycle = endOfLifeObject
            ? endOfLifeObject[`${response1.search.rockwellLifeCycle}`]
            : "is-warning";

          document.querySelector(
            `.normalView [data-id="${productListURL[index]}"] #rockwellLifeCycle`
          ).innerHTML = `<span class="tag ${colorLifCycle} is-medium">${response1.search.rockwellLifeCycle}</span>`;

          document
            .querySelectorAll(
              `.normalView [data-id="${productListURL[index]}"] .columns[class*="main"]`
            )
            .forEach((elem) => {
              elem.classList.remove("is-hidden");
            });

          if (response1.search.rockwellAccessories.length > 0) {
            response1.search.rockwellAccessories.forEach((acc) => {
              document.querySelector(
                `.normalView [data-id="${productListURL[index]}"] .accessories tbody`
              ).innerHTML += `<tr class="is-size-7"><th>${acc.Product}</th><td>${acc.Description}</td></tr>`;
            });
            document
              .querySelector(
                `.normalView [data-id="${productListURL[index]}"] .accessoryTable`
              )
              .classList.remove("is-hidden");
          } else {
            document
              .querySelector(
                `.normalView [data-id="${productListURL[index]}"] .accessoryTable`
              )
              .remove();
          }

          masterJSONobject.push(objectITEM);
        } else if (response1.message === "ROCKWELL-FAIL") {
          document.querySelector(
            `#results .copyCSV`
          ).innerHTML += `${productListURL[index]},ERROR,ERROR,ERROR,ERROR <br>`;
          let failed = document.querySelector(
            `.normalView [data-id="${productListURL[index]}"] .title`
          ).innerText;
          document.querySelector(
            `.normalView [data-id="${productListURL[index]}"] .title`
          ).innerHTML = `${failed} `;

          document.querySelector(
            `.normalView [data-id="${productListURL[index]}"] #rockwellLifeCycle`
          ).innerHTML = `<span class="tag is-danger">FAILURE - Rockwell Search</span>`;

          document
            .querySelector(
              `.normalView [data-id="${productListURL[index]}"] .scanning`
            )
            .classList.add("is-hidden");

          document
            .querySelector(
              `.normalView [data-id="${productListURL[index]}"] .columns`
            )
            .classList.remove("is-hidden");
          document
            .querySelector(
              `.normalView .box[data-id="${productListURL[index]}"]`
            )
            .classList.add("has-background-danger-85");

          document
            .querySelector(
              `.normalView [data-id="${productListURL[index]}"] .main0`
            )
            .remove();
          document
            .querySelector(
              `.normalView [data-id="${productListURL[index]}"] .main2`
            )
            .remove();
          document
            .querySelector(
              `.normalView [data-id="${productListURL[index]}"] .main3`
            )
            .remove();
          document
            .querySelector(
              `.normalView [data-id="${productListURL[index]}"] .main4`
            )
            .remove();

          document
            .querySelector(
              `.normalView [data-id="${productListURL[index]}"] .main5`
            )
            .remove();
          document
            .querySelector(
              `.normalView [data-id="${productListURL[index]}"] .accessoryTable`
            )
            .remove();
        }
      });
  }
});

function clearSelectionList() {
  document.querySelector("#results .normalView").innerHTML = "";
  document.getElementById("results").style.visibility = "hidden";
  document.querySelector(".verbose-mode").innerHTML = "";
  document.querySelector(".normalView").innerHTML = "";
  document.getElementById("productItems").value = "";
  document.querySelector("#results .copyCSV").innerHTML = "";
  document.getElementById("btn-print").classList.toggle("is-hidden");
  document.getElementById("json-download").classList.toggle("is-hidden");
  document.getElementById("cad-download").classList.add("is-hidden");
  masterJSONobject = [];
  drawingARRAY = [
    {
      item_Number_input: "Item Number",
      item_Number_ROCKWELL: "ROCKWELL ID",
      drawing_Type: "CAD Drawing Type",
      technical_Description: "ROCKWELL Technical Description",
      download_URL: "Download URL",
      file_name: "CAD File Name",
    },
  ];
  documentsARRAY = [
    {
      item_Number_input: "Item Number",
      item_Number_ROCKWELL: "ROCKWELL ID",
      document_Type: "Document Type",
      format: "FILE Format",
      download_URL: "Download URL",
      file_name: "FILE Name",
    },
  ];
}
