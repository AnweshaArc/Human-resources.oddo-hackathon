// ==========================
// Sleep & Wellness Dashboard Simulator
// Updates every 5 seconds
// ==========================

// Generate random decimal
function random(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
}

// Generate random integer
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================
// Animate a number smoothly from its current value to a new value
// ============================
function animateValue(elementId, newValue, suffix = "", duration = 1000) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const decimals = (newValue.toString().split(".")[1] || "").length;

    const currentText = el.textContent.replace(/[^0-9.\-]/g, "");
    const startValue = parseFloat(currentText) || 0;
    const endValue = parseFloat(newValue);

    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        const current = startValue + (endValue - startValue) * eased;

        el.textContent = current.toFixed(decimals) + suffix;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = endValue.toFixed(decimals) + suffix;
        }
    }

    requestAnimationFrame(step);
}

// ============================
// Animate the two dots along the night arc
// based on how many hours were slept.
// ============================
function updateNightArc(sleepHours) {
    const path = document.querySelector('#night-arc path');
    if (!path) return;

    const totalLength = path.getTotalLength();

    const minHours = 4;
    const maxHours = 10;
    const clamped = Math.min(Math.max(parseFloat(sleepHours), minHours), maxHours);
    const ratio = (clamped - minHours) / (maxHours - minHours); // 0 to 1

    const startPoint = path.getPointAtLength(totalLength * 0.03);
    const targetLength = totalLength * (0.1 + ratio * 0.87);

    const bedtimeDot = document.querySelectorAll('#night-arc circle')[0];
    const wakeDot = document.querySelectorAll('#night-arc circle')[1];

    if (!bedtimeDot || !wakeDot) return;

    // Bedtime dot sits at a fixed early point on the arc
    bedtimeDot.setAttribute('cx', startPoint.x);
    bedtimeDot.setAttribute('cy', startPoint.y);

    // Animate wake dot smoothly to its new position along the arc
    const startLen = parseFloat(wakeDot.dataset.currentLength || totalLength * 0.97);
    const duration = 1000;
    const startTime = performance.now();

    function step(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        const currentLen = startLen + (targetLength - startLen) * eased;
        const point = path.getPointAtLength(currentLen);

        wakeDot.setAttribute('cx', point.x);
        wakeDot.setAttribute('cy', point.y);

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            wakeDot.dataset.currentLength = targetLength;
        }
    }

    requestAnimationFrame(step);
}

function updateDashboard() {

    // Date
    const today = new Date();
    document.getElementById("report-date").textContent =
        today.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    // Sleep values
    const sleepHours = random(6, 9);
    const avgTemp = random(22, 28);
    const avgHumidity = random(45, 70);

    const maxTemp = random(25, 30);
    const minTemp = random(18, 22);

    const maxHumidity = random(55, 80);
    const minHumidity = random(35, 50);

    const tiredness = randomInt(2, 8);
    const rating = randomInt(7, 10);
    const fragmentation = randomInt(0, 3);

    const bedtime = "11:00 PM";
    const waketime = "7:00 AM";

    // Move the arc dots based on sleep hours
    updateNightArc(sleepHours);

    // Hero Section (animated)
    animateValue("sleep-duration", sleepHours, " hrs");
    animateValue("avg-temp", avgTemp, "°C");
    animateValue("avg-humidity", avgHumidity, "%");

    document.getElementById("arc-start-label").textContent = bedtime;
    document.getElementById("arc-end-label").textContent = waketime;

    animateValue("tiredness-val", tiredness);
    animateValue("rating-val", rating);
    animateValue("fragmentation-val", fragmentation);

    // Temperature Card (animated)
    animateValue("temp-max", maxTemp, "°C");
    animateValue("temp-min", minTemp, "°C");
    animateValue("temp-avg-card", avgTemp, "°C avg");

    // Humidity Card (animated)
    animateValue("humidity-max", maxHumidity, "%");
    animateValue("humidity-min", minHumidity, "%");
    animateValue("humidity-avg-card", avgHumidity, "% avg");

    // Sleep Window
    document.getElementById("sleep-window").textContent =
        bedtime + " - " + waketime;

    animateValue("sleep-duration-card", sleepHours, " hours asleep");

    // Notes
    const notes = [
        "Slept peacefully throughout the night.",
        "Room conditions were comfortable.",
        "Minor wake-up around 3 AM.",
        "Excellent recovery sleep.",
        "Humidity remained stable overnight.",
        "Temperature stayed cool all night."
    ];

    document.getElementById("note-text").textContent =
        notes[randomInt(0, notes.length - 1)];
}

// ============================
// Show zeros initially
// ============================

document.getElementById("report-date").textContent = "Today";

document.getElementById("sleep-duration").textContent = "0 hrs";
document.getElementById("avg-temp").textContent = "0°C";
document.getElementById("avg-humidity").textContent = "0%";

document.getElementById("arc-start-label").textContent = "0";
document.getElementById("arc-end-label").textContent = "0";

document.getElementById("tiredness-val").textContent = "0";
document.getElementById("rating-val").textContent = "0";
document.getElementById("fragmentation-val").textContent = "0";

document.getElementById("temp-max").textContent = "0°C";
document.getElementById("temp-min").textContent = "0°C";
document.getElementById("temp-avg-card").textContent = "0°C avg";

document.getElementById("humidity-max").textContent = "0%";
document.getElementById("humidity-min").textContent = "0%";
document.getElementById("humidity-avg-card").textContent = "0% avg";

document.getElementById("sleep-window").textContent = "0";
document.getElementById("sleep-duration-card").textContent = "0 hrs";

document.getElementById("note-text").textContent = "Waiting for sensor data...";

// Wait 5 seconds before first update
setTimeout(() => {

    updateDashboard();

    // Continue updating every 5 seconds
    setInterval(updateDashboard, 5000);

}, 5000);