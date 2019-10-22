exports.getApiUrl = function (id) {
    return (
        // "https://tassa.fi/resources/shop/ads/1571237722827?ids=" +
        // id +
        // "&l=fi&u=jlfktwr6&uit=mobi-web-prod&city=Sein%C3%A4joki&lat=62.790448999999995&lon=22.8070269&acc=20"
        "https://tassa.fi/resources/shop/" +
        id +
        "/allads?l=fi&im=true&page=0&limit=18&city=Sein%C3%A4joki&u=jlfktwr6&uit=mobi-web-prod"
    );
}