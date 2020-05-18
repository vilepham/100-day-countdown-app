document.addEventListener('DOMContentLoaded', () => {

    const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

    const title = document.querySelector('.title');
    const timer = document.querySelector('.timer');

    let deadline = new Date('Aug 3, 2020 23:59:59').getTime(),
        x = setInterval(function() {

        let now = new Date().getTime(),
            timeLeft = deadline - now;

            document.getElementById('days').innerText = Math.floor(timeLeft / (day)), 
            document.getElementById('hours').innerText = Math.floor((timeLeft % (day)) / (hour)), 
            document.getElementById('minutes').innerText = Math.floor((timeLeft % (hour)) / (minute)), 
            document.getElementById('seconds').innerText = Math.floor((timeLeft % (minute)) / second); 

            if (timeLeft < 0) {
                clearInterval(x);
                clock.removeChild('timer');
                title.innerHTML= 'Are you Ready?';
            };

        },second);

    });
