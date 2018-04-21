$.fn.dither = function() {
    this.addClass("dithered");
    this.prop("disabled", true);
};

$.fn.undither = function() {
    this.removeClass("dithered");
    this.prop("disabled", false);
};