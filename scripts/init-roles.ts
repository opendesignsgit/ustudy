import { getPayload } from 'payload'
import config from '@/payload.config'
import { initialRoles } from '@/collections/Roles/seed'

// Script to initialize roles in the database
export const initializeRoles = async () => {
  try {
    const payload = await getPayload({ config })
    
    console.log('Initializing roles...')
    
    for (const roleData of initialRoles) {
      try {
        // Check if role already exists
        const existingRole = await payload.find({
          collection: 'roles',
          where: {
            name: {
              equals: roleData.name,
            },
          },
          limit: 1,
        })
        
        if (existingRole.docs.length === 0) {
          // Create new role
          await payload.create({
            collection: 'roles',
            data: roleData,
          })
          console.log(`✅ Created role: ${roleData.name}`)
        } else {
          console.log(`⚠️  Role already exists: ${roleData.name}`)
        }
      } catch (error) {
        console.error(`❌ Error creating role ${roleData.name}:`, error)
      }
    }
    
    console.log('Role initialization complete!')
  } catch (error) {
    console.error('Error initializing roles:', error)
  }
}

// Run this script directly if called from command line
if (require.main === module) {
  initializeRoles().then(() => {
    process.exit(0)
  }).catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
}