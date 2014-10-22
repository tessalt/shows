App.ShowsIndexController = Ember.ArrayController.extend({
  user: '',
  errorMsg: '',
  actions: {
    deleteShow: function(show) {
      var self = this;
      show.deleteRecord();
      show.save().catch(function(error){
        self.set('errorMsg', error.responseText);
      });
    }
  },
  results: function() {
    var keyword = this.get('keyword');
    var shows = this.get('content');
    if (keyword) {
      return shows.filter(function(show){
        return show.get('title').toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      })
    } else {
      return shows;
    }
  }.property('content', 'keyword')
});

App.EpisodesController = Ember.ArrayController.extend({
  episodesBySeason: function() {
    var episodes = this.get('content');
    var seasons = [];
    var max = Math.max.apply(Math, episodes.map(function(episode){
      return episode.get('season');
    }));
    for (var i = 0; i <= max; i++) {
      var epsForSeason = episodes.filter(function(episode){
        return episode.get('season') === i;
      }).sort(function(a, b){
        return a.get('number') - b.get('number');
      });
      if (epsForSeason.length) {
        seasons.push({
          number: i,
          episodes: epsForSeason
        });
      }
    }
    return seasons;
  }.property('content')
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

App.SeasonController = Ember.ObjectController.extend({
  isOpen: false,
  actions: {
    toggleSeason: function() {
      this.set('isOpen', !this.get('isOpen'));
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
              season: rawEpisode.SeasonNumber,
              stars: rawEpisode.GuestStars
            });
            return episode.save();
          })).then(function(something){
            self.transitionToRoute('episodes', self.model.show.id);
          })
        }, function(error){
          self.set('errors', error.responseText);
        });
      }
    }
  }
});