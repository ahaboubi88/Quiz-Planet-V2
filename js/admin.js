const ADMIN_KEY = 'admin2026'; // Simple hardcoded pass for now
let _cachedEvents = [];
let _cachedReviews = [];
let _cachedRequests = [];

function checkAuth() {
    const input = document.getElementById('admin-pass').value;
    const error = document.getElementById('login-error');
    if (input === ADMIN_KEY) {
        document.getElementById('login-overlay').style.display = 'none';
        sessionStorage.setItem('admin_auth', 'true');
        loadData();
    } else {
        error.style.display = 'block';
    }
}

// Check session on load
if (sessionStorage.getItem('admin_auth') === 'true') {
    document.getElementById('login-overlay').style.display = 'none';
    window.addEventListener('DOMContentLoaded', loadData);
}

function showTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    document.getElementById('tab-' + tab).classList.add('active');
    document.getElementById('content-' + tab).style.display = 'block';
}

async function loadData() {
    loadStats();
    loadReviews();
    loadLicense();
    loadLicenseRequests();
}

async function loadStats() {
    try {
        const res = await fetch('/api/admin/stats');
        const { counts, recent } = await res.json();
        
        const demoCount = counts.find(c => c.event_type === 'click_download_demo')?.count || 0;
        const fullCount = counts.find(c => c.event_type === 'click_purchase_full')?.count || 0;
        
        document.getElementById('stat-demo').innerText = demoCount;
        document.getElementById('stat-full').innerText = fullCount;
        _cachedEvents = recent;

        const tbody = document.querySelector('#events-table tbody');
        tbody.innerHTML = recent.map(e => `
            <tr>
                <td>${e.event_type}</td>
                <td>${e.viewer_ip}</td>
                <td>${new Date(e.timestamp).toLocaleString()}</td>
            </tr>
        `).join('');
    } catch (err) { console.error(err); }
}

