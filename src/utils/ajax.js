import axios from 'axios';

export const parseJSON = res => res.text().then(text => text ? JSON.parse(text) : {});

export const parseData = res => res.data;

export const get = url => axios.get(url).then(parseData);

export const post = (url, data) => axios.post(url, data).then(parseData);

export const del = url => axios.delete(url).then(parseData);

export const put = (url, data) => axios.put(url, data).then(parseData);
