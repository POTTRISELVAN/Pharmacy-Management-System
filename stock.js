function searchMedicineForStock(query) {
    if (query.length < 2) {
        document.getElementById('stockDropdown').style.display = 'none';
        return;
    }
    fetch(`api/medicine?search=${query}`)
        .then(res => res.json())
        .then(medicines => {
            const dropdown = document.getElementById('stockDropdown');
            if (medicines.length === 0) {
                dropdown.style.display = 'none';
                return;
            }
            dropdown.innerHTML = medicines.map(m => `
                <div onclick="selectStockMedicine(${m.id}, '${m.medicineName}')"
                    style="padding:10px 15px; cursor:pointer; border-bottom:1px solid #f0f0f0; font-size:13px;"
                    onmouseover="this.style.background='#f5f7ff'"
                    onmouseout="this.style.background='white'">
                    <strong>${m.medicineName}</strong>
                </div>
            `).join('');
            dropdown.style.display = 'block';
        });
}

function selectStockMedicine(id, name) {
    document.getElementById('medicineSearch').value = name;
    document.getElementById('stockMedicineId').value = id;
    document.getElementById('stockDropdown').style.display = 'none';
}
window.onload = () => loadStock();

function loadStock() {
    fetch('api/stock')
        .then(res => res.json())
        .then(data => renderStockTable(data));
}

function renderStockTable(stocks) {
    const tbody = document.getElementById('stockTable');
    if (stocks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:30px;color:#999;">No stock found</td></tr>';
        return;
    }
    tbody.innerHTML = stocks.map((s, i) => {
        const expiry = new Date(s.expiryDate);
        const today = new Date();
        const diff = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
        let badge = 'badge-success';
        if (diff < 0) badge = 'badge-danger';
        else if (diff <= 30) badge = 'badge-warning';

        return `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${s.medicineName}</strong></td>
            <td>${s.batchNumber}</td>
            <td><span class="badge ${badge}">${s.expiryDate}</span></td>
            <td>${s.quantity}</td>
            <td>₹${s.sellingPrice}</td>
            <td>₹${s.mrp}</td>
            <td>${s.supplierName || '-'}</td>
            <td>
                <button class="btn btn-danger" style="padding:5px 10px;font-size:12px;"
                    onclick="deleteStock(${s.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>`;
    }).join('');
}

function addStock() {
    const data = {
        medicineId: document.getElementById('stockMedicineId').value,
        batchNumber: document.getElementById('batchNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        quantity: document.getElementById('quantity').value,
        purchasePrice: document.getElementById('purchasePrice').value,
        sellingPrice: document.getElementById('sellingPrice').value,
        mrp: document.getElementById('mrp').value,
        supplierName: document.getElementById('supplierName').value,
        purchaseDate: document.getElementById('purchaseDate').value
    };

    if (!data.medicineId || !data.batchNumber || !data.expiryDate || !data.quantity) {
        showAlert('Please fill all required fields!', 'error');
        return;
    }

    const formData = new URLSearchParams(data);
    fetch('api/stock', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showAlert('Stock added successfully!', 'success');
                hideAddForm();
                loadStock();
            } else {
                showAlert('Failed to add stock!', 'error');
            }
        });
}

function deleteStock(id) {
    if (confirm('Delete this stock entry?')) {
        fetch(`api/stock?id=${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    showAlert('Stock deleted!', 'success');
                    loadStock();
                }
            });
    }
}

function searchStock(keyword) {
    fetch('api/stock')
        .then(res => res.json())
        .then(data => {
            const filtered = data.filter(s =>
                s.medicineName.toLowerCase().includes(keyword.toLowerCase())
            );
            renderStockTable(filtered);
        });
}

function showAddForm() { document.getElementById('addForm').style.display = 'block'; }
function hideAddForm() { document.getElementById('addForm').style.display = 'none'; }

function showAlert(msg, type) {
    const box = document.getElementById('alertBox');
    box.className = `alert alert-${type}`;
    box.textContent = msg;
    box.style.display = 'block';
    setTimeout(() => box.style.display = 'none', 3000);
}