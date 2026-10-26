// Sur iOS Safari, 100vh et height: 100% valent la hauteur de l'écran barres
// d'outils masquées : le bas du clavier passait sous la barre de Safari.
// On mesure la hauteur réellement visible (innerHeight) et on l'expose en CSS :
// --vh = 1 % de cette hauteur, à utiliser à la place de l'unité vh.
function update() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`)
}

update()
window.addEventListener('resize', update)
// Après une rotation, iOS 12 met parfois innerHeight à jour en retard.
window.addEventListener('orientationchange', () => setTimeout(update, 300))
