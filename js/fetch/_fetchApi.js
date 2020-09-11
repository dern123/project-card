const TABLES = {
	login: 'login',
	cards: 'cards',
};

const BASE_PATH = 'http://cards.danit.com.ua/';

export { TABLES, BASE_PATH };

export default function PostData(url, options = {}) {
	return fetch(url, options);
}
export function GetData(url, options = {}) {
	return fetch(url, options);
}
export function PutData(url, options) {
	return fetch(url, options);
}
export function DeleteData(url, options) {
	return fetch(url, options);
}
