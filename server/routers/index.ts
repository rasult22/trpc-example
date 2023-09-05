import { adminProcedure, t } from '../trpc'
import {userRouter} from './users'

const appRouter = t.router({
  sayHi: t.procedure.query(() => {
    return 'Hi'
  }),
  logToServer: t.procedure.input(v => {
    if (typeof v === 'string') return v
    throw new Error("Invalid input")
  }).mutation(req => {
    console.log('Client says: ' + req.input)
    return true
  }),
  secretData: adminProcedure.query(({ctx}) => {
    console.log(ctx)

    return "Super top secret admin data"
  })
})


export const mainRouter = t.mergeRouters(appRouter, userRouter)