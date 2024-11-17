// background.js
// -----------------------------------
// author : Brian Cowell
// email : contact@cunka.com
// July 2024
// v0.0.1

browser.runtime.onMessage.addListener((request) => {
  const { text } = request;
  const { message } = request;

  if (message === "ROCKWELL") {
    let jsonObject = [];
    return fetch(
      `https://api.rockwellautomation.com/ra-papi-gsm-search-vpcprod/api/v2/ux/search?queryText=${text}&role=rockwell-search&spellingCorrect=true&spellcheckPremium=10&segments=Productsv4&startIndex=0&numResults=10&facets=&languages=en&locales=en_GLOBAL,en-US&sort=bma&collections=Literature,Web,Sample_Code&site=RA`,
      {
        credentials: "omit",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/126.0",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.5",
          "Access-Control-Allow-Origin": "true",
          client_id: "fb000cbbe476420b9e70be741abd7a63",
          client_secret: "Db420ae8BAdD47ADA4E12cE90Fb1b747",
          user_email: "search@rockwellautomation.com",
          user_id: "gsKVGXxCuUOSFB5j1ezBaA==",
          correlation_id: "deeb17cf-47b4-3844-f123-30671ff464a3",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
        referrer: "https://www.rockwellautomation.com/",
        method: "GET",
        mode: "cors",
      }
    )
      .then((response1) => response1.json())
      .then((resultJSON) => {
        jsonObject["rockwellTechnicalDescription"] =
          resultJSON.response.docs[0].technicalDescription || "- - -";
        jsonObject["rockwellImage"] = resultJSON.response.docs[0].image;
        jsonObject["rockwellCompatibilityLink"] =
          resultJSON.response.docs[0].compatibilityLink || "- - -";
        jsonObject["rockwellInstallationGuideLink"] =
          resultJSON.response.docs[0].installationGuideLink || "- - -";
        jsonObject["rockwellSpecificationLink"] =
          resultJSON.response.docs[0].specificationLink || "- - -";
        jsonObject["rockwellRepairable"] =
          resultJSON.response.docs[0].repairable || "- - -";
        jsonObject["rockwellManufacturer"] =
          resultJSON.response.docs[0].manufacturer || "- - -";
        jsonObject["rockwellShortDescription"] =
          resultJSON.response.docs[0].shortDescription[0] || "- - -";
        jsonObject["rockwellConfigurationResultPage"] =
          resultJSON.response.docs[0].configurationResultPage || "- - -";
        jsonObject["rockwellLastModifiedDate"] =
          resultJSON.response.docs[0].lastModifiedDate || "- - -";
        jsonObject["rockwellReplacementCategory"] =
          resultJSON.response.docs[0].replacementCategory || "- - -";

        return { catalogNumber: resultJSON.response.docs[0].catalogNumber };
      })
      .then((data1) => {
        return fetch(
          `https://configurator.rockwellautomation.com/api/Product/${data1.catalogNumber}`,
          {
            credentials: "include",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
              Accept: "application/json, text/plain, */*",
              "Accept-Language": "en-US,en;q=0.5",
              "x-pstloc": "USA",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-Fetch-Site": "same-origin",
              Pragma: "no-cache",
              "Cache-Control": "no-cache",
            },
            referrer: `https://configurator.rockwellautomation.com/configurator/${data1.catalogNumber}/details`,
            method: "GET",
            mode: "cors",
          }
        )
          .then((response2) => response2.json())
          .then((resultJSON2) => {
            console.log("resultJSON2", resultJSON2);
            console.log(
              `https://productadvisor-api.rockwellautomation.com/Product/GetDetailedProduct?catalogNumber=${data1}&type=RaiseExactMatchCatalogNumber`
            );

            if (
              resultJSON2.hasOwnProperty("Status") &&
              resultJSON2.Status === "invalid"
            ) {
              console.log("BAD CONFIGURATOR URL");
            }

            let rockwellDocumentsArray = [];
            resultJSON2.summary.AllDocuments.forEach((element) => {
              rockwellDocumentsArray.push({
                docCategory: element.FileType,
                type: element.docClass,
                name: element.name,
                title: element.title,
                format: element.formats[0].format,
                urlLink: element.formats[0].pages[0],
              });
            });
            jsonObject["rockwellLocale"] = resultJSON2.locale;
            jsonObject["rockwellCurrency"] = resultJSON2.currency;
            jsonObject.rockwellCatNumber = jsonObject["rockwellCatNumber"] =
              resultJSON2.summary.Product;
            jsonObject["rockwellProductName"] = resultJSON2.summary.ProductName;
            jsonObject["rockwellDescription"] = resultJSON2.summary.Description;
            jsonObject["rockwellLifeCycle"] =
              resultJSON2.summary.ProdLifeCycleStatus;
            jsonObject["rockwellDocuments"] = rockwellDocumentsArray;
            jsonObject["rockwellDocuments2"] = resultJSON2.summary.Documents;
            jsonObject["rockwellAccessories"] = resultJSON2.summary.Accessories;
            jsonObject["rockwellGroupMarker"] = resultJSON2.summary.GroupMarker;
            jsonObject["rockwellIsPreferred"] = resultJSON2.summary.IsPreferred;
            jsonObject["rockwellListPrice"] = resultJSON2.summary.ListPrice;
            jsonObject["rockwellListPriceFormatted"] =
              resultJSON2.summary.ListPriceFormatted;
            jsonObject["rockwellDetails"] = resultJSON2.summary.Details;
            jsonObject["rockwellRepPhoto"] = resultJSON2.summary.RepPhoto;
            jsonObject["rockwellProductType"] = resultJSON2.summary.ProductType;
            jsonObject["rockwellPublishedLeadTime"] =
              resultJSON2.summary.PublishedLeadTime;
            jsonObject["rockwellPreferredRegions"] =
              resultJSON2.summary.PreferredRegions;
            jsonObject["rockwellQty"] = resultJSON2.summary.Qty;
            jsonObject["rockwellUPC"] = resultJSON2.summary.UPC;
            jsonObject["rockwellUPC12Digit"] = resultJSON2.summary.UPC12Digit;
            jsonObject["rockwellPGC"] = resultJSON2.summary.PGC;
            jsonObject["rockwellDS"] = resultJSON2.summary.DS;
            jsonObject["rockwellListPrice"] =
              resultJSON2.summary.ListPriceFormatted;
            jsonObject["rockwellStockStatusSummary"] =
              resultJSON2.summary.StockStatusSummary;
            return jsonObject;
          })
          .then((jsobj) => {
            return { search: jsobj, message: "ROCKWELL-SUCCESS" };
          });
      })
      .catch((error) => {
        console.error(error);
        return { search: "", message: "ROCKWELL-FAIL" };
      });
  }
});
