'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.handler = void 0
const data_1 = require('@google-analytics/data')
const supabase_js_1 = require('@supabase/supabase-js')
const analyticsDataClient = new data_1.BetaAnalyticsDataClient()
const handler = async () => {
  const supabaseURL = process.env.SUPABASE_DB_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
  if (!supabaseURL || !supabaseServiceKey) {
    throw new Error('Missing supabase env')
  }
  const [response] = await analyticsDataClient.runReport({
    dateRanges: [
      {
        endDate: 'yesterday',
        startDate: 'yesterday',
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
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      {
        name: 'eventCount',
      },
    ],
    property: `properties/365198329`,
  })
  if (!response.rows) {
    throw new Error('Response rows are null')
  }
  const supabase = (0, supabase_js_1.createClient)(
    supabaseURL,
    supabaseServiceKey,
  )
  const collection = response.rows.map((row) => {
    if (
      !row.dimensionValues ||
      !row.dimensionValues[0] ||
      !row.dimensionValues[0].value ||
      !row.metricValues
    ) {
      console.error('Missing download count or stampId on row', row)
      return {
        increment: 0,
        stampId: '',
      }
    }
    return {
      increment: Number(row.metricValues[0].value),
      stampId: row.dimensionValues[0].value.split('/')[2],
    }
  })
  const { error } = await supabase.rpc('loopdownloads', {
    jsonb_collection: collection,
  })
  console.error(error)
}
exports.handler = handler
