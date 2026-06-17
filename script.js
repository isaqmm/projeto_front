// =================================================
// PALHOÇA HERO
// SCRIPT.JS - PARTE 1
// =================================================

// =================================================
// CONFIGURAÇÕES
// =================================================

let currentUser =
localStorage.getItem("currentUser");

let completedSpecialMissions = [];

const users =
JSON.parse(
localStorage.getItem("users")
) || [];

function registerUser(){

    const username =
    document.getElementById(
        "register-user"
    ).value;

    const password =
    document.getElementById(
        "register-pass"
    ).value;

    const confirmPassword =
    document.getElementById(
        "register-pass2"
    ).value;

    if(
        !username ||
        !password ||
        !confirmPassword
    ){

        alert(
            "Preencha tudo"
        );

        return;

    }

    if(
        password !==
        confirmPassword
    ){

        alert(
            "As senhas não coincidem"
        );

        return;

    }

    const exists =
    users.find(

        u =>
        u.username === username

    );

    if(exists){

        alert(
            "Nome já utilizado"
        );

        return;

    }

    users.push({

        username,
        password

    });

    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );

    alert(
        "Conta criada com sucesso!"
    );

    document.getElementById(
        "register-form"
    ).style.display =
    "none";

    document.getElementById(
        "login-form"
    ).style.display =
    "block";

    if(password !== confirmPassword){

    alert(
        "Senha incorreta! As senhas não coincidem."
    );

    return;

}

}




function logoutUser(){

    localStorage.removeItem(
        "currentUser"
    );

    location.reload();

}

function resolveReport(id){

    const report = reports.find(

        r => r.id === id

    );

    if(!report){

        return;

    }

    if(
        report.creator ===
        currentUser
    ){

        alert(
            "Você não pode resolver sua própria ocorrência."
        );

        return;

    }

    const afterImage = prompt(

        "Cole a URL da foto da resolução (temporário)."

    );

    if(!afterImage){

        return;

    }

    report.afterImage =
    afterImage;

    report.status =
    "Em análise";

    report.resolvedBy =
    currentUser;

    report.lastUser = currentUser;

    report.awaitingApproval = true;

    localStorage.setItem(

        "reports",

        JSON.stringify(
            reports
        )

    );

    showNotification(
        "🟡 Ocorrência enviada para análise"
    );

    drawAllReports();

}
function checkPendingApprovals(){

    const pendingReports =

    reports.filter(

        report =>

        report.creator === currentUser &&

        report.status === "Em análise"

    );

    if(

        pendingReports.length > 0

    ){

        showNotification(

            `🔔 ${pendingReports.length} ocorrência(s) aguardando aprovação`

        );

    }

}

const APP = {

    VERSION: "1.0",

    XP_PER_REPORT: 50,

    MAX_XP_BAR: 5000

};

// =================================================
// ELEMENTOS
// =================================================

const notification =
    document.getElementById(
        "notification"
    );

const xpProgress =
    document.getElementById(
        "xp-progress"
    );

const xpText =
    document.getElementById(
        "xp-text"
    );

const playerRank =
    document.getElementById(
        "player-rank"
    );

const totalXP =
    document.getElementById(
        "total-xp"
    );

const totalReports =
    document.getElementById(
        "total-reports"
    );

const totalAchievements =
    document.getElementById(
        "total-achievements"
    );

const achievementFeed =
    document.getElementById(
        "achievement-feed"
    );

const activityFeed =
    document.getElementById(
        "activity-feed"
    );

// =================================================
// DADOS SALVOS
// =================================================

let playerXP =
    Number(
        localStorage.getItem(
            "playerXP"
        )
    ) || 0;

let reports =
    JSON.parse(
        localStorage.getItem(
            "reports"
        )
    ) || [];

let achievements =
    JSON.parse(
        localStorage.getItem(
            "achievements"
        )
    ) || [];

let missions =
    JSON.parse(
        localStorage.getItem(
            "missions"
        )
    ) || {

        lixo:0,

        buraco:0,

        arvore:0,

        alagamento:0,

        animal:0,

        iluminacao:0

    };

// =================================================
// PATENTES
// =================================================

const ranks = [

    {
        name:"Civil",
        xp:0
    },

    {
        name:"Recruta",
        xp:100
    },

    {
        name:"Cabo",
        xp:300
    },

    {
        name:"Sargento",
        xp:600
    },

    {
        name:"Tenente",
        xp:1000
    },

    {
        name:"Capitão",
        xp:2000
    },

    {
        name:"Coronel",
        xp:5000
    }

];

// =================================================
// LOADING
// =================================================

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            document.getElementById(
                "loading-screen"
            ).style.display =
                "none";

        }, 1500);

    }
);

// =================================================
// NOTIFICAÇÕES
// =================================================

