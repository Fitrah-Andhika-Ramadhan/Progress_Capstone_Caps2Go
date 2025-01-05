 // Global variables for charts
 let salesChart, menuChart;

 // Utility function to format currency
 function formatCurrency(amount) {
     return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
         minimumFractionDigits: 0
     }).format(amount);
 }

 // Generate random sales data
 function generateSalesData(period = 'today') {
     const data = [];
     const now = new Date();
     let points = 24; // Default hourly points for today

     switch(period) {
         case 'week':
             points = 7;
             for(let i = 0; i < points; i++) {
                 data.push({
                     label: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][i],
                     sales: Math.floor(Math.random() * 15000000) + 5000000,
                     orders: Math.floor(Math.random() * 100) + 50
                 });
             }
             break;
         
         case 'month':
             points = 30;
             for(let i = 0; i < points; i++) {
                 data.push({
                     label: `Hari ${i + 1}`,
                     sales: Math.floor(Math.random() * 20000000) + 8000000,
                     orders: Math.floor(Math.random() * 150) + 70
                 });
             }
             break;
         
         default: // today - hourly
             for(let i = 0; i < points; i++) {
                 data.push({
                     label: `${i}:00`,
                     sales: Math.floor(Math.random() * 2000000) + 500000,
                     orders: Math.floor(Math.random() * 30) + 10
                 });
             }
     }
     return data;
 }

 // Initialize and update charts
 function initializeCharts() {
     const salesCtx = document.getElementById('salesChart').getContext('2d');
     const menuCtx = document.getElementById('menuChart').getContext('2d');

     // Sales Chart
     salesChart = new Chart(salesCtx, {
         type: 'line',
         data: {
             labels: [],
             datasets: [{
                 label: 'Penjualan',
                 borderColor: '#3498db',
                 data: [],
                 tension: 0.4
             }, {
                 label: 'Jumlah Pesanan',
                 borderColor: '#2ecc71',
                 data: [],
                 tension: 0.4
             }]
         },
         options: {
             responsive: true,
             maintainAspectRatio: false,
             scales: {
                 y: {
                     beginAtZero: true,
                     ticks: {
                         callback: value => formatCurrency(value)
                     }
                 }
             }
         }
     });

     // Menu Popularity Chart
     menuChart = new Chart(menuCtx, {
         type: 'doughnut',
         data: {
             labels: ['Nasi Goreng', 'Ayam Bakar', 'Sate Ayam', 'Sop Iga', 'Es Teh'],
             datasets: [{
                 data: [30, 25, 20, 15, 10],
                 backgroundColor: [
                     '#3498db',
                     '#2ecc71',
                     '#f1c40f',
                     '#e74c3c',
                     '#9b59b6'
                 ]
             }]
         },
         options: {
             responsive: true,
             maintainAspectRatio: false
         }
     });
 }

 // Update dashboard metrics
 function updateDashboardMetrics() {
     // Update revenue
     const revenue = Math.floor(Math.random() * 15000000) + 5000000;
     document.getElementById('totalRevenue').textContent = formatCurrency(revenue);

     // Update orders
     const orders = Math.floor(Math.random() * 100) + 50;
     document.getElementById('totalOrders').textContent = orders;

     // Update average order value
     const avgOrder = Math.floor(revenue / orders);
     document.getElementById('avgOrderValue').textContent = formatCurrency(avgOrder);

     // Update table occupancy
     const occupancy = Math.floor(Math.random() * 40) + 60;
     document.getElementById('tableOccupancy').textContent = `${occupancy}%`;

     // Highlight updated elements
     document.querySelectorAll('.stat-card').forEach(card => {
         card.classList.add('highlight');
         setTimeout(() => card.classList.remove('highlight'), 1000);
     });
 }

 // Update table grid
 function updateTableGrid() {
     const tableGrid = document.getElementById('tableGrid');
     tableGrid.innerHTML = '';

     for(let i = 1; i <= 12; i++) {
         const status = Math.random();
         let statusClass, statusText;

         if(status < 0.4) {
             statusClass = 'status-available';
             statusText = 'Tersedia';
         } else if(status < 0.7) {
             statusClass = 'status-occupied';
             statusText = 'Terisi';
         } else {
             statusClass = 'status-reserved';
             statusText = 'Reservasi';
         }

         const tableCard = `
             <div class="col-md-3 mb-3">
                 <div class="card">
                     <div class="card-body">
                         <div class="d-flex justify-content-between align-items-center">
                             <h6 class="mb-0">Meja #${i}</h6>
                             <span class="table-status ${statusClass}"></span>
                         </div>
                         <small class="text-muted">${statusText}</small>
                         ${statusClass === 'status-occupied' ? 
                             `<div class="mt-2">
                                 <small class="text-muted">Durasi: ${Math.floor(Math.random() * 60) + 30} menit</small>
                             </div>` : ''}
                     </div>
                 </div>
             </div>
         `;
         tableGrid.innerHTML += tableCard;
     }
 }

 // Update kitchen orders
 function updateKitchenOrders() {
     const orders = [
         { table: 12, items: ['Nasi Goreng Spesial (2)', 'Ayam Bakar (2)'], time: '15:00', status: 'urgent' },
         { table: 8, items: ['Sate Ayam (1)', 'Sop Iga (1)'], time: '10:00', status: 'normal' },
         { table: 5, items: ['Es Teh (3)', 'Nasi Goreng (3)'], time: '12:00', status: 'completed' }
     ];

     // Update would go here...
 }

 // Initialize dashboard
 function initializeDashboard() {
     initializeCharts();
     updateDashboardMetrics();
     updateTableGrid();
     updateKitchenOrders();

     // Update sales chart with initial data
     const salesData = generateSalesData();
     salesChart.data.labels = salesData.map(d => d.label);
     salesChart.data.datasets[0].data = salesData.map(d => d.sales);
     salesChart.data.datasets[1].data = salesData.map(d => d.orders);
     salesChart.update();

     // Set up periodic updates
     setInterval(() => {
         updateDashboardMetrics();
         updateTableGrid();
         
         // Update charts with new data
         const newSalesData = generateSalesData();
         salesChart.data.datasets[0].data = newSalesData.map(d => d.sales);
         salesChart.data.datasets[1].data = newSalesData.map(d => d.orders);
         salesChart.update();
     }, 30000); // Update every 30 seconds
 }

 // Event Listeners
 document.addEventListener('DOMContentLoaded', initializeDashboard);

 // Period filter change handler
 document.getElementById('periodFilter').addEventListener('change', function(e) {
     const salesData = generateSalesData(e.target.value);
     salesChart.data.labels = salesData.map(d => d.label);
     salesChart.data.datasets[0].data = salesData.map(d => d.sales);
     salesChart.data.datasets[1].data = salesData.map(d => d.orders);
     salesChart.update();
 });

 // Navigation handling
 document.querySelectorAll('#sidebar .nav-link').forEach(link => {
     link.addEventListener('click', function(e) {
         e.preventDefault();
         
         // Remove active class from all links
         document.querySelectorAll('#sidebar .nav-link').forEach(l => 
             l.classList.remove('active'));
         
         // Add active class to clicked link
         this.classList.add('active');
         
         // Hide all sections and show the selected one
         const targetSection = this.getAttribute('data-section');
         document.querySelectorAll('section').forEach(section => 
             section.style.display = 'none');
         document.getElementById(targetSection).style.display = 'block';
     });
 });

 // Real-time notifications
 let notificationCount = 5;
 function updateNotifications() {
     const badges = document.querySelectorAll('.notification-badge');
     badges.forEach(badge => {
         if (Math.random() > 0.7) {
             notificationCount++;
             badge.textContent = notificationCount;
             badge.classList.add('highlight');
             setTimeout(() => badge.classList.remove('highlight'), 1000);
         }
     });
 }
 setInterval(updateNotifications, 45000); // Check for new notifications every 45 seconds

 
