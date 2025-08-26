import type { PayloadRequest } from 'payload'

// This function will automatically add new collections to existing roles
export const syncCollectionsToRoles = async (payload: any, req: PayloadRequest) => {
  try {
    // Get all collections from config
    const allCollections = payload.config.collections.map((col: any) => col.slug)
    
    // Get all existing roles
    const roles = await payload.find({
      collection: 'roles',
      limit: 1000, // Assuming we won't have more than 1000 roles
    })

    for (const role of roles.docs) {
      const existingCollections = role.privileges?.map((p: any) => p.collection) || []
      const newCollections = allCollections.filter((col: string) => !existingCollections.includes(col))
      
      if (newCollections.length > 0) {
        // Add new collections with default privileges (all false)
        const newPrivileges = newCollections.map((collection: string) => ({
          collection,
          view: false,
          create: false,
          edit: false,
          delete: false,
          selfControl: false,
        }))
        
        await payload.update({
          collection: 'roles',
          id: role.id,
          data: {
            privileges: [...(role.privileges || []), ...newPrivileges],
          },
        })
        
        console.log(`Added ${newCollections.length} new collections to role: ${role.name}`)
      }
    }
  } catch (error) {
    console.error('Error syncing collections to roles:', error)
  }
}

// Hook to be used in collections that need to trigger role sync
export const triggerRoleSync = {
  afterChange: [
    async ({ req }: { req: PayloadRequest }) => {
      if (req.payload) {
        await syncCollectionsToRoles(req.payload, req)
      }
    }
  ]
}