import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UsageAnalytics } from '@/services/api'
import { Crown } from 'lucide-react'

interface TopPerformingOrganizationsProps {
  usageAnalytics: UsageAnalytics | null
  loading: boolean
}

export const TopPerformingOrganizations = ({
  usageAnalytics,
  loading,
}: TopPerformingOrganizationsProps) => {
  // Debug: Log the structure of top_organizations
  if (usageAnalytics?.top_organizations) {
    console.log(
      'TopPerformingOrganizations - top_organizations structure:',
      usageAnalytics.top_organizations
    )
    console.log('First organization:', usageAnalytics.top_organizations[0])
    console.log(
      'First organization keys:',
      Object.keys(usageAnalytics.top_organizations[0])
    )
    console.log(
      'First organization name:',
      usageAnalytics.top_organizations[0]?.name
    )
    console.log(
      'First organization type:',
      typeof usageAnalytics.top_organizations[0]
    )
  }

  return (
    <Card className='border-slate-200/60 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800/95 dark:shadow-slate-900/20 lg:col-span-2'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-slate-700 dark:text-slate-200'>
          <Crown className='h-5 w-5 text-amber-600 dark:text-amber-400' />
          Top Performing Organizations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-slate-200 dark:border-slate-700'>
                  <th className='p-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400'>
                    Organization
                  </th>
                  <th className='p-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400'>
                    Plan
                  </th>
                  <th className='p-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400'>
                    Messages
                  </th>
                  <th className='p-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400'>
                    Recent
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr
                    key={i}
                    className='border-b border-slate-100 dark:border-slate-700/50'
                  >
                    <td className='p-2'>
                      <div className='flex items-center gap-2'>
                        <div className='h-6 w-6 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700'></div>
                        <div className='h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700'></div>
                      </div>
                    </td>
                    <td className='p-2'>
                      <div className='h-5 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700'></div>
                    </td>
                    <td className='p-2'>
                      <div className='h-4 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700'></div>
                    </td>
                    <td className='p-2'>
                      <div className='h-4 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700'></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-slate-200 dark:border-slate-700'>
                  <th className='p-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400'>
                    Organization
                  </th>
                  <th className='p-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400'>
                    Plan
                  </th>
                  <th className='p-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400'>
                    Messages
                  </th>
                  <th className='p-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400'>
                    Recent
                  </th>
                </tr>
              </thead>
              <tbody>
                {usageAnalytics?.top_organizations &&
                usageAnalytics.top_organizations.length > 0 ? (
                  usageAnalytics.top_organizations
                    .slice(0, 5)
                    .map((org, index) => {
                      // Debug: Log each organization being processed
                      console.log(`Processing org ${index}:`, org)

                      // Handle both simplified and full organization objects
                      let orgName = 'Unknown'
                      let subscriptionTier = 'Free'
                      let conversationCount = 0
                      let recentConversations = 0
                      let orgId: string | number = index

                      if (typeof org === 'object' && org !== null) {
                        // Extract name safely
                        if (typeof (org as any).name === 'string') {
                          orgName = (org as any).name
                        } else if (
                          typeof (org as any).organization_name === 'string'
                        ) {
                          orgName = (org as any).organization_name
                        } else if (typeof org === 'string') {
                          orgName = org
                        }

                        // Extract subscription tier safely
                        if (
                          typeof (org as any).subscription_tier === 'string'
                        ) {
                          subscriptionTier = (org as any).subscription_tier
                        }

                        // Extract conversation count safely
                        if (
                          typeof (org as any).conversation_count === 'number'
                        ) {
                          conversationCount = (org as any).conversation_count
                        } else if (
                          typeof (org as any).total_conversations === 'number'
                        ) {
                          conversationCount = (org as any).total_conversations
                        }

                        // Extract recent conversations safely
                        if (
                          typeof (org as any).recent_conversations === 'number'
                        ) {
                          recentConversations = (org as any)
                            .recent_conversations
                        }

                        // Extract ID safely
                        if (typeof (org as any)._id === 'string') {
                          orgId = (org as any)._id
                        } else if (typeof (org as any).id === 'string') {
                          orgId = (org as any).id
                        }
                      } else if (typeof org === 'string') {
                        orgName = org
                      }

                      // Final safety check - ensure orgName is always a string
                      if (typeof orgName !== 'string') {
                        orgName = 'Unknown'
                      }

                      console.log(`Processed org ${index}:`, {
                        orgName,
                        subscriptionTier,
                        conversationCount,
                        recentConversations,
                        orgId,
                      })

                      return (
                        <tr
                          key={orgId}
                          className='border-b border-slate-100 dark:border-slate-700/50'
                        >
                          <td className='p-2'>
                            <div className='flex items-center gap-2'>
                              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-medium dark:bg-slate-700'>
                                {index + 1}
                              </div>
                              <span className='text-sm font-medium text-slate-900 dark:text-slate-100'>
                                {orgName}
                              </span>
                            </div>
                          </td>
                          <td className='p-2'>
                            <Badge className='border-blue-200 bg-blue-50 text-xs text-blue-700'>
                              {subscriptionTier}
                            </Badge>
                          </td>
                          <td className='p-2 text-sm text-slate-600 dark:text-slate-400'>
                            {conversationCount}
                          </td>
                          <td className='p-2 text-sm text-slate-600 dark:text-slate-400'>
                            {recentConversations}
                          </td>
                        </tr>
                      )
                    })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className='py-8 text-center text-slate-500 dark:text-slate-400'
                    >
                      No organization data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