// Order Management System
const OrderManagement = {
// Data Store
orders: [],
activeOrders: [],
orderHistory: [],
menuItems: [
 { id: 1, name: 'Nasi Goreng Spesial', price: 35000, category: 'Main Course' },
 { id: 2, name: 'Ayam Bakar', price: 40000, category: 'Main Course' },
 { id: 3, name: 'Sate Ayam', price: 30000, category: 'Main Course' },
 { id: 4, name: 'Sop Iga', price: 45000, category: 'Main Course' },
 { id: 5, name: 'Es Teh Manis', price: 8000, category: 'Beverage' },
 { id: 6, name: 'Juice Alpukat', price: 15000, category: 'Beverage' },
 { id: 7, name: 'Mie Goreng', price: 30000, category: 'Main Course' },
 { id: 8, name: 'Capcay', price: 35000, category: 'Main Course' }
],

// Initialize System
initialize() {
 this.generateDummyOrders();
 this.initializeOrderTables();
 this.setupEventListeners();
 this.startRealTimeUpdates();
},

// Generate Dummy Orders
generateDummyOrders() {
 // Generate current active orders
 for (let i = 0; i < 5; i++) {
     this.activeOrders.push(this.generateRandomOrder('active'));
 }

 // Generate order history
 for (let i = 0; i < 20; i++) {
     this.orderHistory.push(this.generateRandomOrder('history'));
 }

 this.updateOrderSummary();
},

// Generate a random order
generateRandomOrder(type) {
 const statuses = type === 'active' ? 
     ['Baru', 'Diproses', 'Siap'] : 
     ['Selesai', 'Dibatalkan'];
 const orderTypes = ['Makan di Tempat', 'Bawa Pulang', 'Pengantaran'];
 const tables = Array.from({length: 20}, (_, i) => i + 1);

 const orderItems = [];
 const itemCount = Math.floor(Math.random() * 4) + 1;
 for (let i = 0; i < itemCount; i++) {
     const menuItem = this.menuItems[Math.floor(Math.random() * this.menuItems.length)];
     const quantity = Math.floor(Math.random() * 3) + 1;
     orderItems.push({
         ...menuItem,
         quantity,
         subtotal: menuItem.price * quantity
     });
 }

 const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
 const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
 const tableNo = orderType === 'Makan di Tempat' ? 
     `Meja #${tables[Math.floor(Math.random() * tables.length)]}` : '-';

 return {
     id: `ORD${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
     date: type === 'active' ? 
         new Date() : 
         new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
     type: orderType,
     tableNo: tableNo,
     items: orderItems,
     total: total,
     status: statuses[Math.floor(Math.random() * statuses.length)],
     customer: type === 'active' ? {
         name: 'Customer ' + Math.floor(Math.random() * 100),
         phone: '08' + Math.floor(Math.random() * 1000000000)
     } : null
 };
},

// Initialize Order Tables
initializeOrderTables() {
 this.updateActiveOrdersTable();
 this.updateOrderHistoryTable();
 this.updateOrderSummary();
},

// Update Active Orders Table
updateActiveOrdersTable() {
 const tableBody = document.getElementById('activeOrdersTable');
 if (!tableBody) return;

 tableBody.innerHTML = this.activeOrders.map(order => `
     <tr>
         <td>${order.id}</td>
         <td>${order.tableNo}</td>
         <td>
             <small class="d-block">${order.items.map(item => 
                 `${item.name} (${item.quantity}x)`).join('<br>')}</small>
         </td>
         <td>${this.formatCurrency(order.total)}</td>
         <td>
             <span class="badge bg-${this.getStatusColor(order.status)}">
                 ${order.status}
             </span>
         </td>
         <td>
             <div class="btn-group">
                 <button class="btn btn-sm btn-outline-primary" onclick="OrderManagement.updateOrderStatus('${order.id}')">
                     <i class="bi bi-arrow-right-circle"></i>
                 </button>
                 <button class="btn btn-sm btn-outline-danger" onclick="OrderManagement.cancelOrder('${order.id}')">
                     <i class="bi bi-x-circle"></i>
                 </button>
             </div>
         </td>
     </tr>
 `).join('');
},

// Update Order History Table
updateOrderHistoryTable() {
 const tableBody = document.getElementById('orderHistoryTable');
 if (!tableBody) return;

 tableBody.innerHTML = this.orderHistory.map(order => `
     <tr>
         <td>${order.date.toLocaleDateString()}</td>
         <td>${order.id}</td>
         <td>${order.type}</td>
         <td>
             <small class="d-block">${order.items.map(item => 
                 `${item.name} (${item.quantity}x)`).join('<br>')}</small>
         </td>
         <td>${this.formatCurrency(order.total)}</td>
         <td>
             <span class="badge bg-${this.getStatusColor(order.status)}">
                 ${order.status}
             </span>
         </td>
         <td>
             <button class="btn btn-sm btn-outline-info" onclick="OrderManagement.viewOrderDetails('${order.id}')">
                 <i class="bi bi-eye"></i>
             </button>
         </td>
     </tr>
 `).join('');
},

// Update Order Summary
updateOrderSummary() {
 const todayOrders = this.activeOrders.length;
 const totalRevenue = this.activeOrders.reduce((sum, order) => 
     sum + (order.status !== 'Dibatalkan' ? order.total : 0), 0);

 document.getElementById('todayOrderCount').textContent = todayOrders;
 document.getElementById('todayOrderRevenue').textContent = this.formatCurrency(totalRevenue);

 // Update progress bars
 const statusCounts = {
     'Selesai': this.activeOrders.filter(o => o.status === 'Selesai').length,
     'Diproses': this.activeOrders.filter(o => o.status === 'Diproses').length,
     'Baru': this.activeOrders.filter(o => o.status === 'Baru').length
 };

 const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
 
 document.querySelector('.progress-bar.bg-success').style.width = 
     `${(statusCounts['Selesai'] / total * 100)}%`;
 document.querySelector('.progress-bar.bg-warning').style.width = 
     `${(statusCounts['Diproses'] / total * 100)}%`;
 document.querySelector('.progress-bar.bg-danger').style.width = 
     `${(statusCounts['Baru'] / total * 100)}%`;
},

// Helper Functions
formatCurrency(amount) {
 return new Intl.NumberFormat('id-ID', {
     style: 'currency',
     currency: 'IDR'
 }).format(amount);
},

getStatusColor(status) {
 const colors = {
     'Baru': 'danger',
     'Diproses': 'warning',
     'Siap': 'info',
     'Selesai': 'success',
     'Dibatalkan': 'secondary'
 };
 return colors[status] || 'primary';
},

// CRUD Operations
addNewOrder(orderData) {
 const newOrder = {
     id: `ORD${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
     date: new Date(),
     ...orderData,
     status: 'Baru'
 };

 this.activeOrders.unshift(newOrder);
 this.updateActiveOrdersTable();
 this.updateOrderSummary();
},

updateOrderStatus(orderId) {
 const order = this.activeOrders.find(o => o.id === orderId);
 if (!order) return;

 const statusFlow = {
     'Baru': 'Diproses',
     'Diproses': 'Siap',
     'Siap': 'Selesai'
 };

 if (statusFlow[order.status]) {
     order.status = statusFlow[order.status];
     
     if (order.status === 'Selesai') {
         this.activeOrders = this.activeOrders.filter(o => o.id !== orderId);
         this.orderHistory.unshift(order);
     }
     
     this.updateActiveOrdersTable();
     this.updateOrderHistoryTable();
     this.updateOrderSummary();
 }
},

cancelOrder(orderId) {
 const orderIndex = this.activeOrders.findIndex(o => o.id === orderId);
 if (orderIndex === -1) return;

 const order = this.activeOrders[orderIndex];
 order.status = 'Dibatalkan';
 
 this.activeOrders.splice(orderIndex, 1);
 this.orderHistory.unshift(order);
 
 this.updateActiveOrdersTable();
 this.updateOrderHistoryTable();
 this.updateOrderSummary();
},

// Real-time Updates
startRealTimeUpdates() {
 setInterval(() => {
     // Randomly add new orders
     if (Math.random() < 0.3) {
         this.addNewOrder(this.generateRandomOrder('active'));
     }

     // Randomly progress order statuses
     this.activeOrders.forEach(order => {
         if (Math.random() < 0.2) {
             this.updateOrderStatus(order.id);
         }
     });
 }, 30000); // Every 30 seconds
},

// Event Listeners
setupEventListeners() {
 // Order Status Filter
 const statusFilter = document.getElementById('orderStatusFilter');
 if (statusFilter) {
     statusFilter.addEventListener('change', (e) => {
         this.filterOrders('status', e.target.value);
     });
 }

 // Order Type Filter
 const typeFilter = document.getElementById('orderTypeFilter');
 if (typeFilter) {
     typeFilter.addEventListener('change', (e) => {
         this.filterOrders('type', e.target.value);
     });
 }

 // Date Filter
 const dateFilter = document.getElementById('orderDateFilter');
 if (dateFilter) {
     dateFilter.addEventListener('change', (e) => {
         this.filterOrders('date', e.target.value);
     });
 }

 // Search Input
 const searchInput = document.querySelector('input[placeholder="No. Pesanan/Meja"]');
 if (searchInput) {
     searchInput.addEventListener('input', (e) => {
         this.filterOrders('search', e.target.value);
     });
 }
},

// Filter Orders
filterOrders(filterType, value) {
 let filteredOrders = [...this.activeOrders];

 switch (filterType) {
     case 'status':
         if (value !== 'all') {
             filteredOrders = filteredOrders.filter(order => order.status === value);
         }
         break;

     case 'type':
         if (value !== 'all') {
             filteredOrders = filteredOrders.filter(order => order.type === value);
         }
         break;

     case 'date':
         if (value) {
             const filterDate = new Date(value).toDateString();
             filteredOrders = filteredOrders.filter(order => 
                 order.date.toDateString() === filterDate);
         }
         break;

     case 'search':
         if (value) {
             const searchTerm = value.toLowerCase();
             filteredOrders = filteredOrders.filter(order => 
                 order.id.toLowerCase().includes(searchTerm) ||
                 order.tableNo.toLowerCase().includes(searchTerm));
         }
         break;
 }

 // Update table with filtered orders
 const tableBody = document.getElementById('activeOrdersTable');
 if (tableBody) {
     tableBody.innerHTML = this.generateOrderRows(filteredOrders);
 }
}
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
OrderManagement.initialize();
});



