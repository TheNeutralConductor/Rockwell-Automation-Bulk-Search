// script.js
// -----------------------------------
// author : Brian Cowell
// email : contact@cunka.com
// July 2024, MARCH 2025
// Full redesign as the Rockwell API changed
// v2.0

const ROCKWELL_URL = "https://www.rockwellautomation.com/en-us/products/";
const searchBtn = document.getElementById("search");
const clearBtn = document.getElementById("reset");

let assetsARRAY = [
  {
    item_Number_input: "Item Number",
    item_Number_ROCKWELL: "ROCKWELL ID",
    item_Details: "Item Details",
    media: "Media",
    media_Type: "Media Type",
    download_URL: "Download URL",
    file_name: "File Name",
    webpage_ROCKWELL: "ROCKWELL Product URL",
  },
];

console.clear();
console.log(
  "%c--- ROCKWELL BULK SEARCH ---",
  "color: crimson; font-family:sans-serif; font-size: 20px"
);

document.getElementById("reset").style.visibility = "hidden";

// CLEAR button...
clearBtn.addEventListener("click", (e) => {
  clearSelectionList();
  document.getElementById("reset").style.visibility = "hidden";
});

// PRINT button...
document.getElementById("btn-print").addEventListener("click", () => {
  window.print();
});

// CLOSE Modal for downloading assets
document.getElementById("btn-close-modal").addEventListener("click", () => {
  document.querySelector(".modal").classList.remove("is-active");
});

// CSV ASSET DOWNLOAD button...
document.getElementById("csv-download").addEventListener("click", () => {
  const csvRows = [];
  const csvDATA = [];
  const url = [];
  assetsARRAY.forEach((item) => {
    csvDATA.push(Object.values(item));
  });

  let csvFILEcontent = "";

  csvDATA.forEach((item) => {
    csvFILEcontent += item.join("|") + "\n";
  });

  const blob = new Blob([csvFILEcontent], { type: "text/csv;" });
  const csvURL = URL.createObjectURL(blob);
  const ahref = document.createElement("a");
  document.body.appendChild(ahref);
  ahref.href = csvURL;
  ahref.download = `CSV-FILE-ROCKWELL-ASSETS-${Date()
    .slice(0, 24)
    .replaceAll(" ", "-")
    .replaceAll(":", "-")}.csv`;
  ahref.click();
});

// DOCUMENT DOWNLOAD button...
document.getElementById("all-assets-download").addEventListener("click", () => {
  const url = [];
  let modalElement = document.querySelector(".modal .modal-card-body");
  assetsARRAY.forEach((item) => {
    if (item.download_URL != "Download URL") {
      url.push(`${item.download_URL}`);
      const divBlock = document.createElement("div");
      divBlock.classList.add("block", "is-size-7", "mb-3");
      divBlock.innerHTML = item.download_URL;
      modalElement.appendChild(divBlock);
    }
  });

  document.querySelector(".modal").classList.add("is-active");

  const finalURLS = [...new Set(url)];

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
        await delay(1000); // 1-second delay so Rockwells server isnt overwhelmed
      } catch (error) {
        console.error(`Failed to download: ${url}`, error);
      }
    }
  };

  downloadAllFiles(finalURLS);
});

