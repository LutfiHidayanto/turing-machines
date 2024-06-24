var patternRe = [];
patternRe["Addition"] = new RegExp(/^(\s*[+-][\s0]*[+-][\s0]*)$/); 
// patternRe["Division"] = new RegExp(/^\s*[+-]\s*0[\s0]*[+-]\s*0[\s0]*1\s*$/); 
patternRe["Division"] = new RegExp('^[+-]0*[+-]0*1$');

// patternRe["Power"] = new RegExp(/^\s*0[\s0]*1\s*0[\s0]*1\s*$/); 

var finalStates = [];
finalStates["Multiplication"] = 10;
finalStates["Division"] = 10;
finalStates["Factorial"] = 17;
finalStates["Power"] = 20;
finalStates["Square Root"] = 6;
finalStates["Binary Logarithm"] = 9;

var head1 = 15;
var head2 = 15;
var head3 = 15;

var tempHead1 = head1;
var tempHead2 = head2;
var tempHead3 = head3;

var output1 = document.getElementById("output1");
var output2 = document.getElementById("output2");
var output3 = document.getElementById("output3");
var stepCountOutput = document.getElementById("stepCountOutput");
var stateOutput = document.getElementById("stateOutput");
var tapeOutput1 = document.getElementById("tapeOutput1");
var tapeOutput2 = document.getElementById("tapeOutput2");
var tapeOutput3 = document.getElementById("tapeOutput3");
var statusOutput = document.getElementById("statusOutput");

var animationInterval = 1000;

const selectElement = document.getElementById('select-speed');

selectElement.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    animationInterval = parseInt(selectedValue);
});

var tape1 = [];
var tape2 = [];
var tape3 = [];

var stepCount = 0;

var state = 1;

var move = true;

var anim = 0;

var slide = false;

function init() {
    head1 = 15;
    head2 = 15;
    head3 = 15;

    tempHead1 = head1;
    tempHead2 = head2;
    tempHead3 = head3;

    tape1 = [];
    tape2 = [];
    tape3 = [];

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
                case "Multiplication":
                    multiplication();
                    break;
                case "Division":
                    division();
                    break;
                case "Binary Logarithm":
                    binaryLogarithm();
                    break;
            }

            if (!move && !(state === finalStates[document.getElementById("type").textContent])) {
                document.getElementById("input-step").disabled = true;
                statusOutput.textContent = "Rejected";
                statusOutput.style.backgroundColor = "#ef4444"
                tapeOutput3.textContent = "11 (Undefined)"
            }
        }
    } else {
        document.getElementById("input-reset").disabled = document.getElementById("input-step").disabled = true;

        (tempHead1 > head1 ? animateLeft1() : animateRight1());
        (tempHead2 > head2 ? animateLeft2() : animateRight2());
        (tempHead3 > head3 ? animateLeft3() : animateRight3());
        setTimeout(() => {
            display();

            document.getElementById("input-step").disabled = (!move ? true : false);
            document.getElementById("input-reset").disabled = false;
        }, animationInterval);
        anim = 0;
    }
}

