export function getRandomNumber(_multiplier = 100, _digits = 3) {
    //TODO: make actuall functionx
    return Math.floor(Math.random() * _multiplier)
}
export function slugify(value) {
    if (value == null
        || value == ""
        || value == "null"
        || value == undefined
        || (R.type(value) == "Boolean")
        || (R.type(value) == "Array")
        || (R.type(value) == "Object"))
        return;

    // https://gist.github.com/mathewbyrne/1280286
    return value.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '')             // Trim - from end of text
        .replace(/[\s_-]+/g, '-');
}
