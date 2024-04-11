import { RatingService } from '~/services/index.js';
import UserActions from '~/utils/userActions.js';

const configApi = {
    headers: {
        Authorization: `Bearer ${UserActions.getToken()}`,
    },
};

class RatingActions {
    static async getAll() {
        const ratingService = new RatingService(configApi);
        return await ratingService.getAll();
    }

    static async get(productId) {
        const ratingService = new RatingService(configApi);
        return await ratingService.get(productId);
    }

    static async addRating(data) {
        const ratingService = new RatingService(configApi);
        return await ratingService.add(data);
    }
}

export default RatingActions;
