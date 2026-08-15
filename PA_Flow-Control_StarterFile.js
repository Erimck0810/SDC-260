/*
        Author: Eric Mckinzy   
        Date: August 14, 2024
        Purpose: Discover trails based on your hiking level and park needs.
*/

/* =========================================
   GREENWAY PARK TRAIL DATA
========================================= */

const trails = [
    { name: "River Walk", difficulty: "low", time: 20 },
    { name: "Forest Loop", difficulty: "medium", time: 45 },
    { name: "Hill Summit Trail", difficulty: "high", time: 90 },
    { name: "Lake Side Path", difficulty: "low", time: 30 },
    { name: "Rock Ridge Trail", difficulty: "high", time: 75 },
    // --- Three Additional Trails ---
    { name: "Pine Valley Outlook", difficulty: "medium", time: 60 },
    { name: "erimck0810", difficulty: "high", time: 100 }, // Replace 12345678 with your actual Student ID
    { name: "Meadow Creek Crossing", difficulty: "low", time: 25 }
];

/* =========================================
   DISPLAY TRAILS VIA LOOP
========================================= */

function displayTrails() {
    const trailContainer = document.getElementById("trailContainer");
    let cardsHTML = "";

    for (let i = 0; i < trails.length; i++) {
        cardsHTML += `
<article class="card">
    <h3>${trails[i].name}</h3>
    <p>Difficulty: ${trails[i].difficulty}</p>
    <p>Average Time: ${trails[i].time} mins</p>
</article>`;
    }

    trailContainer.innerHTML = cardsHTML;
}

/* =========================================
   FORM LOGIC
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Render trail cards on page load
    displayTrails();

    const trailForm = document.getElementById("trailForm");
    const resultAside = document.getElementById("result");

    trailForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form from refreshing the page

        // Extract selected input values
        const hasPets = document.querySelector('input[name="hasPets"]:checked').value;
        const experience = document.getElementById("experience").value;

        let recommendedTrail = "";

        // Flow control guidelines
        if (hasPets === "yes" && experience === "low") {
            recommendedTrail = "River Walk";
        } 
        else if (hasPets === "yes" && (experience === "medium" || experience === "high")) {
            recommendedTrail = "Forest Loop";
        } 
        else if (hasPets === "no" && experience === "low") {
            recommendedTrail = "Lake Side Path";
        } 
        else if (hasPets === "no" && experience === "medium") {
            recommendedTrail = "Forest Loop";
        } 
        else if (hasPets === "no" && experience === "high") {
            recommendedTrail = "Rock Ridge Trail";
        } 
        else {
            recommendedTrail = "River Walk"; // Default fallback
        }

        // Output recommendation to the <aside id="result"> element
        resultAside.innerHTML = `<h3>Recommended Trail: ${recommendedTrail}</h3>`;
    });
});