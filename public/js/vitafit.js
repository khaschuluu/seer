var len = 6;            // length of piece
var interval = 2000;    // millisecond = second/1000

var Num = Backbone.Model.extend({
    initialize: function() {
        this.rand();
        this.id = 1;
    },
    rand: function() {
        this.set({num: ('000000' + _.random(0, 200000)).slice(-len)});
    },
    urlRoot: function() {
        return '/api/check/';
    }
});

var Nums = Backbone.Collection.extend({
    model: Num, 
    url: '/api/check/'
});

var ContainerView = Backbone.View.extend({
    el: '#container',
    initialize: function() {
        var that = this;
        this.nums = new Nums();
        $(document).live('keydown', function(e) {
            if(e.keyCode === 32)
                that.next();
        });
        this.render();
    }, 
    render: function() {
        var that = this;
        var num = new Num();
        var nums_view = new NumsView({model: num, el: that.el});
        this.nums.push(num);
    },
    next: function() {
        this.render();
    }
});

var NumsView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function() {
        var that = this;
        var success = function() {
            console.log(that.model);
            if(that.model.get('phone')) {
                var num = that.model.get('num');
                var i = 0;
                var anim = function() {
                    if(i<len)
                        var num_view = new NumView({num: num[i], i: ++i, el: that.el});
                    else
                        clearInterval(animinterval);
                }
                var animinterval = setInterval(anim, interval);
            } else {
                that.model.rand();
                that.model.fetch({success: success});
            }
        };
        this.model.fetch({success: success});
    }
});

var NumView = Backbone.View.extend({
    initialize: function(attrs) {
        this.ops = attrs;
        this.el = this.ops.el;
        this.render();
    },
    render: function() {
        var that = this;
        //var animation = setInterval("$('#number'+"+this.ops.i+").text(_.random(0, 9))", 10);
        //var animation = setInterval(function() {
        //    that.$el.find('#number'+"+this.ops.i+").text(_.random(0, 9));
        //}, 10);
        //setTimeout('print_num', interval);
        //print_num = function() {
        //    clearInterval(animation);
            this.$el.find('#number'+this.ops.i).text(this.ops.num);
        //};
    }
});

var container_view = new ContainerView();
