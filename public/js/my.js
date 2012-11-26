$(function() {
    var scores = new Backbone.Collection();
    scores.url = '/api/scores';
    scores.fetch({success: function() {
        scores.each(function(score) {
            console.log(score.get('name'));
        });
    }});
});
