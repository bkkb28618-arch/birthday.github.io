const text = `Tata Marie Noël,
En ce jour où la magie de Noël enveloppe le monde,
nous célébrons une tante, grande sœur, personne exceptionnelle.
Que tes rêves se réalisent et que chaque bougie allumée soit un nouveau bonheur.`;

const images = [
    "photos/img1.jpg",
    "photos/img2.jpg",
    "photos/img3.jpg",
    "photos/img4.jpg",
    "photos/img5.jpg",
    "photos/img6.jpg"
];

const finalImage = "photos/final.gif";

const music = document.getElementById("music");
let musicPlayCount = 0; // track plays

music.onended = () => {
    musicPlayCount++;
    if (musicPlayCount < 2) {
        music.currentTime = 0;
        music.play();
    }
};
const voiceText = document.getElementById("voiceText");
const voiceImages = document.getElementById("voiceImages");
const overlay = document.getElementById("tapOverlay");

/* USER INTERACTION REQUIRED */
overlay.onclick = () => {
    overlay.remove();
    startSnow();   // ✅ start snowfall
    startPhase1();
};


/* PHASE 1 — TEXT + VOICE */
function startPhase1() {
    music.volume = 0.1;
    music.play();
    voiceText.play();

    const container = document.getElementById("textWave");
    let delay = 0;

    text.split("").forEach(char => {

    if (char === "\n") {
        container.appendChild(document.createElement("br"));
        return;
    }

    if (char === " ") {
        const space = document.createElement("span");
        space.innerHTML = "&nbsp;";
        container.appendChild(space);
        delay += 0.5;
        return;
    }

    const span = document.createElement("span");
    span.textContent = char;
    span.style.animationDelay = `${delay}s`;
    container.appendChild(span);
    delay += 0.03;
});

    voiceText.onended = startPhase2;
}

// /* PHASE 2 — FULLSCREEN IMAGES */
   
function startPhase2() {

    document.getElementById("textWave").innerHTML = "";

    music.volume = 0.05;
    voiceImages.play();

    let index = 0;
    const fs = document.getElementById("fullscreenImage");
    const displayTime = 15000; // 15 seconds per image

    function showNext() {
        if (index >= images.length) {
            // Last image faded out, start Phase 3
            setTimeout(startPhase3, 1000); // wait 1 second for smooth fade
            fs.style.opacity = 0;
            return;
        }

        fs.style.backgroundImage = `url(${images[index++]})`;
        fs.style.opacity = 1;

        // fade out just before next image
        setTimeout(() => fs.style.opacity = 0, displayTime - 1000);

        // show next image after displayTime
        setTimeout(showNext, displayTime);
    }

    showNext();
}

/* PHASE 3 — GALLERY + FINAL IMAGE */function startPhase3() {
    music.volume = 1.0;

    const gallery = document.getElementById("gallery");
    gallery.innerHTML = ""; // clear if needed

    images.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        gallery.appendChild(img);
    });

    const final = document.createElement("img");
    final.src = finalImage;
    final.style.gridColumn = "1 / -1";
    gallery.appendChild(final);

    // Add final end text
    const endText = document.createElement("div");
    endText.className = "name"; // or any class for styling
    endText.style.marginTop = "30px";
    endText.textContent = "Créé spécialement pour toi 💝";
    gallery.appendChild(endText);
}


function startSnow() {
    const canvas = document.getElementById("snow");
    const ctx = canvas.getContext("2d");

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const flakes = Array.from({ length: 200 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 3 + 1,
        d: Math.random() + 0.5,
        vx: Math.random() * 0.5 - 0.25
    }));

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.beginPath();
        flakes.forEach(f => {
            ctx.moveTo(f.x, f.y);
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        });
        ctx.fill();
        update();
    }

    function update() {
        flakes.forEach(f => {
            f.y += f.d;
            f.x += f.vx;
            if (f.y > h) {
                f.y = -5;
                f.x = Math.random() * w;
            }
        });
    }

    function loop() {
        draw();
        requestAnimationFrame(loop);
    }

    loop();

    window.onresize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    };
}
