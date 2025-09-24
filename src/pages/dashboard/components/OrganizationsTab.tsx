import { Button } from '@/components/custom/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Organization } from '@/services/api'
import { Building2, Eye } from 'lucide-react'
import {
  formatDateTime,
  getStatusBadgeColor,
  getTierBadgeColor,
} from '../utils'

interface OrganizationsTabProps {
  organizations: Organization[]
  loading: boolean
  handleOrganizationClick: (organization: Organization) => void
}

export const OrganizationsTab = ({
  organizations,
  loading,
  handleOrganizationClick,
}: OrganizationsTabProps) => {
  return (
    <Card className='border-slate-200/60 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800/95 dark:shadow-slate-900/20'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-slate-700 dark:text-slate-200'>
          <Building2 className='h-5 w-5' />
          Organizations Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='py-8 text-center'>
            <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
            <p className='mt-2 text-sm text-muted-foreground'>
              Loading organizations...
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='p-4 text-left'>Organization</th>
                  <th className='p-4 text-left'>Subscription</th>
                  <th className='p-4 text-left'>Users</th>
                  <th className='p-4 text-left'>Conversations</th>
                  <th className='p-4 text-left'>Status</th>
                  <th className='p-4 text-left'>Created</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org, index) => {
                  // Debug: Log each organization being processed
                  console.log(
                    `OrganizationsTab - Processing org ${index}:`,
                    org
                  )

                  // Safely extract organization properties
                  let orgName = 'Unknown'
                  let orgId: string | number =
                    (org as any).id || (org as any)._id || index
                  let subscriptionTier = 'Free'
                  let subscriptionStatus = 'Unknown'
                  let totalUsers = 0
                  let totalConversations = 0
                  let createdAt = 'N/A'

                  if (typeof org === 'object' && org !== null) {
                    // Extract name safely
                    if (typeof (org as any).name === 'string') {
                      orgName = (org as any).name
                    } else if (
                      typeof (org as any).organization_name === 'string'
                    ) {
                      orgName = (org as any).organization_name
                    }

                    // Extract subscription tier safely
                    if (typeof (org as any).subscription_tier === 'string') {
                      subscriptionTier = (org as any).subscription_tier
                    }

                    // Extract subscription status safely
                    if (typeof (org as any).subscription_status === 'string') {
                      subscriptionStatus = (org as any).subscription_status
                    }

                    // Extract numeric values safely
                    if (typeof (org as any).total_users === 'number') {
                      totalUsers = (org as any).total_users
                    }
                    if (typeof (org as any).total_conversations === 'number') {
                      totalConversations = (org as any).total_conversations
                    }

                    // Extract created_at safely
                    if (typeof (org as any).created_at === 'string') {
                      createdAt = (org as any).created_at
                    }

                    // Extract ID safely
                    if (typeof (org as any).id === 'string') {
                      orgId = (org as any).id
                    } else if (typeof (org as any)._id === 'string') {
                      orgId = (org as any)._id
                    }
                  }

                  // Final safety check - ensure all string values are strings
                  if (typeof orgName !== 'string') {
                    orgName = 'Unknown'
                  }
                  if (typeof subscriptionTier !== 'string') {
                    subscriptionTier = 'Free'
                  }
                  if (typeof subscriptionStatus !== 'string') {
                    subscriptionStatus = 'Unknown'
                  }

                  console.log(`OrganizationsTab - Processed org ${index}:`, {
                    orgName,
                    orgId,
                    subscriptionTier,
                    subscriptionStatus,
                    totalUsers,
                    totalConversations,
                    createdAt,
                  })

                  return (
                    <tr
                      key={orgId}
                      className='cursor-pointer border-b transition-colors hover:bg-muted/50'
                      onClick={() => handleOrganizationClick(org)}
                    >
                      <td className='p-4'>
                        <div className='flex items-center gap-2'>
                          <div className='font-medium'>{orgName}</div>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100'
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOrganizationClick(org)
                            }}
                          >
                            <Eye className='h-3 w-3' />
                          </Button>
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {orgId}
                        </div>
                      </td>
                      <td className='p-4'>
                        <Badge className={getTierBadgeColor(subscriptionTier)}>
                          {subscriptionTier}
                        </Badge>
                      </td>
                      <td className='p-4'>{totalUsers}</td>
                      <td className='p-4'>{totalConversations}</td>
                      <td className='p-4'>
                        <Badge
                          className={getStatusBadgeColor(subscriptionStatus)}
                        >
                          {subscriptionStatus}
                        </Badge>
                      </td>
                      <td className='p-4 text-sm text-muted-foreground'>
                        {createdAt !== 'N/A'
                          ? formatDateTime(createdAt)
                          : 'N/A'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {organizations.length === 0 && (
              <div className='py-8 text-center text-muted-foreground'>
                No organizations found
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