// Table Management System
const TableManagement = {
// Data Store
tables: [], // All tables data
reservations: [], // All reservations
todayReservations: [], // Today's reservations

// Constants
TOTAL_TABLES: 20,
TABLE_STATUSES: {
 AVAILABLE: 'Tersedia',
 OCCUPIED: 'Terisi',
 RESERVED: 'Reservasi'
},

// Initialize System
initialize() {
 this.generateTables();
 this.generateReservations();
 this.updateDashboard();
 this.renderTableLayout();
 this.updateReservationsList();
 this.renderCalendar();
 this.updateReservationHistory();
 this.setupEventListeners();
 this.startRealTimeUpdates();
},

// Generate Tables Data
generateTables() {
 this.tables = Array.from({length: this.TOTAL_TABLES}, (_, i) => ({
     id: i + 1,
     capacity: Math.floor(Math.random() * 4) + 2, // 2-6 seats
     status: this.TABLE_STATUSES.AVAILABLE,
     occupiedSince: null,
     estimatedEndTime: null
 }));

 // Set some tables as occupied
 for(let i = 0; i < 10; i++) {
     const randomTable = this.tables[Math.floor(Math.random() * this.TOTAL_TABLES)];
     if(randomTable.status === this.TABLE_STATUSES.AVAILABLE) {
         const startTime = new Date();
         startTime.setMinutes(startTime.getMinutes() - Math.floor(Math.random() * 60));
         randomTable.status = this.TABLE_STATUSES.OCCUPIED;
         randomTable.occupiedSince = startTime;
         randomTable.estimatedEndTime = new Date(startTime.getTime() + (45 * 60000));
     }
 }
},

// Generate Reservations Data
generateReservations() {
 const names = [
     'Budi Santoso', 'Siti Rahayu', 'Ahmad Wijaya', 'Dewi Kusuma',
     'Rini Putri', 'Eko Prasetyo', 'Nina Sari', 'Joko Susilo'
 ];

 // Generate today's reservations
 const today = new Date();
 for(let i = 0; i < 5; i++) {
     const reservationTime = new Date(today);
     reservationTime.setHours(17 + Math.floor(Math.random() * 4));
     reservationTime.setMinutes(Math.floor(Math.random() * 12) * 5);

     this.reservations.push({
         id: `RES${String(i + 1).padStart(3, '0')}`,
         customerName: names[Math.floor(Math.random() * names.length)],
         date: reservationTime,
         guestCount: Math.floor(Math.random() * 4) + 2,
         tableNo: Math.floor(Math.random() * this.TOTAL_TABLES) + 1,
         status: 'Confirmed',
         notes: Math.random() > 0.7 ? 'Request tempat dekat jendela' : ''
     });
 }

 // Generate future reservations
 for(let i = 1; i <= 30; i++) {
     const futureDate = new Date(today);
     futureDate.setDate(today.getDate() + i);
     
     const reservationsCount = Math.floor(Math.random() * 3) + 1;
     for(let j = 0; j < reservationsCount; j++) {
         futureDate.setHours(17 + Math.floor(Math.random() * 4));
         futureDate.setMinutes(Math.floor(Math.random() * 12) * 5);

         this.reservations.push({
             id: `RES${String(this.reservations.length + 1).padStart(3, '0')}`,
             customerName: names[Math.floor(Math.random() * names.length)],
             date: new Date(futureDate),
             guestCount: Math.floor(Math.random() * 4) + 2,
             tableNo: Math.floor(Math.random() * this.TOTAL_TABLES) + 1,
             status: Math.random() > 0.8 ? 'Pending' : 'Confirmed',
             notes: ''
         });
     }
 }

 // Update today's reservations
 this.updateTodayReservations();
},

// Update Dashboard
updateDashboard() {
 const availableTables = this.tables.filter(t => t.status === this.TABLE_STATUSES.AVAILABLE).length;
 const occupiedTables = this.tables.filter(t => t.status === this.TABLE_STATUSES.OCCUPIED).length;
 const todayReservationsCount = this.todayReservations.length;
 
 document.getElementById('availableTables').textContent = availableTables;
 document.getElementById('occupiedTables').textContent = occupiedTables;
 document.getElementById('todayReservations').textContent = todayReservationsCount;

 // Update wait time
 const avgWaitTime = Math.ceil(this.calculateAverageWaitTime());
 document.getElementById('avgWaitTime').textContent = `${avgWaitTime} min`;
},

// Render Table Layout
renderTableLayout() {
 const layoutContainer = document.getElementById('restaurantLayout');
 if (!layoutContainer) return;

 layoutContainer.innerHTML = this.tables.map(table => `
     <div class="col-md-3 mb-3">
         <div class="card ${this.getTableStatusClass(table.status)}">
             <div class="card-body">
                 <h5 class="card-title">Meja #${table.id}</h5>
                 <p class="card-text">${table.capacity} Kursi</p>
                 <div class="d-flex justify-content-between align-items-center">
                     <span class="badge ${this.getStatusBadgeClass(table.status)}">
                         ${table.status}
                     </span>
                     ${table.occupiedSince ? `
                         <small class="text-muted">
                             ${this.getOccupiedDuration(table.occupiedSince)}
                         </small>
                     ` : ''}
                 </div>
             </div>
         </div>
     </div>
 `).join('');
},

// Update Today's Reservations List
updateReservationsList() {
 const reservationsList = document.getElementById('todayReservationsList');
 if (!reservationsList) return;

 reservationsList.innerHTML = this.todayReservations
     .sort((a, b) => a.date - b.date)
     .map(reservation => `
         <div class="reservation-item mb-3">
             <div class="d-flex justify-content-between align-items-center">
                 <div>
                     <h6 class="mb-1">
                         ${reservation.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                         ${reservation.customerName}
                     </h6>
                     <small>
                         ${reservation.guestCount} orang - Meja #${reservation.tableNo}
                         ${reservation.notes ? `<br>${reservation.notes}` : ''}
                     </small>
                 </div>
                 <span class="badge bg-${this.getReservationStatusColor(reservation.status)}">
                     ${reservation.status}
                 </span>
             </div>
         </div>
     `).join('');
},

// Render Reservation Calendar
renderCalendar() {
 const calendarBody = document.getElementById('calendarBody');
 if (!calendarBody) return;

 const currentDate = new Date();
 const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
 const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
 
 let calendarHtml = '';
 let currentWeek = [];
 
 // Add empty cells for days before first day of month
 for(let i = 0; i < firstDay.getDay(); i++) {
     currentWeek.push('<td></td>');
 }

 // Add days of month
 for(let day = 1; day <= lastDay.getDate(); day++) {
     const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
     const dayReservations = this.getReservationsForDate(date);
     
     currentWeek.push(`
         <td class="calendar-day">
             <div class="day-number">${day}</div>
             ${dayReservations.map(res => `
                 <div class="calendar-event">
                     ${res.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                     ${res.customerName}
                 </div>
             `).join('')}
         </td>
     `);

     if(currentWeek.length === 7) {
         calendarHtml += `<tr>${currentWeek.join('')}</tr>`;
         currentWeek = [];
     }
 }

 // Add remaining empty cells
 while(currentWeek.length < 7) {
     currentWeek.push('<td></td>');
 }
 if(currentWeek.length) {
     calendarHtml += `<tr>${currentWeek.join('')}</tr>`;
 }

 calendarBody.innerHTML = calendarHtml;
},

// Update Reservation History
updateReservationHistory() {
 const historyTable = document.getElementById('reservationHistoryTable');
 if (!historyTable) return;

 const sortedReservations = [...this.reservations].sort((a, b) => b.date - a.date);
 historyTable.innerHTML = sortedReservations.map(res => `
     <tr>
         <td>${res.id}</td>
         <td>${res.customerName}</td>
         <td>${res.date.toLocaleDateString()}</td>
         <td>${res.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
         <td>${res.guestCount}</td>
         <td>Meja #${res.tableNo}</td>
         <td>
             <span class="badge bg-${this.getReservationStatusColor(res.status)}">
                 ${res.status}
             </span>
         </td>
         <td>
             <div class="btn-group">
                 <button class="btn btn-sm btn-info" onclick="TableManagement.viewReservation('${res.id}')">
                     <i class="bi bi-eye"></i>
                 </button>
                 <button class="btn btn-sm btn-danger" onclick="TableManagement.cancelReservation('${res.id}')">
                     <i class="bi bi-x-circle"></i>
                 </button>
             </div>
         </td>
     </tr>
 `).join('');
},

// Real-time Updates
startRealTimeUpdates() {
 setInterval(() => {
     // Update occupied tables time
     this.tables.forEach(table => {
         if(table.status === this.TABLE_STATUSES.OCCUPIED) {
             if(new Date() >= table.estimatedEndTime) {
                 table.status = this.TABLE_STATUSES.AVAILABLE;
                 table.occupiedSince = null;
                 table.estimatedEndTime = null;
             }
         }
     });

     // Update today's reservations
     this.updateTodayReservations();

     // Refresh UI
     this.updateDashboard();
     this.renderTableLayout();
     this.updateReservationsList();
     this.updateReservationHistory();
 }, 60000); // Every minute
},

// Helper Functions
getTableStatusClass(status) {
 const classes = {
     [this.TABLE_STATUSES.AVAILABLE]: 'bg-success text-white',
     [this.TABLE_STATUSES.OCCUPIED]: 'bg-danger text-white',
     [this.TABLE_STATUSES.RESERVED]: 'bg-warning'
 };
 return classes[status] || '';
},

getStatusBadgeClass(status) {
 const classes = {
     [this.TABLE_STATUSES.AVAILABLE]: 'bg-success',
     [this.TABLE_STATUSES.OCCUPIED]: 'bg-danger',
     [this.TABLE_STATUSES.RESERVED]: 'bg-warning'
 };
 return classes[status] || 'bg-secondary';
},

getOccupiedDuration(startTime) {
 const duration = Math.floor((new Date() - startTime) / 60000); // in minutes
 return `${duration} menit`;
},

calculateAverageWaitTime() {
 const occupiedTables = this.tables.filter(t => t.status === this.TABLE_STATUSES.OCCUPIED);
 if(occupiedTables.length === 0) return 0;

 return occupiedTables.reduce((total, table) => {
     const remainingTime = Math.max(0, 
         (table.estimatedEndTime - new Date()) / 60000
     );
     return total + remainingTime;
 }, 0) / occupiedTables.length;
},

getReservationsForDate(date) {
 return this.reservations.filter(res => 
     res.date.toDateString() === date.toDateString()
 );
},

updateTodayReservations() {
 const today = new Date();
 this.todayReservations = this.reservations.filter(res => 
     res.date.toDateString() === today.toDateString() &&
     res.status !== 'Cancelled'
 );
},

getReservationStatusColor(status) {
 const colors = {
     'Confirmed': 'success',
     'Pending': 'warning',
     'Cancelled': 'danger',
     'Completed': 'info'
 };
 return colors[status] || 'secondary';
},

// Event Listeners
setupEventListeners() {
 // Month navigation for calendar
 const prevMonth = document.getElementById('prevMonth');
 const nextMonth = document.getElementById('nextMonth');
 if(prevMonth && nextMonth) {
     prevMonth.addEventListener('click', () => this.changeMonth(-1));
     nextMonth.addEventListener('click', () => this.changeMonth(1));
 }

 // Date filter for reservation history
 const dateFilter = document.getElementById('reservationHistoryDate');
 if(dateFilter) {
     dateFilter.addEventListener('change', (e) => {
         this.filterReservationHistory(e.target.value);
     });
 }
}
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
TableManagement.initialize();
});

// Enhanced Staff Management System
const StaffManagement = {
// Data Stores
staff: [],
shiftSchedule: {},
attendanceLogs: {},
performanceMetrics: {},

// Constants
DEPARTMENTS: {
'Dapur': ['Head Chef', 'Sous Chef', 'Line Cook', 'Kitchen Helper'],
'Pelayanan': ['Supervisor', 'Waiter', 'Waitress', 'Host'],
'Kasir': ['Head Cashier', 'Cashier'],
'Kebersihan': ['Cleaning Supervisor', 'Cleaning Staff']
},

SHIFTS: {
'Pagi': '06:00 - 14:00',
'Siang': '14:00 - 22:00', 
'Malam': '22:00 - 06:00'
},

// Initialize System
initialize() {
this.generateStaffData();
this.generateShiftSchedule();
this.generateAttendanceLogs();
this.generatePerformanceData();
this.updateUI();
this.startRealTimeUpdates();
},

// Generate Staff Data
generateStaffData() {
const names = [
    'Budi Santoso', 'Siti Rahayu', 'Ahmad Wijaya', 'Dewi Kusuma',
    'Rini Putri', 'Eko Prasetyo', 'Nina Sari', 'Joko Susilo',
    'Maya Indah', 'Dedi Kurniawan', 'Rina Wati', 'Agus Setiawan',
    'Sri Wahyuni', 'Hendra Putra', 'Lina Kartika', 'Tono Wijaya',
    'Ani Susanti', 'Bambang Kusuma', 'Citra Dewi', 'Dimas Prayoga',
    'Eva Muliana', 'Farhan Akbar', 'Gita Purnama', 'Hadi Wijaya'
];

this.staff = names.map((name, idx) => {
    const dept = this.getRandomDepartment();
    return {
        id: `STF${String(idx + 1).padStart(3, '0')}`,
        name: name,
        department: dept,
        position: this.getRandomPosition(dept),
        shift: this.getRandomShift(),
        status: Math.random() > 0.15 ? 'Aktif' : 'Cuti',
        performance: {
            overall: Math.floor(Math.random() * 20) + 80,
            attendance: Math.floor(Math.random() * 15) + 85,
            quality: Math.floor(Math.random() * 20) + 80,
            teamwork: Math.floor(Math.random() * 15) + 85
        },
        joinDate: this.generateRandomDate(2020, 2024)
    };
});
},

// Generate Shift Schedule
generateShiftSchedule() {
const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

this.shiftSchedule = days.reduce((schedule, day) => {
    schedule[day] = Object.keys(this.SHIFTS).reduce((shifts, shift) => {
        shifts[shift] = this.staff
            .filter(s => s.status === 'Aktif' && Math.random() > 0.6)
            .map(s => ({
                id: s.id,
                name: s.name,
                position: s.position
            }));
        return shifts;
    }, {});
    return schedule;
}, {});
},

// Generate Attendance Logs
generateAttendanceLogs() {
const today = new Date();
this.attendanceLogs = this.staff.reduce((logs, staff) => {
    if (staff.status === 'Aktif') {
        const isPresent = Math.random() > 0.1;
        if (isPresent) {
            const checkIn = this.generateRandomTime(6, 8);
            const checkOut = this.generateRandomTime(14, 16);
            logs[staff.id] = {
                date: today,
                checkIn: checkIn,
                checkOut: checkOut,
                status: checkIn > '07:30' ? 'Terlambat' : 'Hadir',
                notes: checkIn > '07:30' ? `Terlambat ${this.calculateLateDuration(checkIn)}` : ''
            };
        } else {
            logs[staff.id] = {
                date: today,
                status: 'Tidak Hadir',
                notes: 'Tanpa Keterangan'
            };
        }
    } else {
        logs[staff.id] = {
            date: today,
            status: 'Cuti',
            notes: 'Cuti Tahunan'
        };
    }
    return logs;
}, {});
},

// Generate Performance Data
generatePerformanceData() {
const departments = Object.keys(this.DEPARTMENTS);
const metrics = ['Kualitas Kerja', 'Kehadiran', 'Kerja Tim', 'Inisiatif'];

this.performanceMetrics = departments.reduce((data, dept) => {
    data[dept] = metrics.reduce((scores, metric) => {
        scores[metric] = Math.floor(Math.random() * 20) + 80;
        return scores;
    }, {});
    return data;
}, {});
},

// Update UI Components
updateUI() {
this.updateDashboardMetrics();
this.updateActiveStaffTable();
this.updateShiftScheduleTab();
this.updateAttendanceTab();
this.updatePerformanceTab();
},

// Update Dashboard Metrics
updateDashboardMetrics() {
const activeStaff = this.staff.filter(s => s.status === 'Aktif').length;
const presentToday = Object.values(this.attendanceLogs)
    .filter(log => ['Hadir', 'Terlambat'].includes(log.status)).length;
const onLeave = this.staff.filter(s => s.status === 'Cuti').length;

document.getElementById('totalStaff').textContent = this.staff.length;
document.getElementById('presentToday').textContent = presentToday;
document.getElementById('onLeave').textContent = onLeave;
document.getElementById('teamPerformance').textContent = this.calculateTeamPerformance() + '%';
},

// Update Active Staff Table
updateActiveStaffTable() {
const tableBody = document.getElementById('staffTable');
if (!tableBody) return;

tableBody.innerHTML = this.staff.map(staff => `
    <tr>
        <td>${staff.id}</td>
        <td>${staff.name}</td>
        <td>${staff.department}</td>
        <td>${staff.position}</td>
        <td>${staff.shift}</td>
        <td>
            <span class="badge bg-${staff.status === 'Aktif' ? 'success' : 'warning'}">
                ${staff.status}
            </span>
        </td>
        <td>
            <div class="progress" style="height: 6px;">
                <div class="progress-bar bg-${this.getPerformanceColor(staff.performance.overall)}"
                     style="width: ${staff.performance.overall}%">
                </div>
            </div>
            <small class="text-muted">${staff.performance.overall}%</small>
        </td>
        <td>
            <div class="btn-group">
                <button class="btn btn-sm btn-outline-primary" onclick="StaffManagement.editStaff('${staff.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-info" onclick="StaffManagement.viewStaffDetails('${staff.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="StaffManagement.deleteStaff('${staff.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    </tr>
`).join('');
},

// Helper Functions
getRandomDepartment() {
const departments = Object.keys(this.DEPARTMENTS);
return departments[Math.floor(Math.random() * departments.length)];
},

getRandomPosition(department) {
const positions = this.DEPARTMENTS[department];
return positions[Math.floor(Math.random() * positions.length)];
},

getRandomShift() {
const shifts = Object.keys(this.SHIFTS);
return shifts[Math.floor(Math.random() * shifts.length)];
},

generateRandomTime(startHour, endHour) {
const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
const minute = Math.floor(Math.random() * 60);
return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
},

generateRandomDate(startYear, endYear) {
const start = new Date(startYear, 0, 1);
const end = new Date(endYear, 11, 31);
return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
},

calculateTeamPerformance() {
return Math.round(
    this.staff.reduce((sum, s) => sum + s.performance.overall, 0) / this.staff.length
);
},

getPerformanceColor(score) {
if (score >= 90) return 'success';
if (score >= 80) return 'info';
if (score >= 70) return 'warning';
return 'danger';
},

// Real-time Updates
startRealTimeUpdates() {
setInterval(() => {
    // Update random performance scores
    this.staff.forEach(staff => {
        if (staff.status === 'Aktif') {
            Object.keys(staff.performance).forEach(metric => {
                staff.performance[metric] += (Math.random() - 0.5) * 2;
                staff.performance[metric] = Math.min(100, Math.max(0, staff.performance[metric]));
            });
        }
    });

    // Update attendance logs
    this.updateAttendanceLogs();

    // Refresh UI
    this.updateUI();
}, 30000); // Update every 30 seconds
}
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
StaffManagement.initialize();
});

