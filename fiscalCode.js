const VOWELS = ["a", "e", "u", "i", "o"];
const MONTHS = {
    1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "H",
    7: "L", 8: "M", 9: "P", 10: "R", 11: "S", 12: "T"
}



function generatePrefixForString(query, context) {
    if (typeof query !== "string") { return `INVALID TYPE FOR ${query}` }
    if (context.toLowerCase() !== "name" && context.toLowerCase() !== "surname") { return `INVALID CONTEXT FOR ${context}` }

    const consonants = [];
    const vowels = [];

    for (let i = 0; i < query.length; i++) {
        const ch = query[i];
        const lower = ch.toLowerCase();
        if (!/[a-z]/.test(lower)) continue;
        if (VOWELS.includes(lower)) vowels.push(ch);
        else consonants.push(ch);
    }

    let prefix = "";

    if (context === "surname") {
        // surname: take consonants in order, then vowels, then pad
        prefix = (consonants.join("") + vowels.join("")).slice(0, 3);
    } else {
        // name: special rule when more than 3 consonants
        if (consonants.length === 3) {
            prefix = consonants.slice(0, 3).join("");
        } else if (consonants.length > 3) {
            prefix = consonants[0] + consonants[2] + consonants[3];
        } else {
            prefix = (consonants.join("") + vowels.join("")).slice(0, 3);
        }
    }

    while (prefix.length < 3) prefix += "X";
    return prefix.toUpperCase();
}
/* 
let a = generatePrefixForString("Mouse", "surname");
console.log(a);
let b = generatePrefixForString("Mickey", "name")
console.log(b);
*/


function isValidDMY(dateString) {
    //  Step 1: Strict format check — no leading zeros
    const regex = /^(?:[1-9]|[12]\d|3[01])\/(?:[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(dateString)) return false;

    //  Step 2: Real calendar date check
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    // Check if date components match exactly (to avoid JS auto-correction)
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}
/* 

console.log(isValidDMY("11/7/2025")); // true
console.log(isValidDMY("11/07/2025")); // false
console.log(isValidDMY("10/22/2025")); // false
console.log(isValidDMY("31/11/2025")); // false (November has 30 days)
*/


function generateDobAndGenderPrefix(dob, gender) {
    if (typeof dob !== "string" || typeof gender !== "string") {
        return "INVALID TYPE FOR DOB OR GENDER";
    }

    if (isValidDMY(dob) === false) {
        return "INVALID DOB FORMAT, FOR MORE INFORMATIONS CHECK THE DOCS"
    }

    // assuming that the DD/M/YYYY format is already checked

    // Split the date string D/M/YYYY into separate values
    const [day, month, year] = dob.split("/").map(Number);

    // Get last two digits of year
    const yearPrefix = year.toString().slice(-2);

    // Get month letter from MONTHS object
    const monthPrefix = MONTHS[month];

    // Calculate day prefix based on gender
    let dayPrefix;
    if (gender.toLowerCase() === "m") {
        dayPrefix = day < 10 ? `0${day}` : day.toString();
    } else if (gender.toLowerCase() === "f") {
        dayPrefix = (day + 40).toString();
    } else {
        return "INVALID GENDER";
    }

    return yearPrefix + monthPrefix + dayPrefix;
}

function generateFiscalCode(person) {
    let { surname, name, dob, gender } = person;

    console.log("current person surname is :", surname);
    console.log("current person name is :", name);
    console.log("current person dob is :", dob);
    console.log("current person gender is :", gender)
    console.log("\n");
    console.log("generating..");

    // surname process
    const surnamePrefix = generatePrefixForString(surname, "surname");
    const namePrefix = generatePrefixForString(name, "name");
    const dobGenderPrefix = generateDobAndGenderPrefix(dob, gender);


    return (surnamePrefix + namePrefix + dobGenderPrefix).toUpperCase();



}

const person1 = {
    surname: "Mouse",
    name: "Mickey",
    dob: "16/1/1928",
    gender: "m"
};

const person2 = {
    name: "Helen",
    surname: "Yu",
    gender: "F",
    dob: "1/12/1950"
}

const person3 = {
    name: "Mickey",
    surname: "Mouse",
    gender: "M",
    dob: "16/1/1928"
}

console.log(generateFiscalCode(person1)); // DBTMTT00A01
console.log(generateFiscalCode(person2)); // YUXHLN50T41
console.log(generateFiscalCode(person3)); // MSOMKY28A16