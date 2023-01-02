export const slugify = (string: string): string => {
    string = string.replace(/^\s+|\s+%/g, '');
    string = string.toLowerCase();

    const from = `ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;`;
    const to = `aaaaaeeeeeiiiiooooouuuunc------`;
    for (let i = 0; i < from.length; i++) {
        string = string.replace(new RegExp(from.charAt(i), `g`), to.charAt(i));
    }

    string = string
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    return string;
};

export const makeId = (length: Number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}