// SEARCH button...
searchBtn.addEventListener("click", () => {
  console.log(
    "%c\tSEARCH button pressed",
    "color: brown; font-family:sans-serif; font-size: 16px"
  );
  let textarea = document.getElementById("productItems").value;

  console.log(textarea);

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
  document.getElementById("btn-print").classList.remove("is-hidden");

  for (let index = 0; index < productListURL.length; index++) {
    // 2025 VIEW
    document.querySelector("#results .v2025View").innerHTML += `
  <div class="box " data-prod2025-id="${productListURL[index]}">
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
        <div class="title is-size-3"><span class="material-symbols-outlined errror">error</span>${productListURL[index]}</div>
      </div>
      <div class="column is-quarter" id="rockwellLifeCycle2025"></div>
      <div class="column is-quarter is-flex" style="gap:1rem;">
        <div class="is-flex gotoRockwell" ><span>Search </span><a href="https://www.rockwellautomation.com/search/ra-en-US;keyword=${productListURL[index]};startIndex=0;activeTab=Products;spellingCorrect=true;facets=;languages=en;locales=en_GLOBAL,en-US;sort=bma;isPLS=false;sessionID=d9f1cfcd-b14c-" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"/></svg></a></div>
        <div class="is-flex gotoRockwell gotoProdpage" ><span>Web Page </span><a href="" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"/></svg></a></div>
      </div>

    </div>
    <div class="columns main0 is-hidden">
    <div class="column is-one-fifth photo-column">
     <div class="card card-shadow">
     <div class="card-header-title is-centered">Photo #1</div>
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
      <div class="column main1 is-four-fifths">
          <table class="table info1 is-fullwidth">
            <tbody>     
            </tbody>  
          </table> 
          <div class="is-size-6 is-flex is-align-items-center docHeading">DOCUMENTS <span class="noTable is-hidden"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg></span></div>
          <table class="table info2 is-fullwidth">
            <tbody>     
            </tbody>  
          </table> 
          <div class="is-size-6 is-flex  is-align-items-center drawHeading">DRAWINGS <span class="noTable is-hidden"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg></span></div>
          <table class="table info3 is-fullwidth">
            <tbody>     
            </tbody>  
          </table> 
      </div>
    </div>
    <div class="scanning2">
      <span class="icon is-large">
        <span class="fa-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"/><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"/><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"/><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"/><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"/><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"/><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"/></g></svg>
            <i class="fas fa-spinner fa-pulse"></i>
        </span>
      </span>
      <span class="icon is-large">
        <span class="fa-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"/><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"/><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"/><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"/><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"/><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"/><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"/></g></svg>
            <i class="fas fa-spinner fa-pulse"></i>
        </span>
      </span>
      <span class="icon is-large">
        <span class="fa-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"/><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"/><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"/><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"/><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"/><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"/><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"/></g></svg>
            <i class="fas fa-spinner fa-pulse"></i>
        </span>
      </span>
    </div> 
</div>
 `;

    browser.runtime
      .sendMessage({
        text: productListURL[index],
        message: "ROCKWELL2025",
      })
      .then((response2025) => {
        if (response2025.message === "ROCKWELL2025-SUCCESS") {
          console.log("response2025.search");
          console.log(response2025.search);
          console.log(response2025);
          document.querySelector(
            `.v2025View [data-prod2025-id="${productListURL[index]}"] .title`
          ).innerText = `${response2025.search.catalogNumber}`;

          document
            .querySelector(
              `.v2025View [data-prod2025-id="${productListURL[index]}"] .scanning`
            )
            .classList.add("is-hidden");

          const ROCKLIFECYCLE = [
            { ACTIVE: "is-primary" },
            { ACTIVE_MATURE: "is-success" },
            { END_OF_LIFE: "is-warning" },
            { DISCONTINUED: "is-danger" },
          ];
          let endOfLifeObject = ROCKLIFECYCLE.find(
            (item) => item[`${response2025.search.productLifeCycleStatus}`]
          );

          let colorLifCycle = endOfLifeObject
            ? endOfLifeObject[`${response2025.search.productLifeCycleStatus}`]
            : "is-warning";

          document.querySelector(
            `.v2025View [data-prod2025-id="${productListURL[index]}"] #rockwellLifeCycle2025`
          ).innerHTML = `<span class="tag ${colorLifCycle} is-medium">${response2025.search.productLifeCycleStatus}</span>`;

          let checkPhoto = response2025.search.image;
          let productPHOTO = checkPhoto;
          if (checkPhoto == undefined) {
            productPHOTO =
              "https://www.rockwellautomation.com/etc.clientlibs/rockwell-aem-base/clientlibs/clientlib-base/resources/icons/image_unavailable.svg";
          }

          document
            .querySelector(
              `.v2025View [data-prod2025-id="${productListURL[index]}"] .rockwellRepPhoto`
            )
            .setAttribute("src", `${productPHOTO}`);
          document
            .querySelector(
              `.v2025View [data-prod2025-id="${productListURL[index]}"] .rockwellProductPhotoLink`
            )
            .setAttribute("href", `${productPHOTO}`);

          document
            .querySelector(
              `.v2025View [data-prod2025-id="${productListURL[index]}"] .scanning`
            )
            .classList.add("is-hidden");
          document
            .querySelector(
              `.v2025View [data-prod2025-id="${productListURL[index]}"] .main00`
            )
            .classList.remove("is-hidden");
          document
            .querySelector(
              `.v2025View [data-prod2025-id="${productListURL[index]}"] .main0`
            )
            .classList.remove("is-hidden");

          return {
            rockwellProductNumber: response2025.search.catalogNumber,
            rockwellProductNumberTitle: response2025.search.title,
            rockwellProductNumberDescription: response2025.search.description,
          };
        } else if (response2025.message === "ROCKWELL2025-FAIL") {
          console.log("ROCKWELL FAIL");
          throw new Error("Something bad happened");
        }
      })
      .then((rockwellDetails) => {
        console.log(
          `Rockwells product number is ${rockwellDetails.rockwellProductNumber}`
        );
        document.querySelector(
          `.v2025View [data-prod2025-id="${productListURL[index]}"] .info1 tbody`
        ).innerHTML = `<tr class="is-size-7"><th>PRODUCT ITEM NUMBER</th><td>${rockwellDetails.rockwellProductNumber}</td></tr>
          <tr class="is-size-7"><th>PRODUCT DETAILS</th><td>${rockwellDetails.rockwellProductNumberTitle}</td></tr>
          <tr class="is-size-7"><th>PRODUCT DESCRIPTION</th><td>${rockwellDetails.rockwellProductNumberDescription}</td></tr>
          `;

        // scrape the contents of the ROCKWELL Product Page
        browser.runtime
          .sendMessage({
            text: rockwellDetails.rockwellProductNumber,
            message: "PRODUCT-PAGE-ROCKWELL2025",
          })
          .then((website) => {
            if (website.message === "PRODUCT-PAGE-ROCKWELL2025") {
              const parser = new DOMParser();
              const webpage = parser.parseFromString(website.html, "text/html");

              document.querySelector(
                `.v2025View [data-prod2025-id="${productListURL[index]}"] .gotoProdpage a`
              ).href = `https://www.rockwellautomation.com/en-us/products/details.${rockwellDetails.rockwellProductNumber}.html`;

              // const description = webpage.querySelector(
              //   "#ra-product-new__product-details div.ra-product-new__header-top h1"
              // ).textContent;

              // ------------------- PRODUCT PAGE PHOTOS
              const photoArray = webpage.querySelectorAll(
                ".ra-product-new__product-detail-header-content-image-desktop .ra-product-new__header-image-gallery-image.ra-product-new__product-image"
              );
              console.log("photos", photoArray);

              let existingPhoto = document.querySelector(
                `.v2025View [data-prod2025-id="${productListURL[index]}"] .photo-column`
              );

              let morePhotos = "";
              photoArray.forEach((itemR) => {
                let photoLink = itemR.src;
                let photoTitle = "Photo";
                morePhotos = `<div class="card card-shadow">
                                <div class="card-header-title is-centered">Photo #2</div>
                                <div class="card-image">
                                    <figure class="image is-4by3">
                                    <a href="${photoLink}" target="_blank" class="rockwellProductPhotoLink">
                                      <img src="${photoLink}" class="rockwellRepPhoto">
                                    </a>
                                    </figure>
                                </div>
                              </div>`;

                let fileName = "";
                let check = photoLink.split("/").pop();
                if (check.includes(".")) {
                  fileName = check;
                }
                assetsARRAY.push({
                  item_Number_input: `${productListURL[index]}`,
                  item_Number_ROCKWELL: `${rockwellDetails.rockwellProductNumber}`,
                  item_Details: `${rockwellDetails.rockwellProductNumberTitle}`,
                  media: "PHOTO",
                  media_Type: `PHOTO #2`,
                  download_URL: `${photoLink}`,
                  file_name: `${fileName}`,
                  webpage_ROCKWELL: `${ROCKWELL_URL}details.${rockwellDetails.rockwellProductNumber}.html`,
                });
              });
              existingPhoto.innerHTML += morePhotos;

              // ------------------- DOCUMENTS TABLE
              const documentsTable = webpage.querySelectorAll(
                ".ra-product-new__documentation-table.ra-product-new__documentation-table-desktop tr:not(:first-child)"
              );
              console.log("documents", documentsTable);
              if (documentsTable.length == 0) {
                document
                  .querySelector(
                    `.v2025View [data-prod2025-id="${productListURL[index]}"] .docHeading .noTable`
                  )
                  .classList.toggle("is-hidden");
              }
              let rockDocTable = "";
              documentsTable.forEach((row) => {
                const cells = row.querySelectorAll("td");
                if (cells.length == 3) {
                  const link = cells[1].querySelector("a");
                  if (link) {
                    mylink = link.href;
                  } else {
                    mylink = "";
                  }

                  rockDocTable += `<tr class="is-size-7">
                  <th>${cells[0].textContent}</th><td><a href="${mylink}" target="_blank" rel="noopener noreferrer">${mylink}</a></td></tr>`;
                }

                let fileName = "";
                let check = mylink.split("/").pop();
                if (check.includes(".")) {
                  fileName = check;
                }

                assetsARRAY.push({
                  item_Number_input: `${productListURL[index]}`,
                  item_Number_ROCKWELL: `${rockwellDetails.rockwellProductNumber}`,
                  item_Details: `${rockwellDetails.rockwellProductNumberTitle}`,
                  media: "DOCUMENT",
                  media_Type: `${cells[0].textContent}`,
                  download_URL: `${mylink}`,
                  file_name: `${fileName}`,
                  webpage_ROCKWELL: `${ROCKWELL_URL}details.${rockwellDetails.rockwellProductNumber}.html`,
                });
              });
              document.querySelector(
                `.v2025View [data-prod2025-id="${productListURL[index]}"] .info2 tbody`
              ).innerHTML = rockDocTable;

              // ------------------- DRAWINGS TABLE
              const drawingsTable = webpage.querySelectorAll(
                ".ra-product-new__content-desktop .ra-product-new__drawings-table-wide tr:not(:first-child)"
              );
              console.log("drawings", drawingsTable);
              if (drawingsTable.length == 0) {
                document
                  .querySelector(
                    `.v2025View [data-prod2025-id="${productListURL[index]}"] .drawHeading .noTable`
                  )
                  .classList.toggle("is-hidden");
              }
              let rockDrawingTable = "";
              drawingsTable.forEach((row) => {
                const cells = row.querySelectorAll("td");
                const link = cells[1].querySelector("a");
                if (link) {
                  mylink = link.href;
                } else {
                  mylink = "";
                }

                rockDrawingTable += `<tr class="is-size-7">
                <th>${cells[0].textContent}</th><td><a href="${mylink}" target="_blank" rel="noopener noreferrer">${mylink}</a></td></tr>`;

                let fileName = "";
                let check = mylink.split("/").pop();
                if (check.includes(".")) {
                  fileName = check;
                }

                assetsARRAY.push({
                  item_Number_input: `${productListURL[index]}`,
                  item_Number_ROCKWELL: `${rockwellDetails.rockwellProductNumber}`,
                  item_Details: `${rockwellDetails.rockwellProductNumberTitle}`,
                  media: "DRAWINGS",
                  media_Type: `${cells[0].textContent}`,
                  download_URL: `${mylink}`,
                  file_name: `${fileName}`,
                  webpage_ROCKWELL: `${ROCKWELL_URL}details.${rockwellDetails.rockwellProductNumber}.html`,
                });
              });
              document.querySelector(
                `.v2025View [data-prod2025-id="${productListURL[index]}"] .info3 tbody`
              ).innerHTML = rockDrawingTable;
            }
          })
          .then(() => {
            document
              .querySelector(
                `.v2025View [data-prod2025-id="${productListURL[index]}"] .scanning2`
              )
              .classList.add("is-hidden");
            if (assetsARRAY.length > 1) {
              document
                .getElementById("csv-download")
                .classList.remove("is-hidden");
              document
                .getElementById("all-assets-download")
                .classList.remove("is-hidden");
            }
          });
      })
      .catch((error) => {
        document
          .querySelector(
            `.v2025View [data-prod2025-id="${productListURL[index]}"]`
          )
          .classList.add("has-background-danger-light");
        document
          .querySelector(
            `.v2025View [data-prod2025-id="${productListURL[index]}"] .scanning`
          )
          .remove();

        document
          .querySelector(
            `.v2025View [data-prod2025-id="${productListURL[index]}"] .scanning2`
          )
          .remove();

        document
          .querySelector(
            `.v2025View [data-prod2025-id="${productListURL[index]}"] .main00`
          )
          .classList.remove("is-hidden");

        document
          .querySelector(
            `.v2025View [data-prod2025-id="${productListURL[index]}"] .main0`
          )
          .remove();

        document
          .querySelector(
            `.v2025View [data-prod2025-id="${productListURL[index]}"] .main00 .is-quarter.is-flex`
          )
          .remove();

        console.log("Caught an error:", error.message);
      });
  }
});

function clearSelectionList() {
  document.querySelector("#results .v2025View").innerHTML = "";
  document.getElementById("results").style.visibility = "hidden";
  document.getElementById("productItems").value = "";
  document.getElementById("btn-print").classList.add("is-hidden");
  document.getElementById("csv-download").classList.add("is-hidden");
  document.getElementById("all-assets-download").classList.add("is-hidden");
  document.querySelector(".modal .modal-card-body").innerHTML = "";
  assetsARRAY = [
    {
      item_Number_input: "Item Number",
      item_Number_ROCKWELL: "ROCKWELL ID",
      item_Details: "Item Details",
      media: "Media",
      media_Type: "Media Type",
      download_URL: "Download URL",
      file_name: "File Name",
      webpage_ROCKWELL: "ROCKWELL Product URL",
    },
  ];
}
