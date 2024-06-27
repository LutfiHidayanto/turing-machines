var patternRe = [];
patternRe["Addition"] = new RegExp(/^(\s*[+-][\s0]*[+-][\s0]*)$/); 
// patternRe["Power"] = new RegExp(/^\s*0[\s0]*1\s*0[\s0]*1\s*$/); 
patternRe["Power"] = new RegExp('^0*10*1$');

// 0 ^ 1 udah, 1^ 0 belom (101)
var finalStates = [];
finalStates["Addition"] = 4;
finalStates["Division"] = 10;
finalStates["Power"] = 20;

var head1 = 15;
var head2 = 15;

var tempHead1 = head1;
var tempHead2 = head2;

var output1 = document.getElementById("output1");
var output2 = document.getElementById("output2");
var stepCountOutput = document.getElementById("stepCountOutput");
var stateOutput = document.getElementById("stateOutput");
var tapeOutput1 = document.getElementById("tapeOutput1");
var tapeOutput2 = document.getElementById("tapeOutput2");
var statusOutput = document.getElementById("statusOutput");

var animationInterval = 1000;

const selectElement = document.getElementById('select-speed');

selectElement.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    animationInterval = parseInt(selectedValue);
});

var tape1 = [];
var tape2 = [];

var stepCount = 0;

var state = 1;

var move = true;

var anim = 0;

var slide = false;


function init() {
    head1 = 15;
    head2 = 15;

    tempHead1 = head1;
    tempHead2 = head2;

    tape1 = [];
    tape2 = [];

    stepCount = 0;

    state = 1;

    move = true;

    anim = 0;

    slide = false;

    animationInterval = 1000;
}

function step() {
    if (anim === 0) {
        if (state === finalStates[document.getElementById("type").textContent])
            document.getElementById("input-step").disabled = true;
        else {
            move = false;

            switch (document.getElementById("type").textContent) {
                case "Addition":
                    addition();
                    break;
                case "Power":
                    power();
                    break;
            }

            if (!move && !(state === finalStates[document.getElementById("type").textContent])) {
                document.getElementById("input-step").disabled = true;
                statusOutput.textContent = "Rejected";
                statusOutput.style.backgroundColor = "#ef4444"
                tapeOutput1.textContent = "11 (Undefined)"
            }
        }
    } else {
        document.getElementById("input-reset").disabled = document.getElementById("input-step").disabled = true;

        (tempHead1 > head1 ? animateLeft1() : animateRight1());
        (tempHead2 > head2 ? animateLeft2() : animateRight2());
        setTimeout(() => {
            display();

            document.getElementById("input-step").disabled = (!move ? true : false);
            document.getElementById("input-reset").disabled = false;
        }, animationInterval);
        anim = 0;
    }
}

function action(replaceWith1, replaceWith2, move1, move2, newState) {
    stepCount += 1;

    state = newState;

    tempHead1 = head1;
    tempHead2 = head2;

    tape1[head1] = replaceWith1;
    tape2[head2] = replaceWith2;
    if (move1 === 'L') head1--;
    else if (move1 === 'R') head1++;
    if (move2 === 'L') head2--;
    else if (move2 === 'R') head2++;

    move = (state === finalStates[document.getElementById("type").textContent] ? false : true);

    anim = 1;
    document.getElementsByClassName("popUp1")[0].textContent = replaceWith1;
    document.getElementsByClassName("popUp2")[0].textContent = replaceWith2;
    animatePop();
}

