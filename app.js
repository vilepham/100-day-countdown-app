// Clock class
class Clock {
    constructor (title, day, hour, minute, second, deadline) {
        this.title = title;
        
        this.deadline = deadline;
    }
    updateClock = (day, hour, minute, second) => {
        this.day = day;
        this.hour = hour;
        this.minute = minute;
        this.second = second;
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
                    <li><span class="day${clock.deadline}"></span> Days</li>
                    <li><span class="hour${clock.deadline}"></span> Hours</li>
                    <li><span class="minute${clock.deadline}"></span> Minutes</li>
                    <li><span class="second${clock.deadline}"></span> Seconds</li>
                </ul>
            </div>
            <div class="deadline">til <br> <span>${clock.deadline}</span></div>
            <div class="delete"> [ delete ] </div>
        `
        // Append clock 
        list.appendChild(countdown);
    }
    updateClock(deadline, day, hour, minute, second) {
        document.querySelector(`.day${deadline}`).innerHTML = day;
        document.querySelector(`.hour${deadline}`).innerHTML = hour;
        document.querySelector(`.minute${deadline}`).innerHTML = minute;
        document.querySelector(`.second${deadline}`).innerHTML = second;
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

// Event Listener for window load 
// window.addEventListener('load', () => {
//     registerSW();
// })
// async function registerSW() {
//     if ('serviceWorker' in navigator) {
//         try {
//             await navigator.serviceWorker.register('sw.js');
//         } catch (e) {
//             console.log('SW registration failed');
//         }
//     }
// }
// Event Listener for DOM load
document.addEventListener('DOMContentLoaded', Storage.displayClocks);

// Event Listener for form
document.getElementById('date-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const ui = new UI();

    // Get input
    const title = document.getElementById('title').value;
    const date = document.getElementById('change-dl').value;

    // Get current time & time left to display
    let beginDate = new Date(date),
        deadline = new Date(beginDate.setDate(beginDate.getDate() + 100)),
        deadlineTime = deadline.getTime(),
        deadlineDate = `${deadline.getDate()}-${deadline.getMonth() + 1}-${deadline.getFullYear()}`;

    // Define day, hour, minute, second count
    const secondCount = 1000,
        minuteCount = secondCount * 60,
        hourCount = minuteCount * 60,
        dayCount = hourCount * 24;

    // Get current time and time left
    let now = new Date().getTime(),
        timeLeft = deadlineTime - now;
    
    let day, hour, minute, second;

    // Validate 
    if (title === '' || date === '') {
        // Show alert
        ui.showAlert('You forgot to input something!', 'error');

    } else {
        // Show alert
        ui.showAlert('Countdown successfully added', 'success');

        // New clock with new title and deadline
        const clock = new Clock(title, day, hour, minute, second, deadlineDate);

        // Update clock every second 
        const clockInterval = setInterval(() => {
            timeLeft = timeLeft - secondCount;
            let day = Math.floor(timeLeft / (dayCount)),
                hour = Math.floor((timeLeft % (dayCount)) / (hourCount)),
                minute = Math.floor((timeLeft % (hourCount)) / (minuteCount)),
                second = Math.floor((timeLeft % (minuteCount)) / (secondCount));

            clock.updateClock(day, hour, minute, second);

            ui.updateClock(deadlineDate, day, hour, minute, second)
            
            if (timeLeft < 0) {
                clearInterval(clockInterval);
            }
        }, secondCount)

        // Add clock to UI
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
