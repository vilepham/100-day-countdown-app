document.addEventListener('DOMContentLoaded', () => {

    const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

    const clock = document.querySelector('.countdown');
    const title = document.querySelector('.title');
    const timer = document.querySelector('.timer');
    let date = document.querySelector('.deadline');
    let deadline = document.querySelector('#change-dl');


    let countDown = new Date('Aug 3, 2020 23:59:59').getTime(),
        x = setInterval(function() {    

        let now = new Date().getTime(),
            distance = countDown - now;

            document.getElementById('days').innerText = Math.floor(distance / (day)),
            document.getElementById('hours').innerText = Math.floor((distance % (day)) / (hour)),
            document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute)),
            document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);

            if (distance < 0) {
                clearInterval(x);
                clock.removeChild('timer');
                title.innerHTML= 'Are you Ready?';
            };
        
        },second);

    });