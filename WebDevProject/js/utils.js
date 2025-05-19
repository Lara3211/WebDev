



function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);

/*
* p[ang] format currency >> gives value to "amount"
*/
}

function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);


/*
 * Formats a date string into a long-form date format.
*GUIDED
*/

}

function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);

/*
 * Generates a unique ID >> in progress >> payslips sana
 */

}

function setupPrintButton() {
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
/*
 * Sets up the print functionality for reports. >> in progress >> na p-print whole page
 */

}

function dateDiffInDays(date1, date2) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);

/*
* Determines if a given date falls on a weekend (Saturday or Sunday).
* Used for working day calculations and leave processing.
* GUIDED
*/

}

function isWeekend(date) {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
/*
* is it a weekend >(Saturday or Sunday) simpleng logic to check lang > for WorkingDays.
*/
}

function getWorkingDays(startDate, endDate) {
    let count = 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
        if (day.getDay() !== 0 && day.getDay() !== 6) {
            count++;
        }
    }
    return count;
/*
 * Calculates the number of working days between two dates.
 * ADDED FEATURE >> excludes weekends
 * GUIDED
*/
}

function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;

/*
 * Calculates a person's age from their birthday.
 * FOR CONVENIENCE + ERRORS
 */

}

function calculateYearsOfService(dateHired) {
    const hireDate = new Date(dateHired);
    const today = new Date();
    let years = today.getFullYear() - hireDate.getFullYear();
    const monthDiff = today.getMonth() - hireDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hireDate.getDate())) {
        years--;
    }
    return years;

/*
 * Calculates an employee's years of service from their hire date.
 * FOR OVERALL => PANGLAHATAN NA DATA
 * PARA RIN SA REPORTS => GUIDED
 */

}

function getMonthName(monthNumber) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber];
/*
* month number (0-11) to its corresponding name.
* Used for report generation and date formatting.
* 0 jan => 11 dec
*/

}

function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;

/*
 * Converts 24-hour time format to 12-hour format with AM/PM.
 * JUST FOR CONVENIENCE SAKE
 * Used for attendance records and time reporting.
 */

}

function calculateWorkHours(timeIn, timeOut) {
    if (!timeIn || !timeOut) return 0;
    const [inHours, inMinutes] = timeIn.split(':').map(Number);
    const [outHours, outMinutes] = timeOut.split(':').map(Number);
    const inTime = inHours * 60 + inMinutes;
    const outTime = outHours * 60 + outMinutes;
    let diffMinutes = outTime - inTime;
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
    }
    return (diffMinutes / 60).toFixed(1);

/*
 * Total work hours of time-in and time-out.
 * je : created whilst being guided
 */
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);

/*
 * Validates email address format using regex => this regex of email.
 * Used for form validation and employee data management.
 */
}

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);

/*
 * Checks if a value is numeric.
 * Used for input validation in salary calculations and financial entries.
 */

}