function showNotification(
    message
){

    notification.textContent =
        message;

    notification.classList.add(
        "show"
    );

    setTimeout(() => {

        notification.classList.remove(
            "show"
        );

    }, 3000);

}

// =================================================
// XP
// =================================================

function updateXP(){

    const percentage =

        (playerXP /
        APP.MAX_XP_BAR)

        * 100;

    xpProgress.style.width =
        percentage + "%";

    xpText.textContent =
        `${playerXP} XP`;

    totalXP.textContent =
        playerXP;

    updateRank();

}

// =================================================
// PATENTE
// =================================================

function updateRank(){

    let currentRank =
        "Civil";

    for(
        let rank
        of ranks
    ){

        if(
            playerXP >= rank.xp
        ){

            currentRank =
                rank.name;

        }

    }

    playerRank.textContent =
        currentRank;

}

// =================================================
// ADICIONAR XP
// =================================================

function addXP(amount){

    playerXP += amount;

    localStorage.setItem(

        "playerXP",

        playerXP

    );

    updateXP();

    showNotification(
        `+${amount} XP`
    );

}

// =================================================
// CONQUISTAS
// =================================================

function unlockAchievement(
    achievementName
){

    const validAchievements = [

    "Login Bem-Sucedido",

    "Primeira Denúncia",

    "Primeiro Problema Resolvido",

    "Fiscal da Cidade"

];

if(

    !validAchievements.includes(
        achievementName
    )

){

    return;

}

    if(

        achievements.includes(
            achievementName
        )

    ){

        return;

    }

    achievements.push(
        achievementName
    );

    localStorage.setItem(

        "achievements",

        JSON.stringify(
            achievements
        )

    );

    totalAchievements.textContent =

        achievements.length;

    achievementFeed.innerHTML =

        achievementName;

    showNotification(
        `🏆 ${achievementName}`
    );

}

// =================================================
// MISSÕES
// =================================================

function checkMissions(type){

    if(

        missions[type]
        !== undefined

    ){

        missions[type]++;

    }

    localStorage.setItem(

        "missions",

        JSON.stringify(
            missions
        )

    );

    // Primeira denúncia

    if(
        reports.length === 1
    ){

        unlockAchievement(
            "Primeira Denúncia"
        );

        addXP(100);

    }

}
// =================================================
// SCRIPT.JS - PARTE 2
// MAPA + OCORRÊNCIAS
// =================================================

// =================================================
// MAPA DE PALHOÇA
// =================================================

const map = L.map("map").setView(

    [-27.6455, -48.6697],

    13

);

L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

        attribution:

        "&copy; OpenStreetMap"

    }

).addTo(map);

// =================================================
// MARCADOR CENTRO
// =================================================

L.marker(

    [-27.6455, -48.6697]

)

.addTo(map)

.bindPopup(

    "<b>Palhoça Hero</b><br>Centro de Palhoça"

);

// =================================================
// CORES DOS MARCADORES
// =================================================

function getMarkerColor(type){

    switch(type){

        case "lixo":

            return "green";

        case "buraco":

            return "black";

        case "arvore":

            return "darkgreen";

        case "alagamento":

            return "blue";

        case "animal":

            return "orange";

        case "iluminacao":

            return "yellow";

        default:

            return "red";

    }

}

// =================================================
// CRIAR ÍCONE
// =================================================

function createCustomIcon(type){

    const color =

        getMarkerColor(type);

    return L.divIcon({

        html: `

            <div style="

                width:20px;

                height:20px;

                border-radius:50%;

                background:${color};

                border:3px solid white;

                box-shadow:0 0 10px rgba(0,0,0,.5);

            "></div>

        `,

        className:""

    });

}

// =================================================
// DESENHAR OCORRÊNCIA
// =================================================

function  drawReport (report){

    const marker =

        L.marker(

            [

                report.lat,

                report.lng

            ],

            {

                icon:

                createCustomIcon(

                    report.type

                )

            }

        )

        .addTo(map);

    marker.bindPopup(`

        <b>Tipo:</b>

        ${report.type}

        <br><br>

        <b>Descrição:</b>

        ${report.description}

        <br><br>

        ${
            report.image

            ?

            `<img
            src="${report.image}"
            style="
            width:100%;
            max-width:350px;
            border-radius:12px;
            "
            onclick="openImage(this.src)"
            >`

            
            

            :

            ""

        }

        ${
            report.afterImage

            ?

            `

            <br><br>

            <b>Foto da resolução:</b>

            <br><br>

            <img
            src="${report.afterImage}"
            style="
            width:100%;
            max-width:350px;
            border-radius:12px;
            "
            onclick="openImage(this.src)"
            >

            `

            :

            ""

        }

        <br><br>

        <b>Status:</b>

        ${report.status}

        <br><br>

        ${
            report.status ===
            "Pendente"

            ?

            `<button

            onclick="resolveReport(${report.id})"

            style="

                background:#00d26a;

                color:white;

                border:none;

                padding:10px;

                border-radius:8px;

                cursor:pointer;

                width:100%;

                font-weight:bold;

            "

            >

            ✔ Resolver

            </button>`

            :

            ""

        }

        ${
report.status === "Em análise"

&&

report.lastUser !== currentUser

?

`<button

onclick="approveReport(${report.id})"

style="

background:#ffc107;
color:black;
border:none;
padding:10px;
border-radius:8px;
cursor:pointer;
width:100%;
font-weight:bold;
margin-top:10px;

">

✔ Aprovar Resolução

</button>`

:

""
}

        ${
            report.status ===
            "Resolvido"

            ?

            `<div style="

                color:#00d26a;

                font-weight:bold;

            ">

            ✔ Resolvido por

            ${report.resolvedBy || "N/A"}

            </div>`

            :

            ""

        }

    `);

}