// Staff Performance Charts and Data
const StaffPerformanceCharts = {
// Initialize all staff charts
initialize() {
 this.initializeOverallPerformanceChart();
 this.initializeDepartmentPerformanceChart();
 this.initializeAttendanceChart();
 this.initializeTrainingProgressChart();
},

// Overall performance trends
initializeOverallPerformanceChart() {
 const ctx = document.getElementById('staffPerformanceChart');
 if (!ctx) return;

 const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 const performanceData = months.map(() => Math.floor(Math.random() * 20) + 80);
 const attendanceData = months.map(() => Math.floor(Math.random() * 15) + 85);

 new Chart(ctx, {
     type: 'line',
     data: {
         labels: months,
         datasets: [{
             label: 'Performa',
             data: performanceData,
             borderColor: 'rgb(75, 192, 192)',
             tension: 0.1,
             fill: false
         }, {
             label: 'Kehadiran',
             data: attendanceData,
             borderColor: 'rgb(255, 99, 132)',
             tension: 0.1,
             fill: false
         }]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Tren Performa Staff'
             }
         },
         scales: {
             y: {
                 min: 0,
                 max: 100
             }
         }
     }
 });
},

// Department performance comparison
initializeDepartmentPerformanceChart() {
 const ctx = document.getElementById('departmentPerformanceChart');
 if (!ctx) return;

 const departments = ['Dapur', 'Pelayanan', 'Kasir', 'Gudang', 'Kebersihan'];
 const performanceData = departments.map(() => Math.floor(Math.random() * 20) + 75);
 const efficiencyData = departments.map(() => Math.floor(Math.random() * 20) + 70);

 new Chart(ctx, {
     type: 'radar',
     data: {
         labels: departments,
         datasets: [{
             label: 'Performa',
             data: performanceData,
             backgroundColor: 'rgba(75, 192, 192, 0.2)',
             borderColor: 'rgb(75, 192, 192)',
             pointBackgroundColor: 'rgb(75, 192, 192)'
         }, {
             label: 'Efisiensi',
             data: efficiencyData,
             backgroundColor: 'rgba(255, 99, 132, 0.2)',
             borderColor: 'rgb(255, 99, 132)',
             pointBackgroundColor: 'rgb(255, 99, 132)'
         }]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Performa per Departemen'
             }
         },
         scales: {
             r: {
                 min: 0,
                 max: 100
             }
         }
     }
 });
},

// Attendance tracking
initializeAttendanceChart() {
 const ctx = document.getElementById('attendanceChart');
 if (!ctx) return;

 const lastThirtyDays = Array.from({length: 30}, (_, i) => {
     const date = new Date();
     date.setDate(date.getDate() - i);
     return date.toLocaleDateString('id-ID', {day: 'numeric', month: 'short'});
 }).reverse();

 const attendanceData = lastThirtyDays.map(() => ({
     present: Math.floor(Math.random() * 5) + 20,
     late: Math.floor(Math.random() * 3),
     absent: Math.floor(Math.random() * 2)
 }));

 new Chart(ctx, {
     type: 'bar',
     data: {
         labels: lastThirtyDays,
         datasets: [{
             label: 'Hadir',
             data: attendanceData.map(d => d.present),
             backgroundColor: 'rgb(75, 192, 192)'
         }, {
             label: 'Terlambat',
             data: attendanceData.map(d => d.late),
             backgroundColor: 'rgb(255, 205, 86)'
         }, {
             label: 'Tidak Hadir',
             data: attendanceData.map(d => d.absent),
             backgroundColor: 'rgb(255, 99, 132)'
         }]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Kehadiran Staff 30 Hari Terakhir'
             }
         },
         scales: {
             x: {
                 stacked: true
             },
             y: {
                 stacked: true
             }
         }
     }
 });
},

// Training progress
initializeTrainingProgressChart() {
 const ctx = document.getElementById('trainingProgressChart');
 if (!ctx) return;

 const trainingModules = ['Keamanan Pangan', 'Layanan Pelanggan', 'Kebersihan', 'Prosedur Operasional', 'K3'];
 const completionData = trainingModules.map(() => Math.floor(Math.random() * 30) + 70);

 new Chart(ctx, {
     type: 'doughnut',
     data: {
         labels: trainingModules,
         datasets: [{
             data: completionData,
             backgroundColor: [
                 'rgb(255, 99, 132)',
                 'rgb(75, 192, 192)',
                 'rgb(255, 205, 86)',
                 'rgb(54, 162, 235)',
                 'rgb(153, 102, 255)'
             ]
         }]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Progres Pelatihan Staff'
             }
         }
     }
 });
}
};


// Additional Report Charts for Staff Performance and Attendance
const StaffReportCharts = {
initializeStaffPerformanceReport() {
 const ctx = document.getElementById('staffPerformanceReportChart');
 if (!ctx) return;

 // Generate dummy data for staff performance
 const departments = ['Dapur', 'Pelayanan', 'Kasir', 'Gudang', 'Kebersihan'];
 const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
 
 const datasets = departments.map(dept => ({
     label: dept,
     data: months.map(() => Math.floor(Math.random() * 20) + 80), // 80-100 range
     borderColor: this.getRandomColor(),
     fill: false,
     tension: 0.4
 }));

 new Chart(ctx, {
     type: 'line',
     data: {
         labels: months,
         datasets: datasets
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Tren Performa Staff per Departemen'
             },
             legend: {
                 position: 'bottom'
             },
             tooltip: {
                 callbacks: {
                     label: function(context) {
                         return `${context.dataset.label}: ${context.parsed.y}%`;
                     }
                 }
             }
         },
         scales: {
             y: {
                 min: 60,
                 max: 100,
                 title: {
                     display: true,
                     text: 'Performa (%)'
                 }
             }
         }
     }
 });

 // Add performance breakdown chart
 const ctxBreakdown = document.getElementById('performanceBreakdownChart');
 if (ctxBreakdown) {
     const performanceMetrics = [
         'Ketepatan Waktu',
         'Kualitas Kerja',
         'Kerja Tim',
         'Inisiatif',
         'Komunikasi'
     ];

     const departmentData = departments.map(dept => ({
         label: dept,
         data: performanceMetrics.map(() => Math.floor(Math.random() * 20) + 80),
         backgroundColor: this.getRandomColor(0.6)
     }));

     new Chart(ctxBreakdown, {
         type: 'radar',
         data: {
             labels: performanceMetrics,
             datasets: departmentData
         },
         options: {
             responsive: true,
             plugins: {
                 title: {
                     display: true,
                     text: 'Breakdown Performa per Departemen'
                 }
             },
             scales: {
                 r: {
                     min: 60,
                     max: 100,
                     ticks: {
                         stepSize: 10
                     }
                 }
             }
         }
     });
 }
},

