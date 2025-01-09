// ==UserScript==
// @name         TapSwap
// @namespace    https://t.me/Imebrahim
// @version      3.1
// @description  TapSwap Auto Complete Cinema Tasks
// @author       Imebrahim
// @match        https://app.tapswap.club/*
// @icon         https://www.softportal.com/en/scr/1089/icons/icon_src.png
// @grant        GM_webRequest
// @downloadURL  https://github.com/Imebrahimmz/TapSwap-Automation/blob/main/Rtampermonkey.js
// @updateURL    https://github.com/Imebrahimmz/TapSwap-Automation/blob/main/Rtampermonkey.js
// @homepage     https://github.com/Imebrahimmz/TapSwap-Automation/
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

(function () {
  function onready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  onready(function () {
    const styles = {
      success: 'background: #28a745; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      starting: 'background: #8640ff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      error: 'background: #dc3545; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      info: 'background: #007bff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
    };
    const logPrefix = '%c[TapSwapBot] ';
    const originalLog = console.log;
    console.log = function () {
      if (typeof arguments[0] === 'string' && arguments[0].includes('[TapSwapBot]')) {
        originalLog.apply(console, arguments);
      }
    };
    console.error = console.warn = console.info = console.debug = () => { };

    let listnumber = 0;
    let listcount = 0;
    const $ = window.jQuery;
    const fullurl = window.location.hash;
    const username = fullurl.split("%2522%252C%2522language_code")[0].split("username%2522%253A%2522")[1];
    const tapname = fullurl.split("%2522%252C%2522last_name")[0].split("first_name%2522%253A%2522")[1];
    const tapfamily = fullurl.split("%2522%252C%2522username")[0].split("last_name%2522%253A%2522")[1];

    const buttonn = document.createElement("a");
    buttonn.style.cssText = "background-color: #007bff; color: white; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 12px; position: absolute; top: 10px; right: 10px; z-index: 99999;";
    buttonn.id = "hamedap";
    buttonn.innerHTML = "**IMEBRAHIM**";
    buttonn.href = "https://t.me/Imebrahim";
    buttonn.target = "_blank";
    document.body.appendChild(buttonn);

    const backbutton = document.createElement("Button");
    backbutton.style.cssText = "display:none; background-color: blue; bottom: 0px; right: 0px; position: absolute; z-index: 99999; padding: 3px 2px;";
    backbutton.id = "hamedss";
    backbutton.innerHTML = "Back";
    document.body.appendChild(backbutton);

    backbutton.addEventListener("click", async () => {
      try {
        const accountButton = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Account"));
        if (accountButton) accountButton.click();
      } catch (err) {
        console.error(err.name, err.message);
      }
    });

    const skippedTasks = new Set();

    function levenshtein(a, b) {
      const an = a ? a.length : 0;
      const bn = b ? b.length : 0;
      if (an === 0) return bn;
      if (bn === 0) return an;

      const matrix = [];

      for (let i = 0; i <= bn; i++) {
        matrix[i] = [i];
      }

      for (let j = 0; j <= an; j++) {
        matrix[0][j] = j;
      }

      for (let i = 1; i <= bn; i++) {
        for (let j = 1; j <= an; j++) {
          const cost = (b[i - 1] === a[j - 1]) ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + cost
          );
        }
      }

      return matrix[bn][an];
    }

    function getRandomDelay() {
      return Math.floor(Math.random() * 3000) + 1000; // Random delay between 1000ms and 4000ms
    }

    function getanswer(soal = "") {
      if (skippedTasks.has(soal)) {
        console.log("Shahan Answer : --- Skipped ---");
        backbutton.click();
        return;
      }

      let storedText = "";
      let answers = "NotFound";
      soal = soal.replace("+", "").replace("`", "");
      console.log("Shahan Question : ---" + soal + "---");

      fetch("https://raw.githubusercontent.com/Imebrahimmz/TapSwap-Automation/refs/heads/main/list.json")
        .then(response => response.text())
        .then(text => {
          storedText = text;
          done();
        })
        .catch(err => console.error("Fetch error:", err));

      function done() {
        if (storedText) {
          const bigObj = JSON.parse(storedText);
          let closestKey = soal;
          let minDistance = Infinity;

          for (const key in bigObj) {
            const distance = levenshtein(soal, key);
            if (distance < minDistance) {
              minDistance = distance;
              closestKey = key;
            }
          }

          if (minDistance > 3) { // Adjust the threshold as needed
            skippedTasks.add(soal);
            console.log("Shahan Answer : --- Skipped ---");
            backbutton.click();
            return;
          }

          storedText = bigObj[closestKey] || "";

          const input = document.evaluate(
            "/html/body/div/div[1]/div[2]/div[3]/div[2]/div/div[3]/div/div/input",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (input) {
            input.value = storedText;
            const inputEvent = new Event("input", { bubbles: true });
            input.dispatchEvent(inputEvent);

            const submitButton = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Submit"));
            if (submitButton) {
              setTimeout(() => submitButton.click(), getRandomDelay());
              setTimeout(() => submitButton.click(), getRandomDelay() + 1000);
            }
          }
          answers = storedText;
        } else {
          answers = "";
        }
        console.log("Shahan Answer : ---" + answers + "---");
        setTimeout(() => {
          const input = document.querySelector('input[type="string"]');
          if (input) input.focus();
        }, 1000);
      }
    }

    setInterval(() => {
      const closeElements = document.querySelectorAll('img[alt="close"], button');
      closeElements.forEach(el => {
        if (el.textContent.includes("Get it!") || el.textContent.includes("Task") || el.textContent.includes("Reload")) {
          el.click();
        }
      });
    }, 2000);

    setInterval(() => {
      const gomission = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Go"));
      const submitt = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Submit"));
      const watchclick = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Watch"));
      const finishmission = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Finish mission"));
      const check = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Check"));
      const claimm = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Claim"));
      const startmission = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Start mission"));
      const perror = Array.from(document.querySelectorAll("p")).find((el) => el.textContent.includes("Looks like you"));
      const wronganswer = Array.from(document.querySelectorAll("h5")).find((el) => el.textContent.includes("answer"));
      const tasklistcinema = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Cinema"));
      const tasklistspecial = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Special"));
      const tasklistleagues = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Leagues"));
      const tasklistref = Array.from(document.querySelectorAll("button")).find((el) => el.textContent.includes("Ref"));
      const watchlink = document.querySelectorAll('a[class^="_link_"]').length;

      if (perror && submitt) {
        submitt.click();
        backbutton.click();
      }
      if (wronganswer && submitt) {
        setTimeout(() => backbutton.click(), 5000);
      }
      if (perror && check) {
        check.click();
        backbutton.click();
      }
      if (gomission) gomission.click();
      if (watchlink == 1) {
        const link = document.querySelectorAll('a[class^="_link_"]')[0];
        link.removeAttribute("target");
        link.removeAttribute("href");
      }
      if (tasklistcinema && tasklistspecial && tasklistleagues && tasklistref && !startmission && !watchclick && !finishmission) {
        listcount = document.querySelectorAll('button[class^="_listItem_"]').length;
        if (listnumber >= listcount) listnumber = 0;
        if (listcount != 0) {
          const acc = listnumber + 1;
          console.log(`${logPrefix}Action : ` + acc + `/` + listcount, styles.info);
        }
        const list1 = document.querySelectorAll('button[class^="_listItem_"]')[listnumber];
        if (list1) {
          list1.click();
          listnumber++;
        }
      }
      if (startmission) startmission.click();
      if (watchclick && finishmission && !check && !submitt) watchclick.click();
      if (watchclick && finishmission && !check && submitt && !perror) {
        const firstitem = document.querySelectorAll("h3")[0].innerHTML;
        getanswer(firstitem);
      }
      if (check) check.click();
      if (finishmission) finishmission.click();
      if (claimm) {
        claimm.click();
        setTimeout(() => backbutton.click(), 2000);
      }
    }, 1000);
  });
})();
