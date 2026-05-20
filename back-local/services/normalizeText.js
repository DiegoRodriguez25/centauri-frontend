const normalize = (str) => {

    if (typeof str !== "string") return undefined;
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export default normalize;