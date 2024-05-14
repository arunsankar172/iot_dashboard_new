import axiosClient from '../ServiceClient';

export function updateChannel(data) {
  return axiosClient.post('iot/channel', JSON.stringify(data));
}

export function updateSchedules(data) {
  return axiosClient.post('iot/spectrum', JSON.stringify(data));
}

// export function updateSchedules() {
//   return axiosClient.get('iot/spectrum');
// }
