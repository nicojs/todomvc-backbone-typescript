/*global Backbone */

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
		
		setFilter(param: string) {
			// Set the current filter to be used
			todoFilter = param || '';

			// Trigger a collection filter event, causing hiding/unhiding
			// of Todo view items
			app2.todos.trigger('filter');
		}
	}
	
	export var todoFilter: string;
	export var todoRouter = new TodoRouter();

	Backbone.history.start();
}
