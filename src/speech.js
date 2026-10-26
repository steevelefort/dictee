const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined

let voice = null

// Selon le navigateur, les voix sont disponibles tout de suite ou plus tard.
function pickVoice() {
  const voices = synth.getVoices()
  voice =
    voices.find((v) => v.lang === 'fr-FR' && v.localService) ??
    voices.find((v) => v.lang === 'fr-FR') ??
    voices.find((v) => /^fr/.test(v.lang)) ??
    null
}

if (synth) {
  pickVoice()
  // speechSynthesis n'est pas un EventTarget sur Safari 12.
  synth.onvoiceschanged = pickVoice
}

export function speak(text, { onStart, onEnd } = {}) {
  if (!synth || !text.trim()) return
  if (!voice) pickVoice()
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'fr-FR'
  if (voice) utterance.voice = voice
  utterance.rate = 0.9
  utterance.onstart = onStart
  utterance.onend = onEnd
  utterance.onerror = onEnd
  synth.speak(utterance)
}
