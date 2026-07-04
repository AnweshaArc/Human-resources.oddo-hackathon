// ===== Summary Card Values =====
const summary = {
  "7d": { quality: 8.6, duration: "7.8h", nights: 7, temp: "23°C" },
  "30d": { quality: 8.2, duration: "7.5h", nights: 30, temp: "24°C" },
  "all": { quality: 8.0, duration: "7.3h", nights: 96, temp: "24°C" }
};

const datasets = {
  "7d": {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    quality: [8.1,8.3,8.6,8.0,8.9,8.7,9.1],
    duration: [7.1,7.3,7.5,7.2,8.0,7.8,8.1],
    environment: [92,74,58,40],
    scatter: [
      {x:20,y:8.2},
      {x:21,y:8.6},
      {x:22,y:8.9},
      {x:23,y:8.4},
      {x:24,y:9.1}
    ]
  },

  "30d": {
    labels: ["W1","W2","W3","W4"],
    quality: [7.8,8.4,8.1,8.7],
    duration: [7.0,7.5,7.2,7.8],
    environment: [86,70,60,45],
    scatter: [
      {x:19,y:7.8},
      {x:20,y:8.0},
      {x:21,y:8.4},
      {x:22,y:8.6},
      {x:23,y:8.9},
      {x:24,y:8.5}
    ]
  },

  "all": {
    labels: ["Jan","Feb","Mar","Apr","May","Jun"],
    quality: [7.2,7.5,7.8,8.0,8.3,8.5],
    duration: [6.8,7.0,7.1,7.3,7.5,7.6],
    environment: [82,68,54,42],
    scatter: [
      {x:18,y:7.0},
      {x:19,y:7.3},
      {x:20,y:7.8},
      {x:21,y:8.0},
      {x:22,y:8.3},
      {x:23,y:8.5},
      {x:24,y:8.7}
    ]
  }
};

// ===== Summary Cards =====
function updateCards(mode) {
  document.getElementById("avgQuality").textContent = summary[mode].quality;
  document.getElementById("avgDuration").textContent = summary[mode].duration;
  document.getElementById("totalNights").textContent = summary[mode].nights;
  document.getElementById("avgTemp").textContent = summary[mode].temp;
}

// ===== Charts =====
const qualityChart = new Chart(document.getElementById("qualityChart"), {
  type: "line",
  data: {
    labels: datasets["30d"].labels,
    datasets: [
      {
        label: "Sleep Quality",
        data: datasets["30d"].quality,
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139,92,246,.15)",
        fill: true,
        tension: .4
      },
      {
        label: "Sleep Duration",
        data: datasets["30d"].duration,
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34,211,238,.15)",
        fill: true,
        tension: .4
      }
    ]
  }
});

const environmentChart = new Chart(document.getElementById("environmentChart"), {
  type: "bar",
  data: {
    labels: ["Temperature","Humidity","Noise","Light"],
    datasets: [{
      data: datasets["30d"].environment,
      backgroundColor: ["#8B5CF6","#3B82F6","#14B8A6","#F59E0B"]
    }]
  }
});

const scatterChart = new Chart(document.getElementById("scatterChart"), {
  type: "scatter",
  data: {
    datasets: [{
      label: "Sleep",
      data: datasets["30d"].scatter,
      backgroundColor: "#14B8A6",
      pointRadius: 6
    }]
  }
});

// ===== Change Data =====
function loadData(mode) {
  updateCards(mode);

  qualityChart.data.labels = datasets[mode].labels;
  qualityChart.data.datasets[0].data = datasets[mode].quality;
  qualityChart.data.datasets[1].data = datasets[mode].duration;
  qualityChart.update();

  environmentChart.data.datasets[0].data = datasets[mode].environment;
  environmentChart.update();

  scatterChart.data.datasets[0].data = datasets[mode].scatter;
  scatterChart.update();
}

// ===== Buttons =====
const buttons = document.querySelectorAll(".filter-btn");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {

    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const text = btn.textContent.trim().toLowerCase();

    if (text === "7d") loadData("7d");
    if (text === "30d") loadData("30d");
    if (text === "all") loadData("all");

  });
});

// Default
loadData("30d");