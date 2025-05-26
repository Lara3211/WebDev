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

function initializeLocalStorage() {
    if (!localStorage.getItem('employees')) {
        const defaultEmployees = [
            {
                id: 1,
                employeeId: 'RE-2400001',
                name: 'John Doe',
                email: 'johndoe@gmail.com',
                position: 'Faculty',
                department: 'BSIS',
                salary: 35000,
                dateHired: '2020-01-15'
            },
            {
                id: 2,
                employeeId: 'RE-2400002',
                name: 'Josue Sy',
                email: 'josueasy@gmail.com',
                position: 'Staff',
                department: 'Registrar',
                salary: 28000,
                dateHired: '2019-05-10'
            },
            {
                id: 3,
                employeeId: 'RE-2400003',
                name: 'Danah Zu',
                email: 'danahzu@gmail.com',
                position: 'Staff',
                department: 'Finance',
                salary: 30000,
                dateHired: '2018-11-22'
            },
            {
                id: 4,
                employeeId: 'RE-2400004',
                name: 'Kian Cy',
                email: 'KianCy@gmail.com',
                position: 'Admin',
                department: 'Administration',
                salary: 40000,
                dateHired: '2017-03-07'
            },
            {
                id: 5,
                employeeId: 'RE-2400005',
                name: 'Kyle Za',
                email: 'KyleZa@gmail.com',
                position: 'Faculty',
                department: 'BSOM',
                salary: 32000,
                dateHired: '2021-02-18'
            },
            {
                id: 6,
                employeeId: 'RE-2400006',
                name: 'Jeje Li',
                email: 'jejeli@gmail.com',
                position: 'Faculty',
                department: 'BSAIS',
                salary: 33000,
                dateHired: '2020-09-01'
            }
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
            {
                id: 1,
                employeeId: 1,
                date: today,
                timeIn: '08:00',
                timeOut: '17:00',
                status: 'Present'
            },
            {
                id: 2,
                employeeId: 2,
                date: today,
                timeIn: '08:15',
                timeOut: '17:00',
                status: 'Present'
            },
            {
                id: 3,
                employeeId: 3,
                date: today,
                timeIn: '08:30',
                timeOut: '17:00',
                status: 'Late'
            }
        ];
        localStorage.setItem('attendance', JSON.stringify(defaultAttendance));
    }

    if (!localStorage.getItem('payroll')) {
        const defaultPayroll = [
            {
                id: 1,
                employeeId: 1,
                payPeriod: 'January 2023',
                payDate: '2023-01-15',
                baseSalary: 35000,
                deductions: {
                    tax: 3500,
                    sss: 1200,
                    philhealth: 400,
                    pagibig: 200
                },
                totalDeductions: 5300,
                netSalary: 29700
            },
            {
                id: 2,
                employeeId: 2,
                payPeriod: 'January 2023',
                payDate: '2023-01-15',
                baseSalary: 28000,
                deductions: {
                    tax: 2800,
                    sss: 1200,
                    philhealth: 400,
                    pagibig: 200
                },
                totalDeductions: 4600,
                netSalary: 23400
            }
        ];
        localStorage.setItem('payroll', JSON.stringify(defaultPayroll));
    }
    
    // Initialize loans if not already present
    if (!localStorage.getItem('loans')) {
        const today = new Date();
        const defaultLoans = [
            {
                id: 1,
                employeeId: 1,
                loanType: 'Personal',
                loanAmount: 50000,
                term: 12,
                interestRate: 5,
                monthlyPayment: 4291.67,
                totalPayment: 51500,
                purpose: 'Home renovation',
                applicationDate: new Date(today.getFullYear(), today.getMonth() - 2, 15).toISOString().split('T')[0],
                approvalDate: new Date(today.getFullYear(), today.getMonth() - 2, 20).toISOString().split('T')[0],
                status: 'active',
                remainingBalance: 38625,
                payments: [
                    {
                        id: 1,
                        date: new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString().split('T')[0],
                        amount: 4291.67,
                        principal: 4083.33,
                        interest: 208.34,
                        balance: 46916.67,
                        method: 'Salary Deduction',
                        reference: 'SD12345',
                        notes: 'First payment'
                    },
                    {
                        id: 2,
                        date: new Date(today.getFullYear(), today.getMonth(), 15).toISOString().split('T')[0],
                        amount: 4291.67,
                        principal: 4104.17,
                        interest: 187.50,
                        balance: 42812.50,
                        method: 'Salary Deduction',
                        reference: 'SD12346',
                        notes: 'Second payment'
                    },
                    {
                        id: 3,
                        date: today.toISOString().split('T')[0],
                        amount: 4291.67,
                        principal: 4125.00,
                        interest: 166.67,
                        balance: 38625.00,
                        method: 'Cash',
                        reference: 'CA12347',
                        notes: 'Third payment'
                    }
                ]
            },
            {
                id: 2,
                employeeId: 2,
                loanType: 'Emergency',
                loanAmount: 20000,
                term: 6,
                interestRate: 4,
                monthlyPayment: 3400,
                totalPayment: 20400,
                purpose: 'Medical expenses',
                applicationDate: new Date(today.getFullYear(), today.getMonth(), 5).toISOString().split('T')[0],
                approvalDate: null,
                status: 'pending',
                remainingBalance: 20000,
                payments: []
            },
            {
                id: 3,
                employeeId: 3,
                loanType: 'Educational',
                loanAmount: 30000,
                term: 12,
                interestRate: 3,
                monthlyPayment: 2575,
                totalPayment: 30900,
                purpose: 'Tuition fee for Master\'s degree',
                applicationDate: new Date(today.getFullYear(), today.getMonth() - 3, 10).toISOString().split('T')[0],
                approvalDate: new Date(today.getFullYear(), today.getMonth() - 3, 15).toISOString().split('T')[0],
                status: 'completed',
                remainingBalance: 0,
                payments: [
                    {
                        id: 1,
                        date: new Date(today.getFullYear(), today.getMonth() - 2, 15).toISOString().split('T')[0],
                        amount: 30900,
                        principal: 30000,
                        interest: 900,
                        balance: 0,
                        method: 'Bank Transfer',
                        reference: 'BT54321',
                        notes: 'Full payment'
                    }
                ]
            }
        ];
        localStorage.setItem('loans', JSON.stringify(defaultLoans));
    }
}

function highlightActiveMenu() {
    const currentPage = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.classList.remove('active');
        
        // Check if the href attribute matches the current URL path
        if (item.getAttribute('href') === currentPage || 
            (currentPage === '/' && item.getAttribute('href') === '/')) {
            item.classList.add('active');
        }
    });
}