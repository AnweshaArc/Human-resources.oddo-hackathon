async function loadSeedNight() {
  try {
    const res = await fetch('data/sample.json');
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.sleep || !data.manual) return null;
    return {
      date: data.date,
      sleep: data.sleep,
      manual: data.manual,
      isSeed: true, // mark so we know not to try deleting it from localStorage
    };
  } catch (e) {
    return null;
  }
}

function loadLoggedNights() {
  try {
    const parsed = JSON.parse(localStorage.getItem('noctaReports') || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveLoggedNights(nights) {
  localStorage.setItem('noctaReports', JSON.stringify(nights));
}

function isValidNight(night) {
  return (
    night &&
    typeof night.date === 'string' &&
    night.sleep &&
    typeof night.sleep.start === 'string' &&
    typeof night.sleep.end === 'string' &&
    night.manual &&
    night.manual.tiredness !== undefined &&
    night.manual.sleepRating !== undefined &&
    night.manual.fragmentation !== undefined
  );
}

// Unique key used to identify a night for deletion (date + start time is enough here)
function nightKey(night) {
  return `${night.date}__${night.sleep.start}__${night.sleep.end}`;
}

function deleteNight(key) {
  if (!confirm('Delete this sleep log? This cannot be undone.')) return;

  const logged = loadLoggedNights();
  const updated = logged.filter((n) => nightKey(n) !== key);
  saveLoggedNights(updated);

  init(); // re-render everything after deletion
}

function renderList(nights) {
  const listEl = document.getElementById('history-list');
  const emptyEl = document.getElementById('history-empty');

  listEl.innerHTML = '';

  if (nights.length === 0) {
    emptyEl.hidden = false;
    return;
  }

  emptyEl.hidden = true;

  nights.forEach((night) => {
    const card = document.createElement('div');
    card.className = 'history-card';

    const deleteBtnHtml = night.isSeed
      ? '' // don't allow deleting the seed/sample entry
      : `<button class="delete-btn" data-key="${nightKey(night)}" title="Delete this log">✕</button>`;

    card.innerHTML = `
      <div class="h-date">${night.date}<br>${night.sleep.start} – ${night.sleep.end}</div>
      <div class="h-note">${night.manual.note ? night.manual.note : 'No note added.'}</div>
      <div class="h-stats">
        <div class="h-stat"><span class="val">${night.manual.tiredness}</span><span class="lbl">Tired</span></div>
        <div class="h-stat"><span class="val">${night.manual.sleepRating}</span><span class="lbl">Rating</span></div>
        <div class="h-stat"><span class="val">${night.manual.fragmentation}</span><span class="lbl">Fragm.</span></div>
      </div>
      ${deleteBtnHtml}
    `;
    listEl.appendChild(card);
  });

  // Wire up delete buttons
  listEl.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => deleteNight(btn.dataset.key));
  });
}

let ratingChartInstance = null;

function renderChart(nights) {
  const canvas = document.getElementById('ratingChart');
  if (!canvas) return;

  const sorted = [...nights].sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels = sorted.map((n) => n.date);
  const ratings = sorted.map((n) => Number(n.manual.sleepRating));

  if (ratingChartInstance) {
    ratingChartInstance.destroy();
  }

  ratingChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Sleep Rating',
        data: ratings,
        borderColor: '#a6b8ff',
        backgroundColor: 'rgba(166,184,255,0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#a6b8ff',
        pointBorderColor: '#0e1224',
        pointBorderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0e1224',
          titleColor: '#a6b8ff',
          bodyColor: '#e5e9ff',
          borderColor: '#2a2f4c',
          borderWidth: 1,
          padding: 10,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 10,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#8c96b8', font: { family: 'IBM Plex Mono', size: 10 }, stepSize: 2 },
        },
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#8c96b8', font: { family: 'IBM Plex Mono', size: 10 } },
        },
      },
    },
  });
}

async function init() {
  const seed = await loadSeedNight();
  const logged = loadLoggedNights();

  let all = seed ? [seed, ...logged] : logged;
  all = all.filter(isValidNight);

  const sortedForList = [...all].sort((a, b) => new Date(b.date) - new Date(a.date));

  renderList(sortedForList);

  if (all.length > 0) {
    renderChart(all);
  } else {
    document.getElementById('history-empty').hidden = false;
  }
}

init();