function pad(n) { return n.toString().padStart(2, '0'); }

function autoFillDateTime() {
  const now = new Date();
  document.getElementById('sleep-date').value =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  document.getElementById('log-time').value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function wireSlider(inputId, readoutId) {
  const input = document.getElementById(inputId);
  const readout = document.getElementById(readoutId);
  const update = () => { readout.textContent = `${input.value} / 10`; };
  input.addEventListener('input', update);
  update();
}

function minutesBetween(start, end) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60;
  return mins;
}

function durationLabel(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function saveReport(report) {
  const existing = JSON.parse(localStorage.getItem('noctaReports') || '[]');
  existing.unshift(report);
  localStorage.setItem('noctaReports', JSON.stringify(existing));
}

document.addEventListener('DOMContentLoaded', () => {
  autoFillDateTime();
  wireSlider('fragmentation', 'fragmentation-readout');
  wireSlider('tiredness', 'tiredness-readout');
  wireSlider('sleep-rating', 'rating-readout');

  document.getElementById('sleep-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const start = document.getElementById('sleep-start').value;
    const end = document.getElementById('sleep-end').value;

    if (!start || !end) {
      document.getElementById('form-status').textContent = 'Please fill in bedtime and wake time.';
      return;
    }

    const mins = minutesBetween(start, end);

    const report = {
      date: document.getElementById('sleep-date').value,
      loggedAt: document.getElementById('log-time').value,
      sleep: { start, end, durationLabel: durationLabel(mins) },
      manual: {
        fragmentation: Number(document.getElementById('fragmentation').value),
        tiredness: Number(document.getElementById('tiredness').value),
        sleepRating: Number(document.getElementById('sleep-rating').value),
        note: document.getElementById('note').value.trim(),
      },
    };

    saveReport(report);

    document.getElementById('form-status').textContent = 'Saved — check the History page to see it.';
    document.getElementById('sleep-form').reset();
    autoFillDateTime();
    wireSlider('fragmentation', 'fragmentation-readout');
    wireSlider('tiredness', 'tiredness-readout');
    wireSlider('sleep-rating', 'rating-readout');
  });
});