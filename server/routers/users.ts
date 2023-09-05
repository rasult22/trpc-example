import { t } from '../trpc'
import {z} from 'zod'
import {observable} from '@trpc/server/observable'
import { EventEmitter } from 'stream'
// generic procedure
const userProcedure =  t.procedure.input(z.object({ userId: z.string()}))
const eventEmitter = new EventEmitter

export const userRouter = t.router({
  get: userProcedure.query(({input}) => {
    return { id: input.userId }
  }),
  update: userProcedure.input(z.object({name: z.string()}))
  .output(z.object({id: z.string(), name: z.string()}))
  .mutation(req => {
    console.log(`updating user ${req.input.name} with id: ${req.input.userId}`)
    console.log(req.ctx.isAdmin)
    eventEmitter.emit('update', req.input.userId)
    return {
      id: req.input.userId,
      name: req.input.name
    }
  }),
  onUpdate: t.procedure.subscription(() => {
    return observable<string>(emit => {
      eventEmitter.on('update', emit.next)

      return () => {
        eventEmitter.off('update', emit.next)
      }
    })
  })
})