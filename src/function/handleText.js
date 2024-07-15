export const mapName = (name) => {
    switch (name.toLowerCase()) {
        case 'attack':
            return 'ATK';
        case 'defense':
            return 'DEF';
        case 'special-attack':
            return 'SpA';
        case 'special-defense':
            return 'SpD';
        case 'speed':
            return 'SPD';
        default:
            return name
    }
};
export const Text = (text) => {
    return text.replace(/\u000c/g, ' ').replace(/move/g, 'move');
};
export function replaceSpace(str) {
    return str.replace(/-/g, ' ');
}
export function TachSo(url) {
    const parts = url.split("/");
    return parts[parts.length - 2];
}