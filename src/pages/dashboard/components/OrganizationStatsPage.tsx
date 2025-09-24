import { Button } from '@/components/custom/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useOrganizationStats } from '@/hooks/useAdminData'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ArrowLeft, Calendar } from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface OrganizationStatsPageProps {
  onBack: () => void
}

export const OrganizationStatsPage = ({
  onBack,
}: OrganizationStatsPageProps) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined)

  const { tierDistribution, statusDistribution, topOrganizations, loading } =
    useOrganizationStats(date?.from, date?.to)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Button
          variant='ghost'
          onClick={onBack}
          className='flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Overview
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <Calendar className='mr-2 h-4 w-4' />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>All time</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='end'>
            <CalendarComponent
              initialFocus
              mode='range'
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className='grid gap-6'>
        {/* Organization Distribution by Tier */}
        <Card className='border-slate-200/60 bg-white dark:border-slate-700/60 dark:bg-slate-800/95'>
          <CardHeader>
            <CardTitle>Organizations by Subscription Tier</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex h-[300px] items-center justify-center'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
              </div>
            ) : (
              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={Object.entries(tierDistribution).map(
                    ([tier, count]) => ({ tier, count })
                  )}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='tier' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='count' name='Organizations' fill='#3b82f6' />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Organization Status Distribution */}
        <Card className='border-slate-200/60 bg-white dark:border-slate-700/60 dark:bg-slate-800/95'>
          <CardHeader>
            <CardTitle>Organizations by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex h-[300px] items-center justify-center'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
              </div>
            ) : (
              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={Object.entries(statusDistribution).map(
                    ([status, count]) => ({ status, count })
                  )}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='status' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='count' name='Organizations' fill='#10b981' />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Organizations */}
        <Card className='border-slate-200/60 bg-white dark:border-slate-700/60 dark:bg-slate-800/95'>
          <CardHeader>
            <CardTitle>Top Organizations by Usage</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex h-[300px] items-center justify-center'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
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
                        Tier
                      </th>
                      <th className='p-2 text-right text-xs font-medium text-slate-600 dark:text-slate-400'>
                        Total Conversations
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topOrganizations.map((org, index) => {
                      // Debug: Log each organization being processed
                      console.log(
                        `OrganizationStatsPage - Processing org ${index}:`,
                        org
                      )

                      // Safely extract organization properties
                      let orgName = 'Unknown'
                      let orgId: string | number =
                        (org as any).id || (org as any)._id || index
                      let subscriptionTier = 'Free'
                      let totalConversations = 0

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
                        if (
                          typeof (org as any).subscription_tier === 'string'
                        ) {
                          subscriptionTier = (org as any).subscription_tier
                        }

                        // Extract conversation count safely
                        if (
                          typeof (org as any).total_conversations === 'number'
                        ) {
                          totalConversations = (org as any).total_conversations
                        } else if (
                          typeof (org as any).conversation_count === 'number'
                        ) {
                          totalConversations = (org as any).conversation_count
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

                      console.log(
                        `OrganizationStatsPage - Processed org ${index}:`,
                        {
                          orgName,
                          orgId,
                          subscriptionTier,
                          totalConversations,
                        }
                      )

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
                            <span className='text-sm text-slate-600 dark:text-slate-400'>
                              {subscriptionTier}
                            </span>
                          </td>
                          <td className='p-2 text-right'>
                            <span className='text-sm text-slate-600 dark:text-slate-400'>
                              {totalConversations}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