initializeStaffAttendanceReport() {
 const ctx = document.getElementById('staffAttendanceChart');
 if (!ctx) return;

 const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
 const attendanceData = months.map(() => ({
     present: Math.floor(Math.random() * 10) + 85, // 85-95%
     late: Math.floor(Math.random() * 5) + 3,     // 3-8%
     absent: Math.floor(Math.random() * 3) + 1    // 1-4%
 }));

 new Chart(ctx, {
     type: 'bar',
     data: {
         labels: months,
         datasets: [
             {
                 label: 'Hadir Tepat Waktu',
                 data: attendanceData.map(d => d.present),
                 backgroundColor: 'rgba(75, 192, 192, 0.8)',
                 stack: 'Stack 0'
             },
             {
                 label: 'Terlambat',
                 data: attendanceData.map(d => d.late),
                 backgroundColor: 'rgba(255, 206, 86, 0.8)',
                 stack: 'Stack 0'
             },
             {
                 label: 'Tidak Hadir',
                 data: attendanceData.map(d => d.absent),
                 backgroundColor: 'rgba(255, 99, 132, 0.8)',
                 stack: 'Stack 0'
             }
         ]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Laporan Kehadiran Staff'
             },
             tooltip: {
                 callbacks: {
                     label: function(context) {
                         return `${context.dataset.label}: ${context.parsed.y}%`;
                     }
                 }
             }
         },
         scales: {
             x: {
                 title: {
                     display: true,
                     text: 'Bulan'
                 }
             },
             y: {
                 stacked: true,
                 title: {
                     display: true,
                     text: 'Persentase (%)'
                 }
             }
         }
     }
 });

 // Add detailed attendance metrics
 const ctxMetrics = document.getElementById('attendanceMetricsChart');
 if (ctxMetrics) {
     const departments = ['Dapur', 'Pelayanan', 'Kasir', 'Gudang', 'Kebersihan'];
     const metrics = departments.map(() => ({
         attendance: Math.floor(Math.random() * 10) + 90,
         punctuality: Math.floor(Math.random() * 10) + 85,
         overtime: Math.floor(Math.random() * 20) + 10
     }));

     new Chart(ctxMetrics, {
         type: 'bar',
         data: {
             labels: departments,
             datasets: [
                 {
                     label: 'Tingkat Kehadiran',
                     data: metrics.map(m => m.attendance),
                     backgroundColor: 'rgba(75, 192, 192, 0.8)'
                 },
                 {
                     label: 'Ketepatan Waktu',
                     data: metrics.map(m => m.punctuality),
                     backgroundColor: 'rgba(54, 162, 235, 0.8)'
                 },
                 {
                     label: 'Lembur',
                     data: metrics.map(m => m.overtime),
                     backgroundColor: 'rgba(255, 206, 86, 0.8)'
                 }
             ]
         },
         options: {
             responsive: true,
             plugins: {
                 title: {
                     display: true,
                     text: 'Metrik Kehadiran per Departemen'
                 }
             },
             scales: {
                 y: {
                     min: 0,
                     max: 100,
                     title: {
                         display: true,
                         text: 'Persentase (%)'
                     }
                 }
             }
         }
     });
 }
},

// Utility function for random colors
getRandomColor(alpha = 1) {
 const r = Math.floor(Math.random() * 255);
 const g = Math.floor(Math.random() * 255);
 const b = Math.floor(Math.random() * 255);
 return `rgba(${r}, ${g}, ${b}, ${alpha})`;
},

// Initialize all staff report charts
initialize() {
 this.initializeStaffPerformanceReport();
 this.initializeStaffAttendanceReport();
}
};

// Add to existing initialization
document.addEventListener('DOMContentLoaded', () => {
// ... existing initializations ...
StaffReportCharts.initialize();
});

// Data Staff Management
const staffManagement = {
// Summary data
summary: {
 totalStaff: 24,
 presentToday: 20,
 onLeave: 3,
 teamPerformance: 88
},

// Staff data
staffData: [
 {
     id: "STF001",
     name: "Budi Santoso",
     department: "Dapur",
     position: "Head Chef",
     shift: "Pagi",
     status: "Aktif",
     performance: 92
 },
 {
     id: "STF002",
     name: "Siti Rahayu",
     department: "Pelayanan",
     position: "Supervisor",
     shift: "Siang",
     status: "Aktif",
     performance: 88
 },
 {
     id: "STF003",
     name: "Ahmad Wijaya",
     department: "Dapur",
     position: "Sous Chef",
     shift: "Malam",
     status: "Aktif",
     performance: 85
 },
 {
     id: "STF004", 
     name: "Dewi Kusuma",
     department: "Kasir",
     position: "Head Cashier",
     shift: "Pagi",
     status: "Cuti",
     performance: 90
 }
],

// Shift schedule
shiftSchedule: {
 Pagi: [
     {
         staffId: "STF001",
         name: "Budi Santoso",
         position: "Head Chef"
     },
     {
         staffId: "STF004",
         name: "Dewi Kusuma", 
         position: "Head Cashier"
     }
 ],
 Siang: [
     {
         staffId: "STF002",
         name: "Siti Rahayu",
         position: "Supervisor"
     }
 ],
 Malam: [
     {
         staffId: "STF003",
         name: "Ahmad Wijaya",
         position: "Sous Chef"
     }
 ]
},

// Attendance data
attendance: [
 {
     name: "Budi Santoso",
     shift: "Pagi",
     checkIn: "06:15",
     checkOut: "14:30",
     status: "Hadir",
     notes: "-"
 },
 {
     name: "Siti Rahayu",
     shift: "Siang",
     checkIn: "13:45",
     checkOut: "22:00",
     status: "Hadir",
     notes: "-"
 },
 {
     name: "Ahmad Wijaya",
     shift: "Malam",
     checkIn: "21:45",
     checkOut: "-",
     status: "Hadir",
     notes: "-"
 },
 {
     name: "Dewi Kusuma",
     shift: "-",
     checkIn: "-",
     checkOut: "-",
     status: "Cuti",
     notes: "Cuti Tahunan"
 }
],

// Performance data
performance: {
 departmental: {
     Dapur: 87,
     Pelayanan: 88,
     Kasir: 90
 },
 metrics: {
     qualityOfWork: 88,
     attendance: 92,
     teamwork: 86,
     productivity: 87
 }
}
};

// Function to update Staff Active table
function updateStaffTable() {
const tableBody = document.getElementById('staffTable');
if (!tableBody) return;

tableBody.innerHTML = staffManagement.staffData.map(staff => `
 <tr>
     <td>${staff.id}</td>
     <td>${staff.name}</td>
     <td>${staff.department}</td>
     <td>${staff.position}</td>
     <td>${staff.shift}</td>
     <td>
         <span class="badge bg-${staff.status === 'Aktif' ? 'success' : 'warning'}">
             ${staff.status}
         </span>
     </td>
     <td>
         <div class="progress" style="height: 6px;">
             <div class="progress-bar bg-${getPerformanceColor(staff.performance)}"
                  style="width: ${staff.performance}%">
             </div>
         </div>
         <small class="text-muted">${staff.performance}%</small>
     </td>
     <td>
         <div class="btn-group">
             <button class="btn btn-sm btn-outline-primary">
                 <i class="bi bi-pencil"></i>
             </button>
             <button class="btn btn-sm btn-outline-info">
                 <i class="bi bi-eye"></i>
             </button>
             <button class="btn btn-sm btn-outline-danger">
                 <i class="bi bi-trash"></i>
             </button>
         </div>
     </td>
 </tr>
`).join('');
}

// Function to update Shift Schedule
function updateShiftSchedule() {
const shifts = ['Pagi', 'Siang', 'Malam'];
shifts.forEach(shift => {
 const container = document.getElementById(`${shift.toLowerCase()}ShiftStaff`);
 if (!container) return;

 container.innerHTML = staffManagement.shiftSchedule[shift].map(staff => `
     <div class="d-flex justify-content-between align-items-center mb-2">
         <div>
             <strong>${staff.name}</strong>
             <div><small class="text-muted">${staff.position}</small></div>
         </div>
     </div>
 `).join('');
});
}

// Function to update Attendance table
function updateAttendanceTable() {
const tableBody = document.getElementById('attendanceTable');
if (!tableBody) return;

tableBody.innerHTML = staffManagement.attendance.map(record => `
 <tr>
     <td>${record.name}</td>
     <td>${record.shift}</td>
     <td>${record.checkIn}</td>
     <td>${record.checkOut}</td>
     <td>
         <span class="badge bg-${record.status === 'Hadir' ? 'success' : 'warning'}">
             ${record.status}
         </span>
     </td>
     <td>${record.notes}</td>
 </tr>
`).join('');
}

// Helper function for performance color
function getPerformanceColor(score) {
if (score >= 90) return 'success';
if (score >= 80) return 'info';
if (score >= 70) return 'warning';
return 'danger';
}

// Real-time updates
function startRealTimeUpdates() {
setInterval(() => {
 // Update random performance scores
 staffManagement.staffData.forEach(staff => {
     if (staff.status === 'Aktif') {
         staff.performance += (Math.random() - 0.5) * 2;
         staff.performance = Math.min(100, Math.max(0, staff.performance));
     }
 });

 // Update attendance times
 const now = new Date();
 const currentHour = now.getHours();
 const currentMinute = now.getMinutes();

 staffManagement.attendance.forEach(record => {
     if (record.status === 'Hadir' && !record.checkOut.includes(':')) {
         if ((record.shift === 'Pagi' && currentHour >= 14) ||
             (record.shift === 'Siang' && currentHour >= 22) ||
             (record.shift === 'Malam' && currentHour >= 6)) {
             record.checkOut = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;
         }
     }
 });

 // Update UI
 updateStaffTable();
 updateShiftSchedule();
 updateAttendanceTable();
}, 30000); // Update every 30 seconds
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
updateStaffTable();
updateShiftSchedule();
updateAttendanceTable();
startRealTimeUpdates();
});

// Inventory Management System



