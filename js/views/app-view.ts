/*global Backbone, jQuery, _, ENTER_KEY */

module app2 {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	export class AppView extends Backbone.View<Todo> {

		allCheckbox: HTMLInputElement;
		statsTemplate: (...data: any[]) => string;
		$input: JQuery;
		$footer: JQuery;
		$main: JQuery;
		$list: JQuery;

		constructor() {
			// Instead of generating a new element, bind to the existing skeleton of
			// the App already present in the HTML.
			this.el = '.todoapp';
	
			// Our template for the line of statistics at the bottom of the app.
			this.statsTemplate = _.template($('#stats-template').html()),
			super();
		}
		
		
		// Delegated events for creating new items, and clearing completed ones.
		events(): Backbone.EventsHash {
			return {
				'keypress .new-todo': 'createOnEnter',
				'click .clear-completed': 'clearCompleted',
				'click .toggle-all': 'toggleAllComplete'
			}
		}

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize() {
			this.allCheckbox = <HTMLInputElement>this.$('.toggle-all')[0];
			this.$input = this.$('.new-todo');
			this.$footer = this.$('.footer');
			this.$main = this.$('.main');
			this.$list = $('.todo-list');

			this.listenTo(app2.todos, 'add', this.addOne);
			this.listenTo(app2.todos, 'reset', this.addAll);
			this.listenTo(app2.todos, 'change:completed', this.filterOne);
			this.listenTo(app2.todos, 'filter', this.filterAll);
			this.listenTo(app2.todos, 'all', _.debounce(this.render, 0));

			// Suppresses 'add' events with {reset: true} and prevents the app view
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			app2.todos.fetch({ reset: true });
		}

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render() {
			var completed = app2.todos.completed().length;
			var remaining = app2.todos.remaining().length;

			if (app2.todos.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					completed: completed,
					remaining: remaining
				}));

				this.$('.filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.TodoFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.allCheckbox.checked = !remaining;
			return super.render();
		}

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne(todo) {
			var view = new app2.TodoView({ model: todo });
			this.$list.append(view.render().el);
		}

		// Add all items in the **Todos** collection at once.
		addAll() {
			this.$list.html('');
			app2.todos.each(this.addOne, this);
		}

		filterOne(todo) {
			todo.trigger('visible');
		}

		filterAll() {
			app2.todos.each(this.filterOne, this);
		}

		// Generate the attributes for a new Todo item.
		newAttributes() {
			return {
				title: this.$input.val().trim(),
				order: app2.todos.nextOrder(),
				completed: false
			};
		}

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter(e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				app2.todos.create(this.newAttributes());
				this.$input.val('');
			}
		}

		// Clear all completed todo items, destroying their models.
		clearCompleted() {
			_.invoke(app2.todos.completed(), 'destroy');
			return false;
		}

		toggleAllComplete() {
			var completed = this.allCheckbox.checked;

			app2.todos.each(function(todo) {
				todo.save({
					completed: completed
				});
			});
		}
	}
}