window.animation = new Array();

$(function() {
    var len = 6;        // length of piece
    var interval = 2000; // millisecond = second/1000

    var Num = Backbone.Model.extend({
        initialize: function() {
            this.rand();
        },
        rand: function() {
            this.set({num: ('000000' + _.random(0, 200000)).slice(-len)});
        },
        url: function() {
            //return 'http://www.smscenter.mn/vitafit/check/1/?format=jsonp&callback=?&score='+this.get('num');
            return '/api/check/1/?score='+this.get('num');
        }
    });

    var Nums = Backbone.Collection.extend({
        model: Num, 
        url: 'http://www.smscenter.mn/vitafit/check/1/'
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
            for(var i=1; i<7; i++)
                that.$el.find('#number'+i).text('');
            var num = new Num();
            var nums_view = new NumsView({model: num, el: that.el});
            window.render_list = function() {
                that.nums.add(num);
                that.$el.find('#list').append(num.get('phone')+'<br />\n');
                that.$el.find('#count').text(that.nums.length);
            };
            setTimeout('window.render_list()', (interval+interval/5)*len);
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
            var success = function(m, res) {
                console.log(res);
                if(res != '0') {
                    var num = that.model.get('num');
                    var i = 0;
                    window.anim = function() {
                        if(i<len)
                            var num_view = new NumView({num: num[i], i: ++i, el: that.el});
                        else
                            clearInterval(window.animinterval);
                    };
                    window.animinterval = setInterval('window.anim()', interval);
                } else {
                    that.model.rand();
                    that.model.fetch({success: success});
                }
            };
            this.model.fetch({success: success, error: function() {
                that.model.rand();
                that.model.fetch({success: success});
            }});
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
            
            window.animation[that.ops.i] = setInterval("window.blink()", 50);
            window.blink = function() {
                that.$el.find('#number'+that.ops.i).text(_.random(0, 9));
            };
            window.stop_animation = function() {
                clearInterval(window.animation[that.ops.i]);
                that.$el.find('#number'+that.ops.i).text(that.ops.num);
            };

            setTimeout("window.stop_animation()", interval-100);
        }
    });

    var container_view = new ContainerView();
});
