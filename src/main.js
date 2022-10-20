import "./css/index.css"
import IMask from 'imask'

const ccBgColors01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path"); //Seleciona o elemento no documento html a ser tratado em javascript
const ccBgColors02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");


//funcionalidade para mudar as cores do cartão de acordo com o tipo da bandeira  

function setTypeCard(type){
  const colors = { // estrutura de dados que armazena valores de cores a ser usadad de acordo com o tipo da bendeira
    visa: ["#436D99","#2D57F2"],
    mastercard: ["#DF6F29","#C69347"],
    default: ["black","gray"]
  }

  ccBgColors01.setAttribute("fill" , colors[type][0]) //setando os atributos dos elementos selecionados no começo do codigo
  ccBgColors02.setAttribute("fill" , colors[type][1])

  ccLogo.setAttribute("src",`cc-${type}.svg` )

}

//Tornando a função global
globalThis.setTypecard = setTypeCard


//security code ou cvc do cartão

const securityCode = document.querySelector("#security-code")

const securityCodePattern = {
  mask: "0000",
}
//imask
const securityCodeMasked = IMask(securityCode, securityCodePattern);


//data de expiração

//validação de data do cartão com IMask 
const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: 'MM{/}YY',

  blocks: {
    MM:{
      mask: IMask.MaskedRange,
      from: 1, // validando para que sejam digitados os meses corretamente, de 01 a 12
      to: 12
    },
    YY:{
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2), // pegando o ano atual, convertendo para string e capturando os dois ultimos caractéres
      to: String(new Date().getFullYear() + 10).slice(2), //pegando 10 anos após o ano atual, e capturando os dois ultimos caracteres
    }
   
  }

}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

//validação da numeração do cartão com regex mais complexas
// procurar orientação na documentação do IMask js
const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex:/^4\d{0,15}/, //Regex
      cardtype: "visa",

    },
    {
      mask: "0000 0000 0000 0000",
      regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/, //construção de Regex
      cardtype: "mastercard"

    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"

    },
  ],
  dispatch: function(appended, dynamicMasked){
    const number = (dynamicMasked.value + appended).replace(/\D/g, '');

    const foundMask = dynamicMasked.compiledMasks.find((item) => number.match(item.regex)
    );

    console.log(foundMask)

    return foundMask

  }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

//adicionando funcionalidades de eventos da DOM

const addButton = document.querySelector('#add-card');

addButton.addEventListener("click", () => {
  alert('Cartão adicionado')
})
//Previnindo o reload da pagina ao clicar no botão
document.querySelector('form').addEventListener("submit", (event) =>{
  event.preventDefault();
})

//Mudando as informações no cartão conforme o valor digitado nos input

const cardHolder = document.querySelector('#card-holder')

cardHolder.addEventListener("input", () =>{ //"escutando" evento de input

  const ccHolder = document.querySelector('.cc-holder .value')

  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value ;

})

//Utilizando Eventos do IMask
securityCodeMasked.on("accept", () =>{
  updateSecurityCode(securityCodeMasked.value);
})


function updateSecurityCode(code){
  const ccSecurity = document.querySelector('.cc-security .value')

  ccSecurity.innerText = code.length === 0 ? "123" : code; 
};



cardNumberMasked.on("accept", () =>{
  const card = cardNumberMasked.masked.currentMask.cardtype;
  setTypeCard(card);
  updateCardNumber(cardNumberMasked.value);
})

function updateCardNumber(number){
  const ccNumber = document.querySelector('.cc-number')

  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}




expirationDateMasked.on("accept", ()=>{
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
  const ccExpiration = document.querySelector('.cc-extra .value');

  ccExpiration.innerText = date.length === 0 ? "02/32" : date;
}