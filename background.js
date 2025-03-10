// background.js
// -----------------------------------
// author : Brian Cowell
// email : contact@cunka.com
// July 2024, March 2025
// v2.0

browser.runtime.onMessage.addListener((request) => {
  const { text } = request;
  const { message } = request;

  if (message === "PRODUCT-PAGE-ROCKWELL2025") {
    return fetch(
      `https://www.rockwellautomation.com/en-us/products/details.${text}.html`,
      { cache: "no-store" }
    )
      .then((response) => response.text())
      .then((html) => {
        return { html: html, message: message };
      })
      .catch((error) => {
        console.log(`${text} ROCKWELL PRODUCT PAGE ERROR`);
        console.error(error);
        return { html: "USA", message: "NETWORK ERROR" };
      });
  }

  if (message === "ROCKWELL2025") {
    let jsonObject2025 = [];
    return fetch(
      `https://api.rockwellautomation.com/ra-papi-gsm-search-vpcprod/api/v1/holistic-search?query=${text}&from=0&size=3&locale=en-US`,
      {
        credentials: "omit",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/json",
          client_id: "fb000cbbe476420b9e70be741abd7a63",
          client_secret: "Db420ae8BAdD47ADA4E12cE90Fb1b747",
          correlation_id: "prod_ra_com_header",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          "Sec-GPC": "1",
          Priority: "u=4",
        },
        referrer: "https://www.rockwellautomation.com/",
        method: "GET",
        mode: "cors",
      }
    )
      .then((responseX) => responseX.json())
      .then((resultJSONX) => {
        console.log(
          `%cROCKWELL 2025 JSON ${text}`,
          "color:purple;font-size:14px"
        );
        const PRODUCTS = resultJSONX.find((item) => item.tab === "products");
        const PROD = PRODUCTS.docs.find(
          (item) =>
            item.catalogNumber || item.catalogNumber.replace(/-/g, "") === text
        );
        console.log(resultJSONX);
        console.log(PRODUCTS);
        console.log(PROD);
        console.log("-------------------------------------------------------");
        if (PROD == undefined) {
          return { search: text, message: "ROCKWELL2025-FAIL" };
        }
        return { search: PROD, message: "ROCKWELL2025-SUCCESS" };
      })
      .catch((error) => {
        console.error(error);
        return { search: "", message: "ROCKWELL2025-FAIL" };
      });
  }
});
