$(function() {
    var br = '<br />\n';
    var b = function(str) {
        return '<b>'+str+'</b>';
    };
    var posts = new Backbone.Collection();
    posts.el = '#container';
    posts.url = '/api/post/';
    posts.fetch({success: function(collection) {
        collection.each(function(post) {
            posts.$el.append(post.get('_id')+br);
        });
    }});

    var post = new Backbone.Model();
    score.urlRoot = '/api/post/';
    score.save({name: 'baldan', points: 234}, {success: function(model, res, options) {
        console.log(model, res, options);
        $('#container').append(b(model.get('0')['_id'])+br);
    }});
});
