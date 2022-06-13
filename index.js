// https://stackoverflow.com/questions/63471824/vue-js-3-event-bus
const EventBusLogLevels = {
    DEBUG_ONLY_EVENTS: 0x10,
    DEBUG: 0xF,
    INFO: 0x7,
    WARNING: 0x3,
    ERROR: 0x1,
    OFF: 0x0
}

class EventBus {

    constructor(){
        this.events = {};
        this.log = [];
        this.toggleLog = false;

        const searchParamsRaw = document.location.search;

        let logLevel = EventBusLogLevels.DEBUG_ONLY_EVENTS; 
        
        if(searchParamsRaw) {
            const searchParams = new URLSearchParams(searchParamsRaw);

            logLevel = searchParams.get('loglevel');
            if(!logLevel) {
                if(window.location.host.includes("localhost")) {
                    logLevel = EventBusLogLevels.DEBUG_ONLY_EVENTS;
                } else {
                    logLevel = EventBusLogLevels.OFF;
                }
            } else {
                logLevel = parseInt(logLevel, 16);
            }
        } else {
            if(window.location.host.includes("localhost")) {
                logLevel = EventBusLogLevels.DEBUG_ONLY_EVENTS;
            } else {
                logLevel = EventBusLogLevels.OFF;
            }
        }

        this.logLevel = logLevel;


        this._logEvent(EventBusLogLevels.DEBUG, "DEBUG_EVENTS EVENT");
        this._logEvent(EventBusLogLevels.INFO, "INFO EVENT");
        this._logEvent(EventBusLogLevels.WARNING, "WARN EVENT");
        this._logEvent(EventBusLogLevels.ERROR, "ERROR EVENT");
    }

    changeLogEventStatus() {
        this.toggleLog = !this.toggleLog;
    }

    dump() {
        console.debug("Bus Dump", this.events);
        console.debug("Log Dump", this.log);
    }

    _logEvent(logLevel, eventMessage) {

        const args = Array.prototype.slice.call(arguments, 2);

        const doesNotMatchLogLevel = this.logLevel == EventBusLogLevels.OFF || (this.logLevel & logLevel) == 0;

        if(this.toggleLog) {
            this.log.splice(0, 0, {
                date: new Date(),
                logLevel: logLevel,
                args: args,
                eventMessage: eventMessage,
                matchedLogLevel: !doesNotMatchLogLevel
            });
        }

        if(doesNotMatchLogLevel) {
            return;
        }        
        
        logLevel = logLevel & this.logLevel;

        switch(logLevel) {
            case EventBusLogLevels.DEBUG_ONLY_EVENTS:
            case EventBusLogLevels.DEBUG:
                console.debug(eventMessage, ...args);
                break;
            case EventBusLogLevels.INFO:
                console.info(eventMessage, ...args);
                break;
            case EventBusLogLevels.WARNING:
                console.warn(eventMessage, ...args);
                break;
            case EventBusLogLevels.ERROR:
                console.error(eventMessage, ...args);
                break;
            default:
                console.log(eventMessage, ...args);
                break;
        }
    }

    $on(eventName, fn) {

        this._logEvent(EventBusLogLevels.DEBUG, `Registered callback for "${eventName}".`, fn)

        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    }

    $off(eventName, fn) {

        if (!this.events[eventName]) {
            return;
        }

        for (let i = 0; i < this.events[eventName].length; i++) {
            if (this.events[eventName][i] === fn) {
                this.events[eventName].splice(i, 1);

                this._logEvent(EventBusLogLevels.DEBUG, `UnRegistered callback for "${eventName}".`, fn)

                break;
            }
        };
    }

    $emit(eventName) {
        const args = Array.prototype.slice.call(arguments, 1);

        if (this.events[eventName]) {

            this._logEvent(EventBusLogLevels.DEBUG | EventBusLogLevels.DEBUG_ONLY_EVENTS, `"${eventName}": Invoke ${this.events[eventName].length} callback(s).`, eventName, ...args);

            this.events[eventName].forEach(function(fn) {
                fn(...args);
            });
        } else {
            this._logEvent(EventBusLogLevels.WARNING | EventBusLogLevels.DEBUG_ONLY_EVENTS, `"${eventName}": No callback registered.`, ...args);
        }
    }
}

export { EventBus, EventBusLogLevels }