function display() {
    for (let x = 0, y = tempHead1 - 12; x < 25; x++, y++) {
        if (typeof tape1[y] == "undefined")
            tape1[y] = 'B';

        output1.children[x].children[0].children[0].textContent = tape1[y];
    }
    for (let x = 0, y = tempHead2 - 12; x < 25; x++, y++) {
        if (typeof tape2[y] == "undefined")
            tape2[y] = 'B';

        output2.children[x].children[0].children[0].textContent = tape2[y];
    }

    tapeOutput1.textContent = "";
    for (let x = 0; x < tape1.length; x++) {
        if (tape1[x] != 'B')
            tapeOutput1.textContent += " " + tape1[x] + " ";
    }
    tapeOutput2.textContent = "";
    for (let x = 0; x < tape2.length; x++) {
        if (tape2[x] != 'B')
            tapeOutput2.textContent += " " + tape2[x] + " ";
    }

    if (anim === 0) {
        if (state === finalStates[document.getElementById("type").textContent] || !move) {
            statusOutput.style.backgroundColor = (state === finalStates[document.getElementById("type").textContent] ? "#16a34a" : "#ef4444");
            statusOutput.textContent = (state === finalStates[document.getElementById("type").textContent] ? "Accepted" : "Rejected");
        }
        stepCountOutput.textContent = stepCount;
        stateOutput.textContent = "q" + state;
    }
}

function animatePop() {
    document.getElementById("input-reset").disabled = document.getElementById("input-step").disabled = true;

    document.getElementsByClassName("point1")[0].classList.toggle("animatePop");
    document.getElementsByClassName("popUp1")[0].classList.toggle("animatePop");
    document.getElementsByClassName("point2")[0].classList.toggle("animatePop");
    document.getElementsByClassName("popUp2")[0].classList.toggle("animatePop");

    setTimeout(() => {
        document.getElementsByClassName("point1")[0].classList.toggle("animatePop");
        document.getElementsByClassName("popUp1")[0].classList.toggle("animatePop");
        document.getElementsByClassName("point2")[0].classList.toggle("animatePop");
        document.getElementsByClassName("popUp2")[0].classList.toggle("animatePop");
        display();

        document.getElementById("input-reset").disabled = document.getElementById("input-step").disabled = false;
    }, animationInterval);
}

function animateLeft1() {
    if (tempHead1 == head1) return;

    for (let x = 0; x < document.getElementsByClassName("before1").length; x++)
        document.getElementsByClassName("before1")[x].classList.toggle("animateLeft");
    for (let x = 0; x < document.getElementsByClassName("after1").length; x++)
        document.getElementsByClassName("after1")[x].classList.toggle("animateLeft");
    document.getElementsByClassName("beforePoint1")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("beforeEdge1")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("beforeFade1")[0].textContent = tape1[tempHead1 - 13]; 
    document.getElementsByClassName("beforeFade1")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("afterPoint1")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("afterEdge1")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("point1")[0].classList.toggle("animateLeft");

    setTimeout(() => {
        for (let x = 0; x < document.getElementsByClassName("before1").length; x++)
            document.getElementsByClassName("before1")[x].classList.toggle("animateLeft");
        for (let x = 0; x < document.getElementsByClassName("after1").length; x++)
            document.getElementsByClassName("after1")[x].classList.toggle("animateLeft");
        document.getElementsByClassName("beforePoint1")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("beforeEdge1")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("beforeFade1")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("afterPoint1")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("afterEdge1")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("point1")[0].classList.toggle("animateLeft");
        tempHead1 = head1; 
    }, animationInterval);
}

function animateLeft2() {
    if (tempHead2 == head2) return;

    for (let x = 0; x < document.getElementsByClassName("before2").length; x++)
        document.getElementsByClassName("before2")[x].classList.toggle("animateLeft");
    for (let x = 0; x < document.getElementsByClassName("after2").length; x++)
        document.getElementsByClassName("after2")[x].classList.toggle("animateLeft");
    document.getElementsByClassName("beforePoint2")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("beforeEdge2")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("beforeFade2")[0].textContent = tape2[tempHead2 - 13]; 
    document.getElementsByClassName("beforeFade2")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("afterPoint2")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("afterEdge2")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("point2")[0].classList.toggle("animateLeft");

    setTimeout(() => {
        for (let x = 0; x < document.getElementsByClassName("before2").length; x++)
            document.getElementsByClassName("before2")[x].classList.toggle("animateLeft");
        for (let x = 0; x < document.getElementsByClassName("after2").length; x++)
            document.getElementsByClassName("after2")[x].classList.toggle("animateLeft");
        document.getElementsByClassName("beforePoint2")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("beforeEdge2")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("beforeFade2")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("afterPoint2")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("afterEdge2")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("point2")[0].classList.toggle("animateLeft");
        tempHead2 = head2; 
    }, animationInterval);
}

