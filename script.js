const matches = [
  { league:'United Rugby Championship', short:'URC', time:'LIVE · 2ND HALF · 58:14', home:'Leinster', away:'Bulls', provider:'URC TV', live:true, url:'https://www.unitedrugby.com/' },
  { league:'Top 14', short:'TOP 14', time:'TODAY · 20:05 UTC', home:'Toulouse', away:'La Rochelle', provider:'France TV', url:'https://www.france.tv/sport/' },
  { league:'Super Rugby Pacific', short:'SUPER RUGBY', time:'TODAY · 08:35 UTC', home:'Blues', away:'Crusaders', provider:'NZR+', url:'https://www.nzrugby.co.nz/' },
  { league:"Women's Rugby", short:'WOMEN’S', time:'TODAY · 15:00 UTC', home:'England', away:'France', provider:'World Rugby', url:'https://www.world.rugby/tournaments' },
  { league:'United Rugby Championship', short:'URC', time:'TOMORROW · 17:15 UTC', home:'Munster', away:'Edinburgh', provider:'URC TV', url:'https://www.unitedrugby.com/' },
  { league:'Top 14', short:'TOP 14', time:'TOMORROW · 19:00 UTC', home:'Bordeaux', away:'Racing 92', provider:'France TV', url:'https://www.france.tv/sport/' }
];
const grid = document.querySelector('#match-grid');
const search = document.querySelector('#search');
const empty = document.querySelector('#empty-state');
let filter = 'All';
const saved = new Set();
const news = [
  { category:'Punditry', title:'The detail that could decide the next big collision', dek:'Our desk looks at the breakdown battle and the voices shaping this weekend’s conversation.', source:'Free Rugby Live desk', age:'18 min ago' },
  { category:'Press conference', title:'What the coaches said before kick-off', dek:'A concise read of the key themes, selection hints and questions from the media room.', source:'Press room notes', age:'42 min ago' },
  { category:'Analysis', title:'Why width is becoming the modern advantage', dek:'Space, shape and the second wave: the tactical shift showing up across the major competitions.', source:'Match analysis', age:'1 hr ago' },
  { category:'Team news', title:'Selection watch: the names moving into focus', dek:'The latest squad signals, injury updates and training-ground decisions to keep an eye on.', source:'Team bulletin', age:'2 hrs ago' },
  { category:'Punditry', title:'A different kind of pressure at Test level', dek:'Former internationals weigh in on composure, territory and the moments that swing a series.', source:'Free Rugby Live desk', age:'3 hrs ago' },
  { category:'Press conference', title:'Inside the questions nobody wanted to dodge', dek:'The strongest answers from today’s media briefings, gathered in one quick read.', source:'Press room notes', age:'4 hrs ago' }
];
const newsGrid = document.querySelector('#news-grid');
function renderNews(category = 'All') { newsGrid.innerHTML = news.filter(item => category === 'All' || item.category === category).map((item, index) => `<article class="news-card"><div class="news-card-top"><span class="news-category">${item.category}</span><span class="news-index">0${index + 1}</span></div><h3>${item.title}</h3><p>${item.dek}</p><div class="news-meta"><span>${item.source}</span><span>${item.age}</span></div></article>`).join(''); }
renderNews();
document.querySelectorAll('.news-filter').forEach(button => button.addEventListener('click', () => { document.querySelector('.news-filter.active').classList.remove('active'); button.classList.add('active'); renderNews(button.dataset.newsFilter); }));
const sponsorModal = document.querySelector('#sponsor-modal');
document.querySelector('#open-sponsor').addEventListener('click', () => { sponsorModal.classList.add('open'); sponsorModal.setAttribute('aria-hidden', 'false'); });
document.querySelector('#close-sponsor').addEventListener('click', () => { sponsorModal.classList.remove('open'); sponsorModal.setAttribute('aria-hidden', 'true'); });
document.querySelector('#sponsor-form').addEventListener('submit', event => { event.preventDefault(); event.target.hidden = true; document.querySelector('#form-success').hidden = false; });
function teamBadge(name, side) { const initials = name.split(' ').map(word => word[0]).join('').slice(0, 3); return `<span class="team-cell ${side}"><span class="team-logo ${side}" aria-hidden="true">${initials}</span><span class="team">${name}</span></span>`; }
function render() {
  const query = search.value.trim().toLowerCase();
  const visible = matches.filter(match => (filter === 'All' || match.league === filter) && (!query || `${match.home} ${match.away} ${match.league}`.toLowerCase().includes(query)));
  empty.hidden = visible.length > 0;
  grid.innerHTML = visible.map((match, index) => `<article class="match-card"><div><div class="match-top"><span class="league">${match.short}</span><div><span class="${match.live ? 'live-tag' : 'league'}">${match.live ? 'Live now' : 'Scheduled'}</span><button class="save ${saved.has(match.home) ? 'saved' : ''}" data-save="${match.home}" aria-label="${saved.has(match.home) ? 'Remove from' : 'Save'} ${match.home} match">${saved.has(match.home) ? '♥' : '♡'}</button></div></div><p class="match-time">${match.time}</p><div class="teams">${teamBadge(match.home, 'home')}<span class="versus">VS</span>${teamBadge(match.away, 'away')}</div></div><div class="match-bottom"><span class="provider">FREE · ${match.provider}</span><button class="watch-button" data-watch="${match.url}" data-embed="${match.embedUrl || ''}" data-name="${match.home} v ${match.away}">${match.live ? 'Watch live ↗' : 'Set reminder'}</button></div></article>`).join('');
}
function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove('show'), 2800); }
document.querySelectorAll('.chip').forEach(button => button.addEventListener('click', () => { document.querySelector('.chip.active').classList.remove('active'); button.classList.add('active'); filter = button.dataset.filter; render(); if (filter === 'All') { button.classList.remove('kickoff'); void button.offsetWidth; button.classList.add('kickoff'); } }));
search.addEventListener('input', render);
document.querySelector('#focus-search').addEventListener('click', () => { search.focus(); document.querySelector('#matches').scrollIntoView({behavior:'smooth'}); });
grid.addEventListener('click', event => { const saveButton = event.target.closest('[data-save]'); if (saveButton) { const name = saveButton.dataset.save; saved.has(name) ? saved.delete(name) : saved.add(name); render(); toast(saved.has(name) ? `${name} match saved` : `${name} match removed`); return; } const watch = event.target.closest('[data-watch]'); if (watch) { if (watch.textContent.includes('reminder')) { toast(`Reminder set for ${watch.dataset.name}`); } else { openPlayer(watch.dataset.name, watch.dataset.watch); } } });
render();

const modal = document.querySelector('#player-modal');
const playerTitle = document.querySelector('#player-title');
const playerLink = document.querySelector('#player-link');
const playerFrame = document.querySelector('#player-frame');
const playerStatus = document.querySelector('#player-status');
const playerCopy = document.querySelector('#player-copy');
function openPlayer(name, url, embedUrl) { playerTitle.textContent = name; playerFrame.hidden = !embedUrl; playerLink.hidden = !embedUrl; playerStatus.textContent = embedUrl ? 'Live stream' : 'Licensed stream embed pending'; playerCopy.textContent = embedUrl ? 'You are watching an authorized broadcast inside Free Rugby Live.' : 'This match is listed, but its licensed in-page stream has not been connected yet. No external redirect was used.'; if (embedUrl) playerFrame.src = embedUrl; else playerFrame.removeAttribute('src'); playerLink.href = url; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
function closePlayer() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); playerFrame.removeAttribute('src'); }
document.querySelector('#close-player').addEventListener('click', closePlayer);
modal.addEventListener('click', event => { if (event.target === modal) closePlayer(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closePlayer(); });