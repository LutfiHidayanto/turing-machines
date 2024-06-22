//START VARIABEL GLOBAL//

//list regex
var regex = [];
regex["Addition"] = new RegExp(/^(\s*[+-][\s0]*[+-][\s0]*)$/); //[+-]0*[+-]0* BISA LOL
regex["Subtraction"] = new RegExp(/^(\s*[+-][\s0]*[+-][\s0]*)$/); //[+-]0*[+-]0* BISA LOL
regex["Multiplication"] = new RegExp(/^\s*[+-][\s0]*[+-][\s0]*1\s*$/); //[+-]00*[+-]00*1 hmm?
regex["Division"] = new RegExp(/^\s*[+-][\s0]*[+-][\s0]*1\s*$/); //[+-]0*[+-]0*1 lol idk how can it works
regex["Factorial"] = new RegExp(/^[\s0]*1\s*$/); //0*1 see bisa..
regex["Power"] = new RegExp(/^[\s0]*1[\s0]*1\s*$/); //0*10*1 bisa..
regex["Square Root"] = new RegExp(/^[\s0]*1\s*$/); //0*1 BISA LOL 
regex["Binary Logarithm"] = new RegExp(/^[\s0]*1\s*$/); //00*1 HM OK BISA

//list asep setate
var acceptingState = [];
acceptingState["Addition"] = 21;
acceptingState["Subtraction"] = 21;
acceptingState["Multiplication"] = 18;
acceptingState["Division"] = 17;
acceptingState["Factorial"] = 24;
acceptingState["Power"] = 23;
acceptingState["Square Root"] = 8;
acceptingState["Binary Logarithm"] = 10;

//head index mulai dari 15 biar kirinya ada B
var head = 15;

//buat anim
var tempHead = head;

//ambil div id output yang udah disiapin
var output = document.getElementById("output");
var stepCountOutput = document.getElementById("stepCountOutput");
var stateOutput = document.getElementById("stateOutput");
var tapeOutput = document.getElementById("tapeOutput");
var statusOutput = document.getElementById("statusOutput");

//interval animation
var animationInterval = 1100;

//init tape array
var tape = [];

//steps count
var stepCount = 0;

//state
var state = 1;

//obah indikator
var obah = true;

//step anim indikator
var anim = 0;

//run indikator
var mlayu = false;

//END VARIABEL GLOBAL//
//START ALAT//

function init() {
    //head index mulai dari 15 biar kirinya ada B
    head = 15;

    //buat anim
    tempHead = head;

    //init tape array
    tape = [];

    //steps count
    stepCount = 0;

    //state
    state = 1;

    //obah indikator
    obah = true;

    //step anim indikator
    anim = 0;

    //run indikator
    mlayu = false;

    //fast
    animationInterval = 1100;
}

function step() {
    //deteksi anim
    if (anim === 0) {
        //mandek
        if (state === acceptingState[document.getElementById("nav").textContent])
            document.getElementById("input-step").disabled = true;
        else {
            //detek ora obah
            obah = false;

            //lakoni algoritma
            switch (document.getElementById("nav").textContent) {
                case "Addition":
                    addition();
                    break;
                case "Division":
                    division();
                    break;
                case "Power":
                    power();
                    break;;
                case "X":
                    addition();
                    power();
                    division();
                    break;
            }

            //mandek ditolak
            if (!obah && !(state === acceptingState[document.getElementById("nav").textContent])) {
                document.getElementById("input-step").disabled = true;
                statusOutput.textContent = "Rejected";
            }
        }
    } else {
        //deteksi animasi ke kiri or tengen
        (tempHead > head ? animateLeft() : animateRight());
        anim = 0;
    }
}

function action(replaceWith, move, newState) {
    //mlaku nambah
    stepCount += 1;

    //state ganti
    state = newState;

    //buat anim
    tempHead = head;

    //ganti isi tape, geser kanan kiwo
    tape[(move === 'L' ? head-- : head++)] = replaceWith;

    //obah ceker
    obah = (state === acceptingState[document.getElementById("nav").textContent] ? false : true);

    //lanjut anim
    anim = 1;
    document.getElementsByClassName("popUp")[0].textContent = replaceWith;
    animatePop();
}

