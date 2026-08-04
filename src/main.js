import { analyzeFreelists, analyzePileSorts, exportProject, parseFreelistText } from './analysis.js';

const project = {
  domain: 'Cultural foods at family gatherings',
  freelists: [
    { participant: 'P01', items: ['tamales', 'rice', 'beans', 'roast chicken', 'salad'] },
    { participant: 'P02', items: ['rice', 'beans', 'mole', 'tamales'] },
  ],
  pileSorts: [{ participant: 'P01', piles: [{ label: 'Everyday staples', items: ['rice', 'beans'] }, { label: 'Celebration foods', items: ['tamales', 'mole', 'roast chicken'] }] }],
};

const $ = (id) => document.getElementById(id);
$('domain').value = project.domain;
$('domain').addEventListener('input', (event) => { project.domain = event.target.value; });
$('freelist-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const items = parseFreelistText($('freelist-text').value);
  if (!items.length) return;
  project.freelists.push({ participant: $('freelist-participant').value || `P${project.freelists.length + 1}`, items });
  $('freelist-text').value = '';
  render();
});
$('pilesort-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const piles = $('pile-text').value.split('\n').map((line, index) => {
    const separator = line.indexOf(':');
    const label = separator >= 0 ? line.slice(0, separator) : `Pile ${index + 1}`;
    const rawItems = separator >= 0 ? line.slice(separator + 1) : line;
    return { label: label.trim(), items: parseFreelistText(rawItems) };
  }).filter((pile) => pile.items.length);
  if (!piles.length) return;
  project.pileSorts.push({ participant: $('sort-participant').value, piles });
  $('pile-text').value = '';
  render();
});
$('export-json').addEventListener('click', () => {
  const blob = new Blob([exportProject(project)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${project.domain.replace(/\W+/g, '-').toLowerCase()}-anthropac.json`;
  link.click();
  URL.revokeObjectURL(url);
});

function render() {
  const rows = analyzeFreelists(project.freelists);
  $('freelist-results').innerHTML = `<table><thead><tr><th>Item</th><th>Freq.</th><th>Avg. rank</th><th>First mentions</th><th>Salience</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${row.item}</td><td>${row.frequency}</td><td>${row.averageRank.toFixed(2)}</td><td>${row.firstMentions}</td><td>${row.smithSalience.toFixed(3)}</td></tr>`).join('')}</tbody></table>`;
  const matrix = analyzePileSorts(project.pileSorts);
  $('matrix-results').innerHTML = `<table><thead><tr><th></th>${matrix.items.map((item) => `<th>${item}</th>`).join('')}</tr></thead><tbody>${matrix.items.map((item, row) => `<tr><th>${item}</th>${matrix.matrix[row].map((value) => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  $('study-log').innerHTML = project.freelists.map((list, index) => `<p><button class="icon" data-delete="${index}">×</button><strong>${list.participant}</strong> freelisted ${list.items.join(', ')}.</p>`).join('');
  document.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => { project.freelists.splice(Number(button.dataset.delete), 1); render(); }));
}

render();
