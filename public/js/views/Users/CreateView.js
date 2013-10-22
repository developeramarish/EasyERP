define([
    "text!templates/Users/CreateUserTemplate.html",
    "collections/Users/UsersCollection",
    "collections/Companies/CompaniesCollection",
    "collections/Profiles/ProfilesCollection",
    "models/UserModel",
    "common"
],
    function (CreateUserTemplate, UsersCollection, CompaniesCollection, ProfilesCollection, UserModel, common) {

        var UsersCreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Users",
            actionType: null,
            template: _.template(CreateUserTemplate),
            contentType: "Users",
            imageSrc: '',
            initialize: function () {
                this.usersCollection = new UsersCollection();
                this.usersCollection.bind('reset', _.bind(this.render, this));
                this.profilesCollection = new ProfilesCollection();
                this.profilesCollection.bind('reset', _.bind(this.render, this));
                this.companiesCollection = new CompaniesCollection();
                this.companiesCollection.bind('reset', _.bind(this.render, this));
                this.model = new UserModel();
                this.render();
            },

            close: function () {
                //this._modelBinder.unbind();
            },

            events: {
                "submit form": "submit"
            },

            saveItem: function (event) {
                var self = this;
                //event.preventDefault();
                var mid = 39;

                this.model.save({
                    imageSrc: this.imageSrc,
                    email: $('#email').val(),
                    login: $('#login').val(),
                    pass: $('#password').val(),
                    profile: {
                        company: {
                            id: $('#companiesDd option:selected').val(),
                            name: $('#companiesDd option:selected').text()
                        },
                        profile: {
                            id: $('#profilesDd option:selected').val(),
                            name: $('#profilesDd option:selected').text()
                        }
                    }
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    success: function (model, responseText) {
                        Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                    },
                    error: function () {
                        Backbone.history.navigate("home", { trigger: true });
                    },
                    confirmPass: $('#confirmpassword').val()
                });

            },
            render: function () {
                var userModel = new UserModel();
                this.$el.html(this.template({
                    model: this.model.toJSON(),
                    usersCollection: this.usersCollection,
                    companiesCollection: this.companiesCollection,
                    profilesCollection: this.profilesCollection
                }));
                common.canvasDraw({ model: userModel.toJSON() }, this);
                common.contentHolderHeightFixer();
                return this;
            }
        });

        return UsersCreateView;
    });