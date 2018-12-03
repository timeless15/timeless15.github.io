const api = (() => {
  const MOCK = true;
  const ROOT_URL = 'http://localhost:3000/';
  // const ROOT_URL = 'http://10.5.4.6:3000/';
  if (MOCK) {
    return {
      MOCK,
      SCREEN_LIST: `${ROOT_URL}screens`,
      SCREEN_CREATE: `${ROOT_URL}screens`,
      SCREEN_DELETE: `${ROOT_URL}screens`,
      SCREEN_UPDATE: `${ROOT_URL}screens`,
      EDITORS_LIST: `${ROOT_URL}editors`,
      EDITORS_CREATE: `${ROOT_URL}editors`,
      EDITORS_UPDATE: `${ROOT_URL}editors`,
      EDITOR_DELETE: `${ROOT_URL}editors`,
      EDITORS_SEARCH: `${ROOT_URL}editors`,
      TEMPLATE_LIST: `${ROOT_URL}template`,
      TEMPLATE_CREATE: `${ROOT_URL}template`,
      TEMPLATE_DELETE: `${ROOT_URL}template`,
      DATA_LIST: `${ROOT_URL}data`,
      DATA_UPLOAD: `${ROOT_URL}data`,
      DATA_DELETE: `${ROOT_URL}data`,
      DATA_SEARCH: `${ROOT_URL}data`,
      OPERATORS_SEARCH: `${ROOT_URL}operators`,
      OPERATORS_CREATE: `${ROOT_URL}operators`,
      OPERATORS_UPDATE: `${ROOT_URL}operators`,
      OPERATORS_DELETE: `${ROOT_URL}operators`
    };
  }
  return {
    MOCK,
    SCREEN_LIST: `${ROOT_URL}screens`,
    SCREEN_CREATE: `${ROOT_URL}screens`,
    SCREEN_DELETE: `${ROOT_URL}screens`,
    SCREEN_UPDATE: `${ROOT_URL}screens`,
    EDITORS_LIST: `${ROOT_URL}editors`,
    EDITORS_CREATE: `${ROOT_URL}editors`,
    EDITORS_UPDATE: `${ROOT_URL}editors`,
    EDITOR_DELETE: `${ROOT_URL}editors`,
    EDITORS_SEARCH: `${ROOT_URL}editors`,
    TEMPLATE_LIST: `${ROOT_URL}template`,
    TEMPLATE_CREATE: `${ROOT_URL}template`,
    TEMPLATE_DELETE: `${ROOT_URL}template`,
    DATA_LIST: `${ROOT_URL}data`,
    DATA_UPLOAD: `${ROOT_URL}data`,
    DATA_DELETE: `${ROOT_URL}data`,
    DATA_SEARCH: `${ROOT_URL}data`,
    OPERATORS_SEARCH: `${ROOT_URL}operators`,
    OPERATORS_CREATE: `${ROOT_URL}operators`,
    OPERATORS_UPDATE: `${ROOT_URL}operators`,
    OPERATORS_DELETE: `${ROOT_URL}operators`
  };
})();

export default api;
