const API_BASE_URL = 'https://api.openai.com/v1';
const API_KEY = '';
const GPT_MODEL = 'gpt-3.5-turbo';

//elementi della pagina

const loader = document.querySelector('.loader')
const genereButtons = document.querySelectorAll('.genere')
const placeholder = document.querySelector('#placeholder')
const stageTemplate = document.querySelector('#stage-template')
const gameoverTemplate = document.querySelector('#gameover-template')

// varabile per conservare la chat

const completChat = [];

// variabile per conservare genere selezionato

let selectedGenere;


// logica di gioco

// per ogni bottone dei generi
genereButtons.forEach(function(button){
    //al click
    button.addEventListener('click', function(){
        // 1 recuperiamo generi cliccato
        // 2 lo impostiamo come genere selezionato
        selectedGenere = button.dataset.genere;
        // 3 avviamo la partita
        startGame();
    });
})

// funzione avvio partita

function startGame() {
    // 1 inserisco classe game-started
    document.body.classList.add('game-started')
    // 2 preparo le istruzioni iniziali per chat gpt
    completChat.push({
        role: 'system', //come si deve comportare gpt 
        content: `Voglio che ti comporti come se fossi un classico gioco di avventura testuale. 
        Io sarò il protagonista e giocatore principale. Non fare riferimento a te stesso. 
        L\'ambientazione di questo gioco sarà a tema ${selectedGenere}. 
        Ogni ambientazione ha una descrizione di 150 caratteri seguita da una array di 3 azioni possibili che il giocatore può compiere. 
        Una di queste azioni è mortale e termina il gioco. Non aggiungere mai altre spiegazioni. Non fare riferimento a te stesso. 
        Le tue risposte sono solo in formato JSON come questo esempio: 
        ### {  "description":"descrizione ambientazione",  "actions":["azione 1", "azione 2", "azione 3"]}  ###`
    })
    // 3 avvio il primo livello
    setStage()
}

// funzione per generare ul livello
async function setStage(){
    // 0. svuoto il placeholder
    placeholder.innerHTML = ''
    // 1 mostrare il loader
    loader.classList.remove('hidden')
    // 2. chieder a gpt di inventare il livello
    const gptResponse = await makeRequest('/chat/completions', {
        temperature: 0.7, // grado di imprevedibilità
        model: GPT_MODEL,
        messages: completChat
    });
    // 3. nascondere il loader
    loader.classList.add('hidden')
    // 4. prendiamo il messaggio di gpt e lo inseriamo nello storico chat
    const message = gptResponse.choices[0].message;
    completChat.push(message);
    // 5. recupero il contenuto del messaggio per estrapolare le azioni e la descrizione del livello
    const content = JSON.parse(message.content);
    const actions = content.actions;
    const description = content.description;
    console.log(content);
    // 6. mostriamo la descrizione del livello
    setStageDescription(description);
    // 7. generiamo e mostriamo un'immagine per il livello
    await setStagePicture(description);
    // 8. mostriamo le azioni disponibili per questo livello
    setStageAction(actions);
}


// funzione per effetuare richieste a gpt

async function makeRequest(endpoint, payload){
    const url = API_BASE_URL + endpoint;

    const response = await fetch( url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + API_KEY
        }
    })

    const jsonResponse = await response.json();
    return jsonResponse;
}

// funzione per mostrare la descrizione del livello 

function setStageDescription(description) {
    // 1 clonare il template dello stage
    const stageElement = stageTemplate.content.cloneNode(true);

    // 2 inserire la descrizione
    stageElement.querySelector('.stage-description').innerText = description;

    // 3 mostriamo in pagina il template
    placeholder.appendChild(stageElement);
}

// funzione per generare e mostrare l'immagine del livello

async function setStagePicture(description){

}

// funzione per mostrare le azioni del livello

function setStageAction(actions){

}