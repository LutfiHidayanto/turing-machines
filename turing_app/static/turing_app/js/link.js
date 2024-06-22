
finalOutput = document.getElementById('tapeOutput2');

inputForm = document.getElementById('final_output');

console.log(finalOutput);
nextButton = document.getElementById('next');
submitForm = document.getElementById('next-form'); // Get the form element instead of the button


nextButton.onclick = () => {
    if (finalOutput.innerHTML == '') {
        finalOutput = document.getElementById('tapeOutput1');
    }
    inputForm.value = finalOutput.innerHTML;

    submitForm.submit();
};