const InventoryManagement = {
// Data Store
inventory: [],
categories: [
 'Bahan Baku',
 'Bumbu',
 'Minuman', 
 'Pembersih',
 'Peralatan Dapur'
],
units: ['kg', 'gram', 'liter', 'pcs', 'pack', 'botol', 'karton'],

// Initialize System
initialize() {
 this.generateInitialInventory();
 this.updateDashboard();
 this.updateInventoryTable();
 this.setupEventListeners();
 this.startRealTimeUpdates();
},

// Generate Initial Inventory
generateInitialInventory() {
 const items = [
     { name: 'Beras', category: 'Bahan Baku', minStock: 50, unit: 'kg', price: 13000 },
     { name: 'Ayam', category: 'Bahan Baku', minStock: 20, unit: 'kg', price: 35000 },
     { name: 'Minyak Goreng', category: 'Bahan Baku', minStock: 30, unit: 'liter', price: 15000 },
     { name: 'Telur', category: 'Bahan Baku', minStock: 100, unit: 'kg', price: 28000 },
     { name: 'Gula', category: 'Bahan Baku', minStock: 25, unit: 'kg', price: 12000 },
     { name: 'Garam', category: 'Bumbu', minStock: 10, unit: 'kg', price: 8000 },
     { name: 'Merica', category: 'Bumbu', minStock: 5, unit: 'kg', price: 120000 },
     { name: 'Kecap', category: 'Bumbu', minStock: 20, unit: 'botol', price: 15000 },
     { name: 'Saus Sambal', category: 'Bumbu', minStock: 20, unit: 'botol', price: 18000 },
     { name: 'Air Mineral', category: 'Minuman', minStock: 50, unit: 'karton', price: 35000 },
     { name: 'Teh', category: 'Minuman', minStock: 10, unit: 'pack', price: 8000 },
     { name: 'Kopi', category: 'Minuman', minStock: 10, unit: 'kg', price: 120000 },
     { name: 'Sabun Cuci', category: 'Pembersih', minStock: 15, unit: 'liter', price: 25000 },
     { name: 'Pembersih Lantai', category: 'Pembersih', minStock: 10, unit: 'liter', price: 20000 },
     { name: 'Piring', category: 'Peralatan Dapur', minStock: 100, unit: 'pcs', price: 15000 },
     { name: 'Gelas', category: 'Peralatan Dapur', minStock: 100, unit: 'pcs', price: 8000 },
     { name: 'Sendok', category: 'Peralatan Dapur', minStock: 100, unit: 'pcs', price: 5000 },
     { name: 'Garpu', category: 'Peralatan Dapur', minStock: 100, unit: 'pcs', price: 5000 }
 ];

 this.inventory = items.map((item, index) => ({
     id: `INV${String(index + 1).padStart(3, '0')}`,
     ...item,
     stock: Math.floor(Math.random() * 50) + item.minStock,
     lastUpdated: new Date(),
     status: 'Normal'
 }));

 // Update status based on stock levels
 this.updateInventoryStatus();
},

// Update Inventory Status
updateInventoryStatus() {
 this.inventory.forEach(item => {
     if (item.stock <= item.minStock * 0.25) {
         item.status = 'Kritis';
     } else if (item.stock <= item.minStock * 0.5) {
         item.status = 'Perlu Restock';
     } else {
         item.status = 'Normal';
     }
 });
},

// Update Dashboard
updateDashboard() {
 // Update total items
 document.getElementById('totalItems').textContent = this.inventory.length;

 // Update low stock items
 const lowStock = this.inventory.filter(item => item.stock <= item.minStock * 0.5).length;
 document.getElementById('lowStockItems').textContent = lowStock;

 // Update critical items
 const critical = this.inventory.filter(item => item.stock <= item.minStock * 0.25).length;
 document.getElementById('needRestock').textContent = critical;

 // Update total inventory value
 const totalValue = this.inventory.reduce((sum, item) => sum + (item.stock * item.price), 0);
 document.getElementById('inventoryValue').textContent = this.formatCurrency(totalValue);

 // Update progress bars
 this.updateProgressBars();
},

// Update Progress Bars
updateProgressBars() {
 document.querySelector('#totalItems + .progress .progress-bar').style.width = 
     `${(this.inventory.length / 200) * 100}%`;
 
 const lowStockPercentage = (this.inventory.filter(item => 
     item.stock <= item.minStock * 0.5).length / this.inventory.length) * 100;
 document.querySelector('#lowStockItems + .progress .progress-bar').style.width = 
     `${lowStockPercentage}%`;
 
 const criticalPercentage = (this.inventory.filter(item => 
     item.stock <= item.minStock * 0.25).length / this.inventory.length) * 100;
 document.querySelector('#needRestock + .progress .progress-bar').style.width = 
     `${criticalPercentage}%`;
},

// Update Inventory Table
updateInventoryTable(filteredItems = null) {
 const tableBody = document.getElementById('inventoryTable');
 if (!tableBody) return;

 const items = filteredItems || this.inventory;
 tableBody.innerHTML = items.map(item => `
     <tr>
         <td>${item.id}</td>
         <td>${item.name}</td>
         <td>${item.category}</td>
         <td>${item.stock}</td>
         <td>${item.unit}</td>
         <td>${this.formatCurrency(item.price)}</td>
         <td>
             <span class="badge bg-${this.getStatusColor(item.status)}">
                 ${item.status}
             </span>
         </td>
         <td>
             <div class="btn-group">
                 <button class="btn btn-sm btn-primary" onclick="InventoryManagement.adjustStock('${item.id}')">
                     <i class="bi bi-plus-slash-minus"></i>
                 </button>
                 <button class="btn btn-sm btn-info" onclick="InventoryManagement.editItem('${item.id}')">
                     <i class="bi bi-pencil"></i>
                 </button>
                 <button class="btn btn-sm btn-danger" onclick="InventoryManagement.deleteItem('${item.id}')">
                     <i class="bi bi-trash"></i>
                 </button>
             </div>
         </td>
     </tr>
 `).join('');
},

// Helper Functions
formatCurrency(amount) {
 return new Intl.NumberFormat('id-ID', {
     style: 'currency',
     currency: 'IDR',
     minimumFractionDigits: 0
 }).format(amount);
},

getStatusColor(status) {
 const colors = {
     'Kritis': 'danger',
     'Perlu Restock': 'warning',
     'Normal': 'success'
 };
 return colors[status] || 'secondary';
},

// CRUD Operations
addNewItem(itemData) {
 const newId = `INV${String(this.inventory.length + 1).padStart(3, '0')}`;
 const newItem = {
     id: newId,
     ...itemData,
     stock: parseInt(itemData.stock),
     price: parseInt(itemData.price),
     minStock: parseInt(itemData.minStock),
     lastUpdated: new Date(),
     status: 'Normal'
 };

 this.inventory.push(newItem);
 this.updateInventoryStatus();
 this.updateDashboard();
 this.updateInventoryTable();
},

editItem(itemId) {
 const item = this.inventory.find(i => i.id === itemId);
 if (!item) return;

 // Populate edit modal with item data
 document.getElementById('editItemId').value = item.id;
 document.getElementById('editItemName').value = item.name;
 document.getElementById('editItemCategory').value = item.category;
 document.getElementById('editItemUnit').value = item.unit;
 document.getElementById('editItemPrice').value = item.price;
 document.getElementById('editItemMinStock').value = item.minStock;
 
 // Show edit modal
 const editModal = new bootstrap.Modal(document.getElementById('editItemModal'));
 editModal.show();
},

updateItem(itemId, updatedData) {
 const index = this.inventory.findIndex(i => i.id === itemId);
 if (index === -1) return;

 this.inventory[index] = {
     ...this.inventory[index],
     ...updatedData,
     lastUpdated: new Date()
 };

 this.updateInventoryStatus();
 this.updateDashboard();
 this.updateInventoryTable();
},

deleteItem(itemId) {
 if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;

 this.inventory = this.inventory.filter(i => i.id !== itemId);
 this.updateDashboard();
 this.updateInventoryTable();
},

adjustStock(itemId) {
 const item = this.inventory.find(i => i.id === itemId);
 if (!item) return;

 // Show stock adjustment modal
 document.getElementById('adjustStockId').value = item.id;
 document.getElementById('adjustStockName').value = item.name;
 document.getElementById('currentStock').value = item.stock;
 
 const adjustModal = new bootstrap.Modal(document.getElementById('adjustStockModal'));
 adjustModal.show();
},

updateStock(itemId, adjustment) {
 const item = this.inventory.find(i => i.id === itemId);
 if (!item) return;

 item.stock = Math.max(0, item.stock + parseInt(adjustment));
 item.lastUpdated = new Date();
 
 this.updateInventoryStatus();
 this.updateDashboard();
 this.updateInventoryTable();
},

// Real-time Updates
startRealTimeUpdates() {
 setInterval(() => {
     // Simulate stock usage
     this.inventory.forEach(item => {
         if (Math.random() < 0.3) {
             item.stock = Math.max(0, item.stock - Math.floor(Math.random() * 3));
         }
     });

     this.updateInventoryStatus();
     this.updateDashboard();
     this.updateInventoryTable();
 }, 30000); // Every 30 seconds
},

// Event Listeners
setupEventListeners() {
 // Search functionality
 const searchInput = document.querySelector('input[placeholder="Cari item..."]');
 if (searchInput) {
     searchInput.addEventListener('input', (e) => {
         const searchTerm = e.target.value.toLowerCase();
         const filtered = this.inventory.filter(item => 
             item.name.toLowerCase().includes(searchTerm) ||
             item.id.toLowerCase().includes(searchTerm) ||
             item.category.toLowerCase().includes(searchTerm)
         );
         this.updateInventoryTable(filtered);
     });
 }

 // Add new item form
 const addItemForm = document.getElementById('addItemForm');
 if (addItemForm) {
     addItemForm.addEventListener('submit', (e) => {
         e.preventDefault();
         const formData = new FormData(addItemForm);
         this.addNewItem(Object.fromEntries(formData.entries()));
         
         // Close modal
         const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
         modal.hide();
         addItemForm.reset();
     });
 }

 // Stock adjustment form
 const adjustStockForm = document.getElementById('adjustStockForm');
 if (adjustStockForm) {
     adjustStockForm.addEventListener('submit', (e) => {
         e.preventDefault();
         const itemId = document.getElementById('adjustStockId').value;
         const adjustment = document.getElementById('stockAdjustment').value;
         this.updateStock(itemId, adjustment);
         
         // Close modal
         const modal = bootstrap.Modal.getInstance(document.getElementById('adjustStockModal'));
         modal.hide();
         adjustStockForm.reset();
     });
 }
}
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
InventoryManagement.initialize();
});


// Reports Charts
const ReportsCharts = {
// Initialize all report charts
initialize() {
 this.initializeSalesReportChart();
 this.initializeInventoryReportChart();
 this.initializeFinancialReportChart();
 this.initializeCustomerSatisfactionChart();
},

// Sales Report Chart
initializeSalesReportChart() {
 const ctx = document.getElementById('salesReportChart');
 if (!ctx) return;

 const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 const salesData = months.map(() => Math.floor(Math.random() * 50000000) + 100000000);
 const transactionData = months.map(() => Math.floor(Math.random() * 500) + 1000);

 new Chart(ctx, {
     type: 'line',
     data: {
         labels: months,
         datasets: [{
             label: 'Penjualan (Rp)',
             data: salesData,
             borderColor: 'rgb(75, 192, 192)',
             yAxisID: 'y'
         }, {
             label: 'Jumlah Transaksi',
             data: transactionData,
             borderColor: 'rgb(255, 99, 132)',
             yAxisID: 'y1'
         }]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Laporan Penjualan Tahunan'
             }
         },
         scales: {
             y: {
                 type: 'linear',
                 display: true,
                 position: 'left',
                 title: {
                     display: true,
                     text: 'Penjualan (Rp)'
                 }
             },
             y1: {
                 type: 'linear',
                 display: true,
                 position: 'right',
                 title: {
                     display: true,
                     text: 'Jumlah Transaksi'
                 }
             }
         }
     }
 });
},

// Inventory Report Chart
initializeInventoryReportChart() {
 const ctx = document.getElementById('inventoryReportChart');
 if (!ctx) return;

 const categories = ['Bahan Baku', 'Bumbu', 'Minuman', 'Pembersih', 'Alat Masak'];
 const currentStock = categories.map(() => Math.floor(Math.random() * 50) + 50);
 const minimumStock = categories.map(() => 40);

 new Chart(ctx, {
     type: 'bar',
     data: {
         labels: categories,
         datasets: [{
             label: 'Stok Saat Ini',
             data: currentStock,
             backgroundColor: 'rgb(75, 192, 192)'
         }, {
             label: 'Stok Minimum',
             data: minimumStock,
             backgroundColor: 'rgb(255, 99, 132)'
         }]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Status Inventori'
             }
         }
     }
 });
},

// Financial Report Chart
initializeFinancialReportChart() {
 const ctx = document.getElementById('financialReportChart');
 if (!ctx) return;

 const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 const revenue = months.map(() => Math.floor(Math.random() * 50000000) + 100000000);
 const expenses = months.map(() => Math.floor(Math.random() * 30000000) + 70000000);
 const profit = revenue.map((rev, i) => rev - expenses[i]);

 new Chart(ctx, {
     type: 'line',
     data: {
         labels: months,
         datasets: [{
             label: 'Pendapatan',
             data: revenue,
             borderColor: 'rgb(75, 192, 192)',
             fill: false
         }, {
             label: 'Pengeluaran',
             data: expenses,
             borderColor: 'rgb(255, 99, 132)',
             fill: false
         }, {
             label: 'Profit',
             data: profit,
             borderColor: 'rgb(255, 205, 86)',
             fill: false
         }]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Laporan Keuangan Tahunan'
             }
         }
     }
 });
},

