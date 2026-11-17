export function showFlash(message, type = 'info') {
    window.dispatchEvent(
        new CustomEvent('app:flash', {
            detail: { message, type }
        })
    );
}