function animateRight1() {
    if (tempHead1 == head1) return;

    for (let x = 0; x < document.getElementsByClassName("before1").length; x++)
        document.getElementsByClassName("before1")[x].classList.toggle("animateRight");
    for (let x = 0; x < document.getElementsByClassName("after1").length; x++)
        document.getElementsByClassName("after1")[x].classList.toggle("animateRight");
    document.getElementsByClassName("beforePoint1")[0].classList.toggle("animateRight");
    document.getElementsByClassName("beforeEdge1")[0].classList.toggle("animateRight");
    document.getElementsByClassName("afterPoint1")[0].classList.toggle("animateRight");
    document.getElementsByClassName("afterEdge1")[0].classList.toggle("animateRight");
    if (typeof tape1[tempHead1 + 13] == "undefined") tape1[tempHead1 + 13] = 'B'; 
    document.getElementsByClassName("afterFade1")[0].textContent = tape1[tempHead1 + 13]; 
    document.getElementsByClassName("afterFade1")[0].classList.toggle("animateRight");
    document.getElementsByClassName("point1")[0].classList.toggle("animateRight");

    setTimeout(() => {
        for (let x = 0; x < document.getElementsByClassName("before1").length; x++)
            document.getElementsByClassName("before1")[x].classList.toggle("animateRight");
        for (let x = 0; x < document.getElementsByClassName("after1").length; x++)
            document.getElementsByClassName("after1")[x].classList.toggle("animateRight");
        document.getElementsByClassName("beforePoint1")[0].classList.toggle("animateRight");
        document.getElementsByClassName("beforeEdge1")[0].classList.toggle("animateRight");
        document.getElementsByClassName("afterPoint1")[0].classList.toggle("animateRight");
        document.getElementsByClassName("afterEdge1")[0].classList.toggle("animateRight");
        document.getElementsByClassName("afterFade1")[0].classList.toggle("animateRight");
        document.getElementsByClassName("point1")[0].classList.toggle("animateRight");
        tempHead1 = head1; 
    }, animationInterval);
}

function animateRight2() {
    if (tempHead2 == head2) return;

    for (let x = 0; x < document.getElementsByClassName("before2").length; x++)
        document.getElementsByClassName("before2")[x].classList.toggle("animateRight");
    for (let x = 0; x < document.getElementsByClassName("after2").length; x++)
        document.getElementsByClassName("after2")[x].classList.toggle("animateRight");
    document.getElementsByClassName("beforePoint2")[0].classList.toggle("animateRight");
    document.getElementsByClassName("beforeEdge2")[0].classList.toggle("animateRight");
    document.getElementsByClassName("afterPoint2")[0].classList.toggle("animateRight");
    document.getElementsByClassName("afterEdge2")[0].classList.toggle("animateRight");
    if (typeof tape2[tempHead2 + 13] == "undefined") tape2[tempHead2 + 13] = 'B'; 
    document.getElementsByClassName("afterFade2")[0].textContent = tape2[tempHead2 + 13]; 
    document.getElementsByClassName("afterFade2")[0].classList.toggle("animateRight");
    document.getElementsByClassName("point2")[0].classList.toggle("animateRight");

    setTimeout(() => {
        for (let x = 0; x < document.getElementsByClassName("before2").length; x++)
            document.getElementsByClassName("before2")[x].classList.toggle("animateRight");
        for (let x = 0; x < document.getElementsByClassName("after2").length; x++)
            document.getElementsByClassName("after2")[x].classList.toggle("animateRight");
        document.getElementsByClassName("beforePoint2")[0].classList.toggle("animateRight");
        document.getElementsByClassName("beforeEdge2")[0].classList.toggle("animateRight");
        document.getElementsByClassName("afterPoint2")[0].classList.toggle("animateRight");
        document.getElementsByClassName("afterEdge2")[0].classList.toggle("animateRight");
        document.getElementsByClassName("afterFade2")[0].classList.toggle("animateRight");
        document.getElementsByClassName("point2")[0].classList.toggle("animateRight");
        tempHead2 = head2; 
    }, animationInterval);
}

