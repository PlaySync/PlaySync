function valid() {

    var psw = document.getElementById("registerPass");
    var cpsw = document.getElementById("confirmPass");
    var name = document.getElementById("registerUser");

    var lower = document.getElementById("lower");
    var upper = document.getElementById("upper");
    var number = document.getElementById("number");
    var length = document.getElementById("length");
    var equals = document.getElementById("match");
    var nameCheck = document.getElementById("nameCheck");

    name.onkeyup = function() {
        if (name.value.length > 0) {
            nameCheck.classList.remove("invalid");
            nameCheck.classList.add("valid");
        } else {
            nameCheck.classList.remove("valid");
            nameCheck.classList.add("invalid");
        }
        enableSignup(lower, upper, number, length, equals, nameCheck);
    }

    psw.onkeyup = function() {
        var lowerCase = /[a-z]/g;
        var upperCase = /[A-Z]/g;
        var numbers = /[0-9]/g;
        var minLength = 8;
        
        /*match for a lowercase letter*/
        if (psw.value.match(lowerCase)) {
            lower.classList.remove("invalid");
            lower.classList.add("valid");
        } else {
            lower.classList.remove("valid");
            lower.classList.add("invalid");
        }

        /*match for an uppercase letter*/
        if (psw.value.match(upperCase)) {
            upper.classList.remove("invalid");
            upper.classList.add("valid");
        } else {
            upper.classList.remove("valid");
            upper.classList.add("invalid");
        }

        /*match for a number*/
        if (psw.value.match(numbers)) {
            number.classList.remove("invalid");
            number.classList.add("valid");
        } else {
            number.classList.remove("valid");
            number.classList.add("invalid");
        }

        /*match for length*/
        if (psw.value.length >= minLength) {
            length.classList.remove("invalid");
            length.classList.add("valid");
        } else {
            length.classList.remove("valid");
            length.classList.add("invalid");
        }

        /*match for value on password*/
        if (psw.value == cpsw.value && psw.value != '' && cpsw.value != '') {
            equals.classList.remove("invalid");
            equals.classList.add("valid");
        } else {
            equals.classList.remove("valid");
            equals.classList.add("invalid");
        }
        enableSignup(lower, upper, number, length, equals, nameCheck);
    }

    /*match for value on confirm password*/
    cpsw.onkeyup = function() {
        if (psw.value == cpsw.value && psw.value != '' && cpsw.value != '') {
            equals.classList.remove("invalid");
            equals.classList.add("valid");
        } else {
            equals.classList.remove("valid");
            equals.classList.add("invalid");
        }
        enableSignup(lower, upper, number, length, equals, nameCheck);
    }
}

function enableSignup(lower, upper, number, length, equals, nameCheck) {
    var button = document.getElementById("signupRegisterButton");
    if (lower.classList.contains("valid") && upper.classList.contains("valid") && number.classList.contains("valid") && length.classList.contains("valid") && equals.classList.contains("valid") && nameCheck.classList.contains("valid")) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}