export function _axios_PATCH_belongRecords(cancelToken, submitObj){
  return axios({
    method: 'patch',
    url: '/router/profile/nodesBelong',
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken,
    data: submitObj
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function _axios_GET_belongRecords(cancelToken){
  return axios({
    method: 'get',
    url: '/router/profile/nodesBelong',
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}