function simulate() {
    if (!(patternRe[document.getElementById("type").textContent].test(document.getElementById("input-string").value))) {
        alert("Format string tidak sesuai!\nFormat: " + document.getElementById("input-string").getAttribute("placeholder"));
        return;
    }

    document.getElementById("input-string").disabled = true;
    document.getElementById("input-sim").disabled = true;
    document.getElementById("input-step").disabled = false;
    document.getElementById("input-reset").disabled = false;
    document.getElementById("input-run").disabled = false;
    document.getElementById("input-fast").disabled = false;

    init();

    for (let x = 0;; x++) {
        if (x < head1)
            tape1[x] = 'B';
        else {
            for (let y = 0; y < document.getElementById("input-string").value.length; y++, x++) {
                if (((document.getElementById("input-string").value)[y] != ' '))
                    tape1[x] = (document.getElementById("input-string").value)[y];
                else
                    x--;
            }

            for (let y = 0; y < head1; y++, x++)
                tape1[x] = 'B';
            break;
        }
    }
    for (let x = 0; x < 2 * head1; x++)
        tape2[x] = 'B';

    display();
}

function reset() {
    document.getElementById("input-fast").disabled = true;
    document.getElementById("input-run").disabled = true;
    document.getElementById("input-reset").disabled = true;
    document.getElementById("input-step").disabled = true;
    document.getElementById("input-sim").disabled = false;
    document.getElementById("input-string").disabled = false;

    stepCountOutput.textContent = "";
    stateOutput.textContent = "";
    tapeOutput1.textContent = "";
    tapeOutput2.textContent = "";
    statusOutput.textContent = "";
    statusOutput.style.background = "";

    slide = false;
    document.getElementById("input-run").style.background = "";

    animationInterval = 1000;
    document.getElementById("input-fast").style.background = "";

    for (let x = 0; x < output.children.length; x++)
        output1.children[x].children[0].children[0].textContent = "";
    for (let x = 0; x < output.children.length; x++)
        output2.children[x].children[0].children[0].textContent = "";
}

function run() {
    slide = !slide;
    document.getElementById("input-run").style.background = (slide ? "green" : "");
}

function fast() {
    animationInterval = (animationInterval === 1000 ? 50 : 1000);
    document.getElementById("input-fast").style.background = (animationInterval === 1000 ? "" : "green");
}


document.getElementById("input-string").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("input-sim").click();
    }
});

setInterval(() => {
    if (slide && !(document.getElementById("input-step").disabled)) step();
}, 50);


