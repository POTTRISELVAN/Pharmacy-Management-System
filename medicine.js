const API = 'api/medicine';

// Load medicines on page load
window.onload = () => loadMedicines();

function loadMedicines() {
    fetch(API)
        .then(res => res.json())
        .then(data => renderTable(data))
        .catch(err => showAlert('Error loading medicines!', 'error'));
}

function searchMedicine(keyword) {
    if (keyword.length > 1) {
        fetch(`${API}?search=${keyword}`)
            .then(res => res.json())
            .then(data => renderTable(data));
    } else if (keyword.length === 0) {
        loadMedicines();
    }
}

function renderTable(medicines) {
    const tbody = document.getElementById('medicineTable');
    if (medicines.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:30px;color:#999;">No medicines found</td></tr>';
        return;
    }
    tbody.innerHTML = medicines.map((m, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${m.medicineName}</strong></td>
            <td>${m.genericName || '-'}</td>
            <td><span class="badge badge-success">${m.category || '-'}</span></td>
            <td>${m.manufacturer || '-'}</td>
            <td>${m.unit}</td>
            <td>${m.gstPercent}%</td>
            <td>${m.rackNumber || '-'}</td>
            <td>
                <button class="btn btn-danger" style="padding:5px 10px; font-size:12px;"
                    onclick="deleteMedicine(${m.id}, '${m.medicineName}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function addMedicine() {
    const data = {
        medicineName: document.getElementById('medicineName').value.trim(),
        genericName: document.getElementById('genericName').value.trim(),
        category: document.getElementById('category').value,
        manufacturer: document.getElementById('manufacturer').value.trim(),
        unit: document.getElementById('unit').value,
        hsnCode: document.getElementById('hsnCode').value.trim(),
        gstPercent: document.getElementById('gstPercent').value,
        rackNumber: document.getElementById('rackNumber').value.trim()
    };

    if (!data.medicineName) {
        showAlert('Medicine name is required!', 'error');
        return;
    }

    const formData = new URLSearchParams(data);
    
    fetch(API, { method: 'POST', body: formData })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showAlert('Medicine added successfully!', 'success');
                hideAddForm();
                loadMedicines();
                clearForm();
            } else {
                showAlert('Failed to add medicine!', 'error');
            }
        });
}

function deleteMedicine(id, name) {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
        fetch(`${API}?id=${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    showAlert('Medicine deleted!', 'success');
                    loadMedicines();
                }
            });
    }
}

function showAddForm() { document.getElementById('addForm').style.display = 'block'; }
function hideAddForm() { document.getElementById('addForm').style.display = 'none'; }

function clearForm() {
    ['medicineName','genericName','manufacturer','hsnCode','rackNumber'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function showAlert(msg, type) {
    const box = document.getElementById('alertBox');
    box.className = `alert alert-${type}`;
    box.textContent = msg;
    box.style.display = 'block';
    setTimeout(() => box.style.display = 'none', 3000);
}