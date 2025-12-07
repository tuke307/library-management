import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './prisma/generated/client'
import { env } from './env.config'

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export default prisma