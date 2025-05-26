document.addEventListener('DOMContentLoaded', function() {
    initializeLoans();
    setupLoanEvents();
    updateLoanStats();
});

function initializeLoans() {
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

    loadLoans();
}

function loadLoans() {
    const loansTable = document.getElementById('loansTable');
    if (!loansTable) return;

    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const statusFilter = document.getElementById('statusFilter').value;
    
    // Filter loans based on selected status
    const filteredLoans = statusFilter === 'all' 
        ? loans 
        : loans.filter(loan => loan.status === statusFilter);

    // Sort loans by application date (newest first)
    const sortedLoans = [...filteredLoans].sort((a, b) => {
        return new Date(b.applicationDate) - new Date(a.applicationDate);
    });

    // Clear existing table rows
    const tbody = loansTable.querySelector('tbody');
    tbody.innerHTML = '';

    // Populate table with loans
    sortedLoans.forEach(loan => {
        const employee = employees.find(emp => emp.id === loan.employeeId);
        if (employee) {
            const row = document.createElement('tr');
            
            // Create status badge with appropriate class
            const statusBadge = `<span class="status-badge status-${loan.status}">${capitalizeFirstLetter(loan.status)}</span>`;
            
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${loan.loanType}</td>
                <td>${formatCurrency(loan.loanAmount)}</td>
                <td>${loan.term}</td>
                <td>${formatDate(loan.applicationDate)}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${loan.id}">View</button>
                    <button class="action-btn edit-btn" data-id="${loan.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${loan.id}">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        }
    });

    // Show "No records" message if no loans match the filter
    if (sortedLoans.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" style="text-align: center;">No loan records found</td>`;
        tbody.appendChild(row);
    }
}

function setupLoanEvents() {
    // Status filter change
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', loadLoans);
    }

    // Create new loan button
    const createLoanBtn = document.getElementById('createLoanBtn');
    if (createLoanBtn) {
        createLoanBtn.addEventListener('click', openLoanForm);
    }

    // Form submission for loan application
    const loanForm = document.getElementById('loanForm');
    if (loanForm) {
        loanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitLoanForm();
        });
    }

    // Calculate loan details on input change
    const loanAmount = document.getElementById('loanAmount');
    const term = document.getElementById('term');
    const interestRate = document.getElementById('interestRate');
    
    if (loanAmount && term && interestRate) {
        [loanAmount, term, interestRate].forEach(input => {
            input.addEventListener('input', calculateLoanDetails);
        });
    }

    // Set default interest rates based on loan type
    const loanType = document.getElementById('loanType');
    if (loanType) {
        loanType.addEventListener('change', function() {
            const selectedType = this.value;
            let rate = 0;
            
            switch(selectedType) {
                case 'Personal':
                    rate = 5;
                    break;
                case 'Emergency':
                    rate = 4;
                    break;
                case 'Educational':
                    rate = 3;
                    break;
                case 'Housing':
                    rate = 6;
                    break;
                case 'Salary':
                    rate = 2;
                    break;
            }
            
            interestRate.value = rate;
            calculateLoanDetails();
        });
    }

    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });

    // Window click to close modals
    window.addEventListener('click', function(e) {
        const loanModal = document.getElementById('loanModal');
        const loanDetailsModal = document.getElementById('loanDetailsModal');
        const paymentModal = document.getElementById('paymentModal');
        
        if (e.target === loanModal || e.target === loanDetailsModal || e.target === paymentModal) {
            closeAllModals();
        }
    });

    // Action buttons in loan records table
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-btn') && e.target.closest('#loansTable')) {
            const id = parseInt(e.target.dataset.id);
            viewLoanDetails(id);
        }
        
        if (e.target.classList.contains('edit-btn') && e.target.closest('#loansTable')) {
            const id = parseInt(e.target.dataset.id);
            editLoan(id);
        }
        
        if (e.target.classList.contains('delete-btn') && e.target.closest('#loansTable')) {
            const id = parseInt(e.target.dataset.id);
            deleteLoan(id);
        }
    });

    // Actions in loan details modal
    const makePaymentBtn = document.getElementById('makePaymentBtn');
    const approveLoanBtn = document.getElementById('approveLoanBtn');
    const rejectLoanBtn = document.getElementById('rejectLoanBtn');
    const printLoanDetailsBtn = document.getElementById('printLoanDetailsBtn');
    
    if (makePaymentBtn) makePaymentBtn.addEventListener('click', openPaymentForm);
    if (approveLoanBtn) approveLoanBtn.addEventListener('click', approveLoan);
    if (rejectLoanBtn) rejectLoanBtn.addEventListener('click', rejectLoan);
    if (printLoanDetailsBtn) printLoanDetailsBtn.addEventListener('click', printLoanDetails);

    // Payment form submission
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitPaymentForm();
        });
    }
}

