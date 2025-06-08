export async function request(
  api: string,
  payload: Record<string, any>,
  options: RequestInit = {}
): Promise<any> {
  return fetch(`${process.env.LOBE_HOST}${api}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify(payload),
    ...options,
  })
    .then((res) => res.json())
    .catch((error: any) => {
      const { code } = error;

      switch (code) {
        case 401:
          window.location.href = '/login';
          return;
        case 403:
          window.location.href = '/403';

          // refresh token

          return request(api, payload, options);
        case 404:
          window.location.href = '/404';
          return;
        case 500:
          window.location.href = '/500';
          return;
        default:
          return;
      }
    });
}
