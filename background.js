chrome.storage.local.get('enabled', (result) => {
    console.log("Enabled from storage:", result.enabled);
    const enabled = result.enabled || false;
    if (enabled) {
        enableRules();
    } else {
        disableRules();
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggle') {
        chrome.storage.local.get('enabled', (result) => {
            const enabled = !result.enabled;
            chrome.storage.local.set({ enabled: enabled }, () => {
                if (enabled) {
                    enableRules();
                } else {
                    disableRules();
                }
                sendResponse({ enabled: enabled });
            });
        });
        return true; // Keep the message channel open for sendResponse
    }
});

function enableRules() {
    console.log("Enabling rules...");
    chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ['ruleset_1']
    }, () => {
        if (chrome.runtime.lastError) {
            console.error('Error enabling rules:', chrome.runtime.lastError);
        } else {
            console.log('Rules enabled successfully');
            // Immediately check which rules are matched
            checkMatchedRules();
        }
    });
}

function disableRules() {
    console.log("Disabling rules...");
    chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ['ruleset_1']
    }, () => {
        if (chrome.runtime.lastError) {
            console.error('Error disabling rules:', chrome.runtime.lastError);
        } else {
            console.log('Rules disabled successfully');
        }
    });
}

function checkMatchedRules() {
    chrome.declarativeNetRequest.getMatchedRules({}, (result) => {
        if (chrome.runtime.lastError) {
            console.error('Error fetching matched rules:', chrome.runtime.lastError);
        } else {
            console.log('Matched Rules:', result.rulesMatchedInfo);
        }
    });
}