function power() {
    switch (state) {
        case 1:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('B', 'B', 'R', 'S', 2);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('0', 'B', 'R', 'S', 21);
            break;
        case 21:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('B', 'B', 'R', 'S', 24);
            break;
        case 24:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('B', 'B', 'R', 'S', 24);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('1', 'B', 'S', 'S', finalStates[document.getElementById("type").textContent]);
            break;
        case 2:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'R', 'S', 3);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('B', 'B', 'R', 'S', 7);
            // else if (tape1[head1] === '1' && tape2[head2] === "B") action('1', 'B', 'R', 'S', 7);
            break;
        case 3:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'R', 'S', 3);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('1', 'B', 'R', 'S', 22);
            break;
        case 22:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', '0', 'R', 'R', 4);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('1', 'B', 'L', 'S', 23);
            break;
        case 23:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('B', 'B', 'L', 'S', 23);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('B', 'B', 'L', 'S', 23);
            else if (tape1[head1] === 'B' && tape2[head2] === "B") action('B', 'B', 'S', 'S', finalStates[document.getElementById("type").textContent]);
            break;
        case 4:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', '0', 'R', 'R', 4);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('1', '1', 'R', 'R', 5);
            break;
        case 5:
            if (tape1[head1] === 'B' && tape2[head2] === "B") action('B', 'B', 'L', 'S', 6);
            break;
        case 6:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'L', 'S', 6);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('1', 'B', 'L', 'S', 6);
            else if (tape1[head1] === 'B' && tape2[head2] === "B") action('B', 'B', 'R', 'S', 1);
            break;
        case 7:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'S', 'L', 8);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('1', 'B', 'S', 'S', finalStates[document.getElementById("type").textContent]);
            break;
        case 8:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'S', 'R', finalStates[document.getElementById("type").textContent]);
            else if (tape1[head1] === '0' && tape2[head2] === "1") action('0', '1', 'S', 'L', 9);
            break;
        case 9:
            if (tape1[head1] === '0' && tape2[head2] === "0") action('0', '0', 'S', 'L', 9);
            else if (tape1[head1] === '0' && tape2[head2] === "1") action('0', '1', 'S', 'L', 9);
            else if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'S', 'R', 10);
            break;
        case 10:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('X', 'B', 'R', 'S', 11);
            else if (tape1[head1] === '0' && tape2[head2] === "0") action('X', 'B', 'R', 'S', 11);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('1', 'B', 'L', 'S', 14);
            else if (tape1[head1] === '0' && tape2[head2] === "1") action('B', 'B', 'R', 'R', 15);
            else if (tape1[head1] === 'B' && tape2[head2] === "0") action('B', '0', 'R', 'S', 17);
            break;
        case 11:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'R', 'S', 11);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('1', 'B', 'R', 'S', 12);
            break;
        case 12:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'R', 'S', 12);
            else if (tape1[head1] === 'B' && tape2[head2] === "B") action('0', 'B', 'L', 'S', 13);
            break;
        case 13:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'L', 'S', 13);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('1', 'B', 'L', 'S', 13);
            else if (tape1[head1] === 'X' && tape2[head2] === "B") action('X', 'B', 'R', 'S', 10);
            break;
        case 14:
            if (tape1[head1] === 'X' && tape2[head2] === "B") action('0', 'B', 'L', 'S', 14);
            else if (tape1[head1] === 'B' && tape2[head2] === "B") action('B', 'B', 'R', 'R', 10);
            break;
        case 15:
            if (tape1[head1] === '0' && tape2[head2] === "0") action('B', '0', 'R', 'S', 15);
            else if (tape1[head1] === '0' && tape2[head2] === "1") action('B', '1', 'R', 'S', 15);
            else if (tape1[head1] === '0' && tape2[head2] === "B") action('B', 'B', 'R', 'S', 15);
            else if (tape1[head1] === '1' && tape2[head2] === "0") action('B', '0', 'R', 'S', 16);
            else if (tape1[head1] === '1' && tape2[head2] === "1") action('B', 'B', 'R', 'S', 16);
            else if (tape1[head1] === '1' && tape2[head2] === "B") action('B', 'B', 'R', 'S', 18);
            break;
        case 16:
            if (tape1[head1] === '0' && tape2[head2] === "0") action('0', '0', 'R', 'S', 16);
            else if (tape1[head1] === '0' && tape2[head2] === "B") action('B', 'B', 'R', 'S', 16);
            else if (tape1[head1] === 'B' && tape2[head2] === "0") action('1', '0', 'L', 'S', 17);
            break;
        case 17:
            if (tape1[head1] === '0' && tape2[head2] === "0") action('0', '0', 'L', 'S', 17);
            else if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'L', 'R', 17);
            else if (tape1[head1] === 'B' && tape2[head2] === "0") action('B', '0', 'R', 'S', 10);
            break;
        case 18:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'R', 'S', 18);
            else if (tape1[head1] === 'B' && tape2[head2] === "B") action('1', 'B', 'R', 'S', finalStates[document.getElementById("type").textContent]);
            break;
    }
}

