window.onload = () => {
    updateDateTime();
    loadDashboardStats();
    loadRecentBills();
    setInterval(updateDateTime, 1000);
};

function updateDateTime() {
    const now = new Date();
    document.getElementById('dateTime').textContent = now.toLocaleString('en-IN');
}

function loadDashboardStats() {
    fetch('api/medicine')
        .then(res => res.json())
        .then(data => {
            document.getElementById('totalMedicines').textContent = data.length;
        });

    fetch('api/stock')
        .then(res => res.json())
        .then(data => {
            document.getElementById('totalStock').textContent = data.length;
            const low = data.filter(s => s.quantity < 10).length;
            document.getElementById('lowStock').textContent = low;
            const today = new Date();
            const in30Days = new Date();
            in30Days.setDate(today.getDate() + 30);
            const expiring = data.filter(s => new Date(s.expiryDate) <= in30Days).length;
            document.getElementById('expiringSoon').textContent = expiring;
        });
}

function loadRecentBills() {
    fetch('api/bill')
        .then(res => res.json())
        .then(bills => {
            const tbody = document.getElementById('recentBillsTable');
            if (bills.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:#999;">No bills yet</td></tr>';
                return;
            }
            tbody.innerHTML = bills.map(b => `
                <tr>
                    <td>${b.billNumber}</td>
                    <td>${b.customerName || 'Walk-in'}</td>
                    <td>₹${b.totalAmount}</td>
                    <td><span class="badge badge-success">${b.paymentMode}</span></td>
                    <td>${new Date(b.billDate).toLocaleDateString('en-IN')}</td>
                </tr>
            `).join('');
        });
}