//END ALAT//
//START TAMPILAN ANIMASI//

function display() {
    for (let x = 0, y = tempHead - 12; x < 25; x++, y++) {
        //add B to new index nek ora ono isine
        if (typeof tape[y] == "undefined")
            tape[y] = 'B'

        //output ke masing-masing span
        output.children[x].children[0].children[0].textContent = tape[y];
    }

    //display isi tape ke status bar
    tapeOutput.textContent = "";
    for (let x = 0; x < tape.length; x++) {
        if (tape[x] != 'B')
            tapeOutput.textContent += " " + tape[x] + " ";
    }

    //tampilin ke status bar nek wes kelar animasi kanan kiwo
    if (anim === 0) {
        //ganti status asep or tidak
        if (state === acceptingState[document.getElementById("nav").textContent] || !obah) {
            statusOutput.style.background = (state === acceptingState[document.getElementById("nav").textContent] ? "green" : "red");
            tapeOutput.style.background = (state === acceptingState[document.getElementById("nav").textContent] ? "green" : "red");
            statusOutput.textContent = (state === acceptingState[document.getElementById("nav").textContent] ? "Accepted" : "Rejected");
        }
        stepCountOutput.textContent = stepCount;
        stateOutput.textContent = "q" + state;
    }
}

function animatePop() {
    //matiin tombol reset dan step
    document.getElementById("input-reset").disabled = document.getElementById("input-step").disabled = true;

    //animasi
    document.getElementsByClassName("point")[0].classList.toggle("animatePop");
    document.getElementsByClassName("popUp")[0].classList.toggle("animatePop");

    //end animasi display yang sebenarnya
    setTimeout(() => {
        document.getElementsByClassName("point")[0].classList.toggle("animatePop");
        document.getElementsByClassName("popUp")[0].classList.toggle("animatePop");
        display();

        //tombol reset dan step murup meneh
       document.getElementById("input-reset").disabled = document.getElementById("input-step").disabled = false;
    }, animationInterval);
}

function animateLeft() {
    //matiin tombol reset dan step
    document.getElementById("input-reset").disabled = document.getElementById("input-step").disabled = true;

    //animasi
    for (let x = 0; x < document.getElementsByClassName("before").length; x++)
        document.getElementsByClassName("before")[x].classList.toggle("animateLeft");
    for (let x = 0; x < document.getElementsByClassName("after").length; x++)
        document.getElementsByClassName("after")[x].classList.toggle("animateLeft");
    document.getElementsByClassName("beforePoint")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("beforeEdge")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("beforeFade")[0].textContent = tape[tempHead - 13]; //trick tengen kiwo
    document.getElementsByClassName("beforeFade")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("afterPoint")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("afterEdge")[0].classList.toggle("animateLeft");
    document.getElementsByClassName("point")[0].classList.toggle("animateLeft");

    //end animasi display yang sebenarnya
    setTimeout(() => {
        for (let x = 0; x < document.getElementsByClassName("before").length; x++)
            document.getElementsByClassName("before")[x].classList.toggle("animateLeft");
        for (let x = 0; x < document.getElementsByClassName("after").length; x++)
            document.getElementsByClassName("after")[x].classList.toggle("animateLeft");
        document.getElementsByClassName("beforePoint")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("beforeEdge")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("beforeFade")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("afterPoint")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("afterEdge")[0].classList.toggle("animateLeft");
        document.getElementsByClassName("point")[0].classList.toggle("animateLeft");
        tempHead = head; //back to realiti
        display();

        //tombol step murop porak mboh, nek reset murop
        document.getElementById("input-step").disabled = (!obah ? true : false);
        document.getElementById("input-reset").disabled = false;
    }, animationInterval);
}

