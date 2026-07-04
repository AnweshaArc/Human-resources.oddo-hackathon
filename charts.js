async function loadChartData() {
  const res = await fetch('data/sample.json');
  return res.json();
}

function baseChartOptions(unit) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}${unit}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#8c96b8', font: { family: 'IBM Plex Mono', size: 10 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#8c96b8', font: { family: 'IBM Plex Mono', size: 10 } },
      },
    },
  };
}

loadChartData().then((data) => {
  const labels = data.hourly.map((h) => h.time);

  new Chart(document.getElementById('tempChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: data.hourly.map((h) => h.temperature),
        borderColor: '#eda15f',
        backgroundColor: 'rgba(237,161,95,0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#eda15f',
      }],
    },
    options: baseChartOptions('°C'),
  });

  new Chart(document.getElementById('humidityChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: data.hourly.map((h) => h.humidity),
        borderColor: '#63d1c6',
        backgroundColor: 'rgba(99,209,198,0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#63d1c6',
      }],
    },
    options: baseChartOptions('%'),
  });
});