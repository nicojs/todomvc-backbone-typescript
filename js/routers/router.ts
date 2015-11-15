/*global Backbone */
var app = app || {};

module app2 {
	'use strict';

	// Todo Router
	// ----------
	class TodoRouter extends Backbone.Router {
		
		constructor(){
			this.routes = {
			'*filter': 'setFilter'
			}
			super();
		}
		
		setFilter(param) {
			// Set the current filter to be used
			app.TodoFilter = param || '';

			// Trigger a collection filter event, causing hiding/unhiding
			// of Todo view items
			app2.todos.trigger('filter');
		}
	}

	app.TodoRouter = new TodoRouter();
	Backbone.history.start();
}
