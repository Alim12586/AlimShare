import { loginWithEmail, loginWithGoogle } from './auth.js';
import { uploadFile } from './upload.js';
import { listUserFiles } from './dashboard.js';
import { auth } from './firebase-config.js';

window.handleLogin = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await loginWithEmail(email, password);
    showUploadSection();
  } catch (err) {
    alert("Giriş hatası: " + err.message);
  }
};

window.handleGoogleLogin = async () => {
  try {
    await loginWithGoogle();
    showUploadSection();
  } catch (err) {
    alert("Google giriş hatası: " + err.message);
  }
};

window.handleUpload = async () => {
  const file = document.getElementById("fileInput").files[0];
  const commitMessage = document.getElementById("commitMessage").value;
  if (!file || !commitMessage) return alert("Dosya ve mesaj gerekli");
  await uploadFile(file, commitMessage);
  await renderFileList();
};

function showUploadSection() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("upload-section").style.display = "block";
  renderFileList();
}

async function renderFileList() {
  const files = await listUserFiles();
  const list = document.getElementById("fileList");
  list.innerHTML = files.map(f => `
    <div>
      <a href="${f.url}" target="_blank">${f.name}</a>
      <p>${f.commit} — ${f.time}</p>
    </div>
  `).join("");
}

auth.onAuthStateChanged(user => {
  if (user) showUploadSection();
});
