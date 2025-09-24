import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeadItem } from '@/services/api'

interface LeadsTabProps {
  leads: LeadItem[]
  loading: boolean
}

export const LeadsTab = ({ leads, loading }: LeadsTabProps) => {
  return (
    <Card className='border-slate-200/60 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800/95 dark:shadow-slate-900/20'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-slate-700 dark:text-slate-200'>
          Leads
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='py-8 text-center'>
            <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
            <p className='mt-2 text-sm text-muted-foreground'>
              Loading leads...
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='p-4 text-left'>Name</th>
                  <th className='p-4 text-left'>Email</th>
                  <th className='p-4 text-left'>Phone</th>
                  <th className='p-4 text-left'>Inquiry</th>
                  <th className='p-4 text-left'>Source</th>
                  <th className='p-4 text-left'>Status</th>
                  <th className='p-4 text-left'>Timestamp</th>
                  <th className='p-4 text-left'>Lead ID</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => {
                  const key = lead.lead_id || `${lead.email}-${index}`
                  const ts = lead.timestamp
                    ? new Date(lead.timestamp).toLocaleString()
                    : 'N/A'
                  return (
                    <tr key={key} className='border-b'>
                      <td className='p-4'>
                        {typeof lead.name === 'string' ? lead.name : 'N/A'}
                      </td>
                      <td className='p-4'>
                        {typeof lead.email === 'string' ? lead.email : 'N/A'}
                      </td>
                      <td className='p-4'>
                        {typeof lead.phone === 'string' ? lead.phone : '—'}
                      </td>
                      <td className='p-4'>
                        {typeof lead.inquiry === 'string'
                          ? lead.inquiry
                          : 'N/A'}
                      </td>
                      <td className='p-4'>
                        {typeof lead.source === 'string'
                          ? lead.source
                          : 'chatbot'}
                      </td>
                      <td className='p-4'>
                        {typeof lead.status === 'string' ? lead.status : 'new'}
                      </td>
                      <td className='p-4'>{ts}</td>
                      <td className='p-4 text-xs text-muted-foreground'>
                        {lead.lead_id || '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {leads.length === 0 && (
              <div className='py-8 text-center text-muted-foreground'>
                No leads found
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
