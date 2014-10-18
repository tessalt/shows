App.ShowsIndexController = Ember.ObjectController.extend({
  errorMsg: '',
  actions: {
    deleteShow: function(show) {
      var self = this;
      show.deleteRecord();
      show.save().catch(function(error){
        self.set('errorMsg', error.responseText);
      });
    }
  }
});

App.EpisodeController = Ember.ObjectController.extend({
  errors: '',
  voteCount: function() {
    var votes = this.get('model.votes').content;
    var total = 0;
    for (var i = 0; i < this.get('model.votes.length'); i++) {
      total += parseInt(votes[i].get('direction'));
    }
    return total;
  }.property('model.votes.length'),
  actions: {
    vote: function(direction) {
      var self = this;
      var vote = this.store.createRecord('vote', {
        direction: direction,
        episodeId: self.model.get('id')
      });
      vote.save().then(function(){
        vote.set('episode', self.model);
      }, function(error){
        self.set('errors', error.responseText);
      });
    }
  }
});

App.ExternalShowsSearchController = Ember.Controller.extend({
  keyword: '',
  errorMsg: ''
});

App.ShowsNewController = Ember.ObjectController.extend({
  errors: '',
  actions: {
    createShow: function() {
      var self = this;
      try {
        var show = this.store.createRecord('show', {
          title: this.model.show.SeriesName,
          id: this.model.show.id
        });
      } catch (error) {
        self.set('errors', error.responseText);
      }
      if (show) {
        show.save().then(function() {
          Ember.RSVP.all(self.model.episodes.map(function(rawEpisode){
            var episode = self.store.createRecord('episode', {
              name: rawEpisode.EpisodeName,
              showId: self.model.show.id,
              number: rawEpisode.EpisodeNumber,
              description: rawEpisode.Overview,
              writer: rawEpisode.Writer,
              director: rawEpisode.Director,
              airdate: rawEpisode.FirstAired,
              stars: rawEpisode.GuestStars
            });
            return episode.save();
          })).then(function(something){
            self.transitionToRoute('shows.show', self.model.show.id);
          })
        }, function(error){
          self.set('errors', error.responseText);
        });
      }
    }
  }
});