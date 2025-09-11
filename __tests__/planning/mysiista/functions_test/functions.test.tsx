import { checkStatus, getOdpPercent, infoWindowContentOdp, infoWindowContentUser } from "@features/planning/mysiista/function";
import { describe, test } from "vitest";
import { googleMaps } from '@exoacox/google-maps-vitest-mocks'

googleMaps()

const convertHtml = (string: string) => {
  const element = document.createElement('div')
  element.innerHTML = string
  return element
}

describe('testing function mysiista', () => {


  test('should getOdpPercent', () => {
    const dataPercent = getOdpPercent([
      {
        deviceId: 3,
        name: 'string',
        lat: 3,
        lng: 3,
        status: 'RED',
        idlePort: 3,
        devicePort: 3,
        date: 'string',
        networkLocationCode: 'string',
        stoCode: 'string',
        valinsId: 3,
      }])
    expect(dataPercent).toBe(100)
  })

  test('should infoWindowContentOdp', () => {
    const section = infoWindowContentOdp({
      deviceId: 3,
      name: 'string',
      lat: 3,
      lng: 3,
      status: 'RED',
      idlePort: 3,
      devicePort: 3,
      date: 'string',
      networkLocationCode: 'string',
      stoCode: 'string',
      valinsId: 3,
    })
    const element = convertHtml(section).querySelector('span')?.getAttribute('class')
    expect(element).toBe('w-[5.25rem]')
  })

  test('should infoWindowContentUser', () => {
    const section = infoWindowContentUser({
      address: 'string',
      belanja_online: 'string',
      berita: 'string',
      communication_expenses: 'string',
      created_at: 'string',
      gaming: 'string',
      hiburan: 'string',
      id: 3,
      invalid_reason: 'string',
      kebutuhan_inet_bekerja: 'string',
      kebutuhan_sekolah: 'string',
      kepemilikan_rumah: 'string',
      latitude: 3,
      longitude: 3,
      media_sosial: 'string',
      mysiista_updated: 'string',
      nama_respondent: 'string',
      pekerjaan: 'string',
      phone: 'string',
      photo: 'string',
      pln_id: 'string',
      pln_kwh: 'string',
      providers: 'string',
      scale_of_need: 'string',
      source: 'string',
      status: 'string',
      subscriber_plans: 'string',
      surveyor_id: 3,
      surveyor_treg: 'string',
      surveyor_witel: 'string',
      tahap_survey: 'string',
      valid_at: 'string',
    })
    const element = convertHtml(section).querySelector('span')?.getAttribute('class')
    expect(element).toBe('w-[5.25rem]')
  })

  test('should checkStatus', () => {
    const section = checkStatus('valid')
    expect(typeof (section)).toBe('object')
  })

})