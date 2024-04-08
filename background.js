console.log("Background script is running");
const apiKey = "b3c48151024b410484defeb68850b8968bc31c161f729cbce55a3d2bbdd673c2";
const virustotalEndpoint = 'https://www.virustotal.com/api/v3/urls';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "checkUrl") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTab = tabs[0];
            if (activeTab) {
                const currentUrl = activeTab.url;
                if (currentUrl.substring(0, 6) === "chrome"){
                    chrome.tabs.sendMessage(activeTab.id, { action: "urlChecked", result: "Chrome URL, do not test" });
                }else{const options = {
                    method: 'POST',
                    headers: {
                      accept: 'application/json',
                      'x-apikey': apiKey,
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({url: currentUrl})
                };
                console.log("Checking URL on Virustotal:", currentUrl);
                // First API call to get the id
                fetch(virustotalEndpoint, options)
                    .then(response => response.json())
                    .then(data => {
                        // Extract id from the response
                        const id = data.data.id;

                        // Check analysis status in a loop
                        checkAnalysisStatus(id, activeTab.id);
                    })
                    .catch(error => {
                        console.error("Error in the first API call:", error);

                        // Send an error response back to the content script
                        chrome.tabs.sendMessage(activeTab.id, { action: "urlChecked", result: "error" });
                    });}

                
            } else {
                console.error("Unable to retrieve active tab information.");
            }
        });
    }
});

// Function to check analysis status
function checkAnalysisStatus(id, tabId) {
    const secondEndpoint = `https://www.virustotal.com/api/v3/analyses/${id}`;
    const secondOptions = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-apikey': apiKey
        }
    };

    // Recursive function to check status periodically
    function poll() {
        fetch(secondEndpoint, secondOptions)
            .then(response => response.json())
            .then(response => {

                // Check if the response contains the expected 'attributes' property
                const status = response.data.attributes.status;

                if (status === "completed") {
                    const stats = response.data.attributes.stats;
                    const result = Object.keys(stats).reduce((maxCategory, category) => {
                        return stats[category] > stats[maxCategory] ? category : maxCategory;
                    });
                    // Analysis is complete, handle the final results
                    console.log("Final Analysis Results:", response);
                    chrome.tabs.sendMessage(tabId, { action: "urlChecked", result: result });
                } else if (status === "queued") {
                    // Analysis is still in progress, continue polling
                    setTimeout(poll, 1000); // Poll every second (adjust as needed)
                } else {
                    // Handle other statuses or errors
                    console.error("Unexpected Analysis Status:", status);
                    chrome.tabs.sendMessage(tabId, { action: "urlChecked", result: "error" });
                }
            })
            .catch(error => {
                console.error("Error in the second API call:", error);

                // Send an error response back to the content script
                chrome.tabs.sendMessage(tabId, { action: "urlChecked", result: "error" });
            });
    }

    // Start the initial polling
    poll();
}
