// Clock class
class Clock {
    constructor (title, day, hour, deadline) {
        this.title = title;
        this.day = day;
        this.hour = hour;
        this.deadline = deadline;
    }
}

// UI class 
class UI {
    addClock(clock) {
        const list = document.querySelector('.content');
        // Create clock element 
        const countdown = document.createElement('div');
        countdown.className = 'countdown';
        // Insert clock content
        countdown.innerHTML = `
            <div class="title">100 Days to <br> ${clock.title}</div>
            <div class="timer">
                <ul>
                    <li><span>${clock.day}</span> Days</li>
                    <li><span>${clock.hour}</span> Hours</li>
                </ul>
            </div>
            <div class="deadline">til <br> <span>${clock.deadline}</span></div>
            <div class="delete"> [ delete ] </div>
        `
        // Append clock 
        list.appendChild(countdown);
    }
    showAlert(msg, className) {
        // Create alert element
        const alert = document.createElement('div');
        // Add class
        alert.className = `alert ${className}`;
        // Add message
        alert.appendChild(document.createTextNode(msg));
        // Append element 
        document.querySelector('h3').append(alert);
        // Set timeout
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 4000);

    }
    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('change-dl').value = '';
    }

}

// Storage Class
class Storage {
    static getClocks() {
        let clocks;
        if (localStorage.getItem('clocks') === null) {
            clocks = [];
        } else {
            clocks = JSON.parse(localStorage.getItem('clocks'))
        }
        return clocks;
    }
    static displayClocks(){
        const clocks = Storage.getClocks();

        clocks.forEach(function(clock) {
            const ui = new UI();
            ui.addClock(clock);
        })
    }
    static addClock(clock) {
        const clocks = Storage.getClocks();

        clocks.push(clock);

        localStorage.setItem('clocks', JSON.stringify(clocks));
    }
    static removeClock(clockItem) {
        const clocks = Storage.getClocks();

        clocks.forEach(function(clock, index) {
            if (clock.deadline === clockItem) {
                clocks.splice(index, 1);
            }
        })

        localStorage.setItem('clocks', JSON.stringify(clocks));
    }
}

// Event Listener for DOM load
document.addEventListener('DOMContentLoaded', Storage.displayClocks);

// Event Listener for form
document.getElementById('date-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const ui = new UI();

    // Get input
    const title = document.getElementById('title').value;
    const date = document.getElementById('change-dl').value;

    // Get current time & time left to display
    let deadline = new Date(date).getTime();
    
    // Calculate day, hour, minute, second
    const hourCount = (1000 * 60) * 60,
        dayCount = hourCount * 24;

    let now = new Date().getTime(),
    timeLeft = deadline - now;
    
    const day = Math.floor(timeLeft / (dayCount)),
        hour = Math.floor((timeLeft % (dayCount)) / (hourCount));

    const clock = new Clock(title, day, hour, date);
    
    // Validate 
    if (title === '' || date === '') {
        // Show alert
        ui.showAlert('You forgot to input something!', 'error');

    } else {
        // Show alert
        ui.showAlert('Countdown successfully added', 'success');

        // Add clock 
        ui.addClock(clock);

        // Add to LS
        Storage.addClock(clock);

        // Clear input fields
        ui.clearFields();
    }

})

// Event Listener for delete button
document.body.addEventListener('click', function(e) {
    const ui = new UI();
    if (e.target.classList.contains('delete')) {
        if (confirm('Are you sure to delete your countdown?')) {
            // Remove clock
            e.target.parentElement.remove();

            // Show success message
            ui.showAlert('Countdown successfully deleted', 'success');

            // Remove from LS
            Storage.removeClock(e.target.previousElementSibling.children[1].textContent);
        }
    }
})

