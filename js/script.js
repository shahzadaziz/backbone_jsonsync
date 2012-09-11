/*  Test Backbone application*/
/*  Author : Shahzad Aziz    */

    var bbAPP = {
        Models: {},
        Collections: {},
        Views: {},
        Templates:{}
    }
    
    // Backbone Main view
    bbAPP.Views.main = Backbone.View.extend({

        el: $('#property-list'),
        tagName : 'ul',

       initialize : function(){
        //_(this).bindAll('render');
        this.collection.bind("reset", this.render, this);
        bbAPP.propertyList.fetch();
        

        this.detailView = new bbAPP.Views.propertyDetail();
       },

       render : function(){
           console.log('in view render');
            _.each(this.collection.models, function (property) {
                $(this.el).append(new bbAPP.Views.propertyListItem({parent: this , model: property}).render().el).slideDown();
            }, this);
            return this;
       }       
    });

    bbAPP.Views.propertyListItem = Backbone.View.extend({

        tagName : 'li',

        events: {
            "click" : "ViewDetails",
     
        },

        render: function(){
            $(this.el).html(this.model.attributes.Text);
            return this;
        },

        ViewDetails : function(){
           
           $('#content').append(bbAPP.mainView.detailView.render(this.model).el);
        }

    });


    bbAPP.Views.propertyDetail = Backbone.View.extend({
        tagName: 'div',
        

        events: {
            "click .sync":"modelsync"
        },

        el: $('#content_view'),
        
        modelsync: function(){
            
            console.log('syncCalled');
            this.model.set({Value:$('#value').val()});
            this.$el.append('</br></br> Synced in memory. Peform BE sync to save')
        },

        render : function(model){
            this.model = model;
            
            $(this.el).html('<span>' + this.model.attributes.Text + '</span></br>' +
                '<span>Property:</span>' + this.model.attributes.Property + '</br>' +
                '<span>Value : </span><input id="value" value="' + this.model.attributes.Value + '"></input></br>' +
                '<button class="sync">Sync</button>'

            );
            return this;
        }
    });

    // Backbone Properties Model
    bbAPP.Models.property =  Backbone.Model.extend({});

    bbAPP.Models.CollectionWrapper = Backbone.Model.extend({
       
        url: function(){return 'services/properties'},
        toJSON : function(){
          return bbAPP.propertyList.toJSON();
        }
    });

    bbAPP.Collections.propertyList = Backbone.Collection.extend({
        defaults: {
            model: bbAPP.Models.property
        },
        model: bbAPP.Models.property,
        url: function(){return 'services/properties'},

        parse: function(response){
            return response.properties;
			//return response.children[0].children[0].properties;
        }
    });

    bbAPP.Router = Backbone.Router.extend({
        routes : {
            "": "defaultRoute" 
        },
        defaultRoute: function(){
            console.log('Home page for test application');
            bbAPP.propertyList = new bbAPP.Collections.propertyList();
            bbAPP.BEsync =  new bbAPP.Models.CollectionWrapper({model:bbAPP.propertyList});
           
            bbAPP.mainView =  new bbAPP.Views.main({collection: bbAPP.propertyList});
            
        }

        });

    //Intialize Router 
    var appRouter = new bbAPP.Router();
    Backbone.history.start();
    


    $('#besync').live('click',function(){
        var currentTime = new Date()
        var user = 'sync-' + currentTime.getMonth() + 1 + '-' + currentTime.getDate() + '-' +currentTime.getFullYear();

        bbAPP.propertyList.add({
                            "Property": 'Sync Performed',
                            "Text": user,
                            "Value": "Add notes here"
                        });
        bbAPP.BEsync.save();

        
    });



