<template>
    <div class="user-profile">
        <h1>User Profile</h1>
        <div class="profile-card">
            <img class="profile-avatar" src="https://via.placeholder.com/150" alt="User Avatar" />
            <h2 class="profile-name">John Doe</h2>
            <p class="profile-email">johndoe@example.com</p>
            <button @click="editProfile" class="edit-button">Edit Profile</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "UserProfileView",
    methods: {
        editProfile() {
            alert("Edit profile clicked!");
        },
    },
};
</script>

<style scoped>
.user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.profile-card {
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    width: 300px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 15px;
}

.profile-name {
    font-size: 1.5em;
    margin: 10px 0;
}

.profile-email {
    color: #666;
    margin-bottom: 20px;
}

.edit-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.edit-button:hover {
    background-color: #0056b3;
}
</style>