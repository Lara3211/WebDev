The code implements an enhanced payslip view functionality, replacing the existing placeholder function with a detailed payslip display in a modal.
```

```replit_final_file
document.addEventListener('DOMContentLoaded', function() {
    loadPayroll();
    
    setupPayrollEvents();
});

function loadPayroll() {
    const payrollTable = document.getElementById('payrollTable');
    if (!payrollTable) return;

    const payroll = JSON.parse(localStorage.getItem('payroll')) || [];
    const sortedPayroll = [...payroll].sort((a, b) => {
        return new Date(b.payDate) - new Date(a.payDate);
    });
    

    payrollTable.innerHTML = '';
    
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Employee</th>
        <th>Pay Period</th>
        <th>Pay Date</th>
        <th>Gross Salary</th>
        <th>Total Deductions</th>
        <th>Net Salary</th>
        <th>Actions</th>
    `;
    payrollTable.appendChild(headerRow);
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    

    sortedPayroll.forEach(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        
        if (employee) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${record.payPeriod}</td>
                <td>${formatDate(record.payDate)}</td>
                <td>₱${record.baseSalary.toFixed(2)}</td>
                <td>₱${record.totalDeductions.toFixed(2)}</td>
                <td>₱${record.netSalary.toFixed(2)}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${record.id}">View</button>
                    <button class="action-btn edit-btn" data-id="${record.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${record.id}">Delete</button>
                </td>
            `;
            payrollTable.appendChild(row);
        }
    });
}

function setupPayrollEvents() {
    const generatePayrollBtn = document.getElementById('generatePayrollBtn');
    const payrollForm = document.getElementById('payrollForm');
    const payrollModal = document.getElementById('payrollModal');
    const payrollDetailsModal = document.getElementById('payrollDetailsModal');
    const closeModalBtns = document.querySelectorAll('.close-btn');

    if (generatePayrollBtn) {
        generatePayrollBtn.addEventListener('click', function() {
            openGeneratePayrollForm();
        });
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            payrollModal.style.display = 'none';
            if (payrollDetailsModal) {
                payrollDetailsModal.style.display = 'none';
            }
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target === payrollModal) {
            payrollModal.style.display = 'none';
        }
        if (payrollDetailsModal && event.target === payrollDetailsModal) {
            payrollDetailsModal.style.display = 'none';
        }
    });

    if (payrollForm) {
        payrollForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const payrollData = {
                employeeId: parseInt(formData.get('employeeId')),
                payPeriod: formData.get('payPeriod'),
                payDate: formData.get('payDate'),
                baseSalary: parseFloat(formData.get('baseSalary')),
                deductions: {
                    tax: parseFloat(formData.get('tax')),
                    sss: parseFloat(formData.get('sss')),
                    philhealth: parseFloat(formData.get('philhealth')),
                    pagibig: parseFloat(formData.get('pagibig'))
                }
            };
            
            payrollData.totalDeductions = 
                payrollData.deductions.tax + 
                payrollData.deductions.sss + 
                payrollData.deductions.philhealth + 
                payrollData.deductions.pagibig;
            
            payrollData.netSalary = payrollData.baseSalary - payrollData.totalDeductions;
            
            if (!validatePayrollForm(payrollData)) {
                return;
            }

            const mode = this.dataset.mode;
            
            if (mode === 'add') {
                addPayroll(payrollData);
            } else if (mode === 'edit') {
                const id = parseInt(this.dataset.id);
                editPayroll(id, payrollData);
            }

            payrollModal.style.display = 'none';
            
            loadPayroll();
        });
    }
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-btn') && e.target.closest('#payrollTable')) {
            const id = parseInt(e.target.dataset.id);
            viewPayslip(id);
        }
        
        if (e.target.classList.contains('edit-btn') && e.target.closest('#payrollTable')) {
            const id = parseInt(e.target.dataset.id);
            openEditPayrollForm(id);
        }

        if (e.target.classList.contains('delete-btn') && e.target.closest('#payrollTable')) {
            const id = parseInt(e.target.dataset.id);
            if (confirm('Are you sure you want to delete this payroll record?')) {
                deletePayroll(id);
                loadPayroll();
            }
        }
    });

    const employeeSelect = document.getElementById('employeeId');
    if (employeeSelect) {
        employeeSelect.addEventListener('change', function() {
            updateBaseSalary();
        });
    }
}

