// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth Scroll Functions
function scrollToEmail() {
    document.getElementById('email').scrollIntoView({ behavior: 'smooth' });
}

function scrollToPillars() {
    document.getElementById('pillars').scrollIntoView({ behavior: 'smooth' });
}

// Formspree Form Submission Handler
function handleFormspreeSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value;
    const successMessage = document.getElementById('successMessage');
    const submitButton = document.getElementById('submitBtn');

    // Disable button during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    // Submit to Formspree
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Success!
            successMessage.textContent = '✓ Success! You\'re on the waitlist. Check your email soon!';
            successMessage.style.background = 'linear-gradient(135deg, #D1FAE5, #A7F3D0)';
            successMessage.style.color = '#065F46';
            successMessage.classList.add('show');
            
            // Clear form
            emailInput.value = '';
            
            // Also store locally as backup
            storeEmailLocally(email);
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        successMessage.textContent = '❌ Something went wrong. Please try again.';
        successMessage.style.background = 'linear-gradient(135deg, #FEE2E2, #FECACA)';
        successMessage.style.color = '#991B1B';
        successMessage.classList.add('show');
    })
    .finally(() => {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = 'Get Early Access';
    });
}

// Store email locally as backup
function storeEmailLocally(email) {
    const existingEmails = JSON.parse(localStorage.getItem('metacore_emails') || '[]');
    
    if (!existingEmails.find(entry => entry.email === email)) {
        const newEntry = {
            email: email,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        existingEmails.push(newEntry);
        localStorage.setItem('metacore_emails', JSON.stringify(existingEmails));
        
        console.log('✅ Email stored locally:', email);
        console.log('📧 Total local subscribers:', existingEmails.length);
    }
}

// Function to export local emails (call from console: exportEmails())
function exportEmails() {
    const emails = JSON.parse(localStorage.getItem('metacore_emails') || '[]');
    console.log('📧 Exporting', emails.length, 'emails...');
    
    let csv = 'Email,Date,Time,Timestamp\n';
    emails.forEach(entry => {
        csv += `${entry.email},${entry.date},${entry.time},${entry.timestamp}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metacore-emails-' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    
    console.log('✅ Export complete!');
    return emails;
}

// Function to view all local emails (call from console: viewEmails())
function viewEmails() {
    const emails = JSON.parse(localStorage.getItem('metacore_emails') || '[]');
    console.table(emails);
    return emails;
}

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});