function approveReport(id){

    const report = reports.find(
        r => r.id === id
    );

    if(!report){
        return;
    }

    report.status =
    "Resolvido";

    report.awaitingApproval =
    false;

    report.approvedBy =
    currentUser;

    report.ownerNotification =
    true;

    unlockAchievement(
        "Primeiro Problema Resolvido"
    );

    unlockAchievement(
        "Fiscal da Cidade"
    );

    addXP(300);

    localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    );

    showNotification(
        "🟢 Ocorrência aprovada"
    );

    drawAllReports();

}
// =================================================
// CARREGAR OCORRÊNCIAS
// =================================================

function loadReports(){

    reports.forEach(report => {

        drawReport(report);

    });

}

// =================================================
// ESTATÍSTICAS
// =================================================

function updateStats(){

    totalReports.textContent =
        reports.length;

    totalAchievements.textContent =
        achievements.length;

    const resolvedReports =

        reports.filter(

            report =>

            report.status ===
            "Resolvido"

        ).length;

    const resolvedElement =

        document.getElementById(
            "total-resolved"
        );

    if(resolvedElement){

        resolvedElement.textContent =
            resolvedReports;

    }

    const xpElement =

        document.getElementById(
            "total-xp"
        );

    if(xpElement){

        xpElement.textContent =
            playerXP;

    }

}

// =================================================
// FEED
// =================================================

function addActivity(message){

    activityFeed.innerHTML =

        message;

}

// =================================================
// CARREGAMENTO INICIAL
// =================================================

loadReports();

updateStats();

updateXP();

// =================================================
// SCRIPT.JS - PARTE 3
// MODAL + DENÚNCIAS + UPLOAD
// =================================================

// =================================================
// ELEMENTOS DO MODAL
// =================================================

const reportModal =
    document.getElementById(
        "report-modal"
    );

const reportForm =
    document.getElementById(
        "report-form"
    );

const reportImage =
    document.getElementById(
        "report-image"
    );

const imagePreview =
    document.getElementById(
        "image-preview"
    );

// =================================================
// COORDENADAS CLICADAS
// =================================================

let clickedLat = null;

let clickedLng = null;

// =================================================
// ABRIR MODAL AO CLICAR NO MAPA
// =================================================

map.on("click", e => {

    clickedLat =
        e.latlng.lat;

    clickedLng =
        e.latlng.lng;

    reportModal.style.display =
        "flex";

});

// =================================================
// FECHAR MODAL
// =================================================

window.addEventListener(
    "click",
    e => {

        if(
            e.target ===
            reportModal
        ){

            reportModal.style.display =
                "none";

        }

    }
);

// =================================================
// PREVIEW DA IMAGEM
// =================================================

reportImage.addEventListener(
    "change",
    e => {

        const file =
            e.target.files[0];

        if(!file){

            return;

        }

        const reader =
            new FileReader();

        reader.onload =
            event => {

            imagePreview.src =

                event.target.result;

            imagePreview.style.display =

                "block";

        };

        reader.readAsDataURL(
            file
        );

    }
);

// =================================================
// REGISTRAR OCORRÊNCIA
// =================================================

reportForm.addEventListener(

    "submit",

    e => {

        e.preventDefault();

        const type =

            document.getElementById(
                "report-type"
            ).value;

        const description =

            document.getElementById(
                "report-description"
            ).value;

        const report = {

            id: Date.now(),

            creator: currentUser,

            type,

            description,

            image:
            imagePreview.src || "",

            lat: clickedLat,

            lng: clickedLng,

            date:

            new Date()
            .toLocaleString(
                "pt-BR"
            ),

            status:"Pendente",

        };

        reports.push(
            report
        );

        localStorage.setItem(

            "reports",

            JSON.stringify(
                reports
            )

        );

        drawReport(
            report
        );

        addXP(
            APP.XP_PER_REPORT
        );

        checkMissions(
            type
        );

        updateStats();

        addActivity(

            `Nova ocorrência registrada: ${type}`

        );

        reportModal.style.display =

            "none";

        reportForm.reset();

        imagePreview.style.display =

            "none";

    }

);