// Customer Satisfaction Chart
initializeCustomerSatisfactionChart() {
 const ctx = document.getElementById('customerSatisfactionChart');
 if (!ctx) return;

 const categories = ['Makanan', 'Layanan', 'Kebersihan', 'Kecepatan', 'Harga'];
 const satisfactionScores = categories.map(() => Math.floor(Math.random() * 2) + 3.5);

 new Chart(ctx, {
     type: 'radar',
     data: {
         labels: categories,
         datasets: [{
             label: 'Kepuasan Pelanggan',
             data: satisfactionScores,
             backgroundColor: 'rgba(75, 192, 192, 0.2)',
             borderColor: 'rgb(75, 192, 192)',
             pointBackgroundColor: 'rgb(75, 192, 192)'
         }]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Tingkat Kepuasan Pelanggan'
             }
         },
         scales: {
             r: {
                 min: 0,
                 max: 5
             }
         }
     }
 });
}
};

// Initialize charts when document is ready
document.addEventListener('DOMContentLoaded', () => {
StaffPerformanceCharts.initialize();
ReportsCharts.initialize();
});
// Inventory Movement and Critical Items Charts
const InventoryReportCharts = {
initializeInventoryMovementChart() {
 const ctx = document.getElementById('inventoryMovementChart');
 if (!ctx) return;

 // Generate dummy data for inventory movement
 const days = Array.from({length: 30}, (_, i) => `Hari ${i + 1}`);
 const items = [
     {name: 'Beras', color: 'rgb(75, 192, 192)'},
     {name: 'Ayam', color: 'rgb(255, 99, 132)'},
     {name: 'Sayuran', color: 'rgb(255, 205, 86)'},
     {name: 'Minyak', color: 'rgb(54, 162, 235)'}
 ];

 const datasets = items.map(item => ({
     label: item.name,
     data: days.map(() => Math.floor(Math.random() * 50) + 50),
     borderColor: item.color,
     backgroundColor: item.color,
     fill: false,
     tension: 0.4
 }));

 new Chart(ctx, {
     type: 'line',
     data: {
         labels: days,
         datasets: datasets
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Pergerakan Stok 30 Hari Terakhir'
             },
             legend: {
                 position: 'bottom'
             },
             tooltip: {
                 mode: 'index',
                 intersect: false
             }
         },
         scales: {
             y: {
                 beginAtZero: true,
                 title: {
                     display: true,
                     text: 'Jumlah Stok'
                 }
             }
         }
     }
 });
},

initializeCriticalItemsChart() {
 const ctx = document.getElementById('criticalItemsChart');
 if (!ctx) return;

 // Generate dummy data for critical items
 const criticalItems = [
     { name: 'Beras', current: 25, minimum: 50, unit: 'kg' },
     { name: 'Ayam', current: 15, minimum: 30, unit: 'kg' },
     { name: 'Minyak Goreng', current: 10, minimum: 20, unit: 'L' },
     { name: 'Telur', current: 100, minimum: 200, unit: 'pcs' },
     { name: 'Sayuran', current: 8, minimum: 15, unit: 'kg' },
     { name: 'Bumbu Dapur', current: 5, minimum: 10, unit: 'pack' },
     { name: 'Gas LPG', current: 2, minimum: 5, unit: 'tabung' }
 ];

 new Chart(ctx, {
     type: 'bar',
     data: {
         labels: criticalItems.map(item => item.name),
         datasets: [
             {
                 label: 'Stok Saat Ini',
                 data: criticalItems.map(item => item.current),
                 backgroundColor: 'rgba(255, 99, 132, 0.8)',
                 barPercentage: 0.6
             },
             {
                 label: 'Stok Minimum',
                 data: criticalItems.map(item => item.minimum),
                 backgroundColor: 'rgba(54, 162, 235, 0.8)',
                 barPercentage: 0.6
             }
         ]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Item Kritis vs Stok Minimum'
             },
             tooltip: {
                 callbacks: {
                     label: function(context) {
                         const item = criticalItems[context.dataIndex];
                         return `${context.dataset.label}: ${context.parsed.y} ${item.unit}`;
                     }
                 }
             }
         },
         scales: {
             y: {
                 beginAtZero: true,
                 title: {
                     display: true,
                     text: 'Jumlah Stok'
                 }
             }
         }
     }
 });

 // Create table for critical items
 const tableBody = document.getElementById('criticalItemsTable');
 if (tableBody) {
     tableBody.innerHTML = criticalItems.map(item => `
         <tr>
             <td>${item.name}</td>
             <td>${item.current} ${item.unit}</td>
             <td>${item.minimum} ${item.unit}</td>
             <td>
                 <span class="badge bg-${this.getStatusColor(item.current, item.minimum)}">
                     ${this.getStatusText(item.current, item.minimum)}
                 </span>
             </td>
         </tr>
     `).join('');
 }
},

getStatusColor(current, minimum) {
 if (current <= minimum * 0.25) return 'danger';
 if (current <= minimum * 0.5) return 'warning';
 return 'success';
},

getStatusText(current, minimum) {
 if (current <= minimum * 0.25) return 'Kritis';
 if (current <= minimum * 0.5) return 'Perlu Restock';
 return 'Normal';
},

initialize() {
 this.initializeInventoryMovementChart();
 this.initializeCriticalItemsChart();
}
};

// Add to existing initialization
document.addEventListener('DOMContentLoaded', () => {
// ... existing initializations ...
InventoryReportCharts.initialize();
});

// Financial Report Charts
const FinancialReportCharts = {
initializeFinancialReports() {
 this.initializeProfitLossChart();
 this.initializeIncomeChart();
 this.initializeExpenseChart();
},

initializeProfitLossChart() {
 const ctx = document.getElementById('profitLossChart');
 if (!ctx) return;

 const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 const data = months.map(() => ({
     revenue: Math.floor(Math.random() * 50000000) + 150000000, // 150-200jt
     expense: Math.floor(Math.random() * 30000000) + 100000000, // 100-130jt
     profit: 0 // will be calculated
 }));

 // Calculate profit
 data.forEach(item => {
     item.profit = item.revenue - item.expense;
 });

 new Chart(ctx, {
     type: 'line',
     data: {
         labels: months,
         datasets: [
             {
                 label: 'Pendapatan',
                 data: data.map(d => d.revenue),
                 borderColor: 'rgb(75, 192, 192)',
                 backgroundColor: 'rgba(75, 192, 192, 0.1)',
                 fill: true
             },
             {
                 label: 'Pengeluaran',
                 data: data.map(d => d.expense),
                 borderColor: 'rgb(255, 99, 132)',
                 backgroundColor: 'rgba(255, 99, 132, 0.1)',
                 fill: true
             },
             {
                 label: 'Laba/Rugi',
                 data: data.map(d => d.profit),
                 borderColor: 'rgb(54, 162, 235)',
                 backgroundColor: 'rgba(54, 162, 235, 0.1)',
                 fill: true
             }
         ]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Laporan Laba/Rugi Tahunan'
             },
             tooltip: {
                 callbacks: {
                     label: function(context) {
                         let label = context.dataset.label || '';
                         if (label) {
                             label += ': ';
                         }
                         if (context.parsed.y !== null) {
                             label += new Intl.NumberFormat('id-ID', {
                                 style: 'currency',
                                 currency: 'IDR'
                             }).format(context.parsed.y);
                         }
                         return label;
                     }
                 }
             }
         },
         scales: {
             y: {
                 ticks: {
                     callback: function(value) {
                         return new Intl.NumberFormat('id-ID', {
                             style: 'currency',
                             currency: 'IDR',
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0
                         }).format(value);
                     }
                 }
             }
         }
     }
 });
},

initializeIncomeChart() {
 const ctx = document.getElementById('incomeChart');
 if (!ctx) return;

 const incomeCategories = [
     'Makanan',
     'Minuman',
     'Dessert',
     'Paket Hemat',
     'Catering'
 ];

 const incomeData = incomeCategories.map(() => Math.floor(Math.random() * 50000000) + 30000000);
 const total = incomeData.reduce((a, b) => a + b, 0);
 const percentages = incomeData.map(value => ((value / total) * 100).toFixed(1));

 new Chart(ctx, {
     type: 'doughnut',
     data: {
         labels: incomeCategories,
         datasets: [{
             data: incomeData,
             backgroundColor: [
                 'rgba(75, 192, 192, 0.8)',
                 'rgba(54, 162, 235, 0.8)',
                 'rgba(255, 206, 86, 0.8)',
                 'rgba(255, 99, 132, 0.8)',
                 'rgba(153, 102, 255, 0.8)'
             ]
         }]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Distribusi Pendapatan per Kategori'
             },
             tooltip: {
                 callbacks: {
                     label: function(context) {
                         const value = context.raw;
                         const percentage = percentages[context.dataIndex];
                         return `${context.label}: ${new Intl.NumberFormat('id-ID', {
                             style: 'currency',
                             currency: 'IDR',
                             minimumFractionDigits: 0
                         }).format(value)} (${percentage}%)`;
                     }
                 }
             }
         }
     }
 });

 // Update income table
 const incomeTable = document.getElementById('incomeTable');
 if (incomeTable) {
     incomeTable.innerHTML = incomeCategories.map((category, index) => `
         <tr>
             <td>${category}</td>
             <td>${new Intl.NumberFormat('id-ID', {
                 style: 'currency',
                 currency: 'IDR',
                 minimumFractionDigits: 0
             }).format(incomeData[index])}</td>
             <td>${percentages[index]}%</td>
         </tr>
     `).join('');
 }
},

initializeExpenseChart() {
 const ctx = document.getElementById('expenseChart');
 if (!ctx) return;

 const expenseCategories = [
     'Bahan Baku',
     'Gaji Karyawan',
     'Utilitas',
     'Peralatan',
     'Marketing',
     'Operasional'
 ];

 const expenseData = expenseCategories.map(() => Math.floor(Math.random() * 30000000) + 20000000);
 const total = expenseData.reduce((a, b) => a + b, 0);
 const percentages = expenseData.map(value => ((value / total) * 100).toFixed(1));

 new Chart(ctx, {
     type: 'pie',
     data: {
         labels: expenseCategories,
         datasets: [{
             data: expenseData,
             backgroundColor: [
                 'rgba(255, 99, 132, 0.8)',
                 'rgba(54, 162, 235, 0.8)',
                 'rgba(255, 206, 86, 0.8)',
                 'rgba(75, 192, 192, 0.8)',
                 'rgba(153, 102, 255, 0.8)',
                 'rgba(255, 159, 64, 0.8)'
             ]
         }]
     },
     options: {
         responsive: true,
         plugins: {
             title: {
                 display: true,
                 text: 'Distribusi Pengeluaran per Kategori'
             },
             tooltip: {
                 callbacks: {
                     label: function(context) {
                         const value = context.raw;
                         const percentage = percentages[context.dataIndex];
                         return `${context.label}: ${new Intl.NumberFormat('id-ID', {
                             style: 'currency',
                             currency: 'IDR',
                             minimumFractionDigits: 0
                         }).format(value)} (${percentage}%)`;
                     }
                 }
             }
         }
     }
 });

 // Update expense table
 const expenseTable = document.getElementById('expenseTable');
 if (expenseTable) {
     expenseTable.innerHTML = expenseCategories.map((category, index) => `
         <tr>
             <td>${category}</td>
             <td>${new Intl.NumberFormat('id-ID', {
                 style: 'currency',
                 currency: 'IDR',
                 minimumFractionDigits: 0
             }).format(expenseData[index])}</td>
             <td>${percentages[index]}%</td>
         </tr>
     `).join('');
 }
}
};