function animateRight() {
    //matiin tombol step
    document.getElementById("input-reset").disabled = document.getElementById("input-step").disabled = true;

    //animasi
    for (let x = 0; x < document.getElementsByClassName("before").length; x++)
        document.getElementsByClassName("before")[x].classList.toggle("animateRight");
    for (let x = 0; x < document.getElementsByClassName("after").length; x++)
        document.getElementsByClassName("after")[x].classList.toggle("animateRight");
    document.getElementsByClassName("beforePoint")[0].classList.toggle("animateRight");
    document.getElementsByClassName("beforeEdge")[0].classList.toggle("animateRight");
    document.getElementsByClassName("afterPoint")[0].classList.toggle("animateRight");
    document.getElementsByClassName("afterEdge")[0].classList.toggle("animateRight");
    if (typeof tape[tempHead + 13] == "undefined") tape[tempHead + 13] = 'B'; //jogoni undefined
    document.getElementsByClassName("afterFade")[0].textContent = tape[tempHead + 13]; //trick tengen kiri
    document.getElementsByClassName("afterFade")[0].classList.toggle("animateRight");
    document.getElementsByClassName("point")[0].classList.toggle("animateRight");

    //end animasi display yang sebenarnya
    setTimeout(() => {
        for (let x = 0; x < document.getElementsByClassName("before").length; x++)
            document.getElementsByClassName("before")[x].classList.toggle("animateRight");
        for (let x = 0; x < document.getElementsByClassName("after").length; x++)
            document.getElementsByClassName("after")[x].classList.toggle("animateRight");
        document.getElementsByClassName("beforePoint")[0].classList.toggle("animateRight");
        document.getElementsByClassName("beforeEdge")[0].classList.toggle("animateRight");
        document.getElementsByClassName("afterPoint")[0].classList.toggle("animateRight");
        document.getElementsByClassName("afterEdge")[0].classList.toggle("animateRight");
        document.getElementsByClassName("afterFade")[0].classList.toggle("animateRight");
        document.getElementsByClassName("point")[0].classList.toggle("animateRight");
        tempHead = head; //back to realiti club
        display();

        //tombol step murop porak mboh, nek reset murop
        document.getElementById("input-step").disabled = (!obah ? true : false);
        document.getElementById("input-reset").disabled = false;
    }, animationInterval);
}

//END TAMPILAN ANIMASI//
//START TOMBOL//

function simulate() {
    //detek regex
    if (!(regex[document.getElementById("nav").textContent].test(document.getElementById("input-string").value))) {
        alert("Format string tidak sesuai!\nFormat: " + document.getElementById("input-string").getAttribute("placeholder"));
        return;
    }

    //enable-disable button
    document.getElementById("input-string").disabled = true;
    document.getElementById("input-sim").disabled = true;
    document.getElementById("input-step").disabled = false;
    document.getElementById("input-reset").disabled = false;
    document.getElementById("input-run").disabled = false;
    document.getElementById("input-fast").disabled = false;

    //init
    init();

    //taruh input ke tape
    for (let x = 0;; x++) {
        //sebelum head B kabeh
        if (x < head)
            tape[x] = 'B';
        else {
            //dari input
            for (let y = 0; y < document.getElementById("input-string").value.length; y++, x++) {
                //kalo space diskip gamashok tape
                if (((document.getElementById("input-string").value)[y] != ' '))
                    tape[x] = (document.getElementById("input-string").value)[y];
                else
                    x--;
            }

            //jogoni setelah input kei B
            for (let y = 0; y < head; y++, x++)
                tape[x] = 'B';
            break;
        }
    }

    //mendelik
    display();
}

function reset() {
    //enable-disable button
    document.getElementById("input-fast").disabled = true;
    document.getElementById("input-run").disabled = true;
    document.getElementById("input-reset").disabled = true;
    document.getElementById("input-step").disabled = true;
    document.getElementById("input-sim").disabled = false;
    document.getElementById("input-string").disabled = false;

    //reset status
    stepCountOutput.textContent = "";
    stateOutput.textContent = "";
    tapeOutput.textContent = "";
    statusOutput.textContent = "";
    statusOutput.style.background = "";
    tapeOutput.style.background = "";

    //ora mlayu
    mlayu = false;
    document.getElementById("input-run").style.background = "";

    //ora fast
    animationInterval = 1100;
    document.getElementById("input-fast").style.background = "";

    //apus yang sebelumnya
    for (let x = 0; x < output.children.length; x++)
        output.children[x].children[0].children[0].textContent = "";
}

