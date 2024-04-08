chrome.runtime.sendMessage({ action: "checkUrl" });
//Apply a filter on the url to see if on a string level if the URL is suspected as malicious.
let currentUrl = window.location.href;
let urlObject = new URL(currentUrl);
let domainName = urlObject.hostname;
let https = "https";
const iPpattern = /^[0-9.]+$/;
const domainPattern = /^[0-9a-zA-Z.]+$/

if(currentUrl.startsWith("chrome")){
    //Prevents the clicking on the extension icon from popping the no https alert.
}
//Test if there is no https in the beggining
else if(!currentUrl.startsWith(https)){
    let result = confirm("This website is not protected by the HTTPS security protocols.\nClick OK for further inspection or Cancel to continue on");
    if(result){
        handleMessage();
    }
}
//Test if the URL is only an IP address
else if(iPpattern.test(domainName)){
    let result = confirm("The URL does not give textual info regarding the identity of the domain.\nClick OK for further inspection or Cancel to continue on");
    if(result){
        handleMessage();
    }
//Test is the domain name contains Hyphens or Symbols
}else if(!(domainPattern.test(domainName))){
    let result = confirm("The domain name contains Hypens or Symbols which is common in malicious websites.\nClick OK for further inspection or Cancel to continue on");
    if(result){
        handleMessage();
    }
} else{
  handleMessage();
}

function handleMessage() {
  chrome.runtime.onMessage.addListener(function (response) {
    if (response.action === "urlChecked") {
        console.log("Received response from background script:", response.result);
        alert("This website has been inspected and was found "+ response.result);
    }
    else {
        handleMessage();
    }
});
}





