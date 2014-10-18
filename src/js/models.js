App.User = Ember.Object.extend();

App.User.reopenClass({
  get: function() {
    return $.getJSON('/me');
  }
})

App.Show = DS.Model.extend({
  title: DS.attr('string'),
  tvdbId: DS.attr('number'),
  episodes: DS.hasMany('episode')
});

App.Episode = DS.Model.extend({
  name: DS.attr('string'),
  showId: DS.attr('number'),
  show: DS.belongsTo('show'),
  number: DS.attr('number'),
  votes: DS.hasMany('vote'),
  description: DS.attr('string'),
  writer: DS.attr('string'),
  director: DS.attr('string'),
  airdate: DS.attr('date'),
  stars: DS.attr('string')
});

App.Vote = DS.Model.extend({
  userId: DS.attr('string'),
  episode: DS.belongsTo('episode'),
  episodeId: DS.attr('string'),
  direction: DS.attr('number')
});

App.ExternalShow = DS.Model.extend({
  SeriesName: DS.attr('string')
});