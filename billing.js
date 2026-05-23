let billItems = [];
let selectedMedicine = null;

// Generate Bill Number
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('billNo').textContent = 'Bill# BILL' + Date.now();
});

// Medicine Search for Billing
function searchForBilling(query) {
    if (query.length < 2) {
        document.getElementById('searchResults').style.display = 'none';
        return;
    }
    
    fetch(`api/medicine?search=${query}`)
        .then(res => res.json())
        .then(medicines => {
            const dropdown = document.getElementById('searchResults');
            if (medicines.length === 0) {
                dropdown.style.display = 'none';
                return;
            }
            
            dropdown.innerHTML = medicines.map(m => `
                <div onclick="selectMedicine(${m.id}, '${m.medicineName}', ${m.gstPercent})"
                    style="padding:10px 15px; cursor:pointer; border-bottom:1px solid #f0f0f0; font-size:13px;"
                    onmouseover="this.style.background='#f5f7ff'"
                    onmouseout="this.style.background='white'">
                    <strong>${m.medicineName}</strong>
                    <span style="color:#666; float:right;">GST: ${m.gstPercent}%</span>
                </div>
            `).join('');
            dropdown.style.display = 'block';
        });
}

function selectMedicine(id, name, gst) {
    selectedMedicine = { id, name, gst };
    document.getElementById('medicineSearch').value = name;
    document.getElementById('searchResults').style.display = 'none';
    
    // Show stock info
    const info = document.getElementById('selectedMedicineInfo');
    info.style.display = 'block';
    info.innerHTML = `<i class="fas fa-check-circle" style="color:green;"></i> Selected: <strong>${name}</strong> | GST: ${gst}%`;
}

function addItemToBill() {
    if (!selectedMedicine) {
        alert('Please select a medicine first!');
        return;
    }
    
    const qty = parseInt(document.getElementById('itemQty').value);
    const price = parseFloat(document.getElementById('itemPrice').value);
    
    if (!qty || qty <= 0) { alert('Enter valid quantity!'); return; }
    if (!price || price <= 0) { alert('Enter selling price!'); return; }
    
    const gstAmt = (price * qty * selectedMedicine.gst) / 100;
    const total = (price * qty) + gstAmt;
    
    // Check if same medicine already added
    const existing = billItems.find(i => i.medicineId === selectedMedicine.id);
    if (existing) {
        existing.qty += qty;
        existing.total = (existing.price * existing.qty) + (existing.price * existing.qty * existing.gst / 100);
    } else {
        billItems.push({
            medicineId: selectedMedicine.id,
            medicineName: selectedMedicine.name,
            qty: qty,
            price: price,
            gst: selectedMedicine.gst,
            gstAmt: gstAmt,
            total: total
        });
    }
    
    renderBillItems();
    clearItemForm();
}

function renderBillItems() {
    const tbody = document.getElementById('billItemsBody');
    
    if (billItems.length === 0) {
        tbody.innerHTML = '<tr id="emptyRow"><td colspan="7" style="text-align:center; padding:20px; color:#999;">No items added</td></tr>';
        calculateTotal();
        return;
    }
    
    tbody.innerHTML = billItems.map((item, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${item.medicineName}</td>
            <td>${item.qty}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>${item.gst}%</td>
            <td>₹${item.total.toFixed(2)}</td>
            <td>
                <button onclick="removeItem(${i})" 
                    style="background:#f44336; color:white; border:none; border-radius:4px; padding:3px 8px; cursor:pointer;">✕</button>
            </td>
        </tr>
    `).join('');
    
    calculateTotal();
}

function removeItem(index) {
    billItems.splice(index, 1);
    renderBillItems();
}

function calculateTotal() {
    const subtotal = billItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const gstTotal = billItems.reduce((sum, item) => sum + (item.price * item.qty * item.gst / 100), 0);
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const total = subtotal + gstTotal - discount;
    
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('gstAmount').textContent = gstTotal.toFixed(2);
    document.getElementById('totalAmount').textContent = Math.max(0, total).toFixed(2);
}

function calcChange() {
    const total = parseFloat(document.getElementById('totalAmount').textContent);
    const cash = parseFloat(document.getElementById('cashReceived').value) || 0;
    const change = cash - total;
    
    document.getElementById('changeDiv').style.display = change >= 0 ? 'block' : 'none';
    document.getElementById('changeAmount').textContent = Math.max(0, change).toFixed(2);
}

function saveBill() {
    if (billItems.length === 0) {
        alert('Add at least one medicine to bill!');
        return;
    }
    
    const billData = {
        customerName: document.getElementById('customerName').value || 'Walk-in',
        customerPhone: document.getElementById('customerPhone').value,
        doctorName: document.getElementById('doctorName').value,
        items: billItems,
        subtotal: document.getElementById('subtotal').textContent,
        gstAmount: document.getElementById('gstAmount').textContent,
        discount: document.getElementById('discount').value,
        totalAmount: document.getElementById('totalAmount').textContent,
        paymentMode: document.getElementById('paymentMode').value
    };
    
    fetch('api/bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billData)
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            alert(`Bill generated successfully!\nBill ID: ${result.billId}\nTotal: ₹${billData.totalAmount}`);
            clearBill();
        } else {
            alert('Error generating bill!');
        }
    });
}

function clearBill() {
    billItems = [];
    selectedMedicine = null;
    renderBillItems();
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('doctorName').value = '';
    document.getElementById('discount').value = 0;
    document.getElementById('cashReceived').value = '';
    document.getElementById('changeDiv').style.display = 'none';
    document.getElementById('billNo').textContent = 'Bill# BILL' + Date.now();
}

function clearItemForm() {
    selectedMedicine = null;
    document.getElementById('medicineSearch').value = '';
    document.getElementById('itemQty').value = 1;
    document.getElementById('itemPrice').value = '';
    document.getElementById('selectedMedicineInfo').style.display = 'none';
}