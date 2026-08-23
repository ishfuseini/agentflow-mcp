---
type: 'pattern'
title: 'Event Driven Architecture Pattern'
source_url: 'https://github.com/chanakaudaya/solution-architecture-patterns/blob/master/vendor-neutral/Event-Driven-Architecture-Pattern.md'
vendor: []
industry: []
data_stack: []
cloud: []
constraints: []
compliance: []
region: []
data_zones: []
latency: ['real-time']
credit: '"Solution Architecture Patterns for Enterprise" (https://www.amazon.com/dp/1484289471)'
---

# Event-Driven Architecture Pattern

## Introduction
Enterprise systems are built on 2 fundamental messaging models. Which are
- Synchronous messaging (request-response)
- Asynchronous messaging (pub-sub, callback, batch)

Out of these 2 models, synchronous messaging style is the most common pattern and within enterprises. But that doesn't reduce the importance of the asynchronous messaging architectures. In layman's terms, asynchronous messaging means that the consumer and the producer are decoupled and the producer would not get an immediate response to his message. 

Event-Driven architecture is one such asynchronous messging pattern where a set of actors called publishers generate a set of events and a set of subscribers or consumers consume these events independently and process those events asynchronously. We call this pattern as pub-sub model. 

## Architecture