// Add to existing initialization
document.addEventListener('DOMContentLoaded', () => {
// ... existing initializations ...
FinancialReportCharts.initializeFinancialReports();
});


// Dummy data structure
let kitchenData = {
orders: [
 {
     id: 1,
     tableNumber: "Meja 1",
     items: [
         { name: "Nasi Goreng", quantity: 2, category: "main" },
         { name: "Es Teh", quantity: 2, category: "beverage" }
     ],
     status: "new",
     timestamp: new Date().getTime(),
     notes: "Pedas level 2"
 },
 {
     id: 2,
     tableNumber: "Meja 3",
     items: [
         { name: "Mie Goreng", quantity: 1, category: "main" },
         { name: "Juice Alpukat", quantity: 1, category: "beverage" }
     ],
     status: "processing",
     timestamp: new Date().getTime() - 600000,
     notes: "Tanpa sayur"
 }
],
stats: {
 pendingOrders: 0,
 processingOrders: 0,
 readyOrders: 0,
 avgPrepTime: 0
}
};

// Update stats
function updateStats() {
kitchenData.stats.pendingOrders = kitchenData.orders.filter(order => order.status === "new").length;
kitchenData.stats.processingOrders = kitchenData.orders.filter(order => order.status === "processing").length;
kitchenData.stats.readyOrders = kitchenData.orders.filter(order => order.status === "ready").length;

// Calculate average prep time
const completedOrders = kitchenData.orders.filter(order => order.status === "ready");
if (completedOrders.length > 0) {
 const totalTime = completedOrders.reduce((acc, order) => {
     return acc + (new Date().getTime() - order.timestamp);
 }, 0);
 kitchenData.stats.avgPrepTime = Math.round(totalTime / completedOrders.length / 60000); // Convert to minutes
}

// Update UI
document.getElementById("pendingOrders").textContent = kitchenData.stats.pendingOrders;
document.getElementById("processingOrders").textContent = kitchenData.stats.processingOrders;
document.getElementById("readyOrders").textContent = kitchenData.stats.readyOrders;
document.getElementById("avgPrepTime").textContent = `${kitchenData.stats.avgPrepTime} min`;
}

// Render order queues
function renderQueues() {
const queues = {
 new: document.getElementById("newOrderQueue"),
 processing: document.getElementById("processingQueue"),
 ready: document.getElementById("readyQueue")
};

// Clear existing content
Object.values(queues).forEach(queue => queue.innerHTML = "");

// Render orders
kitchenData.orders.forEach(order => {
 const orderElement = createOrderElement(order);
 queues[order.status].appendChild(orderElement);
});
}

// Create order element
function createOrderElement(order) {
const div = document.createElement("div");
div.className = "card mb-3";
div.innerHTML = `
 <div class="card-body">
     <div class="d-flex justify-content-between align-items-center mb-2">
         <h6 class="card-title mb-0">${order.tableNumber}</h6>
         <small class="text-muted">${new Date(order.timestamp).toLocaleTimeString()}</small>
     </div>
     <ul class="list-unstyled mb-3">
         ${order.items.map(item => `
             <li>${item.quantity}x ${item.name}</li>
         `).join("")}
     </ul>
     ${order.notes ? `<small class="text-muted d-block mb-2">Catatan: ${order.notes}</small>` : ""}
     <div class="d-flex gap-2">
         ${createActionButtons(order)}
     </div>
 </div>
`;
return div;
}

// Create action buttons based on order status
function createActionButtons(order) {
switch (order.status) {
 case "new":
     return `
         <button class="btn btn-sm btn-warning" onclick="updateOrderStatus(${order.id}, 'processing')">
             Proses Pesanan
         </button>
         <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.id})">
             Hapus
         </button>
     `;
 case "processing":
     return `
         <button class="btn btn-sm btn-success" onclick="updateOrderStatus(${order.id}, 'ready')">
             Selesai
         </button>
     `;
 case "ready":
     return `
         <button class="btn btn-sm btn-info" onclick="deleteOrder(${order.id})">
             Selesaikan
         </button>
     `;
 default:
     return "";
}
}

// CRUD Operations
function addOrder(orderData) {
const newOrder = {
 id: kitchenData.orders.length + 1,
 ...orderData,
 status: "new",
 timestamp: new Date().getTime()
};
kitchenData.orders.push(newOrder);
updateUI();
}

function updateOrderStatus(orderId, newStatus) {
const order = kitchenData.orders.find(order => order.id === orderId);
if (order) {
 order.status = newStatus;
 updateUI();
}
}

function deleteOrder(orderId) {
kitchenData.orders = kitchenData.orders.filter(order => order.id !== orderId);
updateUI();
}

// Update UI
function updateUI() {
updateStats();
renderQueues();
}

// Filter by category
document.querySelector("select").addEventListener("change", function(e) {
const category = e.target.value;
// Implement filtering logic here
});

// Initialize
document.addEventListener("DOMContentLoaded", function() {
updateUI();

// Set up real-time updates (simulated)
setInterval(() => {
 // Simulate new orders
 if (Math.random() < 0.3) {
     addOrder({
         tableNumber: `Meja ${Math.floor(Math.random() * 10) + 1}`,
         items: [
             {
                 name: ["Nasi Goreng", "Mie Goreng", "Ayam Bakar"][Math.floor(Math.random() * 3)],
                 quantity: Math.floor(Math.random() * 3) + 1,
                 category: "main"
             }
         ],
         notes: Math.random() < 0.5 ? "Pedas" : ""
     });
 }
}, 15000); // Check for new orders every 15 seconds
});

// Laporan Penjualan Data
const salesReportData = {
detailSales: [
 {
     date: "2024-12-30",
     items: [
         {
             name: "Nasi Goreng Spesial",
             category: "Main Course",
             quantity: 45,
             totalSales: 1575000, // @35.000
             profit: 787500 // 50% margin
         },
         {
             name: "Ayam Bakar",
             category: "Main Course", 
             quantity: 38,
             totalSales: 1520000, // @40.000
             profit: 760000
         },
         {
             name: "Sate Ayam",
             category: "Main Course",
             quantity: 52,
             totalSales: 1560000, // @30.000
             profit: 780000
         },
         {
             name: "Sop Iga", 
             category: "Main Course",
             quantity: 25,
             totalSales: 1125000, // @45.000
             profit: 562500
         },
         {
             name: "Es Teh Manis",
             category: "Minuman",
             quantity: 85,
             totalSales: 680000, // @8.000
             profit: 340000
         },
         {
             name: "Juice Alpukat",
             category: "Minuman",
             quantity: 32,
             totalSales: 480000, // @15.000
             profit: 240000
         }
     ]
 },
 {
     date: "2024-12-29",
     items: [
         {
             name: "Nasi Goreng Spesial",
             category: "Main Course",
             quantity: 42,
             totalSales: 1470000,
             profit: 735000
         },
         {
             name: "Ayam Bakar",
             category: "Main Course",
             quantity: 35,
             totalSales: 1400000,
             profit: 700000
         },
         {
             name: "Mie Goreng",
             category: "Main Course",
             quantity: 28,
             totalSales: 840000, // @30.000
             profit: 420000
         },
         {
             name: "Juice Alpukat",
             category: "Minuman",
             quantity: 30,
             totalSales: 450000,
             profit: 225000
         }
     ]
 },
 {
     date: "2024-12-28",
     items: [
         {
             name: "Nasi Goreng Spesial",
             category: "Main Course",
             quantity: 48,
             totalSales: 1680000,
             profit: 840000
         },
         {
             name: "Capcay",
             category: "Main Course",
             quantity: 22,
             totalSales: 770000, // @35.000
             profit: 385000
         },
         {
             name: "Sop Iga",
             category: "Main Course", 
             quantity: 27,
             totalSales: 1215000,
             profit: 607500
         }
     ]
 }
],

// Function to populate sales details table
updateSalesDetailsTable() {
 const tableBody = document.getElementById('salesDetailTable');
 if(!tableBody) return;

 let tableContent = '';

 this.detailSales.forEach(dayData => {
     dayData.items.forEach(item => {
         tableContent += `
             <tr>
                 <td>${new Date(dayData.date).toLocaleDateString('id-ID')}</td>
                 <td>${item.name}</td>
                 <td>${item.category}</td>
                 <td>${item.quantity}</td>
                 <td>${new Intl.NumberFormat('id-ID', {
                     style: 'currency',
                     currency: 'IDR'
                 }).format(item.totalSales)}</td>
                 <td>${new Intl.NumberFormat('id-ID', {
                     style: 'currency',
                     currency: 'IDR'
                 }).format(item.profit)}</td>
             </tr>
         `;
     });
 });

 tableBody.innerHTML = tableContent;
},

// Real-time updates simulation
startRealTimeUpdates() {
 setInterval(() => {
     // Add random new transactions
     const today = this.detailSales[0];
     const randomItem = today.items[Math.floor(Math.random() * today.items.length)];
     
     // Random increase in quantity between 1-3
     const additionalQty = Math.floor(Math.random() * 3) + 1;
     randomItem.quantity += additionalQty;

     // Update sales and profit
     const pricePerUnit = randomItem.totalSales / (randomItem.quantity - additionalQty);
     const additionalSales = pricePerUnit * additionalQty;
     randomItem.totalSales += additionalSales;
     randomItem.profit += additionalSales * 0.5; // 50% profit margin

     // Update table
     this.updateSalesDetailsTable();
 }, 45000); // Update every 45 seconds
}
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
salesReportData.updateSalesDetailsTable();
salesReportData.startRealTimeUpdates();
});



// Function to generate and download report
function downloadReport() {
    const period = document.getElementById('periodFilter').value;
    const timestamp = new Date().toLocaleString('id-ID');
    
    // Get current stats
    const totalRevenue = document.getElementById('totalRevenue').textContent;
    const totalOrders = document.getElementById('totalOrders').textContent;
    const avgOrderValue = document.getElementById('avgOrderValue').textContent;
    const tableOccupancy = document.getElementById('tableOccupancy').textContent;

    // Create report content
    const reportContent = `
LAPORAN RESTORAN UMKM
=====================
Periode: ${period}
Tanggal Laporan: ${timestamp}

RINGKASAN KINERJA
----------------
Total Pendapatan: ${totalRevenue}
Total Pesanan: ${totalOrders}
Rata-rata Pesanan: ${avgOrderValue}
Okupansi Meja: ${tableOccupancy}

DETAIL MENU TERPOPULER
---------------------
1. Nasi Goreng: 30%
2. Ayam Bakar: 25%
3. Sate Ayam: 20%
4. Sop Iga: 15%
5. Es Teh: 10%

STATUS DAPUR
-----------
Efisiensi: 75%
Pesanan Menunggu: ${document.getElementById('pendingOrders')?.textContent || '0'}
Pesanan Diproses: ${document.getElementById('processingOrders')?.textContent || '0'}
Pesanan Siap: ${document.getElementById('readyOrders')?.textContent || '0'}

PERINGATAN STOK
--------------
Kritis:
- Ayam Potong (2 kg)
Perlu Restock:
- Beras (10 kg)
`;

    // Create blob and download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-restoran-${period}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Add event listener to download button
document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.querySelector('#content button.btn-primary');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadReport);
    }
});