async function loadReviews() {
    try {
        const res = await fetch('/api/admin/reviews');
        const reviews = await res.json();
        _cachedReviews = reviews;
        
        const tbody = document.querySelector('#reviews-table tbody');
        tbody.innerHTML = reviews.map(r => `
            <tr>
                <td><strong>${r.author_name}</strong></td>
                <td>${'★'.repeat(r.rating)}</td>
                <td>${r.comment}</td>
                <td><span class="badge badge-${r.status}">${r.status}</span></td>
                <td>
                    <div style="display: flex; gap: 5px;">
                        ${r.status !== 'approved' ? `<button onclick="updateReview(${r.id}, 'approved')" class="btn" style="padding: 5px 10px; font-size: 0.8rem; background: #10b981;">Approve</button>` : ''}
                        ${r.status === 'approved' ? `<button onclick="updateReview(${r.id}, 'hidden')" class="btn" style="padding: 5px 10px; font-size: 0.8rem; background: #64748b;">Hide</button>` : ''}
                        <button onclick="deleteReview(${r.id})" class="btn" style="padding: 5px 10px; font-size: 0.8rem; background: #ef4444;">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) { console.error(err); }
}

async function updateReview(id, status) {
    await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    loadReviews();
}

async function deleteReview(id) {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    loadReviews();
}

// --- License Management ---

async function loadLicense() {
    try {
        const hwRes = await fetch('/api/license/hwid');
        const { hwid } = await hwRes.json();
        document.getElementById('hwid-display').innerText = hwid;

        const stRes = await fetch('/api/license/status');
        const status = await stRes.json();
        
        const statusText = document.getElementById('license-status-text');
        const portableSection = document.getElementById('portable-section');
        const actForm = document.getElementById('activation-form');

        statusText.innerText = status.status;
        statusText.className = 'badge ' + (status.status === 'DEMO' ? 'badge-hidden' : 'badge-approved');

        if (status.status === 'DEMO') {
            if (actForm) actForm.style.display = 'block';
            if (portableSection) {
                portableSection.style.opacity = '0.5';
                portableSection.style.pointerEvents = 'none';
            }
        } else {
            if (actForm) actForm.style.display = 'none';
            if (portableSection) {
                portableSection.style.opacity = '1';
                portableSection.style.pointerEvents = 'auto';
            }
        }
    } catch (err) { console.error(err); }
}

async function activateSoftware() {
    const key = document.getElementById('activation-key-input').value;
    if (!key) return alert('Please enter a key');

    try {
        const res = await fetch('/api/license/activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key })
        });
        const data = await res.json();

        if (data.success) {
            alert(data.message);
            loadLicense();
        } else {
            alert(data.error);
        }
    } catch (err) { alert('Activation failed'); }
}

function downloadPortableLicense() {
    window.location.href = '/api/license/download-portable';
}

async function loadLicenseRequests() {
    try {
        const res = await fetch('/api/admin/license/requests');
        const requests = await res.json();
        _cachedRequests = requests;
        
        const tbody = document.getElementById('license-requests-body');
        tbody.innerHTML = requests.map(req => `
            <tr>
                <td>${req.name}</td>
                <td>${req.email}</td>
                <td>${req.phone}</td>
                <td><code>${req.hwid}</code></td>
                <td>${req.activation_key || '<em>None</em>'}</td>
                <td>
                    ${req.status === 'pending' ? 
                        `<button onclick="generateKeyForRequest(${req.id}, '${req.hwid}')" class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;">Generate Key</button>` : 
                        `<span class="badge badge-approved">Sent</span>`
                    }
                </td>
            </tr>
        `).join('');
    } catch (err) { console.error(err); }
}

async function generateKeyForRequest(id, hwid) {
    if (!confirm('Generate activation key for this customer?')) return;
    try {
        const res = await fetch('/api/admin/license/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, hwid })
        });
        const data = await res.json();
        if (data.success) {
            alert('Key generated: ' + data.key + '\n\nPlease email this key to the customer manually.');
            loadLicenseRequests();
        }
    } catch (err) { alert('Failed to generate key'); }
}

// --- CSV Export Logic ---

function downloadCSV(data, headers, filename) {
    if (!data || !data.length) return alert('No data to export');
    
    // UTF-8 BOM for Excel compatibility
    let csvContent = "\uFEFF";
    csvContent += headers.map(h => `"${h}"`).join(",") + "\n";
    
    data.forEach(item => {
        const row = headers.map(h => {
            const val = item[h] === null || item[h] === undefined ? '' : item[h];
            return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportEvents() {
    downloadCSV(_cachedEvents, ['event_type', 'viewer_ip', 'timestamp'], 'quiz_planet_events.csv');
}

function exportReviews() {
    downloadCSV(_cachedReviews, ['author_name', 'rating', 'comment', 'status', 'created_at'], 'quiz_planet_reviews.csv');
}

function exportRequests() {
    downloadCSV(_cachedRequests, ['name', 'email', 'phone', 'hwid', 'activation_key', 'status', 'created_at'], 'quiz_planet_license_requests.csv');
}

// --- Game Distro Upload Logic ---

let selectedGameFile = null;

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    selectedGameFile = file;
    document.getElementById('file-selected-name').innerText = file.name + ` (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    document.getElementById('start-upload-btn').style.display = 'block';
    
    // Reset progress UI
    document.getElementById('upload-progress-container').style.display = 'none';
    document.getElementById('upload-progress-bar').style.width = '0%';
    document.getElementById('upload-status-text').innerText = 'Uploading... 0%';
}

async function startGameUpload() {
    if (!selectedGameFile) return alert('No file selected!');
    
    const githubToken = document.getElementById('github-pat-input').value.trim();
    if (!githubToken) return alert('You must provide your GitHub Personal Access Token to upload new game files.');

    const progressContainer = document.getElementById('upload-progress-container');
    const progressBar = document.getElementById('upload-progress-bar');
    const statusText = document.getElementById('upload-status-text');
    const startBtn = document.getElementById('start-upload-btn');

    startBtn.style.display = 'none';
    progressContainer.style.display = 'block';

    const repoOwner = 'ahaboubi88';
    const repoName = 'Quiz-Planet-V2';
    const releaseTag = 'v' + new Date().toISOString().replace(/T/, '-').replace(/:/g, '-').split('.')[0];
    const releaseName = 'Quiz Planet Live Update - ' + new Date().toLocaleDateString();

    try {
        statusText.innerText = 'Creating new Release on GitHub...';
        progressBar.style.width = '10%';

        // STEP 1: Create a Draft Release
        const createReleaseRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tag_name: releaseTag,
                name: releaseName,
                body: 'Automatic executable upload via Admin Dashboard.',
                draft: true, // Keep it draft until upload completes
                prerelease: false
            })
        });

        if (!createReleaseRes.ok) {
            const errJson = await createReleaseRes.json();
            throw new Error(errJson.message || 'Failed to create GitHub release');
        }

        const releaseData = await createReleaseRes.json();
        const uploadUrl = releaseData.upload_url.replace(/\{.*\}/, '') + '?name=' + encodeURIComponent(selectedGameFile.name);

        statusText.innerText = 'Uploading 230MB Game File to GitHub... 0%';

        // STEP 2: Upload the binary using XMLHttpRequest to get progress events
        await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', uploadUrl, true);
            
            xhr.setRequestHeader('Authorization', `Bearer ${githubToken}`);
            xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    // Start progress bar visual from 10% to 90% space
                    progressBar.style.width = (10 + (percent * 0.8)) + '%';
                    statusText.innerText = `Uploading 230MB Game File to GitHub... ${percent}%`;
                }
            };
            
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) resolve();
                else reject(new Error('GitHub rejected the binary upload. Status: ' + xhr.status));
            };
            
            xhr.onerror = () => reject(new Error('Network error during upload'));
            
            xhr.send(selectedGameFile);
        });

        statusText.innerText = 'Publishing Release...';
        progressBar.style.width = '95%';

        // STEP 3: Publish the Release (remove draft status)
        const publishRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases/${releaseData.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ draft: false })
        });

        if (!publishRes.ok) throw new Error('Failed to publish the release');

        progressBar.style.width = '100%';
        statusText.innerText = 'Upload Complete! Users will now instantly download this version.';
        statusText.style.color = '#10b981';

        // Clear password box for safety
        // document.getElementById('github-pat-input').value = ''; // We can keep it to ease multiple ops

        // Refresh the current release view
        fetchCurrentLiveRelease();

    } catch (err) {
        console.error(err);
        statusText.innerText = 'Upload Failed: ' + err.message;
        statusText.style.color = '#ef4444';
        startBtn.style.display = 'block'; // Let them retry
    }
}

