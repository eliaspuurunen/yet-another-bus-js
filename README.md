# yet-another-bus-js

[![npm version](https://badge.fury.io/js/@agfinn%2Fyet-another-bus.svg)](https://badge.fury.io/js/@agfinn%2Fyet-another-bus)

A simple event bus for JavaScript apps.

## Usage

First, install the package from npm.

```npm i @agfinn/yet-another-bus```

Next, in your JavaScript project, create an instance of the EventBus class.

```

import { EventBus } from "@agfinn/yet-another-bus"

window.$bus = new EventBus()

```

Subscribe to events.

```
function onMyEvent(param1, param2) {
 console.log(param1, param2);
}

window.$bus.$on('my-event', onMyEvent)

```

Emit events with arguments.

```

window.$bus.$emit('my-event', 'Argument 1', {})

```

Unsubscribe from events.

```

window.$bus.$off('my-event', onMyEvent)

```

