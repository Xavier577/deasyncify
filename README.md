# Deasyncify

A declarative way of doing asynchronous programing with Typescript.

# Overview

- [Getting started](#getting-started)
- [Issues](#issues)
- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
  - [watch](#watch)
  - [watchAll](#watchall)
  - [watchSettled](#watchsettled)

# Getting started

Deasyncify is a utility library which builds on top of Typescript's Promise api and simplifies handling promises and async functions. The goal of this library is to help make handling asychronous Typescript code more declarative without having to wrap code in a try-catch blockcode to handle errors(which
makes your code more cleaner because errors are handled as values) and without losing type definition on the return types of the values of resolved promises or async function trying to write a custom wrapper for yourself (yes we implemented that too). Imagine writing your own custom async wrapper for every single new project (that's pretty much a drag).

```typescript
import axios from 'axios';
import Deasyncify from 'deasyncify';

const doSomething = async () => {
    const [expectedValue, error] = await Deasyncify.watch(axios.get(url))

    if(error) throw error

    return expectedValue
}
```

# Issues

This library is meant to work on all nodejs enviroments. If any issue or bug is found in whatever enviroment you are on, feel free to report it to [issues](https://github.com/Xavier577/deasyncify/issues) and we'll address it as fast as we can.

# Installation

### Using yarn

```bash
$ yarn add deasyncify
```

### Using npm

```bash
$ npm install deasyncify
```

# Usage

Deasyncify is a utility class which currenctly comprises of watch, watchAll and watchSettled methods which we'll look into [below](#methods)

# Methods

## watch

Deasyncify.`watch` is used to handle a single asynchorous function or promise.

> Definitions

- `watch = <T> (asynParam: Promise<T> | (() => Promise<T>)) => Promise<[T | null, any]>`
- Args
  - `asyncParam: Promise<T> | (() => Promise<T>)`
- Expected output:
  - `expectValue: T | null`
  - `error: any`

> usage

`watch` takes in on argument (which could be either a promise or an async function or a function that returns a promise) executes it and returns an array of two values; expectedValue and error. expectedValue being the value return from your asynchronous code (you can name this anything) and error being any errors which running your asynchronous code (you can name this anything as well). error would be undefined if the asyncParam runs successfully but if asyncParam fails, error would be defined an expectedValue would be undefined.

> Example

```typescript
import { Request, Response, Next } from "express";
import prisma from "prisma";
import Deasyncify from "deasyncify";

export const getUser = async (req: Request, res: Response, next: Next) => {
    const [user, userFindError] = await Deasyncify.watch(this.prisma.users.findOne({
        where: { userId: req.user.id }
        }));

    if(userFindError) return next(userFindError);

    res.json(user);
};
```

## watchAll

Deasyncify.`watchAll` is used to handle a bunch of asynchorous function or promise "concurrently".

> Definitions

- ```typescript
   watchAll = <
    J,
    T extends Awaited<J>,
    G = T extends () => any ? Awaited<ReturnType<T>> : T> (asyncArr: J[]) => Promise<[G[] | null, any]>

  ```

- Args
  - `asyncParam: (Promise<T> | (() => Promise<T>))[]`
- Expected output:
  - `expectValues: T[] | null`
  - `error: any`

> usage

`watchAll` takes in on argument (which could be an array of an asyncParam (a promise or an async function or a function that returns a promise)) executes it and returns an array of two values; expectedValue and error. expectedValues being the value return from your asynchronous code (you can name this anything) and error being any error that occur while running your asynchronous code (you can name this anything as well). if any of the asyncParam in the arr fails, expectedValues would be null and error would be defined. An alternative to this is [watchSettled](#watchsettled) method which doesn't have this behaviour.

> Example

```typescript
import { Request, Response, Next } from "express";
import prisma from "prisma";
import Deasyncify from "deasyncify";

export const getUserItems = async (req: Request, res: Response, next: Next) => {
    const [userItems, userItemsFindError] = await Deasyncify.watchAll([
        this.prisma.cars.findOne({where: { ownersId: req.user.id } }),
        this.prisma.phones.findOne({ where: { ownersId: req.user.id }}),
        this.prisma.pets.findOne({ where: { ownersId: req.user.id }})
        ]);

    if(userFindError) return next(userItemsFindError);

    res.json(userItems);
};
```

## watchSettled

Deasyncify.`watchSettled` is used to also handle a bunch of asynchorous function or promise "concurrently".

> Definitions

- ```typescript
   watchSettled = <
    J,
    T extends Awaited<J>,
    G = T extends () => any ? Awaited<ReturnType<T>> : T> (asyncArr: J[]) => Promise<[G[], any[]]>

  ```

- Args
  - `asyncParam: (Promise<T> | (() => Promise<T>))[]`
- Expected output:
  - `expectValues: T[] | null`
  - `errors: any[]`

> usage

`watchAll` takes in on argument (which could be an array of an asyncParam (a promise or an async function or a function that returns a promise)) executes it and returns an array of two values; expectedValue and error. expectedValues being the value return from your asynchronous code (you can name this anything) and error being an arr of errors which running your asynchronous code (you can name this anything as well). unlike `watchAll` which fails if one of the asyncArr elems fail during execution, since watchSettled using Promise.`allSettled` under the hood, expectedValues would contain all the values of the settled asyncParams and errors would contain all errors if any.

> Example

```typescript
import { Request, Response, Next } from "express";
import prisma from "prisma";
import Deasyncify from "deasyncify";

export const getUserItems = async (req: Request, res: Response, next: Next) => {
    const [userItems, userItemsFindError] = await Deasyncify.watchSettled([
        this.prisma.cars.findOne({where: { ownersId: req.user.id } }),
        this.prisma.phones.findOne({ where: { ownersId: req.user.id }}),
        this.prisma.pets.findOne({ where: { ownersId: req.user.id }})
        ]);

    if(userItemsFindError.length > 0) return next(userItemsFindError);

    res.json(userItems);
};
```