function addPayroll(payrollData) {
    const payroll = JSON.parse(localStorage.getItem('payroll')) || [];
    payrollData.id = generateId();
    
    payroll.push(payrollData);
    
    localStorage.setItem('payroll', JSON.stringify(payroll));
}

function editPayroll(id, payrollData) {
    const payroll = JSON.parse(localStorage.getItem('payroll')) || [];
    const index = payroll.findIndex(p => p.id === id);
    
    if (index !== -1) {
        payroll[index] = { ...payrollData, id: id };
        localStorage.setItem('payroll', JSON.stringify(payroll));
    }
}

function deletePayroll(id) {
    const payroll = JSON.parse(localStorage.getItem('payroll')) || [];
    const updatedPayroll = payroll.filter(p => p.id !== id);

    localStorage.setItem('payroll', JSON.stringify(updatedPayroll));
}

function openGeneratePayrollForm() {
    const payrollModal = document.getElementById('payrollModal');
    const payrollForm = document.getElementById('payrollForm');
    
    if (!payrollModal || !payrollForm) {
        console.error('Payroll modal or form not found');
        return;
    }
    
    payrollForm.reset();

    populateEmployeeDropdown();

    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    
    // Add cut-off indication
    const payPeriod = `${currentMonth} ${currentYear} (Cut-off: 1-15)`;
    const payDate = `${currentYear}-${(now.getMonth() + 1).toString().padStart(2, '0')}-15`;
    
    if (payrollForm.elements['payPeriod']) {
        payrollForm.elements['payPeriod'].value = payPeriod;
    }
    if (payrollForm.elements['payDate']) {
        payrollForm.elements['payDate'].value = payDate;
    }
    
    payrollForm.dataset.mode = 'add';
    payrollForm.dataset.id = '';
    
    const modalTitle = payrollModal.querySelector('.form-header h2');
    if (modalTitle) {
        modalTitle.textContent = 'Generate Payroll';
    }
    
    if (payrollForm.elements['tax']) payrollForm.elements['tax'].value = '';
    if (payrollForm.elements['sss']) payrollForm.elements['sss'].value = '1200.00';
    if (payrollForm.elements['philhealth']) payrollForm.elements['philhealth'].value = '400.00';
    if (payrollForm.elements['pagibig']) payrollForm.elements['pagibig'].value = '200.00';
    
    updateBaseSalary();
    
    payrollModal.style.display = 'block';
}

function openEditPayrollForm(id) {
    const payrollModal = document.getElementById('payrollModal');
    const payrollForm = document.getElementById('payrollForm');
    
    if (!payrollModal || !payrollForm) return;
    
    const payroll = JSON.parse(localStorage.getItem('payroll')) || [];
    const record = payroll.find(p => p.id === id);
    
    if (record) {
        populateEmployeeDropdown();

        payrollForm.elements['employeeId'].value = record.employeeId;
        payrollForm.elements['payPeriod'].value = record.payPeriod;
        payrollForm.elements['payDate'].value = record.payDate;
        payrollForm.elements['baseSalary'].value = record.baseSalary;
        payrollForm.elements['tax'].value = record.deductions.tax;
        payrollForm.elements['sss'].value = record.deductions.sss;
        payrollForm.elements['philhealth'].value = record.deductions.philhealth;
        payrollForm.elements['pagibig'].value = record.deductions.pagibig;

        payrollForm.dataset.mode = 'edit';
        payrollForm.dataset.id = id;
        
        const modalTitle = payrollModal.querySelector('.form-header h2');
        if (modalTitle) {
            modalTitle.textContent = 'Edit Payroll Record';
        }
        
        payrollModal.style.display = 'block';
    }
}



