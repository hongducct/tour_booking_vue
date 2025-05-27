<template>
    <div class="admin-profile">
        <h2>Thông tin Quản trị viên</h2>
        <form @submit.prevent="onSubmit">
            <div class="form-group">
                <label for="name">Họ và tên:</label>
                <input v-model="profile.name" id="name" type="text" required />
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input v-model="profile.email" id="email" type="email" required />
            </div>
            <div class="form-group">
                <label for="phone">Số điện thoại:</label>
                <input v-model="profile.phone" id="phone" type="text" />
            </div>
            <div class="form-group">
                <label for="role">Vai trò:</label>
                <input v-model="profile.role" id="role" type="text" disabled />
            </div>
            <button type="submit">Lưu thay đổi</button>
            <button type="button" @click="resetForm">Hủy</button>
        </form>
        <div v-if="message" class="message">{{ message }}</div>
    </div>
</template>

<script>
export default {
    name: "AdminProfile",
    data() {
        return {
            profile: {
                name: "Nguyễn Văn A",
                email: "admin@example.com",
                phone: "0123456789",
                role: "Admin"
            },
            originalProfile: {},
            message: ""
        };
    },
    created() {
        // Lưu bản gốc để reset khi cần
        this.originalProfile = { ...this.profile };
    },
    methods: {
        onSubmit() {
            // Giả lập lưu dữ liệu
            this.message = "Cập nhật thông tin thành công!";
            this.originalProfile = { ...this.profile };
        },
        resetForm() {
            this.profile = { ...this.originalProfile };
            this.message = "";
        }
    }
};
</script>

<style scoped>
.admin-profile {
    max-width: 400px;
    margin: 40px auto;
    padding: 24px;
    border: 1px solid #eee;
    border-radius: 8px;
    background: #fafafa;
}
.form-group {
    margin-bottom: 16px;
}
label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
}
input[type="text"],
input[type="email"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
button {
    margin-right: 8px;
    padding: 8px 16px;
    border: none;
    background: #1976d2;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
}
button[type="button"] {
    background: #888;
}
.message {
    margin-top: 16px;
    color: green;
    font-weight: 500;
}
</style>