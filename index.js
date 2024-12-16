document.addEventListener("DOMContentLoaded", () => {
    const content = document.querySelector('.loading');
    setTimeout(() => {
        content.style.display = 'none';
    }, 5000);
})
function checkPassword() {
    const correctPassword = "King";
    const LoginC = "DZKing";

    const login = document.getElementById("login").value;
    const inputPassword = document.getElementById("password").value;

    if (inputPassword === correctPassword && login === LoginC) {
        document.querySelector(".login-box").style.display = "none";
    } else {
        const errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "block";
    }
};
const NBtn = document.querySelector(".p-btn");
const PName = document.querySelector(".namee");
const PInputField = document.getElementById("name-input");
const formContainer = document.querySelector(".profile-type");
const Menu = document.querySelector('.menu');
Menu.style.display = "none"

NBtn.addEventListener("click", () => {
    const PInput = PInputField.value.trim();
    
    if (PInput === "Dilshod") {
        PName.textContent = "Admin Panel";
        Menu.style.display = "block";
        PInputField.value = "";
        formContainer.style.display = 'none';
    } else if (PInput) {
        PName.textContent = PInput;
        formContainer.style.display = "none";
    }
    localStorage.setItem("savedName", PName.textContent);
});
// document.addEventListener("DOMContentLoaded", () => {
//     const savedName = localStorage.getItem("savedName");

//     if (savedName !== "Dilshod") {
//         PName.textContent = savedName;
//         if (savedName) {
//             formContainer.style.display = "none";
//         } else {
//             formContainer.style.display = "block";
//         }
//     }
// });

const display = document.getElementById("yechish");
function appened(input) {
    display.value += input;
}
function clearr() {
    display.value = "";
}
function B() {
    const inputValue = display.value.trim();

    const [price, discountPercentage] = inputValue.split(',').map(value => parseFloat(value.trim()));

    if (!isNaN(price) && !isNaN(discountPercentage) && price > 0 && discountPercentage >= 0) {
        const discountAmount = (price * discountPercentage) / 100;
        const discountedPrice = price - discountAmount;
      
        display.value = `Chegirma: ${discountPercentage}% | Summa: ${discountedPrice.toFixed(2)} so'm`;
    } else {
        display.value = "Iltimos, to'g'ri formatda kiriting: Narx, %";
    }
}
function calculate() {
    display.value = eval(display.value);
}

// const anime = document.querySelector('.animation-all');
// const Btns = document.querySelectorAll(".cal-btn").forEach(
//     btn => btn.addEventListener("click", () => {
//         const div = document.createElement("div");
//         div.innerHTML = btn.textContent;
//         div.classList.add('animation');
//         anime.appendChild(div);

//         const startX = Math.random() * (anime.offsetWidth - 30);
//         div.style.left = `${startX}px`;

//         const direction = Math.random() < 0.5 ? -1 : 1;
//         div.style.setProperty('--direction', direction);

//         setTimeout(() => {
//             anime.removeChild(div);
//           }, 5000);
//     })
// );

const anime = document.querySelector('.animation-all');
const Btns = document.querySelectorAll(".cal-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const div = document.createElement("div");
        div.innerHTML = btn.textContent;
        div.classList.add('animation');

        const screenWidth = window.innerWidth;
        const startX = Math.random() * (screenWidth < 600 ? 100 : anime.offsetWidth - 10);
        div.style.left = `${startX}px`;

        anime.appendChild(div);

        setTimeout(() => {
            anime.removeChild(div);
        }, screenWidth < 600 ? 3000 : 5000);
    });
});

const MFon = document.querySelector(".Mfon");
const FBtn = document.getElementById("menu-fon");

FBtn.addEventListener("click", () => {
    let BColor = MFon.value;
    document.body.style.backgroundColor = BColor
});
const IBtn = document.getElementById("input-btn");
const Binput = document.getElementById("input-b");
const Cinput = document.getElementById("input-c");

IBtn.addEventListener("click", () => {
    let BColor = Binput.value;
    let CColor = Cinput.value;
    display.style.backgroundColor = BColor;
    display.style.color = CColor;
});

const Tinput = document.getElementById('cal-input-t')
const Ninput = document.getElementById('cal-input-n')
const COinput = document.getElementById('cal-input-c')
const CalBtn = document.getElementById('call-btn');

CalBtn.addEventListener('click', () => {
    let T = Tinput.value
    let N = Ninput.value
    let C = COinput.value
    const CalBox = document.querySelector('.cal-box');
    document.querySelectorAll('.cal-btn').forEach(CB => {
        CB.style.backgroundColor = N;
        CB.style.color = C;
    })

    CalBox.style.backgroundColor = T
});

const HinputB = document.getElementById('h-input-t')
const HinputN = document.getElementById('h-input-n')
const HinputC = document.getElementById('h-input-c')
const HBtn = document.getElementById('h-btn');

HBtn.addEventListener('click', () => {
    let T = HinputB.value;
    let N = HinputN.value;
    let C = HinputC.value;
    const CK = document.querySelector(".cal-k");
    CK.style.backgroundColor = T;
    document.querySelectorAll("#h-btns").forEach(HBtnss => {
        HBtnss.style.backgroundColor = N;
        HBtnss.style.color = C;
    })
});

const ML = document.querySelector('.menu-list');

// MX.addEventListener("click", () => {
//     ML.style.transform = 'TranslateX(500px)'
// })
Menu.addEventListener("click", () => {
    ML.classList.toggle('m-class')
});

function Delete() {
    display.value = display.value.slice(0, -1);
}
function Tenglama() {
    const tenglama = document.getElementById('yechish').value.trim();

    if (tenglama === "") {
        document.getElementById('yechish').value = "Iltimos, tenglamani kiriting!";
        return;
    }

    try {
        const parts = tenglama.split('=');
        if (parts.length === 2) {
            const leftSide = parts[0].trim();
            const rightSide = parts[1].trim();

            const result = math.solve(`${leftSide} = ${rightSide}`, 'x');
            document.getElementById('yechish').value = `x = ${result[0]}`;
        } else {
            document.getElementById('yechish').value = "Noto‘g‘ri tenglama!";
        }
    } catch (error) {
        document.getElementById('yechish').value = "Tenglama noto‘g‘ri formatda!";

    }
    console.log(tenglama); 
}
async function getExchangeRate() {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    return data.rates.UZS;
}
async function dollor() {
    const usdToUzsRate = await getExchangeRate();
    const amountInUsd = parseFloat(document.getElementById('yechish').value);
    const amountInUzs = amountInUsd * usdToUzsRate;
    document.getElementById('yechish').value = `USZ: ${amountInUzs.toFixed(0)}`;
}
function Qoldiq() {
    try {
        const natija = eval(display.value);
        display.value = natija;
    } catch (error) {
        display.value = "Xato!";
    }
}