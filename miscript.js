
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let particulas = [];
let estrellas = [];
let ondas = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Colores de las explosiones
const colores = [
    "#ff00ff",
    "#00eaff",
    "#ffea00",
    "#ff4500",
    "#8b00ff",
    "#00ff88",
    "#ffffff"
];

// Ajustar pantalla
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Crear estrellas de fondo
for (let i = 0; i < 150; i++) {
    estrellas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        alpha: Math.random()
    });
}

// Clase de partículas
class Particula {

    constructor(x, y, color, velocidad, angulo, tamano) {

        this.x = x;
        this.y = y;

        this.color = color;

        this.vx = Math.cos(angulo) * velocidad;
        this.vy = Math.sin(angulo) * velocidad;

        this.tamano = tamano;

        this.vida = 1;
        this.gravedad = 0.035;

        this.friccion = 0.985;

        this.estela = [];
    }

    actualizar() {

        // Guardar posiciones para crear estelas
        this.estela.push({
            x: this.x,
            y: this.y
        });

        if (this.estela.length > 5) {
            this.estela.shift();
        }

        this.vx *= this.friccion;
        this.vy *= this.friccion;

        this.vy += this.gravedad;

        this.x += this.vx;
        this.y += this.vy;

        this.vida -= 0.012;
    }

    dibujar() {

        ctx.save();

        ctx.globalAlpha = Math.max(0, this.vida);

        // Estela luminosa
        if (this.estela.length > 1) {

            ctx.beginPath();

            ctx.moveTo(
                this.estela[0].x,
                this.estela[0].y
            );

            for (let punto of this.estela) {
                ctx.lineTo(punto.x, punto.y);
            }

            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.tamano / 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;

            ctx.stroke();
        }

        // Partícula brillante
        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.tamano,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;

        ctx.fill();

        ctx.restore();
    }
}

// Crear explosión
function explosion(x, y) {

    let color = colores[
        Math.floor(Math.random() * colores.length)
    ];

    // Onda luminosa
    ondas.push({
        x: x,
        y: y,
        radio: 2,
        alpha: 1,
        color: color
    });

    // Cantidad aleatoria de partículas
    let cantidad = 90 + Math.random() * 100;

    for (let i = 0; i < cantidad; i++) {

        let angulo = Math.random() * Math.PI * 2;

        let velocidad = 2 + Math.random() * 9;

        let tamano = 1 + Math.random() * 3;

        particulas.push(
            new Particula(
                x,
                y,
                color,
                velocidad,
                angulo,
                tamano
            )
        );
    }

    // Pequeños destellos blancos
    for (let i = 0; i < 25; i++) {

        let angulo = Math.random() * Math.PI * 2;

        let velocidad = 3 + Math.random() * 10;

        particulas.push(
            new Particula(
                x,
                y,
                "#ffffff",
                velocidad,
                angulo,
                1.5
            )
        );
    }
}

// Dibujar estrellas
function dibujarEstrellas() {

    estrellas.forEach(e => {

        ctx.beginPath();

        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(255,255,255,${e.alpha})`;

        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ffffff";

        ctx.fill();

    });
}

// Dibujar ondas
function dibujarOndas() {

    ondas.forEach((onda, index) => {

        ctx.beginPath();

        ctx.arc(
            onda.x,
            onda.y,
            onda.radio,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = onda.color;
        ctx.lineWidth = 3;

        ctx.globalAlpha = onda.alpha;

        ctx.shadowBlur = 20;
        ctx.shadowColor = onda.color;

        ctx.stroke();

        onda.radio += 5;
        onda.alpha -= 0.035;

        if (onda.alpha <= 0) {
            ondas.splice(index, 1);
        }

    });

    ctx.globalAlpha = 1;
}

// Animación principal
function animar() {

    // Crear efecto de estela
    ctx.fillStyle = "#03000c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    dibujarEstrellas();

    dibujarOndas();

    // Actualizar partículas
    particulas.forEach((p, index) => {

        p.actualizar();
        p.dibujar();

        if (p.vida <= 0) {
            particulas.splice(index, 1);
        }

    });

    requestAnimationFrame(animar);
}

// Detectar clic
canvas.addEventListener("click", (e) => {

    explosion(e.clientX, e.clientY);

});

// Primera explosión de demostración
setTimeout(() => {

    explosion(
        canvas.width / 2,
        canvas.height * 0.65
    );

}, 500);

// Iniciar animación
animar();