function run() {
    //pokoe mlayu
    mlayu = !mlayu;
    document.getElementById("input-run").style.background = (mlayu ? "green" : "");
}

function fast() {
    //ai em spiid
    animationInterval = (animationInterval === 1100 ? 50 : 1100);
    document.getElementById("input-fast").style.background = (animationInterval === 1100 ? "" : "green");
}

//END TOMBOL//
//START TAMBAHAN//

//Enter bikin submit
document.getElementById("input-string").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("input-sim").click();
    }
});

//mlayu detektor
setInterval(() => {
    if (mlayu && !(document.getElementById("input-step").disabled)) step();
}, 50);

//END TAMBAHAN//
//FUNGSI UTAMA ALGORITMA//

function addition() {
    switch (state) {
        case 1:
            if (tape[head] === '+') action('+', 'R', 2);
            else if (tape[head] === '-') action('-', 'R', 3);
            break;
        case 2:
            if (tape[head] === '0') action('0', 'R', 2);
            else if (tape[head] === '+') action('+', 'L', 4);
            else if (tape[head] === '-') action('-', 'L', 9);
            break;
        case 3:
            if (tape[head] === '0') action('0', 'R', 3);
            else if (tape[head] === '-') action('-', 'L', 4);
            else if (tape[head] === '+') action('+', 'L', 9);
            break;
        case 4:
            if (tape[head] === '0') action('0', 'L', 4);
            else if (tape[head] === '+') action('B', 'R', 5);
            else if (tape[head] === '-') action('B', 'R', 5);
            break;
        case 5:
            if (tape[head] === '+') action('+', 'R', 8);
            else if (tape[head] === '-') action('-', 'R', 8);
            else if (tape[head] === '0') action('B', 'R', 6);
            break;
        case 6:
            if (tape[head] === '0') action('0', 'R', 6);
            else if (tape[head] === '+') action('+', 'R', 6);
            else if (tape[head] === '-') action('-', 'R', 6);
            else if (tape[head] === 'B') action('0', 'L', 7);
            break;
        case 7:
            if (tape[head] === '0') action('0', 'L', 7);
            else if (tape[head] === '+') action('+', 'L', 7);
            else if (tape[head] === '-') action('-', 'L', 7);
            else if (tape[head] === 'B') action('B', 'R', 5);
            break;
        case 8:
            if (tape[head] === '0') action('0', 'R', 8);
            else if (tape[head] === 'B') action('1', 'R', acceptingState[document.getElementById("nav").textContent]);
            break;
        case 9:
            if (tape[head] === 'B') action('B', 'L', 9);
            else if (tape[head] === '0') action('B', 'R', 10);
            else if (tape[head] === '-') action('B', 'R', 17);
            else if (tape[head] === '+') action('B', 'R', 17);
            break;
        case 10:
            if (tape[head] === 'B') action('B', 'R', 10);
            else if (tape[head] === '+') action('+', 'R', 11);
            else if (tape[head] === '-') action('-', 'R', 11);
            break;
        case 11:
            if (tape[head] === '0') action('0', 'R', 11);
            else if (tape[head] === 'B') action('B', 'L', 12);
            break;
        case 12:
            if (tape[head] === '0') action('B', 'L', 13);
            else if (tape[head] === '+') action('B', 'L', 14);
            else if (tape[head] === '-') action('B', 'L', 14);
            break;
        case 13:
            if (tape[head] === '0') action('0', 'L', 13);
            else if (tape[head] === '+') action('+', 'L', 13);
            else if (tape[head] === '-') action('-', 'L', 13);
            else if (tape[head] === 'B') action('B', 'L', 9);
            break;
        case 14:
            if (tape[head] === 'B') action('B', 'L', 14);
            else if (tape[head] === '+') action('+', 'R', 15);
            else if (tape[head] === '-') action('-', 'R', 15);
            else if (tape[head] === '0') action('0', 'R', 15);
            break;
        case 15:
            if (tape[head] === 'B') action('0', 'R', 16);
            break;
        case 16:
            if (tape[head] === 'B') action('1', 'R', acceptingState[document.getElementById("nav").textContent]);
            break;
        case 17:
            if (tape[head] === 'B') action('B', 'R', 17);
            else if (tape[head] === '+') action('+', 'R', 18);
            else if (tape[head] === '-') action('-', 'R', 18);
            break;
        case 18:
            if (tape[head] === 'B') action('B', 'L', 19);
            else if (tape[head] === '0') action('0', 'R', 20);
            break;
        case 19:
            if (tape[head] === '-') action('1', 'R', acceptingState[document.getElementById("nav").textContent]);
            else if (tape[head] === '+') action('1', 'R', acceptingState[document.getElementById("nav").textContent]);
            break;
        case 20:
            if (tape[head] === '0') action('0', 'R', 20);
            else if (tape[head] === 'B') action('1', 'R', acceptingState[document.getElementById("nav").textContent]);
            break;
    }
}

