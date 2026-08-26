/*
        Author: Eric Mckinzy 
        Date: August 25 2026
        Purpose: Development Environment Configuration
*/

/* =========================================
     COOKIE FUNCTIONS
========================================= */

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
    const cookieName = name + "=";
    const cookieArray = document.cookie.split(";");

    for (let cookie of cookieArray) {
        cookie = cookie.trim();

        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length);
        }
    }
    return "";
}

/* =========================================
     LIVE SERVER DETECTION
========================================= */

const isLiveServer = location.hostname === "localhost" || location.hostname === "127.0.0.1";

/* =========================================
     ELEMENT REFERENCES
========================================= */

const heroTitle = document.getElementById("heroTitle");
const heroText = document.getElementById("heroText");

const connectionStatus = document.getElementById("connectionStatus");
const lastOnline = document.getElementById("lastOnline");

const refreshButton = document.getElementById("refreshButton");
const hostInfo = document.getElementById("hostInfo");
const portInfo = document.getElementById("portInfo");
const protocolInfo = document.getElementById("protocolInfo");

/* =========================================
     DISPLAY LAST ONLINE
========================================= */

const previousVisit = getCookie("lastOnline");

if (previousVisit) {
    lastOnline.textContent = previousVisit;
}

/* =========================================
     LIVE SERVER DETAILS
========================================= */

hostInfo.textContent = `PRIMARY COMMAND NODE: ${window.location.hostname}`;

if (window.location.port) {
    portInfo.textContent = `ACCESS GATEWAY: Port ${window.location.port}`;

} else {
    portInfo.textContent = "ACCESS GATEWAY: Default Port";
}

protocolInfo.textContent = `TRANSMISSION PROTOCOL: ${window.location.protocol.replace(":", "").toUpperCase()}`;

/* =========================================
     REFRESH BUTTON
========================================= */

refreshButton.addEventListener("click", function () {
    location.reload();
});

/* =========================================
     ACTIVATE LIVE MODE
========================================= */

if (isLiveServer) {
    document.body.classList.add("live-mode");

    heroTitle.textContent = "NETWORK CONNECTION ESTABLISHED";
    
    heroText.innerHTML = `
        ACCESSING GLOBAL NODES...<br>
        ENCRYPTION BYPASSED...<br>
        GHOST PROTOCOL ACTIVE...<br>
        FIREWALL STATUS: COMPROMISED...<br>
        SATELLITE RELAY SYNCHRONIZED...<br><br>
        WELCOME OPERATIVE
    `;

    connectionStatus.textContent = "NETWORK ACTIVE";

    const now = new Date().toLocaleString();
    setCookie("lastOnline", now, 30);
    lastOnline.textContent = now;

} else {
    heroTitle.textContent = "SYSTEM OFFLINE";
    heroText.innerHTML = `Awaiting Network Access...<br>`;
    connectionStatus.textContent = "OFFLINE";
}