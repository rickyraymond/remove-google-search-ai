//popup.js
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('toggle');
    const donateButton = document.getElementById('donate');

    chrome.storage.local.get('enabled', function (result) {
        toggle.checked = result.enabled || false;
    });

    toggle.addEventListener('change', function () {
        chrome.runtime.sendMessage({ action: 'toggle' }, function (response) {
            toggle.checked = response.enabled;
        });
    });
});
