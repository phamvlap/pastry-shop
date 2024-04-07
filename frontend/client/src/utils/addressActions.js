import { CustomerService } from '~/services/index.js';
import UserActions from '~/utils/userActions.js';

const configApi = {
    headers: {
        Authorization: `Bearer ${UserActions.getToken()}`,
    },
};

class AddressActions {
    static async getAddresses() {
        const customerService = new CustomerService(configApi);
        const addresses = await customerService.getAddresses();
        return addresses;
    }

    static async addAddress(data) {
        const address = {
            address_fullname: data.address_fullname,
            address_phone_number: data.address_phone_number,
            address_detail: data.address_detail,
            address_is_default: Number(data.address_is_default),
        };
        const customerService = new CustomerService(configApi);
        const response = await customerService.addAddress(address);
        return response;
    }

    static async setDefaultAddress(id) {
        const customerService = new CustomerService(configApi);
        const response = await customerService.setDefaultAddress(id);
        return response;
    }

    static async updateAddress(id, data) {
        const address = {
            address_fullname: data.address_fullname,
            address_phone_number: data.address_phone_number,
            address_detail: data.address_detail,
            address_is_default: Number(data.address_is_default),
        };
        const customerService = new CustomerService(configApi);
        const response = await customerService.updateAddress(id, address);
        return response;
    }

    static async removeAddress(id) {
        const customerService = new CustomerService(configApi);
        await customerService.deleteAddress(id);
    }
}

export default AddressActions;
