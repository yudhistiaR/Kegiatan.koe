export const ERROR_CODES = {
  SERVER_ERROR: { message: 'Terjadi kesalahan pada server', status: 500 },
  DATA_NOT_FOUND: {
    Error: {
      status: 'error',
      error: true,
      message: 'Data tidak ditemukan',
      code: 404
    },
    status: 404
  },
  BAD_REQUEST: {
    Error: {
      status: 'error',
      error: true,
      message: 'Permintaan tidak valid',
      code: 400
    },
    status: 400
  }
}
