class UserRole {
    static roles = {
        ADMIN: 'Quản trị viên',
        STAFF: 'Nhân viên',
        MANAGER: 'Quản lý',
        CUSTOMER: 'Khách hàng',
    };
    static getKeys() {
        return Object.keys(this.roles);
    }
    static retrieveRole(role) {
        return this.roles[role];
    }
}

export default UserRole;
