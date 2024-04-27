class StaffRole {
    static roles = {
        ADMIN: 'Quản trị viên',
        STAFF: 'Nhân viên',
        MANAGER: 'Quản lý',
    };
    static getKeys() {
        return Object.keys(this.roles);
    }
    static retrieveRole(role) {
        return this.roles[role];
    }
}

export default StaffRole;
