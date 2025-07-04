const inspirationalPhrases = [
    "Insertar algo inspirador",
    "Confirmado: miedo irracional, pero estético",
    "No es cringe si es compartido",
    "Respirá hondo. Hay arañas en todos lados igual",
    "La terapia es cara. Postear es gratis",
    "Fobia desbloqueada: esta página",
    "¿Es raro tenerle miedo al algodón? Preguntando por un amigo",
    "Venías por memes, te fuiste con traumas nuevos",
    "Fobia al vacío… como tu inbox",
    "Fobia al compromiso, pero acá todos los días",
    "Este sitio está certificado libre de juicio. Y de serpientes",
    "Spoiler: nadie te entiende. Pero nosotros sí",
    "Fobia al silencio incómodo. ¿Cómo venís con eso?",
];
function getRandomPhrase() {
    const randomIndex = Math.floor(Math.random() * inspirationalPhrases.length);
    return inspirationalPhrases[randomIndex];
}

function setRandomTitle() {
    const titleElement = document.getElementById('inspirationalTitle');
    const randomPhrase = getRandomPhrase();
    titleElement.textContent = randomPhrase;
}
document.addEventListener('DOMContentLoaded', () => {
    setRandomTitle();
});
console.log("Título actualizado con:", randomPhrase);