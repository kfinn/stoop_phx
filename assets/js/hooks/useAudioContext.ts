interface WebkitSpecificWindow {
    webkitAudioContext: typeof AudioContext
}

type WebkitWIndow = WebkitSpecificWindow & typeof window

let _audioContext = null
export function getAudioContext(): AudioContext {
    if (!_audioContext) {
        _audioContext = new (window.AudioContext || (window as WebkitWIndow).webkitAudioContext)()
    }
    return _audioContext
}

export default function useAudioContext(): AudioContext {
    return getAudioContext()
}
