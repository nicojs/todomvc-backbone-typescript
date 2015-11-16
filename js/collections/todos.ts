/*global Backbone */

module app2 {
	'use strict';

	// Todo Collection
	// ---------------

	// The collection of todos is backed by *localStorage* instead of a remote
	// server.
	class Todos extends Backbone.Collection<app2.Todo> {
		
		constructor(models?: app2.Todo[] | Object[], options?: any){
			// Reference to this collection's model.
			this.model = app2.Todo;
			this.localStorage = new Backbone.LocalStorage('todos-backbone');
			super(models, options);
		}

		// Save all of the todo items under this example's namespace.
		localStorage: Backbone.LocalStorage;

		// Filter down the list of all todo items that are finished.
		completed() {
			return this.where({ completed: true });
		}

		// Filter down the list to only todo items that are still not finished.
		remaining () {
			return this.where({ completed: false });
		}

		// We keep the Todos in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder() {
			return this.length ? this.last().get('order') + 1 : 1;
		}
	}

	// Create our global collection of **Todos**.
	export var todos = new Todos();
}