function viewPayslip(id) {
    const payrollDetailsModal = document.getElementById('payrollDetailsModal');
    const payslipContainer = document.getElementById('payslipContainer');

    if (!payrollDetailsModal || !payslipContainer) return;

    const payroll = JSON.parse(localStorage.getItem('payroll')) || [];
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const record = payroll.find(p => p.id === id);

    if (record) {
        const employee = employees.find(emp => emp.id === record.employeeId);

        if (employee) {
            payslipContainer.innerHTML = `
                <div class="payslip-header">
                    <h3>BULACAN POLYTECHNIC COLLEGE</h3>
                    <h4>PAYSLIP</h4>
                </div>

                <div class="payslip-employee-info">
                    <div class="employee-details-left">
                        <p><strong>Employee Name:</strong> ${employee.name}</p>
                        <p><strong>Employee ID:</strong> ${employee.employeeId || 'N/A'}</p>
                        <p><strong>Department:</strong> ${employee.department}</p>
                    </div>
                    <div class="employee-details-right">
                        <p><strong>Position:</strong> ${employee.position}</p>
                        <p><strong>Pay Period:</strong> ${record.payPeriod}</p>
                        <p><strong>Date Issued:</strong> ${formatDate(record.payDate)}</p>
                    </div>
                </div>

                <div class="payslip-earnings">
                    <h4>EARNINGS</h4>
                    <table class="payslip-table">
                        <tr>
                            <td>Basic Salary</td>
                            <td class="amount">₱${record.baseSalary.toFixed(2)}</td>
                        </tr>
                        <tr class="total-row">
                            <td><strong>TOTAL EARNINGS:</strong></td>
                            <td class="amount"><strong>₱${record.baseSalary.toFixed(2)}</strong></td>
                        </tr>
                    </table>
                </div>

                <div class="payslip-deductions">
                    <h4>DEDUCTIONS</h4>
                    <table class="payslip-table">
                        <tr>
                            <td>Tax</td>
                            <td class="amount">₱${record.deductions.tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>SSS</td>
                            <td class="amount">₱${record.deductions.sss.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>PhilHealth</td>
                            <td class="amount">₱${record.deductions.philhealth.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Pag-IBIG</td>
                            <td class="amount">₱${record.deductions.pagibig.toFixed(2)}</td>
                        </tr>
                        <tr class="total-row">
                            <td><strong>TOTAL DEDUCTIONS:</strong></td>
                            <td class="amount"><strong>₱${record.totalDeductions.toFixed(2)}</strong></td>
                        </tr>
                    </table>
                </div>

                <div class="payslip-net">
                    <table class="payslip-table">
                        <tr class="net-pay-row">
                            <td><strong>NET PAY:</strong></td>
                            <td class="amount"><strong>₱${record.netSalary.toFixed(2)}</strong></td>
                        </tr>
                    </table>
                </div>
            `;

            payrollDetailsModal.style.display = 'block';
        }
    }
}


function populateEmployeeDropdown() {
    const employeeSelect = document.getElementById('employeeId');
    if (!employeeSelect) return;

    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    employeeSelect.innerHTML = '<option value="">Select Employee</option>';
    
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = employee.name;
        employeeSelect.appendChild(option);
    });
}

function updateBaseSalary() {
    const employeeSelect = document.getElementById('employeeId');
    const baseSalaryInput = document.getElementById('baseSalary');
    const taxInput = document.getElementById('tax');
    
    if (!employeeSelect || !baseSalaryInput || !taxInput) return;
    
    const selectedEmployeeId = parseInt(employeeSelect.value);
    if (!selectedEmployeeId) {
        baseSalaryInput.value = '';
        taxInput.value = '';
        return;
    }
    
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    
    if (employee) {
        baseSalaryInput.value = employee.salary;

        const tax = employee.salary * 0.12;
        taxInput.value = tax.toFixed(2);
    }
}

function validatePayrollForm(payrollData) {
    if (!payrollData.employeeId || !payrollData.payPeriod || !payrollData.payDate || 
        !payrollData.baseSalary || !payrollData.deductions.tax || !payrollData.deductions.sss || 
        !payrollData.deductions.philhealth || !payrollData.deductions.pagibig) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    if (isNaN(payrollData.baseSalary) || payrollData.baseSalary <= 0) {
        alert('Please enter a valid base salary amount.');
        return false;
    }
    
    return true;
}