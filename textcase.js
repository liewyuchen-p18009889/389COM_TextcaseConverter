["sentence", "uppercase", "lowercase", "capitalize", "togglecase", "spaces"].forEach(
    function (e) {
      browser.contextMenus.create({
        title: chrome.i18n.getMessage(e),
        id: e,
        contexts: ["editable"],
      });
    }
  );
  
  browser.contextMenus.onClicked.addListener(function (info, tab) {
    var words;
    var text = info.selectionText || "";
  
    // console.log(text, info);
    switch (info.menuItemId) {
      case "sentence":
        text = text.toLowerCase();
        text = text.charAt(0).toUpperCase() + text.slice(1);
        break;

      case "uppercase":
        text = text.toUpperCase();
        break;
  
      case "lowercase":
        text = text.toLowerCase();
        break;

      case "capitalize":
        words = text.split(/(\s+)/).map(function (word) {
          first = word.search(/[a-zA-Z]/);
          return first < 2 && isNaN(word.charAt(0))
            ? word.slice(0, first) +
                word.charAt(first).toUpperCase() +
                word.slice(first + 1).toLowerCase()
            : word.toLowerCase();
        });
        text = words.join("");
        break;   

      case "togglecase":
        words = text.split("").map(function (char) {
          return char === char.toUpperCase()
            ? char.toLowerCase()
            : char.toUpperCase();
        });
        text = words.join("");
        break;
      
        case "spaces":
        text = text.replace(/  +/g, " ");
        break;
    }
  
    // escape `
    text = text.replace(/`/g, "\\`");
  
    // code for input and textarea elements
    var code_1 =
      "el.value=el.value.substring(0,el.selectionStart)+`" +
      text +
      "`+el.value.substring(el.selectionEnd)";
  
    // code_1 = "el.value='sdf sf' ";
    // code for visual editors like tinyMCE
    var code_2 = "document.execCommand('insertText',false,`" + text + "`)";
  
    // code + test
    var code =
      "el=document.activeElement;((el.value) ? " + code_1 + ":" + code_2 + ");";
  
    // console.log(code);
    chrome.tabs.executeScript(null, { frameId: info.frameId, code: code });
  });