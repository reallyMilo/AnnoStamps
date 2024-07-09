import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { createClient } from '@supabase/supabase-js'

const analyticsDataClient = new BetaAnalyticsDataClient()

export const handler = async () => {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/365198329`,
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      {
        name: 'eventCount',
      },
    ],
    dateRanges: [
      {
        startDate: 'yesterday',
        endDate: 'yesterday',
      },
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: {
          value: 'file_download',
        },
      },
    },
  })

  console.log(`${response.rowCount} rows received`)
  const supabase = createClient(
    process.env.SUPA_DB,
    process.env.SUPA_SERVICE_KEY,
  )

  const collection = response.rows.map((row) => ({
    stampId: row.dimensionValues[0].value.split('/')[2],
    increment: Number(row.metricValues[0].value),
  }))

  const { error } = await supabase.rpc('loopdownloads', {
    jsonb_collection: collection,
  })
  console.log(error)
}
