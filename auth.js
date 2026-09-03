const authButton = document.querySelector('#auth-button, .avatar');
const authModal = document.querySelector('#auth-modal') || (() => { const modal = document.createElement('div'); modal.className = 'auth-modal'; modal.id = 'auth-modal'; modal.setAttribute('aria-hidden', 'true'); modal.innerHTML = '<div class="auth-panel"><button class="modal-close" id="close-auth" aria-label="Close account dialog">×</button><div class="auth-tabs"><button class="auth-tab active" data-auth-mode="login">Log in</button><button class="auth-tab" data-auth-mode="signup">Sign up</button></div><p class="eyebrow">Free Rugby Live account</p><h2 id="auth-title">Welcome back.</h2><form id="auth-form"><label>Name<input name="name" id="auth-name" placeholder="Your name"></label><label>Email<input name="email" type="email" required placeholder="you@example.com"></label><label>Password<input name="password" type="password" required minlength="6" placeholder="At least 6 characters"></label><button class="watch-button" type="submit" id="auth-submit">Log in ↗</button></form><p class="auth-message" id="auth-message" hidden></p><button class="logout-button" id="logout-button" hidden>Log out</button></div>'; document.body.appendChild(modal); return modal; })();
const authForm = document.querySelector('#auth-form');
const authTitle = document.querySelector('#auth-title');
const authName = document.querySelector('#auth-name');
const authMessage = document.querySelector('#auth-message');
const authSubmit = document.querySelector('#auth-submit');
const logoutButton = document.querySelector('#logout-button');
let authMode = 'login';
function updateAuthButton() { const user = JSON.parse(localStorage.getItem('frl-user') || 'null'); if (authButton) { authButton.textContent = user ? user.name.split(' ')[0] : 'Log in'; authButton.setAttribute('aria-label', user ? `Logged in as ${user.name}` : 'Open account'); } }
function setMode(mode) { authMode = mode; document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.authMode === mode)); authTitle.textContent = mode === 'signup' ? 'Join the game.' : 'Welcome back.'; authSubmit.textContent = mode === 'signup' ? 'Create account ↗' : 'Log in ↗'; authName.required = mode === 'signup'; authName.hidden = mode !== 'signup'; authMessage.hidden = true; logoutButton.hidden = true; }
function openAuth() { const user = JSON.parse(localStorage.getItem('frl-user') || 'null'); authModal.classList.add('open'); authModal.setAttribute('aria-hidden', 'false'); if (user) { authMessage.textContent = `You are logged in as ${user.email}.`; authMessage.hidden = false; authForm.hidden = true; logoutButton.hidden = false; } else { authForm.hidden = false; setMode('login'); } }
function closeAuth() { authModal.classList.remove('open'); authModal.setAttribute('aria-hidden', 'true'); }
function persistAccount(event) { event.preventDefault(); const data = new FormData(authForm); const user = { name: data.get('name') || data.get('email').split('@')[0], email: data.get('email') }; localStorage.setItem('frl-user', JSON.stringify(user)); updateAuthButton(); authForm.hidden = true; authMessage.textContent = authMode === 'signup' ? `Account created for ${user.email}.` : `Welcome back, ${user.name}.`; authMessage.hidden = false; logoutButton.hidden = false; }
if (authButton) authButton.addEventListener('click', openAuth);
document.querySelectorAll('.auth-tab').forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.authMode)));
authForm.addEventListener('submit', persistAccount);
logoutButton.addEventListener('click', () => { localStorage.removeItem('frl-user'); updateAuthButton(); authForm.hidden = false; setMode('login'); closeAuth(); });
document.querySelector('#close-auth').addEventListener('click', closeAuth);
authModal.addEventListener('click', event => { if (event.target === authModal) closeAuth(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeAuth(); });
updateAuthButton();