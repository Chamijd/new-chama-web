let currentUser = null;

function register() {
  fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: document.getElementById('reg-username').value,
      email: document.getElementById('reg-email').value,
      password: document.getElementById('reg-password').value
    })
  }).then(res => res.json()).then(alert);
}

function login() {
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: document.getElementById('login-username').value,
      password: document.getElementById('login-password').value
    })
  }).then(res => res.json()).then(data => {
    if (data.success) {
      currentUser = data.user;
      document.getElementById('auth').style.display = 'none';
      document.getElementById('comment-section').style.display = 'block';
      loadComments();
    } else {
      alert(data.message);
    }
  });
}

function logout() {
  currentUser = null;
  document.getElementById('auth').style.display = 'block';
  document.getElementById('comment-section').style.display = 'none';
}

function submitComment() {
  const comment = document.getElementById('comment').value;
  fetch('/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment, username: currentUser })
  }).then(() => {
    document.getElementById('comment').value = '';
    loadComments();
  });
}

function loadComments() {
  fetch('/comments').then(res => res.json()).then(data => {
    const container = document.getElementById('comments');
    container.innerHTML = data.map(c => \`
      <div class="comment">
        <strong>\${c.username}</strong><br/>
        <span>\${c.comment}</span><br/>
        <small>\${new Date(c.date).toLocaleString()}</small>
      </div>
    \`).join('');
  });
}
