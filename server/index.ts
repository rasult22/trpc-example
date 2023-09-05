import express from 'express'
import cors from 'cors'
import {createExpressMiddleware} from '@trpc/server/adapters/express'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { mainRouter } from './routers/index'
import { createContext } from './context'
import ws from 'ws'
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }))
app.use('/trpc', createExpressMiddleware({ router: mainRouter, createContext}))


console.log('Server running on localhost:3000')
const server = app.listen(3000)

applyWSSHandler({
  wss: new ws.Server({ server }),
  router: mainRouter,
  createContext: () => {
    return {isAdmin: true}
  }
})

export type AppRouter = typeof mainRouter