import axios from 'axios'
import apiConfig from './ApiConfig'

export default {
  getAirports () {
    const token = apiConfig.configuration.tenantId
    return axios.get(apiConfig.configuration.apiUrl, {
      headers: {
        'Tenant-Identifier': `${token}`,
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => {
      return response.data.airports
    })
  }
}