function division() {
    switch (state) {
        case 1:
            if (tape[head] === '+') action('B', 'R', 2);
            else if (tape[head] === '-') action('B', 'R', 3);
            break;
        case 2:
            if (tape[head] === '0') action('0', 'R', 2);
            else if (tape[head] === '+') action('1', 'R', 4);
            else if (tape[head] === '-') action('1', 'R', 5);
            break;
        case 3:
            if (tape[head] === '0') action('0', 'R', 3);
            else if (tape[head] === '+') action('1', 'R', 5);
            else if (tape[head] === '-') action('1', 'R', 4);
            break;
        case 4:
            if (tape[head] === '1') action('1', 'R', 4);
            else if (tape[head] === '0') action('0', 'R', 4);
            else if (tape[head] === 'B') action('+', 'L', 6);
            break;
        case 5:
            if (tape[head] === '1') action('1', 'R', 5);
            else if (tape[head] === '0') action('0', 'R', 5);
            else if (tape[head] === 'B') action('-', 'L', 6);
            break;
        case 6:
            if (tape[head] === '1') action('1', 'L', 7);
            break;
        case 7:
            if (tape[head] === '0') action('0', 'L', 7);
            else if (tape[head] === '1') action('1', 'R', 8);
            break;
        case 8:
            if (tape[head] === 'X') action('X', 'R', 8);
            else if (tape[head] === '0') action('X', 'L', 9);
            else if (tape[head] === '1') action('1', 'R', 12);
            break;
        case 9:
            if (tape[head] === '0') action('0', 'L', 9);
            else if (tape[head] === '1') action('1', 'L', 9);
            else if (tape[head] === 'X') action('X', 'L', 9);
            else if (tape[head] === 'B') action('B', 'R', 10);
            break;
        case 10:
            if (tape[head] === '0') action('B', 'R', 11);
            else if (tape[head] === '1') action('B', 'R', 15);
            break;
        case 11:
            if (tape[head] === '0') action('0', 'R', 11);
            else if (tape[head] === '1') action('1', 'R', 8);
            break;
        case 12:
            if (tape[head] === '+') action('+', 'R', 12);
            else if (tape[head] === '-') action('-', 'R', 12);
            else if (tape[head] === '0') action('0', 'R', 12);
            else if (tape[head] === 'B') action('0', 'L', 13);
            break;
        case 13:
            if (tape[head] === '+') action('+', 'L', 13);
            else if (tape[head] === '-') action('-', 'L', 13);
            else if (tape[head] === '0') action('0', 'L', 13);
            else if (tape[head] === '1') action('1', 'L', 18);
            break;
        case 18: //0/0 modif here
            if (tape[head] === 'X') action('0', 'L', 14);
            else if (tape[head] === '1') action('B', 'L', 19); //0/0
            break;
        case 19:
            if (tape[head] === '0' || tape[head] === '1') action('B', 'L', 29);
            else if (tape[head] === 'B') action('B', 'R', 30); //indeterminate
            break;
        case 29:
            if (tape[head] === '0' || tape[head] === '1') action('B', 'L', 29);
            else if (tape[head] === 'B') action('B', 'R', 20); //undefined
            break;
        case 20:
            if (tape[head] === '0' || tape[head] === '1' || tape[head] === 'B') action('B', 'R', 20);
            else if (tape[head] === '+' || tape[head] === '-') action('U', 'R', 21);
            break;
        case 21:
            action('N', 'R', 22);
            break;
        case 22:
            action('D', 'R', 23);
            break;
        case 23:
            action('E', 'R', 24);
            break;
        case 24:
            action('F', 'R', 25);
            break;
        case 25:
            action('I', 'R', 26);
            break;
        case 26:
            action('N', 'R', 27);
            break;
        case 27:
            action('E', 'R', 28);
            break;
        case 28:
            action('D', 'R', acceptingState[document.getElementById("nav").textContent]);
            break;
        case 30:
            if (tape[head] === '0' || tape[head] === '1' || tape[head] === 'B') action('B', 'R', 30);
            else if (tape[head] === '+' || tape[head] === '-') action('I', 'R', 31);
            break;
        case 31:
            action('N', 'R', 32);
            break;
        case 32:
            action('D', 'R', 33);
            break;
        case 33:
            action('E', 'R', 34);
            break;
        case 34:
            action('T', 'R', 35);
            break;
        case 35:
            action('E', 'R', 36);
            break;
        case 36:
            action('R', 'R', 37);
            break;
        case 37:
            action('M', 'R', 38);
            break;
        case 38:
            action('I', 'R', 39);
            break;
        case 39:
            action('N', 'R', 40);
            break;
        case 40:
            action('A', 'R', 41);
            break;
        case 41:
            action('T', 'R', 42);
            break;
        case 42:
            action('E', 'R', acceptingState[document.getElementById("nav").textContent]);
            break;
        case 14:
            if (tape[head] === 'X') action('0', 'L', 14);
            else if (tape[head] === '1') action('1', 'R', 8);
            break;
        case 15:
            if (tape[head] === 'X') action('B', 'R', 15);
            else if (tape[head] === '0') action('B', 'R', 15);
            else if (tape[head] === '1') action('B', 'R', 16);
            break;
        case 16:
            if (tape[head] === '+') action('+', 'R', 16);
            else if (tape[head] === '-') action('-', 'R', 16);
            else if (tape[head] === '0') action('0', 'R', 16);
            else if (tape[head] === 'B') action('1', 'R', acceptingState[document.getElementById("nav").textContent]);
            break;
    }
}

