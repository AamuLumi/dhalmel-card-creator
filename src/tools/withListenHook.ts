import { useSyncExternalStore } from 'react';

export function WithListenHook<
	Events extends string,
	T extends {
		new (...args: any[]): {
			_notify(e: Events): void;
			_get(e: Events): any;
		};
	},
>(constructor: T) {
	return class extends constructor {
		private readonly _listeners: Record<Events, Array<() => void>>;

		constructor(...args: any[]) {
			super(...args);

			this._listeners = {} as Record<Events, Array<() => void>>;
		}

		public _notify = (event: Events) => {
			if (this._listeners[event]) {
				this._listeners[event].forEach((f) => f());
			}
		};

		private _on = (event: Events, fn: () => void) => {
			if (!this._listeners[event]) {
				this._listeners[event] = [];
			}

			this._listeners[event].push(fn);

			return () => {
				const index = this._listeners[event].indexOf(fn);

				if (index > -1) {
					this._listeners[event].splice(index, 1);
				}
			};
		};

		public use = (e: Events) => {
			return useSyncExternalStore(
				(fn) => this._on(e, fn),
				() => this._get(e),
			);
		};
	};
}
