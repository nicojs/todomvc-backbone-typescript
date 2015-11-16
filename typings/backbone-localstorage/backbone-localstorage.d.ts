// Type definitions for Backbone localstorage

declare module Backbone {
	
	interface AnyArrayWithId extends Array<any>{
		id: string;
	}
	
	class LocalStorage{
		constructor(name: string);
	}
}