// =================================================
// ATUALIZAÇÃO INICIAL
// =================================================

updateXP();

updateStats();

if(

    achievements.length > 0

){

    achievementFeed.innerHTML =

        achievements[
            achievements.length - 1
        ];

}

// =================================================
// MENSAGEM DE BOAS-VINDAS
// =================================================

setTimeout(() => {

    showNotification(

        "Bem-vindo ao Palhoça Hero"

    );

}, 2000);

// =================================================
// FIM DO SCRIPT
// =================================================

// =================================================
// SCRIPT.JS - PARTE 4
// TUTORIAL + LOCALIZAÇÃO + TEMA
// =================================================

// =================================================
// CRIAR HTML DO TUTORIAL
// =================================================

const tutorialHTML = `

<div id="tutorial-overlay">

    <div class="tutorial-box">

        <div class="tutorial-header">

            <i class="fa-solid fa-user-shield"></i>

            <span>
                Comandante Silva
            </span>

        </div>

        <div class="tutorial-body">

            <h2 id="tutorial-title">

                Bem-vindo Agente

            </h2>

            <p id="tutorial-text">

                Sua missão é ajudar a cidade.

            </p>

        </div>

        <div class="tutorial-footer">

            <button
                id="tutorial-next"
                class="tutorial-btn">

                Próximo

            </button>

        </div>

    </div>

</div>

`;

document.body.insertAdjacentHTML(
    "beforeend",
    tutorialHTML
);

// =================================================
// PASSOS DO TUTORIAL
// =================================================

const tutorialSteps = [

    {

        title:
        "Bem-vindo ao Palhoça Hero",

        text:
        "Você foi recrutado para ajudar a cidade reportando problemas urbanos."

    },

    {

        title:
        "Como denunciar",

        text:
        "Clique em qualquer ponto do mapa para registrar uma ocorrência."

    },

    {

        title:
        "Ganhe XP",

        text:
        "Cada denúncia gera experiência e aumenta sua patente."

    },

    {

        title:
        "Missões",

        text:
        "Complete missões para ganhar recompensas extras."

    },

    {

        title:
        "Boa sorte Agente",

        text:
        "A cidade conta com você."

    }

];

let tutorialIndex = 0;

const tutorialOverlay =
    document.getElementById(
        "tutorial-overlay"
    );

const tutorialTitle =
    document.getElementById(
        "tutorial-title"
    );

const tutorialText =
    document.getElementById(
        "tutorial-text"
    );

const tutorialNext =
    document.getElementById(
        "tutorial-next"
    );

// =================================================
// MOSTRAR TUTORIAL
// =================================================

function showTutorialStep(){

    tutorialTitle.textContent =

        tutorialSteps[
            tutorialIndex
        ].title;

    tutorialText.textContent =

        tutorialSteps[
            tutorialIndex
        ].text;

}

if(

    !localStorage.getItem(
        "tutorialCompleted"
    )

){

    tutorialOverlay.style.display =
        "flex";

    showTutorialStep();

}

tutorialNext.addEventListener(
    "click",
    () => {

        tutorialIndex++;

        if(

            tutorialIndex >=
            tutorialSteps.length

        ){

            tutorialOverlay.style.display =
                "none";

            localStorage.setItem(

                "tutorialCompleted",

                "true"

            );

            return;

        }

        showTutorialStep();

    }
);

// =================================================
// LOCALIZAÇÃO DO USUÁRIO
// =================================================

if(

    navigator.geolocation

){

    navigator.geolocation.getCurrentPosition(

        position => {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;

            const userIcon =
                L.divIcon({

                html: `
                    <div
                    class="user-location-marker">
                    </div>
                `,

                className:""

            });

            L.marker(

                [lat,lng],

                {
                    icon:userIcon
                }

            )

            .addTo(map)

            .bindPopup(

                "📍 Você está aqui"

            );

        },

        error => {

            console.log(

                "Localização não permitida"

            );

        }

    );

}

// =================================================
// BOTÃO DE TEMA
// =================================================

const themeButton =

`

<button
id="theme-toggle"
class="theme-toggle">

    <i class="fa-solid fa-moon"></i>

</button>

`;

document.body.insertAdjacentHTML(

    "beforeend",

    themeButton

);

const themeToggle =

document.getElementById(
    "theme-toggle"
);

// =================================================
// TEMA SALVO
// =================================================

const savedTheme =

localStorage.getItem(
    "theme"
);

if(

    savedTheme ===
    "cyberpunk"

){

    document.body.classList.add(
        "cyberpunk"
    );

}

// =================================================
// TROCAR TEMA
// =================================================

