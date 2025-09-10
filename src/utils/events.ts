type EventCallback = (payload?: any) => any;

class Events {
  private events: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback) {
    this.events.set(event, this.events.get(event) || []);
    this.events.get(event)?.push(callback);
  }

  emit(event: string, payload: any) {
    if (!this.events.has(event)) {
      return;
    }

    this.events.get(event)?.forEach((callback) => callback(payload));
  }
}

export const events = new Events();