function power() {
    switch (state) {
        case 1:
            if (tape[head] === '0') action('0', 'R', 2);
            else if (tape[head] === '1') action('B', 'R', 24); //modif here
            break;
        case 24:
            if (tape[head] === '0') action('B', 'R', 25); //n^0
            else if (tape[head] === '1') action('I', 'R', 27); //0^0 indeterminate
            break;
        case 25:
            if (tape[head] === '0') action('B', 'R', 25);
            else if (tape[head] === '1') action('0', 'R', 26);
            break;
        case 26:
            if (tape[head] === 'B') action('1', 'R', acceptingState[document.getElementById("nav").textContent]);
            break;
        case 27:
            action('N', 'R', 28);
            break;
        case 28:
            action('D', 'R', 29);
            break;
        case 29:
            action('E', 'R', 30);
            break;
        case 30:
            action('T', 'R', 31);
            break;
        case 31:
            action('E', 'R', 32);
            break;
        case 32:
            action('R', 'R', 33);
            break;
        case 33:
            action('M', 'R', 34);
            break;
        case 34:
            action('I', 'R', 35);
            break;
        case 35:
            action('N', 'R', 36);
            break;
        case 36:
            action('A', 'R', 37);
            break;
        case 37:
            action('T', 'R', 38);
            break;
        case 38:
            action('E', 'R', acceptingState[document.getElementById("nav").textContent]);
            break;
        case 2:
            if (tape[head] === '0') action('0', 'R', 3);
            else if (tape[head] === '1') action('1', 'L', 10);
            break;
        case 3:
            if (tape[head] === '0') action('0', 'R', 3);
            else if (tape[head] === '1') action('1', 'R', 4);
            break;
        case 4:
            if (tape[head] === '0') action('X', 'R', 5);
            else if (tape[head] === '1') action('1', 'R', 7);
            break;
        case 5:
            if (tape[head] === '0') action('0', 'R', 5);
            else if (tape[head] === '1') action('1', 'R', 5);
            else if (tape[head] === 'B') action('0', 'L', 6);
            break;
        case 6:
            if (tape[head] === '0') action('0', 'L', 6);
            else if (tape[head] === '1') action('1', 'L', 6);
            else if (tape[head] === 'X') action('X', 'R', 4);
            break;
        case 7:
            if (tape[head] === '0') action('0', 'R', 7);
            else if (tape[head] === '1') action('1', 'R', 7);
            else if (tape[head] === 'B') action('1', 'L', 8);
            break;
        case 8:
            if (tape[head] === '0') action('0', 'L', 8);
            else if (tape[head] === '1') action('1', 'L', 8);
            else if (tape[head] === 'X') action('0', 'L', 8);
            else if (tape[head] === 'B') action('B', 'R', 9);
            break;
        case 9:
            if (tape[head] === '0') action('B', 'R', 1);
            break;
        case 10:
            if (tape[head] === '0') action('B', 'R', 11);
            break;
        case 11:
            if (tape[head] === '1') action('B', 'R', 12);
            break;
        case 12:
            if (tape[head] === '1') action('B', 'R', 19);
            else if (tape[head] === '0') action('B', 'R', 13);
            break;
        case 13:
            if (tape[head] === '0') action('0', 'R', 13);
            else if (tape[head] === '1') action('1', 'R', 14);
            break;
        case 14:
            if (tape[head] === '0') action('X', 'R', 15);
            else if (tape[head] === '1') action('1', 'L', 17);
            else if (tape[head] === 'B') action('1', 'L', 22);
            break;
        case 15:
            if (tape[head] === '0') action('0', 'R', 15);
            else if (tape[head] === '1') action('1', 'R', 15);
            else if (tape[head] === 'B') action('0', 'L', 16);
            break;
        case 16:
            if (tape[head] === '0') action('0', 'L', 16);
            else if (tape[head] === '1') action('1', 'L', 16);
            else if (tape[head] === 'X') action('X', 'R', 14);
            break;
        case 17:
            if (tape[head] === 'X') action('0', 'L', 17);
            else if (tape[head] === '1') action('1', 'L', 18);
            break;
        case 18:
            if (tape[head] === '0') action('0', 'L', 18);
            else if (tape[head] === 'B') action('B', 'R', 12);
            break;
        case 19:
            if (tape[head] === '0') action('B', 'R', 19);
            else if (tape[head] === '1') action('B', 'R', 20);
            else if (tape[head] === 'B') action('1', 'R', acceptingState[document.getElementById("nav").textContent]); //modif here
            break;
        case 20:
            if (tape[head] === '0') action('0', 'R', 20);
            else if (tape[head] === '1') action('1', 'R', 20);
            else if (tape[head] === 'B') action('1', 'L', 21);
            break;
        case 21:
            if (tape[head] === '0') action('0', 'L', 21);
            else if (tape[head] === '1') action('1', 'L', 21);
            else if (tape[head] === 'B') action('B', 'R', 12);
            break;
        case 22:
            if (tape[head] === '1') action('0', 'R', acceptingState[document.getElementById("nav").textContent]);
            break;
    }
}

//END FUNGSI UTAMA ALGORITMA