themeToggle.addEventListener(

    "click",

    () => {

        document.body.classList.toggle(
            "cyberpunk"
        );

        if(

            document.body.classList.contains(
                "cyberpunk"
            )

        ){

            localStorage.setItem(

                "theme",

                "cyberpunk"

            );

            showNotification(
                "Modo Cyberpunk"
            );

        }

        else{

            localStorage.setItem(

                "theme",

                "default"

            );

            showNotification(
                "Modo Padrão"
            );

        }

    }

);

// =================================================
// FIM PARTE 4
// =================================================
// =================================================
// SCRIPT.JS - PARTE 5
// MISSÕES ESPECIAIS
// =================================================





// =================================================
// SCRIPT.JS - PARTE 7
// RANKING
// =================================================

const panelHTML = `

<div id="game-panel">

    <span
    id="close-panel"
    class="panel-close">

        ✖

    </span>

    <div id="panel-content">

    </div>

</div>

`;

document.body.insertAdjacentHTML(

    "beforeend",

    panelHTML

);

const gamePanel =

document.getElementById(
    "game-panel"
);

const panelContent =

document.getElementById(
    "panel-content"
);

// =================================================
// RANKING
// =================================================

function openRanking(){

    const playerName =

        localStorage.getItem(
            "currentUser"
        ) || "Você";

    const ranking = [

    {
        nome:"Isaque",
        xp:4850
    },

    {
        nome:"Agente Teste",
        xp:3200
    },


    {
        nome: playerName,
        xp: playerXP
    }



];

    ranking.sort(

        (a,b)=>

        b.xp-a.xp

    );

    let html =

    `<h2>🏆 Ranking</h2>`;

    ranking.forEach(

        (player,index)=>{

        html += `

        <div class="ranking-row">

            <span>

                ${index+1}º

                ${player.nome}

            </span>

            <span>

                ${player.xp} XP

            </span>

        </div>

        `;

    });

    panelContent.innerHTML =
        html;

    gamePanel.style.display =
        "block";

}

// =================================================
// BOTÃO RANKING
// =================================================

const rankingButton =

document.querySelectorAll(
    ".menu-btn"
)[3];

rankingButton.addEventListener(

    "click",

    openRanking

);

// =================================================
// FECHAR
// =================================================

document
.getElementById(
    "close-panel"
)
.addEventListener(

    "click",

    ()=>{

        gamePanel.style.display =
            "none";

    }

);

// =================================================
// SCRIPT.JS - PARTE 8
// DASHBOARD
// =================================================

function openDashboard(){

    const playerName =

        localStorage.getItem(
            "currentUser"
        ) || "Agente";

    const currentRank =

        playerRank.textContent;

    const reportsCount =

        reports.length;

    const achievementsCount =

        achievements.length;

    const specialCount =

        completedSpecialMissions
        ? completedSpecialMissions.length
        : 0;

    panelContent.innerHTML = `

        <h2>

             👤 Perfil do Agente

        </h2>

        <div class="ranking-row">

            <span>
                Agente
            </span>

            <span>
                ${playerName}
            </span>

        </div>

        <div class="ranking-row">

            <span>
                Patente
            </span>

            <span>
                ${currentRank}
            </span>

        </div>

        <div class="ranking-row">

            <span>
                XP
            </span>

            <span>
                ${playerXP}
            </span>

        </div>

        <div class="ranking-row">

            <span>
                Denúncias
            </span>

            <span>
                ${reportsCount}
            </span>

        </div>

        <div class="ranking-row">

            <span>
                Conquistas
            </span>

            <span>
                ${achievementsCount}
            </span>

        </div>

        <div class="ranking-row">

            <span>
                Missões Especiais
            </span>

            <span>
                ${specialCount}
            </span>

        </div>

    `;

    gamePanel.style.display =
        "block";

}

// =================================================
// BOTÃO DASHBOARD
// =================================================

const dashboardButton =

document.querySelectorAll(
    ".menu-btn"
)[0];

dashboardButton.addEventListener(

    "click",

    openDashboard

);


// =================================================
// SCRIPT.JS - PARTE 9
// CONQUISTAS
// =================================================

function openAchievements(){

    let html = `

        <h2>

            🏆 Conquistas

        </h2>

    `;

    if(

        achievements.length === 0

    ){

        html += `

        <div class="ranking-row">

            <span>

                Nenhuma conquista desbloqueada.

            </span>

        </div>

        `;

    }

    achievements.forEach(

        achievement => {

            html += `

            <div class="ranking-row">

                <span>

                    🏆 ${achievement}

                </span>

            </div>

            `;

        }

    );

    panelContent.innerHTML =

        html;

    gamePanel.style.display =

        "block";

}

// =================================================
// BOTÃO CONQUISTAS
// =================================================

const achievementsButton =

document.querySelectorAll(
    ".menu-btn"
)[2];

achievementsButton.addEventListener(

    "click",

    openAchievements

);

// =================================================
// SCRIPT.JS - PARTE 10
// MISSÕES
// =================================================

