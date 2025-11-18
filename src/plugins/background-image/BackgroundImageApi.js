(function(EaselApi) {

    /**
     * Sets background image from given url.
     *
     * @param {String} imageUrl
     * @param {Object} placement options
     */
    EaselApi.prototype.setBackgroundImageFromUrl = function(imageUrl, options, callback) {
        this.drawer.api.checkIsActive();
        var tool = this.drawer.getPluginInstance('BackgroundImage');
        tool.loadImageFromUrl(imageUrl, options);
    };

    /**
     * Sets background image from given image object.
     *
     * @param {Image}   image
     * @param {Object} placement options
     */
    EaselApi.prototype.setBackgroundImage = function(image, options) {
        this.drawer.api.checkIsActive();
        var tool = this.drawer.getPluginInstance('BackgroundImage');
        tool.makeImageBackground(image, options);
    };


})(Easel.EaselApi);