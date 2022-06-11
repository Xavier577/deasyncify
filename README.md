# Deasyncify

A declarative way to a execute asynchronous programing with javascript with first class typescript support.

```
// (ES6 imports)
import { Request, Response, Next } from "express";
import Deasyncify from "deasyncify";
import prisma from "prisma";

export const getUser = async (userId: string) = (_req: Request, _res: Response, next: Next) => {
    const [user, error] = Deasyncify.watch(this.prisma.user.findOne({ where: {userId } }));
    if(error) return next(error);
    return user;
};
```
