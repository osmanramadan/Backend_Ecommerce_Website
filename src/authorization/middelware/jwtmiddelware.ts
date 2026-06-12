import express from 'express';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET: string = process.env.TOKEN_SECRET as string;

// verify user
const verify: RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization as string;

    const token = authorizationHeader.split(' ')[1];

    const decoded = jwt.verify(token, TOKEN_SECRET) as {
      userid: string;
      tokenEmail: string;
    };

    req.body.userid = decoded.userid;
    req.body.tokenEmail = decoded.tokenEmail;

    if (
      req.params.userid &&
      Number(req.params.userid) !== Number(req.body.userid)
    ) {
      res.status(403);

      res.json({
        status: 'forbidden',
        msg: 'User only access his/her data'
      });

      return;
    }

    if (req.params.email && req.params.email !== req.body.tokenEmail) {
      res.status(403);

      res.json({
        status: 'forbidden',
        msg: 'User only access his/her data'
      });

      return;
    }

    if (req.body.email && req.body.email !== req.body.tokenEmail) {
      res.status(403);

      res.json({
        status: 'forbidden',
        msg: 'User only access his/her data'
      });

      return;
    }

    next();
  } catch (e) {
    res.status(401);

    res.json({
      status: 'forbidden',
      msg: 'Invalid token or token is not provided (Unauthorized)'
    });

    return;
  }
};

// verify admin
export const verifyAdmin: RequestHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization as string;

    const token = authorizationHeader.split(' ')[1];

    const decoded = jwt.verify(token, TOKEN_SECRET) as {
      userid: string;
      role: string;
    };

    req.body.userid = decoded.userid;
    req.body.role = decoded.role;

    if (decoded.role !== 'admin_1/id=80226753244') {
      res.status(403);

      res.json({
        status: 'forbidden',
        msg: 'Admin access only'
      });

      return;
    }

    next();
  } catch (e) {
    res.status(401);

    res.json({
      status: 'forbidden',
      msg: 'Invalid token or token is not provided (Unauthorized)'
    });

    return;
  }
};

export default verify;
