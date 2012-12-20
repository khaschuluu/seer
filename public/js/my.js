$(function() {
    var br = '<br />\n';
    var b = function(str) {
        return '<b>'+str+'</b>';
    };
    var scores = new Backbone.Collection();
    scores.url = '/api/scores';
    scores.fetch({success: function() {
        scores.each(function(score) {
            $('#container').append(score.get('_id')+br);
        });
    }});

    var score = new Backbone.Model();
    score.urlRoot = '/api/scores';
    score.save({name: 'baldan', points: 234}, {success: function(model, res, options) {
        console.log(model, res, options);
        $('#container').append(b(model.get('0')['_id'])+br);
    }});
});