// Fetch the currently active release to show the admin
let _currentReleaseId = null;

async function fetchCurrentLiveRelease() {
    try {
        const res = await fetch('https://api.github.com/repos/ahaboubi88/Quiz-Planet-V2/releases/latest');
        const nameEl = document.getElementById('current-release-name');
        const metaEl = document.getElementById('current-release-meta');
        const delBtn = document.getElementById('delete-release-btn');
        
        if (res.ok) {
            const data = await res.json();
            _currentReleaseId = data.id;
            
            if (data.assets && data.assets.length > 0) {
                const asset = data.assets[0];
                nameEl.innerText = asset.name;
                nameEl.style.color = '#10b981';
                
                const mb = (asset.size / 1024 / 1024).toFixed(2);
                const date = new Date(asset.created_at).toLocaleString();
                metaEl.innerText = `${mb} MB • Uploaded ${date}`;
                
                delBtn.style.display = 'block';
            } else {
                nameEl.innerText = "No game file uploaded yet.";
                nameEl.style.color = 'var(--text-muted)';
                metaEl.innerText = "Upload a .exe below.";
                delBtn.style.display = 'none';
            }
        } else {
            nameEl.innerText = "No Live Releases Found.";
            metaEl.innerText = "Upload a .exe below.";
            delBtn.style.display = 'none';
        }
    } catch (err) {
        console.error(err);
    }
}

// Call this function when the user switches to the Upload tab or the dashboard loads
window.addEventListener('DOMContentLoaded', fetchCurrentLiveRelease);

async function deleteCurrentRelease() {
    if (!_currentReleaseId) return;
    
    const githubToken = document.getElementById('github-pat-input').value.trim();
    if (!githubToken) return alert('You must provide your GitHub Personal Access Token to delete a release.');
    
    if (!confirm('Are you absolutely sure you want to stop users from downloading this game version? (This deletes it from GitHub)')) return;

    try {
        document.getElementById('delete-release-btn').innerText = 'Deleting...';
        
        const res = await fetch(`https://api.github.com/repos/ahaboubi88/Quiz-Planet-V2/releases/${_currentReleaseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!res.ok && res.status !== 204) throw new Error('Failed to delete release');
        
        alert('Game update deleted successfully.');
        document.getElementById('current-release-name').innerText = 'Refreshing...';
        fetchCurrentLiveRelease();
        
    } catch (err) {
        alert('Failed to delete: ' + err.message);
        document.getElementById('delete-release-btn').innerText = 'Delete Release';
    }
}
