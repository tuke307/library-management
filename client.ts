import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './prisma/generated/client'
import { env } from './env.config'

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export default prisma

export type {
	Prisma,
	Media,
	RentedMedia,
	Location,
	Author,
	User,
	Employee,
} from './prisma/generated/client'

export { MediaType } from './prisma/generated/client'