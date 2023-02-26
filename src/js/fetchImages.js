// export const fetchImages = async (inputValue, pageNr) => {
//     return await fetch(
//     `https://pixabay.com/api/?key=33800520-72f14a88d2f4e06a324defc7e&q=${inputValue}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${pageNr}`
//     )
//     .then(async response => {
//         if (!response.ok) {
//         if (response.status === 404) {
//             return [];
//         }
//         throw new Error(response.status);
//         }
//         return await response.json();
//     })
//     .catch(error => {
//         console.error(error);
//     });
// };
import axios from 'axios';

const URL = 'https://pixabay.com/api';
const KEY = '33800520-72f14a88d2f4e06a324defc7e';
const OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true';

export default class PixabayApi {
    constructor() {
    this.query = '';
    this.page = 1;
    }

    async getImage() {
    try {
        const res = await axios.get(
        `${URL}/?key=${KEY}&q=${this.query}&${OPTIONS}&per_page=40&page=${this.page}`
        );

        this.nextPage();
        return res.data;
    } catch (error) {
        console.log(error.message);
    }
    }

    nextPage() {
    this.page += 1;
    }

    resetPage() {
    this.page = 1;
    }

}