function openLoanForm() {
    const loanModal = document.getElementById('loanModal');
    const loanForm = document.getElementById('loanForm');
    
    // Reset form
    loanForm.reset();
    
    // Populate employee dropdown
    populateEmployeeDropdown();
    
    // Set today's date as default for application date
    const today = new Date().toISOString().split('T')[0];
    
    // Set form as 'add' mode
    loanForm.dataset.mode = 'add';
    loanForm.dataset.id = '';
    
    // Set modal title
    const modalTitle = loanModal.querySelector('.form-header h2');
    modalTitle.textContent = 'Apply for Loan';
    
    // Default interest rate
    document.getElementById('interestRate').value = '';
    
    // Show modal
    loanModal.style.display = 'block';
}

function populateEmployeeDropdown() {
    const employeeSelect = document.getElementById('employeeId');
    if (!employeeSelect) return;
    
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    
    // Clear existing options
    employeeSelect.innerHTML = '<option value="">Select Employee</option>';
    
    // Add employee options
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = employee.name;
        employeeSelect.appendChild(option);
    });
}

function calculateLoanDetails() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const term = parseInt(document.getElementById('term').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    
    const monthlyPaymentElement = document.getElementById('monthlyPayment');
    const totalPaymentElement = document.getElementById('totalPayment');
    
    if (loanAmount > 0 && term > 0) {
        // Calculate interest amount
        const interestAmount = (loanAmount * interestRate * term / 12) / 100;
        
        // Calculate total payment
        const totalPayment = loanAmount + interestAmount;
        
        // Calculate monthly payment
        const monthlyPayment = totalPayment / term;
        
        // Update form fields
        monthlyPaymentElement.value = formatCurrency(monthlyPayment);
        totalPaymentElement.value = formatCurrency(totalPayment);
    } else {
        monthlyPaymentElement.value = '';
        totalPaymentElement.value = '';
    }
}