function action(replaceWith1, replaceWith2, replaceWith3, move1, move2, move3, newState) {
    stepCount += 1;

    state = newState;

    tempHead1 = head1;
    tempHead2 = head2;
    tempHead3 = head3;

    tape1[head1] = replaceWith1;
    tape2[head2] = replaceWith2;
    tape3[head3] = replaceWith3;
    if (move1 === 'L') head1--;
    else if (move1 === 'R') head1++;
    if (move2 === 'L') head2--;
    else if (move2 === 'R') head2++;
    if (move3 === 'L') head3--;
    else if (move3 === 'R') head3++;

    move = (state === finalStates[document.getElementById("type").textContent] ? false : true);

    anim = 1;
    document.getElementsByClassName("popUp1")[0].textContent = replaceWith1;
    document.getElementsByClassName("popUp2")[0].textContent = replaceWith2;
    document.getElementsByClassName("popUp3")[0].textContent = replaceWith3;
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
    for (let x = 0, y = tempHead3 - 12; x < 25; x++, y++) {
        if (typeof tape3[y] == "undefined")
            tape3[y] = 'B';

        output3.children[x].children[0].children[0].textContent = tape3[y];
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
    tapeOutput3.textContent = "";
    for (let x = 0; x < tape3.length; x++) {
        if (tape3[x] != 'B')
            tapeOutput3.textContent += " " + tape3[x] + " ";
    }

    if (anim === 0) {
        if (state === finalStates[document.getElementById("type").textContent] || !move) {
            statusOutput.style.background = (state === finalStates[document.getElementById("type").textContent] ? "#16a34a" : "#ef4444");
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
    document.getElementsByClassName("point3")[0].classList.toggle("animatePop");
    document.getElementsByClassName("popUp3")[0].classList.toggle("animatePop");

    setTimeout(() => {
        document.getElementsByClassName("point1")[0].classList.toggle("animatePop");
        document.getElementsByClassName("popUp1")[0].classList.toggle("animatePop");
        document.getElementsByClassName("point2")[0].classList.toggle("animatePop");
        document.getElementsByClassName("popUp2")[0].classList.toggle("animatePop");
        document.getElementsByClassName("point3")[0].classList.toggle("animatePop");
        document.getElementsByClassName("popUp3")[0].classList.toggle("animatePop");
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

function animateLeft3() {
    if (tempHead3 == head3) return;

    for (let x = 0; x < document.getElementsByClassName("before3").length; x++)
        document.getElementsByClassName("before3")[x].classList.toggle("animateLeft");
    for (let x = 0; x < document.getElementsByClassName("after3").length; x++)
        document.getElementsByClassName("after3")[x].classList.toggle("animateLeft");
    document.getElementsByClassName("beforePoint3")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("beforeEdge3")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("beforeFade3")[0].textContent = tape3[tempHead3 - 13]; 
    document.getElementsByClassName("beforeFade3")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("afterPoint3")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("afterEdge3")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("point3")[0].classList.toggle("animateLeft");

    setTimeout(() => {
        for (let x = 0; x < document.getElementsByClassName("before3").length; x++)
            document.getElementsByClassName("before3")[x].classList.toggle("animateLeft");
        for (let x = 0; x < document.getElementsByClassName("after3").length; x++)
            document.getElementsByClassName("after3")[x].classList.toggle("animateLeft");
        document.getElementsByClassName("beforePoint3")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("beforeEdge3")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("beforeFade3")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("afterPoint3")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("afterEdge3")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("point3")[0].classList.toggle("animateLeft");
        tempHead3 = head3; 
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

function animateRight3() {
    if (tempHead3 == head3) return;

    for (let x = 0; x < document.getElementsByClassName("before3").length; x++)
        document.getElementsByClassName("before3")[x].classList.toggle("animateRight");
    for (let x = 0; x < document.getElementsByClassName("after3").length; x++)
        document.getElementsByClassName("after3")[x].classList.toggle("animateRight");
    document.getElementsByClassName("beforePoint3")[0].classList.toggle("animateRight");
    document.getElementsByClassName("beforeEdge3")[0].classList.toggle("animateRight");
    document.getElementsByClassName("afterPoint3")[0].classList.toggle("animateRight");
    document.getElementsByClassName("afterEdge3")[0].classList.toggle("animateRight");
    if (typeof tape3[tempHead3 + 13] == "undefined") tape3[tempHead3 + 13] = 'B'; 
    document.getElementsByClassName("afterFade3")[0].textContent = tape3[tempHead3 + 13]; 
    document.getElementsByClassName("afterFade3")[0].classList.toggle("animateRight");
    document.getElementsByClassName("point3")[0].classList.toggle("animateRight");

    setTimeout(() => {
        for (let x = 0; x < document.getElementsByClassName("before3").length; x++)
            document.getElementsByClassName("before3")[x].classList.toggle("animateRight");
        for (let x = 0; x < document.getElementsByClassName("after3").length; x++)
            document.getElementsByClassName("after3")[x].classList.toggle("animateRight");
        document.getElementsByClassName("beforePoint3")[0].classList.toggle("animateRight");
        document.getElementsByClassName("beforeEdge3")[0].classList.toggle("animateRight");
        document.getElementsByClassName("afterPoint3")[0].classList.toggle("animateRight");
        document.getElementsByClassName("afterEdge3")[0].classList.toggle("animateRight");
        document.getElementsByClassName("afterFade3")[0].classList.toggle("animateRight");
        document.getElementsByClassName("point3")[0].classList.toggle("animateRight");
        tempHead3 = head3; 
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
        tape2[x] = tape3[x] = 'B';

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
    tapeOutput3.textContent = "";
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
    for (let x = 0; x < output.children.length; x++)
        output3.children[x].children[0].children[0].textContent = "";
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


function division() {
    switch (state) {
        // case 100:
        //     if (tape1[head1] === '+' && tape2[head2] === "B" && tape3[head3] === "B") action('+', 'B', 'B', 'R', 'S', 'S', 100);
        //     else if (tape1[head1] === '-' && tape2[head2] === "B" && tape3[head3] === "B") action('-', 'B', 'B', 'R', 'S', 'S', 100);
        //     else if (tape1[head1] === '0' && tape2[head2] === "B" && tape3[head3] === "B") {
        //         console.log("100 to 100");
        //         action('0', 'B', 'B', 'R', 'S', 'S', 100);
        //     }
        //     else if (tape1[head1] === '1' && tape2[head2] === "B" && tape3[head3] === "B") action('1', 'B', 'B', 'L', 'S', 'S', 99);
        //     break;
        // case 99:
        //     if (tape1[head1] === '+' && tape2[head2] === "B" && tape3[head3] === "B") action('+', 'B', 'B', 'S', 'S', 'S', finalStates[document.getElementById("type").textContent]);
        //     else if (tape1[head1] === '-' && tape2[head2] === "B" && tape3[head3] === "B") action('-', 'B', 'B', 'S', 'S', 'S', finalStates[document.getElementById("type").textContent]);
        //     else if (tape1[head1] === '0' && tape2[head2] === "B" && tape3[head3] === "B")  {
        //         console.log("99 to 97");
        //         action('0', 'B', 'B', 'L', 'S', 'S', 97); 
        //     }
        //     break;
        // case 97:
        //     if (tape1[head1] === '+' && tape2[head2] === "B" && tape3[head3] === "B") action('+', 'B', 'B', 'L', 'S', 'S', 97);
        //     else if (tape1[head1] === '-' && tape2[head2] === "B" && tape3[head3] === "B") action('-', 'B', 'B', 'L', 'S', 'S', 97);
        //     else if (tape1[head1] === '0' && tape2[head2] === "B" && tape3[head3] === "B") action('0', 'B', 'B', 'L', 'S', 'S', 97);
        //     else if (tape1[head1] === 'B' && tape2[head2] === "B" && tape3[head3] === "B") action('B', 'B', 'B', 'R', 'S', 'S', 1);
        //     break;
        case 1:
            if (tape1[head1] === '+' && tape2[head2] === "B" && tape3[head3] === "B") action('B', 'B', 'B', 'R', 'S', 'S', 2);
            else if (tape1[head1] === '-' && tape2[head2] === "B" && tape3[head3] === "B") action('B', 'B', 'B', 'R', 'S', 'S', 3);
            break;
        case 2:
            if (tape1[head1] === '0' && tape2[head2] === "B" && tape3[head3] === "B") action('0', 'B', 'B', 'R', 'S', 'S', 2);
            else if (tape1[head1] === '+' && tape2[head2] === "B" && tape3[head3] === "B") action('B', 'B', '+', 'R', 'S', 'R', 4);
            else if (tape1[head1] === '-' && tape2[head2] === "B" && tape3[head3] === "B") action('B', 'B', '-', 'R', 'S', 'R', 4);
            break;
        case 3:
            if (tape1[head1] === '0' && tape2[head2] === "B" && tape3[head3] === "B") action('0', 'B', 'B', 'R', 'S', 'S', 3);
            else if (tape1[head1] === '+' && tape2[head2] === "B" && tape3[head3] === "B") action('B', 'B', '-', 'R', 'S', 'R', 4);
            else if (tape1[head1] === '-' && tape2[head2] === "B" && tape3[head3] === "B") action('B', 'B', '+', 'R', 'S', 'R', 4);
            break;
        case 4:
            if (tape1[head1] === '0' && tape2[head2] === "B" && tape3[head3] === "B") action('0', '0', 'B', 'R', 'R', 'S', 4);
            else if (tape1[head1] === '1' && tape2[head2] === "B" && tape3[head3] === "B") action('1', 'B', 'B', 'L', 'L', 'S', 6);
            break;
        case 6:
            if (tape1[head1] === '0' && tape2[head2] === "0" && tape3[head3] === "B") action('0', '0', 'B', 'L', 'S', 'S', 6);
            else if (tape1[head1] === 'B' && tape2[head2] === "0" && tape3[head3] === "B") action('B', '0', 'B', 'L', 'S', 'S', 7);
            break;
        case 7:
            if (tape1[head1] === '0' && tape2[head2] === "0" && tape3[head3] === "B") action('0', '0', 'B', 'L', 'L', 'S', 7);
            else if (tape1[head1] === 'B' && tape2[head2] === "0" && tape3[head3] === "B") action('B', '0', '1', 'S', 'S', 'R', finalStates[document.getElementById("type").textContent]);
            else if (tape1[head1] === '0' && tape2[head2] === "B" && tape3[head3] === "B") action('0', 'B', '0', 'S', 'R', 'R', 8);
            else if (tape1[head1] === 'B' && tape2[head2] === "B" && tape3[head3] === "B") action('B', 'B', '0', 'S', 'S', 'R', 9);
            break;
        case 8:
            if (tape1[head1] === '0' && tape2[head2] === "0" && tape3[head3] === "B") action('0', '0', 'B', 'L', 'R', 'S', 8);
            else if (tape1[head1] === 'B' && tape2[head2] === "0" && tape3[head3] === "B") action('B', 'B', '1', 'S', 'S', 'R', finalStates[document.getElementById("type").textContent]);
            else if (tape1[head1] === '0' && tape2[head2] === "B" && tape3[head3] === "B") action('0', 'B', '0', 'S', 'L', 'R', 7);
            else if (tape1[head1] === 'B' && tape2[head2] === "B" && tape3[head3] === "B") action('B', 'B', '0', 'S', 'S', 'R', 9);
            break;
        case 9:
            if (tape1[head1] === 'B' && tape2[head2] === "B" && tape3[head3] === "B") action('B', 'B', '1', 'S', 'S', 'R', finalStates[document.getElementById("type").textContent]);
            break;
    }
}