function addition() {
    switch (state) {
        case 1:
            if (tape1[head1] === '+' && tape2[head2] === "B") action('+', '+', 'R', 'R', 2);
            else if (tape1[head1] === '-' && tape2[head2] === "B") action('-', '-', 'R', 'R', 9);
            break;
        case 2:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', '0', 'R', 'R', 2);
            else if (tape1[head1] === '+' && tape2[head2] === "B") action('+', 'B', 'R', 'S', 3);
            else if (tape1[head1] === '-' && tape2[head2] === "B") action('-', 'B', 'L', 'S', 5);
            break;
        case 3:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', '0', 'R', 'R', 3);
            else if (tape1[head1] === 'B' && tape2[head2] === "B") action('B', '1', 'S', 'S', finalStates[document.getElementById("type").textContent]);
            break;
        case 5:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'L', 'S', 5);
            else if (tape1[head1] === '+' && tape2[head2] === "B") action('B', 'B', 'R', 'S', 6);
            break;
        case 6:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('B', 'B', 'R', 'S', 6);
            else if (tape1[head1] === '-' && tape2[head2] === "B") action('-', 'B', 'R', 'S', 7);
            break;
        case 7:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'R', 'S', 7);
            else if (tape1[head1] === 'B' && tape2[head2] === "B") action('B', 'B', 'L', 'L', 8);
            break;
        case 8:
            if (tape1[head1] === '0' && tape2[head2] === "0") action('B', 'B', 'L', 'L', 8);
            else if (tape1[head1] === '-' && tape2[head2] === "0") action('B', '0', 'S', 'R', 15);
            else if (tape1[head1] === '0' && tape2[head2] === "+") action('0', 'B', 'R', 'S', 16);
            else if (tape1[head1] === '-' && tape2[head2] === "+") action('B', '1', 'S', 'S', finalStates[document.getElementById("type").textContent]);
            break;
        case 9:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', '0', 'R', 'R', 9);
            else if (tape1[head1] === '-' && tape2[head2] === "B") action('-', 'B', 'R', 'S', 10);
            else if (tape1[head1] === '+' && tape2[head2] === "B") action('+', 'B', 'L', 'S', 11);
            break;
        case 10:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', '0', 'R', 'R', 10);
            else if (tape1[head1] === 'B' && tape2[head2] === "B") action('B', '1', 'S', 'S', finalStates[document.getElementById("type").textContent]);
            break;
        case 11:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'L', 'S', 11);
            else if (tape1[head1] === '-' && tape2[head2] === "B") action('B', 'B', 'R', 'S', 12);
            break;
        case 12:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('B', 'B', 'R', 'S', 12);
            else if (tape1[head1] === '+' && tape2[head2] === "B") action('+', 'B', 'R', 'S', 13);
            break;
        case 13:
            if (tape1[head1] === '0' && tape2[head2] === "B") action('0', 'B', 'R', 'S', 13);
            else if (tape1[head1] === 'B' && tape2[head2] === "B") action('B', 'B', 'L', 'L', 14);
            break;
        case 14:
            if (tape1[head1] === '0' && tape2[head2] === "0") action('B', 'B', 'L', 'L', 14);
            else if (tape1[head1] === '+' && tape2[head2] === "0") action('B', '0', 'S', 'R', 17);
            else if (tape1[head1] === '0' && tape2[head2] === "-") action('0', 'B', 'R', 'S', 18);
            else if (tape1[head1] === '+' && tape2[head2] === "-") action('B', '1', 'S', 'S', finalStates[document.getElementById("type").textContent]);
            break;
        case 15:
            if (tape1[head1] === 'B' && tape2[head2] === "B") action('B', '1', 'S', 'S', finalStates[document.getElementById("type").textContent]);
            break;
        case 16:
            if (tape1[head1] === 'B' && tape2[head2] === "B") action('1', 'B', 'S', 'S', finalStates[document.getElementById("type").textContent]);
            break;
        case 17:
            if (tape1[head1] === 'B' && tape2[head2] === "B") action('B', '1', 'S', 'S', finalStates[document.getElementById("type").textContent]);
            break;
        case 18:
            if (tape1[head1] === 'B' && tape2[head2] === "B") action('1', 'B', 'S', 'S', finalStates[document.getElementById("type").textContent]);
            break;

    }
}
