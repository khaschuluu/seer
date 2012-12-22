$(function() {
    $('#post_submit').live('click', function() {
        var that = this;
        var post_data = {
            title: $('input[name="title"]').val(),
            text: $('input[name="text"]').val()
        };
        var new_post = new Post();
        new_post.save(post_data, {wait: true, success: function(post) {
            var new_post_view = new PostView({model: post});
            $(that).after(new_post_view.render().el);
        }});
    });

    var Post = Backbone.Model.extend({
        urlRoot: '/api/post/'
    });
    
    var Posts = Backbone.Collection.extend({
        url: '/api/post/'
    });

    var Comment = Backbone.Model.extend({
        urlRoot: '/api/comment/'
    });

    var Comments = Backbone.Model.extend({
        initialize: function(attrs) {
            this.options = attrs;
        },
        url: function() {
            pid = this.options.pid || 1;
            return '/api/comment/'+pid+'/'
        }
    });

    var PostsView = Backbone.View.extend({
        el: '#container',
        initialize: function() {
            this.posts = new Posts();
            this.render();
        },
        render: function() {
            var that = this;
            this.posts.fetch({success: function(posts) {
                posts.each(function(post) {
                    var post_view = new PostView({model: post});
                    that.$el.append(post_view.render().el);
                });
            }});
        }
    });

    var PostView = Backbone.View.extend({
        template: _.template($('#post_template').html()),
        initialize: function() {
            this.comments = new Comments({pid: this.model.get('id')});
        },
        render: function() {
            var that = this;
            var data = this.model.toJSON();
            this.comments.fetch({success: function(comments) {
                data.comments = comments.toJSON();
                that.$el.html(that.template(data));
            }});
            return this;
        }
    });

    var posts_view = new PostsView();
});
