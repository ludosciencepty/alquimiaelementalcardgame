const config = {
    type: Phaser.AUTO,
    width: 1280, height: 720,
    parent: 'game-container',
    dom: { createContainer: true },
    scene: { preload: preload, create: create }
};
const game = new Phaser.Game(config);
let deckSeleccionado = [];

function preload() {}

async function create() {
    const scene = this;
    const resp = await fetch('data/personajes.csv');
    const txt = await resp.text();

    // UI del Mazo
    scene.add.text(950, 50, 'DECK BUILDER', { fontSize: '28px', color: '#ffd700' });
    let listaUI = scene.add.text(950, 100, 'Mazo: 0/40', { fontSize: '18px', color: '#ffffff' });

    Papa.parse(txt, {
        header: false, skipEmptyLines: true,
        complete: (res) => {
            res.data.slice(1).forEach((fila, i) => {
                let cartaHTML = crearNodo(fila);
                let pCard = scene.add.dom(150 + (i * 250), 300, cartaHTML).setOrigin(0.5);
                
                pCard.addListener('click');
                pCard.on('click', () => {
                    if(deckSeleccionado.length < 40) {
                        deckSeleccionado.push(fila[0]);
                        listaUI.setText(`Mazo: ${deckSeleccionado.length}/40\n\n` + deckSeleccionado.join('\n'));
                    }
                });
            });
        }
    });
}

function crearNodo(cols) {
    const t = document.getElementById('card-template');
    const c = t.content.cloneNode(true);
    const d = c.querySelector('.card');
    const clean = (v) => v ? v.toString().trim() : "";

    d.setAttribute('data-estado', clean(cols[13]));
    c.querySelector('.card-name').textContent = clean(cols[0]);
    c.querySelector('.personaje-text').textContent = clean(cols[1]);
    c.querySelector('.stat-atk').textContent = clean(cols[4]);
    c.querySelector('.stat-def').textContent = clean(cols[5]);
    c.querySelector('.card-symbols').textContent = clean(cols[8]);
    c.querySelector('.desc-main').textContent = clean(cols[2]);

    const art = clean(cols[10]);
    if (art) c.querySelector('.card-art').style.backgroundImage = `url('imagenes/artes/${art}')`;
    return d;
}