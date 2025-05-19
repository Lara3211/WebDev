// REAL TIME SEARCH FUNCTION - credits to: Web Dev Simplified [How to Create a Search Bar]
// GUIDED


document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});





function initializeSearch() {
    const searchInput = document.querySelector('.search-container input');
    if (!searchInput) return;

    updateSearchPlaceholder(searchInput, getCurrentPage());

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        switch (getCurrentPage()) {
            case 'employees':
                searchEmployees(searchTerm);
                break;
            case 'departments':
                searchDepartments(searchTerm);
                break;
            case 'attendance':
                searchAttendance(searchTerm);
                break;
            case 'payroll':
                searchPayroll(searchTerm);
                break;
            case 'reports':
                break;
            case 'dashboard':
                searchDashboard(searchTerm);
                break;
            default:
                console.log('Unknown page type for search');
        }
    });
}
/* Sets search bar >> based sa current page 
 * event listeners to uuser input
*/



function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('employees.html')) return 'employees';
    if (path.includes('departments.html')) return 'departments';
    if (path.includes('attendance.html')) return 'attendance';
    if (path.includes('payroll.html')) return 'payroll';
    if (path.includes('reports.html')) return 'reports';
    return 'dashboard';
}
/*
 * if statemetn to determine anong page we are at
 * connected to initializeSearch >> to set the placeholder of function updateSearblahbalh
 */



function updateSearchPlaceholder(searchInput, pageName) {
    switch (pageName) {
        case 'employees':
            searchInput.placeholder = 'Search employees by name, position, department...';
            break;
        case 'departments':
            searchInput.placeholder = 'Search departments by name or description...';
            break;
        case 'attendance':
            searchInput.placeholder = 'Search attendance by employee name or date...';
            break;
        case 'payroll':
            searchInput.placeholder = 'Search payroll by employee name or date...';
            break;
        case 'reports':
            searchInput.placeholder = 'Search reports by type or date... (not implemented)';
            break;
        case 'dashboard':
            searchInput.placeholder = 'Search across all modules...';
            break;
    }
}
/*
 * Sets placeholder based on ano nakuha sa getCurrentPage >> initializeSearch
 */


function searchEmployees(searchTerm) {
    const table = document.getElementById('employeesTable');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    if (rows.length === 0) return;

    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase() || '';
        const email = row.cells[1].textContent.toLowerCase() || '';
        const position = row.cells[2].textContent.toLowerCase() || '';
        const department = row.cells[3].textContent.toLowerCase() || '';

        if (
            searchTerm === '' || 
            name.includes(searchTerm) || 
            email.includes(searchTerm) || 
            position.includes(searchTerm) || 
            department.includes(searchTerm)
        ) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    showNoResultsMessage(table, rows);
}
/*
 * para sa employee table >> search fuinction
 */

function searchDepartments(searchTerm) {
    const table = document.getElementById('departmentsTable');
    if (!table) return;

    const rows = table.querySelectorAll('tr');
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const name = row.cells[0].textContent.toLowerCase() || '';
        const description = row.cells[1].textContent.toLowerCase() || '';

        if (
            searchTerm === '' || 
            name.includes(searchTerm) || 
            description.includes(searchTerm)
        ) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }

    showNoResultsMessage(table, Array.from(rows).slice(1));
}
/*
 * para sa department table >> search function
 */

function searchAttendance(searchTerm) {
    const table = document.getElementById('attendanceTable');
    if (!table) return;

    const rows = table.querySelectorAll('tr');
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const employeeName = row.cells[0].textContent.toLowerCase() || '';
        const date = row.cells[1].textContent.toLowerCase() || '';
        const status = row.cells[2].textContent.toLowerCase() || '';

        if (
            searchTerm === '' || 
            employeeName.includes(searchTerm) || 
            date.includes(searchTerm) || 
            status.includes(searchTerm)
        ) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }

    showNoResultsMessage(table, Array.from(rows).slice(1));
}
/*
 * para sa attendance table >> search function
 */

function searchPayroll(searchTerm) {
    const table = document.getElementById('payrollTable');
    if (!table) return;

    const rows = table.querySelectorAll('tr');
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const employeeName = row.cells[0].textContent.toLowerCase() || '';
        const payPeriod = row.cells[1].textContent.toLowerCase() || '';
        const payDate = row.cells[2].textContent.toLowerCase() || '';
        const amount = row.cells[3].textContent.toLowerCase() || '';

        if (
            searchTerm === '' || 
            employeeName.includes(searchTerm) || 
            payPeriod.includes(searchTerm) || 
            payDate.includes(searchTerm) || 
            amount.includes(searchTerm)
        ) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }

    showNoResultsMessage(table, Array.from(rows).slice(1));
}
/*
 * para sa payroll table >> search function
 */

function searchDashboard(searchTerm) {
    searchDashboardEmployees(searchTerm);
    searchDashboardPaydays(searchTerm);
}
/*
 * overall search >> dashboard >> continer for two fucntons
 */



function searchDashboardEmployees(searchTerm) {
    const table = document.getElementById('recentEmployeesTable');
    if (!table) return;

    const rows = table.querySelectorAll('tr');
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const name = row.cells[0].textContent.toLowerCase() || '';
        const position = row.cells[1].textContent.toLowerCase() || '';
        const department = row.cells[2].textContent.toLowerCase() || '';

        if (
            searchTerm === '' || 
            name.includes(searchTerm) || 
            position.includes(searchTerm) || 
            department.includes(searchTerm)
        ) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }

    showNoResultsMessage(table, Array.from(rows).slice(1));
}
/*
 * ALmost same as employee >> name/pos/dep
 */


function searchDashboardPaydays(searchTerm) {
    const table = document.getElementById('upcomingPaydaysTable');
    if (!table) return;

    const rows = table.querySelectorAll('tr');
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const employee = row.cells[0].textContent.toLowerCase() || '';
        const payDate = row.cells[1].textContent.toLowerCase() || '';
        const amount = row.cells[2].textContent.toLowerCase() || '';

        if (
            searchTerm === '' || 
            employee.includes(searchTerm) || 
            payDate.includes(searchTerm) || 
            amount.includes(searchTerm)
        ) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }

    showNoResultsMessage(table, Array.from(rows).slice(1));
}
/*
 * same as sDE function >> name/paydate/amount
 */

function showNoResultsMessage(table, rows) {
    const allHidden = Array.from(rows).every(row => 
        row.style.display === 'none'
    );

    const tableContainer = table.closest('.table-container');
    if (!tableContainer) return;

    let noResultsMsg = tableContainer.querySelector('.no-results');

    if (allHidden) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.textContent = 'No items match your search criteria.';
            noResultsMsg.style.textAlign = 'center';
            noResultsMsg.style.padding = '20px';
            noResultsMsg.style.color = '#666';
            tableContainer.appendChild(noResultsMsg);
        }
        table.style.display = 'none';
    } else {
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
        table.style.display = '';
    }
}
/* 
 * if none is found >> then set we "No items match your search criteria.""
 */
