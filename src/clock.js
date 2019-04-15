import "core-js/stable";
import "regenerator-runtime/runtime";


const numPad = function (val){ 
    return val.toString().padStart(2, '0') 
}

function* defaultGenerator (start = 0, end = 59) {
    let counter = start;
    while (counter < end) {
        yield ++counter;
    }
    yield 0;
}

function* mainGenerator (date) {
    let s = date.getSeconds();
    let m = date.getMinutes();
    let h  = date.getHours() % 12;
    let secondCounter = defaultGenerator(s);
    let minuteCounter = defaultGenerator(m);
    let hourCounter = defaultGenerator(h, 11);


    while (true) {

        s = secondCounter.next().value;

        if (s === 0) {
            secondCounter = defaultGenerator();
            m = minuteCounter.next().value;

            if (m === 0) {
                minuteCounter = defaultGenerator();
                h = hourCounter.next().value;

                if (h === 0){
                    hourCounter = defaultGenerator(0, 11);
                }
            }
        }

        yield `${numPad(h)} : ${numPad(m)} : ${numPad(s)}`;
    }
}


export default function () {

    const { body } = document;

    const container = document.createElement('div');
    const generatedTime = document.createElement('div');
    const realTime = document.createElement('div');

    container.classList.add("container");
    generatedTime.classList.add("element");
    realTime.classList.add("element");

    body.appendChild(container);

    container.appendChild(generatedTime);
    container.appendChild(realTime);

    const clock = mainGenerator(new Date());

    setInterval(() => {
        generatedTime.innerText = `Czas wygenerowany: ${clock.next().value}`;
        realTime.innerText = `Czas systemowy: ${new Date().toTimeString()}`;
    }, 1000)
};