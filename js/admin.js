
'use strict';

// Gunakan konfigurasi Supabase yang sama dengan website IRR.
const SUPABASE_URL = 'https://delsfwkdyaexvzzxvoav.supabase.co';
const SUPABASE_KEY = 'sb_publishable_8Vt3ETU-oaJ1kFVoKHL_aw__aAuxKZe';

const TABLE = 'irr_reviews_public';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const $ = (selector) => document.querySelector(selector);
const loginPanel = $('#login-panel');
const dashboard = $('#dashboard');
const loginMessage = $('#login-message');
const dashboardMessage = $('#dashboard-message');

let busy = false;

function message(target, text) {
  target.textContent = text;
}

function escapeText(value) {
  return String(value ?? '');
}

function addText(parent, tag, value) {
  const node = document.createElement(tag);
  node.textContent = escapeText(value);
  parent.append(node);
  return node;
}

function actionButton(label, className, callback) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `btn ${className}`;
  button.textContent = label;
  button.addEventListener('click', callback);
  return button;
}

async function currentUser() {
  const { data, error } = await db.auth.getUser();
  if (error) throw error;
  return data.user;
}

function showLogin() {
  loginPanel.hidden = false;
  dashboard.hidden = true;
}

function showDashboard(user) {
  loginPanel.hidden = true;
  dashboard.hidden = false;
  $('#admin-identity').textContent = `Login: ${user.email || 'Admin'}`;
}

// Login menggunakan Supabase Auth.
$('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy) return;
  busy = true;

  const button = $('#login-button');
  button.disabled = true;
  message(loginMessage, 'Memeriksa akun...');

  try {
    const email = $('#email').value.trim();
    const password = $('#password').value;

    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const user = await currentUser();

    // Ini hanya memverifikasi sesi login, bukan membuktikan
    // bahwa pengguna memiliki hak admin di database.
    showDashboard(user);
    await loadReviews();
  } catch (error) {
    message(loginMessage, `Login gagal: ${error.message}`);
  } finally {
    busy = false;
    button.disabled = false;
  }
});

// Muat daftar ulasan dari database.
async function loadReviews() {
  message(dashboardMessage, 'Memuat ulasan...');

  const pending = $('#pending-list');
  const processed = $('#processed-list');
  pending.replaceChildren();
  processed.replaceChildren();

  try {
    const user = await currentUser();
    if (!user) throw new Error('Silakan login kembali.');

    const { data, error } = await db
      .from(TABLE)
      .select('id, name, service, rating, review_text, status, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;

    const rows = data || [];
    const pendingRows = rows.filter(r => r.status === 'pending');
    const processedRows = rows.filter(r =>
      ['approved', 'rejected'].includes(r.status)
    );

    if (!pendingRows.length) {
      addText(pending, 'p', 'Tidak ada ulasan yang menunggu persetujuan.');
    }

    pendingRows.forEach(row => renderReview(pending, row, true));
    processedRows.forEach(row => renderReview(processed, row, false));

    message(
      dashboardMessage,
      `Berhasil memuat ${pendingRows.length} ulasan pending.`
    );
  } catch (error) {
    message(
      dashboardMessage,
      `Gagal memuat ulasan: ${error.message}. Periksa policy database.`
    );
  }
}

function renderReview(container, review, canModerate) {
  const card = document.createElement('article');
  card.className = 'review-admin';

  addText(card, 'h3', review.name);
  addText(card, 'p', `${review.service} · ${review.rating}/5 bintang`);
  addText(card, 'p', review.review_text);
  addText(card, 'p', `Status: ${review.status}`);
  addText(card, 'small',
    new Date(review.created_at).toLocaleString('id-ID'));

  if (canModerate) {
    const actions = document.createElement('div');
    actions.className = 'admin-actions';

    actions.append(
      actionButton('Setujui', 'btn-approve', () =>
        moderateReview(review.id, 'approved')
      ),
      actionButton('Tolak', 'btn-reject', () =>
        moderateReview(review.id, 'rejected')
      )
    );

    card.append(actions);
  }

  container.append(card);
}

// Sengaja tidak mengasumsikan update akan berhasil.
// Database wajib mempunyai otorisasi admin yang benar.
async function moderateReview(id, status) {
  if (!['approved', 'rejected'].includes(status)) return;

  const confirmed = window.confirm(
    status === 'approved'
      ? 'Setujui ulasan ini agar dapat tampil ke publik?'
      : 'Tolak ulasan ini?'
  );
  if (!confirmed) return;

  message(dashboardMessage, 'Memproses perubahan...');

  try {
    const user = await currentUser();
    if (!user) throw new Error('Sesi login berakhir.');

    const { data, error } = await db
      .from(TABLE)
      .update({ status })
      .eq('id', id)
      .eq('status', 'pending')
      .select('id');

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error(
        'Tidak ada perubahan. Hak admin atau policy UPDATE belum disiapkan.'
      );
    }

    message(dashboardMessage, 'Status ulasan berhasil diperbarui.');
    await loadReviews();
  } catch (error) {
    message(
      dashboardMessage,
      `Perubahan gagal: ${error.message}. Pastikan hak admin di database sudah dikonfigurasi.`
    );
  }
}

$('#refresh-button').addEventListener('click', loadReviews);

$('#logout-button').addEventListener('click', async () => {
  const { error } = await db.auth.signOut();

  if (error) {
    message(dashboardMessage, `Logout gagal: ${error.message}`);
    return;
  }

  showLogin();
  $('#login-form').reset();
  message(loginMessage, 'Anda sudah logout.');
});

// Pulihkan sesi bila admin sebelumnya sudah login.
(async function init() {
  try {
    const user = await currentUser();
    if (user) {
      showDashboard(user);
      await loadReviews();
    } else {
      showLogin();
    }
  } catch {
    showLogin();
  }
})();
