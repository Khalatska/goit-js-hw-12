import axios from 'axios';
 

export class NewsAPI {
    static PAGE_SIZE = 15;
    constructor(){
        this.query = null;
        this.totalResult = 0;
        this.currentPage = 1;
    }
    
    async getImages(){
    const url = 'https://pixabay.com/api/';
    
    const options = {
        params: {
            key : '42200986-2d8f017897691a4245488f945',
            q: this.query,
            image_type: 'photo',
            orientation: 'horizontal',
            safeSearch: true, 
            page: this.currentPage, 
            per_page: NewsAPI.PAGE_SIZE,
        },
    };
    try{
        const res = await axios.get(url , options);
        return res.data;
    } catch(error) {
        console.error('Error fetching images:', error);
        throw error;
    }
}
}