function openMissions(){

    const lixoAtual =

        missions.lixo < 0
        ? 3
        : missions.lixo;

    const buracoAtual =

        missions.buraco < 0
        ? 5
        : missions.buraco;

    const arvoreAtual =

        missions.arvore < 0
        ? 3
        : missions.arvore;

    panelContent.innerHTML = `

        <h2>

            🎯 Missões

        </h2>

        <div class="ranking-row">

            <span>

                Operação Cidade Limpa

            </span>

            <span>

                ${lixoAtual}/3

            </span>

        </div>

        <div class="ranking-row">

            <span>

                Caçador de Buracos

            </span>

            <span>

                ${buracoAtual}/5

            </span>

        </div>

        <div class="ranking-row">

            <span>

                Arvores caídas

            </span>

            <span>

                ${arvoreAtual}/3

            </span>

        </div>

    `;

    gamePanel.style.display =
        "block";

}

// =================================================
// BOTÃO MISSÕES
// =================================================

const missionsButton =

document.querySelectorAll(
    ".menu-btn"
)[1];

missionsButton.addEventListener(

    "click",

    openMissions

);

// =================================================
// SCRIPT.JS - PARTE 11
// OCORRÊNCIAS
// =================================================

function openReports(){

    let html = `

        <h2>

            📋 Ocorrências

        </h2>

    `;

    if(reports.length === 0){

        html += `

        <div class="ranking-row">

            <span>

                Nenhuma ocorrência registrada.

            </span>

        </div>

        `;

    }

    reports
    .slice()
    .reverse()
    .forEach(report => {

        html += `

        <div class="ranking-row">

            <div>

                ${getReportIcon(
                    report.type
                )}

                <b>
                    ${report.type}
                </b>

                <br>

                ${getStatusIcon(
                    report.status
                )}

                ${report.status}

                <br><br>

                ${report.description || ""}

                <br><br>

                ${
                    report.image

                    ?

                    `<img
                    src="${report.image}"
                    style="
                    width:120px;
                    border-radius:10px;
                    margin-top:5px;
                    ">`

                    :

                    ""

                }

                <br><br>

                ${
                    report.status !==
                    "Resolvido"

                    ?

                    `<button
                    onclick="resolveReport(${report.id})">

                    ✔ Resolver

                    </button>`

                    :

                    `<span>

                    ✔ Resolvido por
                    ${report.resolvedBy || "N/A"}

                    <br>

                    📅
                    ${report.resolvedDate || ""}

                    </span>`

                }

            </div>

        </div>

        `;

    });

    panelContent.innerHTML =
    html;

    gamePanel.style.display =
    "block";

}

// =================================================
// ÍCONES
// =================================================

function getReportIcon(type){

    switch(type){

        case "lixo":
            return "🗑️";

        case "buraco":
            return "🕳️";

        case "arvore":
            return "🌳";

        case "alagamento":
            return "🌊";

        case "animal":
            return "🐶";

        case "iluminacao":
            return "💡";

        default:
            return "📍";

    }

}

// =================================================
// BOTÃO OCORRÊNCIAS
// =================================================

const reportsButton =

document.querySelectorAll(
    ".menu-btn"
)[4];

reportsButton.addEventListener(

    "click",

    openReports

);

// =================================================
// V3 PARTE 1
// HERO SCREEN
// =================================================

const heroHTML = `

<div id="hero-screen">

    <div class="hero-box">

        <div class="hero-logo">

            🛡️

        </div>

        <div class="hero-title">

            PALHOÇA HERO

        </div>

        <div class="hero-subtitle">

            Transformando cidadãos
            em heróis urbanos

        </div>

        <button
        id="start-hero"

        class="hero-button">

            🚀 INICIAR MISSÃO

        </button>

    </div>

</div>

`;

document.body.insertAdjacentHTML(

    "beforeend",

    heroHTML

);

// =================================================
// ENTRAR
// =================================================

document
.getElementById(
    "start-hero"
)
.addEventListener(

    "click",

    () => {

        document
        .getElementById(
            "hero-screen"
        )
        .remove();

    }

);

// =================================================
// V3.4
// STATUS DAS OCORRÊNCIAS
// =================================================

function getStatusIcon(status){

    switch(status){

        case "Pendente":

            return "🔴";

        case "Em Análise":

            return "🟡";

        case "Resolvido":

            return "🟢";

        default:

            return "⚪";

    }

}

// =================================================
// CORRIGIR OCORRÊNCIAS ANTIGAS
// =================================================

reports.forEach(report => {

    if(!report.status){

        report.status =

            "Pendente";

    }

});

localStorage.setItem(

    "reports",

    JSON.stringify(
        reports
    )

);

// =================================================
// V4.1
// BOTÃO GPS + ATUALIZAR LOCALIZAÇÃO
// =================================================

const gpsButton = `

<button
id="gps-button"
class="gps-button">

📍

</button>

`;

document.body.insertAdjacentHTML(
    "beforeend",
    gpsButton
);

// =================================================
// LOCALIZAÇÃO ATUAL
// =================================================

let userMarker = null;

function updateUserLocation(){

    console.log("1 - ENTROU");

    console.log(navigator.geolocation);

    if(!navigator.geolocation){

        console.log("2 - SEM GPS");

        return;

    }

    console.log("3 - GPS EXISTE");

    navigator.geolocation.getCurrentPosition(

        position => {

            console.log("4 - GPS OK");

            console.log(position);

        },

        error => {

            console.log("5 - GPS ERRO");

            console.log(error);

        }

    );

}

// =================================================
// PRIMEIRA LOCALIZAÇÃO
// =================================================

setTimeout(() => {

    updateUserLocation();

}, 2000);

// =================================================
// BOTÃO GPS
// =================================================

document
.getElementById(
    "gps-button"
)
.addEventListener(

    "click",

    irParaMinhaLocalizacao

);
console.log("SCRIPT CARREGOU");

document
.getElementById("gps-button")
.addEventListener("click", () => {

    console.log("BOTAO GPS CLICADO");

});

navigator.geolocation.getCurrentPosition(

    (position) => {

        console.log(
            "LAT:",
            position.coords.latitude
        );

        console.log(
            "LNG:",
            position.coords.longitude
        );

        alert(
            position.coords.latitude +
            "\n" +
            position.coords.longitude
        );

    },

    (error) => {

        return;

    }

);

// =====================================
// V4.2 TESTE GPS DEFINITIVO
// =====================================

document
.getElementById("gps-button")
.addEventListener(

    "dblclick",

    () => {

        navigator.geolocation.getCurrentPosition(

            (position) => {

                alert(

                    "LAT: " +

                    position.coords.latitude +

                    "\nLNG: " +

                    position.coords.longitude

                );

            },

            (error) => {

                alert(

                    "ERRO GPS: " +

                    error.message

                );

            }

        );

    }

);


// =====================================
// V4.3 GPS DEFINITIVO
// =====================================

if(window.gpsInterval){

    clearInterval(window.gpsInterval);

}

window.gpsInterval = setInterval(() => {

    if(!navigator.geolocation){

        return;

    }

},1000);

let gpsMarker = null;

function gpsDefinitivo(){

    navigator.geolocation.getCurrentPosition(

        (position)=>{

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;

            console.log(
                "LOCALIZAÇÃO:",
                lat,
                lng
            );

            map.setView(
                [lat,lng],
                18
            );

            if(gpsMarker){

                map.removeLayer(
                    gpsMarker
                );

            }

            gpsMarker = L.marker(
                [lat,lng]
            )
            .addTo(map)
            .bindPopup(
                "📍 SUA LOCALIZAÇÃO ATUAL"
            )
            .openPopup();

            showNotification(
                "GPS atualizado"
            );

        },

        (error)=>{

            console.log(error);

            

        },

        {

            enableHighAccuracy:true,

            timeout:15000,

            maximumAge:0

        }

    );

}

document
.getElementById("gps-button")
.onclick = gpsDefinitivo;


// =====================================
// V4.4 - LOCALIZAÇÃO DEMO FMP
// =====================================

let demoLocationMarker = null;

function irParaMinhaLocalizacao(){

    showNotification(
        "Obtendo localização..."
    );

    setTimeout(() => {

        const fmpLat = -27.637538;
        const fmpLng = -48.651982;

        map.flyTo(
            [fmpLat, fmpLng],
            18,
            {
                duration:2
            }
        );

        if(demoLocationMarker){

            map.removeLayer(
                demoLocationMarker
            );

        }

        const localIcon = L.divIcon({

            html:`

            <div
            class="demo-location-marker">

            </div>

            `,

            className:""

        });

        demoLocationMarker =

        L.marker(

            [fmpLat,fmpLng],

            {
                icon:localIcon
            }

        )

        .addTo(map)

        .bindPopup(`

        📍 LOCALIZAÇÃO ENCONTRADA

        <br><br>

        FMP - Ponte do Imaruim

        <br>

        Precisão: 12 metros

        `)

        .openPopup();

        

    },1000);

}






// =====================================
// V5.2.1
// LOGIN + HERO SCREEN
// =====================================

const startButton =
document.getElementById(
    "start-hero"
);

if(startButton){

    startButton.onclick = () => {

        openLoginScreen();

    };

}

/* =====================================
V5.2 LOGIN VISUAL
===================================== */

document.addEventListener("DOMContentLoaded",()=>{

    const startButton =
    document.querySelector(".hero-button");

    if(!startButton) return;

    startButton.onclick = ()=>{

        openLoginScreen();

    };

});

function openLoginScreen(){

    if(
        document.getElementById(
            "login-screen"
        )
    ) return;

    document.body.insertAdjacentHTML(

        "beforeend",

        `

        <div id="login-screen">

            <div class="login-box">

                <h2>PALHOÇA HERO</h2>

                <div id="login-home">

                    <button id="show-login">

                        🔐 LOGIN

                    </button>

                    <button id="show-register">

                        📝 CRIAR CONTA

                    </button>

                </div>

                <div
                id="login-form"
                style="display:none;">

                    <input
                    id="login-user"
                    placeholder="Usuário">

                    <input
                    id="login-pass"
                    type="password"
                    placeholder="Senha">

                    <button id="login-btn">

                        ENTRAR

                    </button>

                </div>

                <div
                id="register-form"
                style="display:none;">

                    <input
                    id="register-user"
                    placeholder="Usuário">

                    <input
                    id="register-pass"
                    type="password"
                    placeholder="Senha">

                    <input
                    id="register-pass2"
                    type="password"
                    placeholder="Confirmar Senha">

                    <button id="create-btn">

                        CRIAR CONTA

                    </button>

                </div>

            </div>

        </div>

        `
    );

    document.getElementById(
        "show-login"
    ).onclick = ()=>{

        document.getElementById(
            "login-home"
        ).style.display = "none";

        document.getElementById(
            "login-form"
        ).style.display = "block";

    };

    document.getElementById(
        "show-register"
    ).onclick = ()=>{

        document.getElementById(
            "login-home"
        ).style.display = "none";

        document.getElementById(
            "register-form"
        ).style.display = "block";

    };

    document.getElementById(
        "login-btn"
    ).onclick = loginUser;

    document.getElementById(
        "create-btn"
    ).onclick = registerUser;

}

/* =====================================
PERFIL
===================================== */

function openProfile(){

    alert(

        "Usuário: " +

        currentUser +

        "\n\nXP: " +

        playerXP +

        "\n\nPatente: " +

        playerRank.textContent

    );

}

setTimeout(()=>{

    const btn =
    document.getElementById(
        "profile-btn"
    );

    if(btn){

        btn.onclick =
        openProfile;

    }

},2000);

function loginUser(){

    const username =
    document.getElementById(
        "login-user"
    ).value;

    const password =
    document.getElementById(
        "login-pass"
    ).value;

    const user = users.find(

        u =>

        u.username === username &&

        u.password === password

    );

    if(!user){

        alert(
            "Usuário ou senha inválidos"
        );

        return;

    }

    currentUser =
    user.username;

    localStorage.setItem(

        "currentUser",

        currentUser

    );

    document.getElementById(
        "player-name"
    ).textContent =

    "Agente " +

    currentUser;

    document.getElementById(
        "login-screen"
    ).remove();

    document.getElementById(
        "hero-screen"
    ).remove();

    alert(
        "Login realizado!"
    );

    unlockAchievement(
    "Login Bem-Sucedido"
    );

    setTimeout(()=>{

        checkPendingApprovals();

    },1000);

    checkUserNotifications();

    drawAllReports();

    

}

function drawAllReports(){

    map.eachLayer(layer => {

        if(
            layer instanceof L.Marker
        ){

            map.removeLayer(layer);

        }

    });

    reports.forEach(report => {

        drawReport(report);

    });

}

function checkUserNotifications(){

    reports.forEach(report => {

        if(

            report.resolvedBy ===
            currentUser

            &&

            report.ownerNotification

        ){

            showNotification(
    "🏆 PARABÉNS! Sua resolução foi aprovada! +500 XP"
);

            report.ownerNotification = "";

        }

    });

    localStorage.setItem(

        "reports",

        JSON.stringify(
            reports
        )

    );

}

setTimeout(()=>{

    const rankBox =

    document.querySelector(
        ".rank-box"
    );

    if(!rankBox) return;

    rankBox.style.cursor =
    "pointer";

    rankBox.onclick = ()=>{

    const oldMenu =
    document.getElementById(
        "user-menu"
    );

    if(oldMenu){

        oldMenu.remove();

        return;

    }

    rankBox.insertAdjacentHTML(

        "beforeend",

        `

        <div id="user-menu">

            <button
            id="profile-menu-btn">

            👤 Perfil

            </button>

            <button
            id="logout-menu-btn">

            🚪 Sair da Conta

            </button>

        </div>

        `

    );

    document
    .getElementById(
        "profile-menu-btn"
    )
    .onclick =
    openProfile;

    document
    .getElementById(
        "logout-menu-btn"
    )
    .onclick =
    logoutUser;

};

},1000);

function openImage(src){

    const modal = document.createElement("div");

    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.9)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "99999";

    modal.innerHTML = `
        <img
        src="${src}"
        style="
        max-width:95%;
        max-height:95%;
        border-radius:20px;
        ">
    `;

    modal.onclick = () => {

        modal.remove();

    };

    document.body.appendChild(
        modal
    );

}