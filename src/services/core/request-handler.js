/* eslint-disable consistent-return */
import axios from 'axios';
import {useLoading} from 'vue-loading-overlay';

const $loading = useLoading({
    color: '#fff',
    zIndex: 99999999,
    backgroundColor: '#000',
});

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_ENDPOINT,
    // timeout: 30000,
    headers: { Authorization: `${localStorage.token}` },
});

// Add a request interceptor
api.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // if (error?.response?.status === 401) {
        //     window.location.replace(process.env.VUE_APP_LOGIN_REDIRECT_URL);
        // }
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    }
);

export default class RequestHandler {
    constructor() {
        this.api = api;
        this.fileName = "ApiService";
    }

    async get(endpoint, params={}, withLoader=false) {
        return new Promise((resolve, reject) => {
            let loader = null
            if (withLoader) {
                loader = $loading.show();
            }
            api.get(endpoint, {
                params: {
                    ...params,
                },
            })
                .then((response) => {
                    if (withLoader)
                        loader.hide();
                    if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                        resolve(response.data);
                    } else {
                        reject(response);
                    }
                })
                .catch((error) => {
                    if (withLoader)
                        loader.hide();
                    reject(error);
                });
        });
    }

    async find(endpoint, param, withLoader=true) {
        return new Promise((resolve, reject) => {
            let loader = null
            if (withLoader) {
                loader = $loading.show();
            }
            api.get(`${endpoint}/${param}`)
                .then((response) => {
                    if (withLoader)
                        loader.hide();
                    if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                        resolve(response.data);
                    } else {
                        reject(response);
                    }
                })
                .catch((error) => {
                    if (withLoader)
                        loader.hide();
                    reject(error);
                });
        });
    }

    async store(endpoint, body, withLoader=true) {
        return new Promise((resolve, reject) => {
            let loader = null
            if (withLoader) {
                loader = $loading.show();
            }
            this.api
                .post(endpoint, {
                    ...body,
                })
                .then((response) => {
                    if (withLoader)
                        loader.hide()
                    if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                        resolve(response.data);
                    } else {
                        reject(response);
                    }
                })
                .catch((error) => {
                    if (withLoader)
                        loader.hide()
                    reject(error);
                });
        });
    }

    async saveCustomHeader(endpoint, body, withLoader=true) {
        return new Promise((resolve, reject) => {
            let loader = null
            if (withLoader) {
                loader = $loading.show();
            }
            this.api
                .post(`${endpoint}`, {
                    ...body,
                },
                {
                    headers: {
                        'Authorization': localStorage.token_finance
                    }
                })
                .then((response) => {
                    if (withLoader)
                        loader.hide();
                    if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                        resolve(response.data);
                    } else {
                        reject(response);
                    }
                })
                .catch((error) => {
                    if (withLoader)
                        loader.hide();
                    reject(error);
                });
        });
    }

    async update(endpoint, id, body, withLoader=true) {
        return new Promise((resolve, reject) => {
            let loader = null
            if (withLoader) {
                loader = $loading.show();
            }
            this.api
                .put(`${endpoint}/${id}`, {
                    ...body,
                })
                .then((response) => {
                    if (withLoader)
                        loader.hide();
                    if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                        resolve(response.data);
                    } else {
                        reject(response);
                    }
                })
                .catch((error) => {
                    if (withLoader)
                        loader.hide();
                    reject(error);
                });
        });
    }

    async delete(endpoint, id, withLoader=true) {
        return new Promise((resolve, reject) => {
            let loader = null
            if (withLoader) {
                loader = $loading.show();
            }
            this.api
                .delete(`${endpoint}/${id}`)
                .then((response) => {
                    if (withLoader)
                        loader.hide();
                    if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                        resolve(response.data);
                    } else {
                        reject(response);
                    }
                })
                .catch((error) => {
                    if (withLoader)
                        loader.hide();
                    reject(error);
                });
        });
    }

    async bulkDelete(endpoint, params, withLoader=true) {
        return new Promise((resolve, reject) => {
            let loader = null
            if (withLoader) {
                loader = $loading.show();
            }
            this.api
                .delete(`${endpoint}`, {
                    data: {
                        ...params,
                    },
                })
                .then((response) => {
                    if (withLoader)
                        loader.hide();
                    if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                        resolve(response.data);
                    } else {
                        reject(response);
                    }
                })
                .catch((error) => {
                    if (withLoader)
                        loader.hide();
                    reject(error);
                });
        });
    }

    async downloadExcel(endpoint, params={}, fileName='file-download', withLoader=true) {
        return new Promise((resolve, reject) => {
            let loader = null
            if (withLoader) {
                loader = $loading.show();
            }

            this.api
                .get(endpoint, {
                    method: 'GET',
                    responseType: 'blob',
                    params: {
                        ...params,
                    },
                })
                .then((response) => {
                    if (withLoader)
                        loader.hide();
                    if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/octet-stream' }));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `${fileName}.xlsx`);
                        document.body.appendChild(link);
                        link.click();
                        resolve(response.data);
                    } else reject(response);
                })
                .catch((error) => {
                    if (withLoader)
                        loader.hide();
                    reject(error);
                });
        });
    }

    async downloadPDF(endpoint, params, autoDownload = true, filename = 'print', withLoader=true) {
        return new Promise((resolve, reject) => {
            let loader = null
            if (withLoader) {
                loader = $loading.show();
            }
            this.api
                .get(`${endpoint}`, {
                    method: 'GET',
                    responseType: 'blob',
                    params: {
                        ...params,
                    },
                })
                .then((response) => {
                    if (withLoader)
                        loader.hide();
                    if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                        if (autoDownload) {
                            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `${filename}.pdf`);
                            document.body.appendChild(link);
                            link.click();
                        }
                        resolve(response.data);
                    } else reject(response);
                })
                .catch((error) => {
                    if (withLoader)
                        loader.hide();
                    reject(error);
                });
        });
    }

    async postWithUpload(endpoint, body, fieldParseToJson=[], withLoader=true) {
        return new Promise((resolve, reject) => {
            let formData = new FormData();

            const form = body;
            for (var index in form) {
                if (form[index] instanceof Array || fieldParseToJson.includes(index)) {
                    formData.append(index, JSON.stringify(form[index]));
                } else {
                    formData.append(index, form[index]);
                }
            }

            let loader = null
            if (withLoader) {
                loader = $loading.show();
            }
            this.api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                if (withLoader)
                    loader.hide();
                if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                    resolve(response.data);
                } else {
                    reject(response);
                }
            })
            .catch((error) => {
                if (withLoader)
                    loader.hide();
                reject(error);
            });
        });
    }
}