function submitLoanForm() {
    const loanForm = document.getElementById('loanForm');
    const employeeId = parseInt(document.getElementById('employeeId').value);
    const loanType = document.getElementById('loanType').value;
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const term = parseInt(document.getElementById('term').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const purpose = document.getElementById('purpose').value;
    
    // Validate form inputs
    if (!employeeId || !loanType || !loanAmount || !term || !interestRate || !purpose) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Calculate loan details
    const interestAmount = (loanAmount * interestRate * term / 12) / 100;
    const totalPayment = loanAmount + interestAmount;
    const monthlyPayment = totalPayment / term;
    
    // Get current date
    const today = new Date().toISOString().split('T')[0];
    
    // Create loan object
    const loanData = {
        employeeId,
        loanType,
        loanAmount,
        term,
        interestRate,
        monthlyPayment,
        totalPayment,
        purpose,
        applicationDate: today,
        approvalDate: null,
        status: 'pending',
        remainingBalance: loanAmount,
        payments: []
    };
    
    // Get existing loans from localStorage
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    
    // Check if we're adding or editing
    const mode = loanForm.dataset.mode;
    
    if (mode === 'add') {
        // Generate new ID
        loanData.id = generateId();
        
        // Add new loan
        loans.push(loanData);
    } else if (mode === 'edit') {
        // Get loan ID
        const id = parseInt(loanForm.dataset.id);
        
        // Find loan index
        const index = loans.findIndex(loan => loan.id === id);
        
        if (index !== -1) {
            // Preserve existing payment history and status
            loanData.id = id;
            loanData.approvalDate = loans[index].approvalDate;
            loanData.status = loans[index].status;
            loanData.payments = loans[index].payments;
            
            // Update loan
            loans[index] = loanData;
        }
    }
    
    // Save updated loans to localStorage
    localStorage.setItem('loans', JSON.stringify(loans));
    
    // Close modal
    closeAllModals();
    
    // Reload loans table
    loadLoans();
    
    // Update dashboard stats
    updateLoanStats();
}

function editLoan(id) {
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const loan = loans.find(loan => loan.id === id);
    
    if (loan) {
        // Only allow editing if loan is pending
        if (loan.status !== 'pending') {
            alert('Only pending loans can be edited.');
            return;
        }
        
        const loanModal = document.getElementById('loanModal');
        const loanForm = document.getElementById('loanForm');
        
        // Populate form with loan data
        populateEmployeeDropdown();
        
        document.getElementById('employeeId').value = loan.employeeId;
        document.getElementById('loanType').value = loan.loanType;
        document.getElementById('loanAmount').value = loan.loanAmount;
        document.getElementById('term').value = loan.term;
        document.getElementById('interestRate').value = loan.interestRate;
        document.getElementById('purpose').value = loan.purpose;
        document.getElementById('monthlyPayment').value = formatCurrency(loan.monthlyPayment);
        document.getElementById('totalPayment').value = formatCurrency(loan.totalPayment);
        
        // Set form as 'edit' mode
        loanForm.dataset.mode = 'edit';
        loanForm.dataset.id = id;
        
        // Set modal title
        const modalTitle = loanModal.querySelector('.form-header h2');
        modalTitle.textContent = 'Edit Loan Application';
        
        // Show modal
        loanModal.style.display = 'block';
    }
}

function deleteLoan(id) {
    if (confirm('Are you sure you want to delete this loan record?')) {
        const loans = JSON.parse(localStorage.getItem('loans')) || [];
        const updatedLoans = loans.filter(loan => loan.id !== id);
        
        localStorage.setItem('loans', JSON.stringify(updatedLoans));
        
        loadLoans();
        updateLoanStats();
    }
}

function viewLoanDetails(id) {
    const loanDetailsModal = document.getElementById('loanDetailsModal');
    const loanDetailsContent = document.getElementById('loanDetailsContent');
    const paymentHistoryTable = document.getElementById('paymentHistoryTable').querySelector('tbody');
    
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    
    const loan = loans.find(loan => loan.id === id);
    
    if (loan) {
        const employee = employees.find(emp => emp.id === loan.employeeId);
        
        // Store the loan ID in the modal for use by buttons
        loanDetailsModal.dataset.loanId = id;
        
        // Populate loan details
        let detailsHTML = `<div class="ln-details-section">`;
        
        // Employee info
        detailsHTML += `
            <div class="ln-detail-item">
                <div class="ln-detail-label">Employee</div>
                <div class="ln-detail-value">${employee ? employee.name : 'Unknown'}</div>
            </div>
            <div class="ln-detail-item">
                <div class="ln-detail-label">Department</div>
                <div class="ln-detail-value">${employee ? employee.department : 'Unknown'}</div>
            </div>
            <div class="ln-detail-item">
                <div class="ln-detail-label">Position</div>
                <div class="ln-detail-value">${employee ? employee.position : 'Unknown'}</div>
            </div>
        `;
        
        // Loan info
        detailsHTML += `
            <div class="ln-detail-item">
                <div class="ln-detail-label">Loan Type</div>
                <div class="ln-detail-value">${loan.loanType}</div>
            </div>
            <div class="ln-detail-item">
                <div class="ln-detail-label">Status</div>
                <div class="ln-detail-value"><span class="status-badge status-${loan.status}">${capitalizeFirstLetter(loan.status)}</span></div>
            </div>
            <div class="ln-detail-item">
                <div class="ln-detail-label">Application Date</div>
                <div class="ln-detail-value">${formatDate(loan.applicationDate)}</div>
            </div>
        `;
        
        // Loan amounts
        detailsHTML += `
            <div class="ln-detail-item">
                <div class="ln-detail-label">Loan Amount</div>
                <div class="ln-detail-value">${formatCurrency(loan.loanAmount)}</div>
            </div>
            <div class="ln-detail-item">
                <div class="ln-detail-label">Interest Rate</div>
                <div class="ln-detail-value">${loan.interestRate}%</div>
            </div>
            <div class="ln-detail-item">
                <div class="ln-detail-label">Term</div>
                <div class="ln-detail-value">${loan.term} months</div>
            </div>
        `;
        
        // Loan payment details
        detailsHTML += `
            <div class="ln-detail-item">
                <div class="ln-detail-label">Monthly Payment</div>
                <div class="ln-detail-value">${formatCurrency(loan.monthlyPayment)}</div>
            </div>
            <div class="ln-detail-item">
                <div class="ln-detail-label">Total Payment</div>
                <div class="ln-detail-value">${formatCurrency(loan.totalPayment)}</div>
            </div>
            <div class="ln-detail-item">
                <div class="ln-detail-label">Remaining Balance</div>
                <div class="ln-detail-value">${formatCurrency(loan.remainingBalance)}</div>
            </div>
        `;
        
        detailsHTML += `</div>`;
        
        // Purpose section
        detailsHTML += `
            <div class="ln-detail-item" style="margin-top: 1rem;">
                <div class="ln-detail-label">Purpose</div>
                <div class="ln-detail-value">${loan.purpose}</div>
            </div>
        `;
        
        // Update loan details content
        loanDetailsContent.innerHTML = detailsHTML;
        
        // Populate payment history table
        paymentHistoryTable.innerHTML = '';
        
        if (loan.payments && loan.payments.length > 0) {
            loan.payments.forEach(payment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(payment.date)}</td>
                    <td>${formatCurrency(payment.amount)}</td>
                    <td>${formatCurrency(payment.principal)}</td>
                    <td>${formatCurrency(payment.interest)}</td>
                    <td>${formatCurrency(payment.balance)}</td>
                `;
                paymentHistoryTable.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" style="text-align: center;">No payment records found</td>`;
            paymentHistoryTable.appendChild(row);
        }
        
        // Show/hide action buttons based on loan status
        const makePaymentBtn = document.getElementById('makePaymentBtn');
        const approveLoanBtn = document.getElementById('approveLoanBtn');
        const rejectLoanBtn = document.getElementById('rejectLoanBtn');
        
        if (makePaymentBtn && approveLoanBtn && rejectLoanBtn) {
            // Hide all action buttons by default
            makePaymentBtn.style.display = 'none';
            approveLoanBtn.style.display = 'none';
            rejectLoanBtn.style.display = 'none';
            
            // Show buttons based on loan status
            if (loan.status === 'active') {
                makePaymentBtn.style.display = 'block';
            } else if (loan.status === 'pending') {
                approveLoanBtn.style.display = 'block';
                rejectLoanBtn.style.display = 'block';
            }
        }
        
        // Show modal
        loanDetailsModal.style.display = 'block';
    }
}

function openPaymentForm() {
    const paymentModal = document.getElementById('paymentModal');
    const paymentForm = document.getElementById('paymentForm');
    const loanDetailsModal = document.getElementById('loanDetailsModal');
    const loanId = parseInt(loanDetailsModal.dataset.loanId);
    
    // Store loan ID in form
    paymentForm.dataset.loanId = loanId;
    
    // Set today's date as default
    document.getElementById('paymentDate').valueAsDate = new Date();
    
    // Get loan details to set default payment amount
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const loan = loans.find(loan => loan.id === loanId);
    
    if (loan) {
        document.getElementById('paymentAmount').value = loan.monthlyPayment.toFixed(2);
    }
    
    // Hide loan details modal and show payment modal
    loanDetailsModal.style.display = 'none';
    paymentModal.style.display = 'block';
}

function submitPaymentForm() {
    const paymentForm = document.getElementById('paymentForm');
    const loanId = parseInt(paymentForm.dataset.loanId);
    
    const paymentDate = document.getElementById('paymentDate').value;
    const paymentAmount = parseFloat(document.getElementById('paymentAmount').value);
    const paymentMethod = document.getElementById('paymentMethod').value;
    const paymentReference = document.getElementById('paymentReference').value;
    const paymentNotes = document.getElementById('paymentNotes').value;
    
    // Validate form inputs
    if (!paymentDate || !paymentAmount || !paymentMethod) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Get loan details
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const loanIndex = loans.findIndex(loan => loan.id === loanId);
    
    if (loanIndex !== -1) {
        const loan = loans[loanIndex];
        
        // Calculate principal and interest portions
        const interestRate = loan.interestRate / 100 / 12;
        const interest = loan.remainingBalance * interestRate;
        const principal = paymentAmount - interest;
        
        // Calculate new balance
        const newBalance = Math.max(0, loan.remainingBalance - principal);
        
        // Create payment record
        const payment = {
            id: generateId(),
            date: paymentDate,
            amount: paymentAmount,
            principal: principal,
            interest: interest,
            balance: newBalance,
            method: paymentMethod,
            reference: paymentReference,
            notes: paymentNotes
        };
        
        // Add payment to loan
        loan.payments.push(payment);
        
        // Update remaining balance
        loan.remainingBalance = newBalance;
        
        // Check if loan is fully paid
        if (newBalance === 0) {
            loan.status = 'completed';
        }
        
        // Save updated loans
        localStorage.setItem('loans', JSON.stringify(loans));
        
        // Close modal
        closeAllModals();
        
        // Reload loans table and update stats
        loadLoans();
        updateLoanStats();
        
        // Show success message
        alert('Payment recorded successfully!');
    }
}

function approveLoan() {
    const loanDetailsModal = document.getElementById('loanDetailsModal');
    const loanId = parseInt(loanDetailsModal.dataset.loanId);
    
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const loanIndex = loans.findIndex(loan => loan.id === loanId);
    
    if (loanIndex !== -1) {
        const loan = loans[loanIndex];
        
        // Update loan status to approved
        loan.status = 'active';
        loan.approvalDate = new Date().toISOString().split('T')[0];
        
        // Save updated loans
        localStorage.setItem('loans', JSON.stringify(loans));
        
        // Close modal
        closeAllModals();
        
        // Reload loans table and update stats
        loadLoans();
        updateLoanStats();
        
        // Show success message
        alert('Loan approved successfully!');
    }
}

function rejectLoan() {
    const loanDetailsModal = document.getElementById('loanDetailsModal');
    const loanId = parseInt(loanDetailsModal.dataset.loanId);
    
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const loanIndex = loans.findIndex(loan => loan.id === loanId);
    
    if (loanIndex !== -1) {
        const loan = loans[loanIndex];
        
        // Update loan status to rejected
        loan.status = 'rejected';
        
        // Save updated loans
        localStorage.setItem('loans', JSON.stringify(loans));
        
        // Close modal
        closeAllModals();
        
        // Reload loans table and update stats
        loadLoans();
        updateLoanStats();
        
        // Show success message
        alert('Loan rejected.');
    }
}

function printLoanDetails() {
    window.print();
}

function updateLoanStats() {
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    
    // Count active loans
    const activeLoans = loans.filter(loan => loan.status === 'active');
    const activeLoansCount = document.getElementById('activeLoansCount');
    if (activeLoansCount) {
        activeLoansCount.textContent = activeLoans.length;
    }
    
    // Calculate total loan amount
    const totalLoanAmount = activeLoans.reduce((total, loan) => total + loan.remainingBalance, 0);
    const totalLoanAmountElement = document.getElementById('totalLoanAmount');
    if (totalLoanAmountElement) {
        totalLoanAmountElement.textContent = formatCurrency(totalLoanAmount);
    }
    
    // Count pending loans
    const pendingLoans = loans.filter(loan => loan.status === 'pending');
    const pendingLoansCount = document.getElementById('pendingLoansCount');
    if (pendingLoansCount) {
        pendingLoansCount.textContent = pendingLoans.length;
    }
    
    // Count completed loans
    const completedLoans = loans.filter(loan => loan.status === 'completed');
    const completedLoansCount = document.getElementById('completedLoansCount');
    if (completedLoansCount) {
        completedLoansCount.textContent = completedLoans.length;
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-container input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        searchLoans(searchTerm);
    });
}

function searchLoans(searchTerm) {
    const loansTable = document.getElementById('loansTable');
    if (!loansTable) return;
    
    const rows = loansTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const employeeName = row.cells[0]?.textContent?.toLowerCase() || '';
        const loanType = row.cells[1]?.textContent?.toLowerCase() || '';
        const amount = row.cells[2]?.textContent?.toLowerCase() || '';
        const term = row.cells[3]?.textContent?.toLowerCase() || '';
        const date = row.cells[4]?.textContent?.toLowerCase() || '';
        const status = row.cells[5]?.textContent?.toLowerCase() || '';
        
        if (
            searchTerm === '' || 
            employeeName.includes(searchTerm) || 
            loanType.includes(searchTerm) || 
            amount.includes(searchTerm) || 
            term.includes(searchTerm) || 
            date.includes(searchTerm) || 
            status.includes(searchTerm)
        ) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}