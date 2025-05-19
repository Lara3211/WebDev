
// MAIN >> LAHAT NG HTML MERON >> MAIN CONTROLLER >> CORE FUNCTION BLAHBLAH


document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initializeLocalStorage();
    highlightActiveMenu();
});

function initSidebar() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const dashboard = document.querySelector('.dashboard');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            dashboard.classList.toggle('expanded');
        });
    }

    if (window.innerWidth <= 991) {
        sidebar.classList.add('collapsed');
        if (dashboard) dashboard.classList.add('expanded');
    }
}
/*SideBAR TOGGLE
 *
 */


function initializeLocalStorage() {
    if (!localStorage.getItem('employees')) {
        const defaultEmployees = [
            { id: 1, name: 'John Ericson', email: 'johnericson@gmail.com', position: 'Faculty', department: 'BSIS', salary: 35000, dateHired: '2020-01-15' },
            { id: 2, name: 'Josue Sy', email: 'josueasy@gmail.com', position: 'Staff', department: 'Registrar', salary: 28000, dateHired: '2019-05-10' },
            { id: 3, name: 'Danah Zu', email: 'danahzu@gmail.com', position: 'Staff', department: 'Finance', salary: 30000, dateHired: '2018-11-22' },
            { id: 4, name: 'Kian Cy', email: 'KianCy@gmail.com', position: 'Admin', department: 'Administration', salary: 40000, dateHired: '2017-03-07' },
            { id: 5, name: 'Kyle Za', email: 'KyleZa@gmail.com', position: 'Faculty', department: 'BSOM', salary: 32000, dateHired: '2021-02-18' },
            { id: 6, name: 'Jeje Li', email: 'jejeli@gmail.com', position: 'Faculty', department: 'BSAIS', salary: 33000, dateHired: '2020-09-01' }
        ];
        localStorage.setItem('employees', JSON.stringify(defaultEmployees));
    }

    if (!localStorage.getItem('departments')) {
        const defaultDepartments = [
            { id: 1, name: 'BSIS', description: 'Bachelor of Science in Information Systems' },
            { id: 2, name: 'BSOM', description: 'Bachelor of Science in Office Management' },
            { id: 3, name: 'BSAIS', description: 'Bachelor of Science in Accounting Information Systems' },
            { id: 4, name: 'Registrar', description: 'Student Records Management' },
            { id: 5, name: 'Finance', description: 'Financial Management and Accounting' },
            { id: 6, name: 'Administration', description: 'College Administration and Operations' }
        ];
        localStorage.setItem('departments', JSON.stringify(defaultDepartments));
    }

    if (!localStorage.getItem('attendance')) {
        const today = new Date().toISOString().split('T')[0];
        const defaultAttendance = [
            { id: 1, employeeId: 1, date: today, timeIn: '08:00', timeOut: '17:00', status: 'Present' },
            { id: 2, employeeId: 2, date: today, timeIn: '08:15', timeOut: '17:00', status: 'Present' },
            { id: 3, employeeId: 3, date: today, timeIn: '08:30', timeOut: '17:00', status: 'Late' }
        ];
        localStorage.setItem('attendance', JSON.stringify(defaultAttendance));
    }

    if (!localStorage.getItem('payroll')) {
        const defaultPayroll = [
            { id: 1, employeeId: 1, payPeriod: 'January 2023', payDate: '2023-01-15', baseSalary: 35000, deductions: { tax: 3500, sss: 1200, philhealth: 400, pagibig: 200 }, totalDeductions: 5300, netSalary: 29700 },
            { id: 2, employeeId: 2, payPeriod: 'January 2023', payDate: '2023-01-15', baseSalary: 28000, deductions: { tax: 2800, sss: 1200, philhealth: 400, pagibig: 200 }, totalDeductions: 4600, netSalary: 23400 }
        ];
        localStorage.setItem('payroll', JSON.stringify(defaultPayroll));
    }
}
/*MAIN DATABASE parang
 *all is set to default. >>
 */

function highlightActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });

    let activeItem;
    if (currentPage === '' || currentPage === 'index.html') {
        activeItem = document.querySelector('a[href="index.html"]');
    } else if (currentPage === 'employees.html') {
        activeItem = document.querySelector('a[href="employees.html"]');
    } else if (currentPage === 'departments.html') {
        activeItem = document.querySelector('a[href="departments.html"]');
    } else if (currentPage === 'attendance.html') {
        activeItem = document.querySelector('a[href="attendance.html"]');
    } else if (currentPage === 'payroll.html') {
        activeItem = document.querySelector('a[href="payroll.html"]');
    } else if (currentPage === 'reports.html') {
        activeItem = document.querySelector('a[href="reports.html"]');
    }
    if (activeItem) {
        activeItem.classList.add('active');
    }
}
/*Toggle Active >> menu 
*/
